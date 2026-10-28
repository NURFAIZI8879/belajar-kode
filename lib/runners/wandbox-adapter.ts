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

export function createWandboxAdapter(lang: string): RunnerAdapter {
  const config = CONFIG[lang] ?? CONFIG.c;

  return {
    name: "Wandbox (online compiler)",

    async isAvailable() {
      return true;
    },

    async run(code: string, stdin?: string): Promise<RunResult> {
      const start = performance.now();
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
          throw new Error(`Wandbox HTTP ${res.status}`);
        }

        const json = (await res.json()) as {
          status?: string;
          program_output?: string;
          program_error?: string;
          compiler_error?: string;
          compiler_message?: string;
        };

        const stdout = String(json.program_output ?? "");
        const stderr = String(json.program_error ?? json.compiler_error ?? json.compiler_message ?? "");
        const ok = json.status === "0";

        return {
          stdout,
          stderr,
          status: ok ? "ok" : "error",
          timeMs: Math.max(0, performance.now() - start),
          language: lang,
        };
      } catch (error: unknown) {
        return {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Gagal menghubungi layanan eksekusi.",
          status: "error",
          timeMs: Math.max(0, performance.now() - start),
          language: lang,
        };
      }
    },
  };
}