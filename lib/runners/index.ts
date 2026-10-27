import type { RunnerAdapter, RunResult } from "./runner";

const ADAPTERS: Map<string, () => Promise<RunnerAdapter>> = new Map();

export function registerRunner(language: string, factory: () => Promise<RunnerAdapter>) {
  ADAPTERS.set(language, factory);
}

export async function getRunner(language: string): Promise<RunnerAdapter | null> {
  const factory = ADAPTERS.get(language.toLowerCase());
  if (!factory) {
    return null;
  }
  return factory();
}

export async function runCode(
  language: string,
  code: string,
  stdin?: string,
  options?: { timeoutMs?: number },
): Promise<RunResult> {
  const runner = await getRunner(language);

  if (!runner) {
    return {
      stdout: "",
      stderr: `Bahasa "${language}" belum tersedia untuk dijalankan di browser.`,
      status: "not-available",
      timeMs: 0,
      language,
    };
  }

  const available = await runner.isAvailable();
  if (!available) {
    return {
      stdout: "",
      stderr: `Runtime "${runner.name}" sedang dimuat atau tidak tersedia.`,
      status: "not-available",
      timeMs: 0,
      language,
    };
  }

  return runner.run(code, stdin, options);
}
