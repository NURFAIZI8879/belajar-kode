"use client";

import type { RunnerAdapter, RunResult } from "./runner";

const WORKER_CODE = `
const PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.mjs";

let pyodide = null;
let readyPromise = null;

async function ensurePyodideReady() {
  if (readyPromise) {
    return readyPromise;
  }

  readyPromise = (async () => {
    const { loadPyodide } = await import(PYODIDE_URL);
    pyodide = await loadPyodide();
  })();

  return readyPromise;
}

self.onmessage = async (event) => {
  const { id, code, stdin } = event.data;

  try {
    await ensurePyodideReady();

    const start = performance.now();

    const inputs = stdin ? stdin.split("\\n") : [];
    let inputIndex = 0;

    pyodide.setStdin(() => {
      if (inputIndex < inputs.length) {
        return inputs[inputIndex++] + "\\n";
      }
      return "";
    });

    const stdoutParts = [];
    const stderrParts = [];

    pyodide.setStdout({ batched: (msg) => stdoutParts.push(msg) });
    pyodide.setStderr({ batched: (msg) => stderrParts.push(msg) });

    await pyodide.runPythonAsync(code);

    const timeMs = performance.now() - start;

    self.postMessage({
      id,
      stdout: stdoutParts.join(""),
      stderr: stderrParts.join(""),
      status: "ok",
      timeMs,
      language: "python",
    });
  } catch (error) {
    self.postMessage({
      id,
      stdout: "",
      stderr: error ? error.message : String(error),
      status: "error",
      timeMs: 0,
      language: "python",
    });
  }
};
`;

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
const pendingCalls = new Map<
  number,
  { resolve: (value: RunResult) => void; reject: (reason?: unknown) => void }
>();
let callCounter = 0;

function getWorker(): Worker {
  if (!worker) {
    const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
    worker = new Worker(URL.createObjectURL(blob), { type: "module" });
    worker.onmessage = (event: MessageEvent) => {
      const { id, ...result } = event.data as { id: number } & RunResult;
      const call = pendingCalls.get(id);
      if (call) {
        pendingCalls.delete(id);
        call.resolve(result);
      }
    };
    worker.onerror = (event: ErrorEvent) => {
      pendingCalls.forEach((call) => {
        call.reject(event.error);
      });
      pendingCalls.clear();
    };
  }
  return worker;
}

async function ensureReady(): Promise<void> {
  if (readyPromise) {
    return readyPromise;
  }

  readyPromise = (async () => {
    const w = getWorker();
    await new Promise<RunResult>((resolve, reject) => {
      const id = ++callCounter;
      pendingCalls.set(id, { resolve, reject });
      w.postMessage({ id, code: "", stdin: "" });
    });
  })();

  return readyPromise;
}

export const pythonAdapter: RunnerAdapter = {
  name: "Pyodide (Web Worker)",

  async isAvailable() {
    try {
      await ensureReady();
      return true;
    } catch {
      return false;
    }
  },

  async run(code: string, stdin?: string): Promise<RunResult> {
    const start = performance.now();
    const w = getWorker();

    return new Promise<RunResult>((resolve, reject) => {
      const id = ++callCounter;
      pendingCalls.set(id, { resolve, reject });

      setTimeout(() => {
        pendingCalls.delete(id);
        resolve({
          stdout: "",
          stderr: "Eksekusi Python melebihi batas waktu (30 detik).",
          status: "timeout",
          timeMs: Math.max(0, performance.now() - start),
          language: "python",
        });
      }, 30000);

      w.postMessage({ id, code, stdin: stdin ?? "" });
    });
  },
};
