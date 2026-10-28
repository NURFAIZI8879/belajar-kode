"use client";

import "@/lib/runners/register";
import { useCallback, useState } from "react";
import { runCode } from "@/lib/runners";
import { CodeEditor } from "./CodeEditor";
import { RunnerPanel } from "./RunnerPanel";

const SAMPLE_CODE: Record<string, string> = {
  c: `#include <stdio.h>

int main(void) {
    printf("Halo, dunia!\\n");
    return 0;
}`,
  csharp: `Console.WriteLine("Halo, dunia!");`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Halo, dunia!" << endl;
    return 0;
}`,
  python: `print("Halo, dunia!")`,
  php: `<?php
echo "Halo, dunia!";`,
};

const LANGUAGE_LABELS: Record<string, string> = {
  c: "C",
  csharp: "C#",
  cpp: "C++",
  python: "Python",
  php: "PHP",
};

type RunResult = {
  stdout: string;
  stderr: string;
  status: string;
  timeMs: number;
};

export default function TryItYourself({ language }: { language: string }) {
  const [code, setCode] = useState(SAMPLE_CODE[language] ?? "");
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await runCode(language, code, stdin || undefined);
      setResult({
        stdout: res.stdout,
        stderr: res.stderr,
        status: res.status,
        timeMs: res.timeMs,
      });
    } catch (error: unknown) {
      setResult({
        stdout: "",
        stderr: error instanceof Error ? error.message : "Terjadi kesalahan saat menjalankan kode.",
        status: "error",
        timeMs: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [language, code, stdin]);

  const handleReset = useCallback(() => {
    setCode(SAMPLE_CODE[language] ?? "");
    setResult(null);
  }, [language]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Coba Sendiri — {LANGUAGE_LABELS[language] ?? language}
          </h1>
          <p className="mt-1 text-foreground/70">
            Tulis kode di editor kiri, lalu klik Jalankan untuk melihat hasilnya di kanan.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Menjalankan…" : "Jalankan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-foreground/80">Kode</label>
          <CodeEditor key={language} language={language} value={code} onChange={setCode} />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-foreground/80">
            Input standar (opsional)
          </label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Ketik input yang akan dibaca program…"
            rows={4}
            className="flex-1 min-h-[40px] rounded-lg border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
          <RunnerPanel result={result} />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground/70">
        <p className="font-semibold">Catatan keamanan:</p>
        <p className="mt-1">
          Kode untuk {LANGUAGE_LABELS[language] ?? language} dijalankan sepenuhnya di browser kamu
          (runtime WASM/Web Worker), bukan di server kami.
        </p>
      </div>
    </section>
  );
}
