import type { RunnerAdapter, RunResult } from "./runner";

type WandboxConfig = {
  compiler: string;
  filename: string;
};

const CONFIG: Record<string, WandboxConfig> = {
  c: { compiler: "gcc-13.2.0-c", filename: "main.c" },
  cpp: { compiler: "gcc-12.3.0", filename: "main.cpp" },
  csharp: { compiler: "mono-6.12.0.199", filename: "main.cs" },
  php: { compiler: "php-8.3.12", filename: "main.php" },
};

type WandboxJson = {
  status?: string;
  signal?: string;
  program_output?: string;
  program_error?: string;
  program_message?: string;
  compiler_output?: string;
  compiler_error?: string;
  compiler_message?: string;
};

function pickText(json: WandboxJson): string {
  return (
    (json.program_error && json.program_error.trim()) ||
    (json.compiler_error && json.compiler_error.trim()) ||
    (json.compiler_message && json.compiler_message.trim()) ||
    (json.program_message && json.program_message.trim()) ||
    (json.compiler_output && json.compiler_output.trim()) ||
        ""
  );
}

function isTransient(json: WandboxJson, httpStatus: number): boolean {
  if (httpStatus >= 500) return true;
  const msg = pickText(json).toLowerCase();
  if (msg.includes("resource temporarily unavailable")) return true;
  if (msg.includes("oci runtime error")) return true;
  if (msg.includes("crun:")) return true;
  if (json.status === "126") return true;
  return false;
}

export function createWandboxAdapter(lang: string): RunnerAdapter {
  const config = CONFIG[lang] ?? CONFIG.c;

  return {
    name: "Wandbox (online compiler)",

    async isAvailable() {
      return true;
    },

    async run(code: string, stdin?: string): Promise<RunResult> {
      const start = performance.now();
      const maxAttempts = 2;
      let lastError = "";

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch("https://wandbox.org/api/compile.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              compiler: config.compiler,
              stdin: stdin ?? "",
            }),
          });

          if (!res.ok) {
            lastError = `Wandbox HTTP ${res.status}`;
            if (attempt < maxAttempts && res.status >= 500) {
              await new Promise((r) => setTimeout(r, 2000));
              continue;
            }
            return {
              stdout: "",
              stderr: lastError,
              status: "error",
              timeMs: Math.max(0, performance.now() - start),
              language: lang,
            };
          }

          const json = (await res.json()) as WandboxJson;
          const stdout = String(json.program_output ?? "");
          const stderr = pickText(json);
          const ok = json.status === "0";

          if (!ok && attempt < maxAttempts && isTransient(json, res.status)) {
            lastError = stderr || `status ${json.status}`;
            await new Promise((r) => setTimeout(r, 1500 * attempt));
            continue;
          }

          return {
            stdout,
            stderr: ok ? stderr : (stderr || `Eksekusi gagal (status ${json.status}). Coba lagi.`),
            status: ok ? "ok" : "error",
            timeMs: Math.max(0, performance.now() - start),
            language: lang,
          };
        } catch (error: unknown) {
          lastError = error instanceof Error ? error.message : "Gagal menghubungi layanan eksekusi.";
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 1500 * attempt));
            continue;
          }
          return {
            stdout: "",
            stderr: lastError,
            status: "error",
            timeMs: Math.max(0, performance.now() - start),
            language: lang,
          };
        }
      }

      return {
        stdout: "",
        stderr: lastError || "Layanan kompilasi Wandbox sedang sibuk. Coba lagi beberapa saat.",
        status: "error",
        timeMs: Math.max(0, performance.now() - start),
        language: lang,
      };
    },
  };
}
