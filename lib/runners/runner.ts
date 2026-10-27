export type RunnerStatus = "ok" | "error" | "timeout" | "cancelled" | "not-available";

export type RunResult = {
  stdout: string;
  stderr: string;
  status: RunnerStatus;
  timeMs: number;
  language: string;
};

export type RunnerAdapter = {
  name: string;
  isAvailable(): Promise<boolean>;
  run(code: string, stdin?: string, options?: { timeoutMs?: number }): Promise<RunResult>;
};
