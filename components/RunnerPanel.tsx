"use client";

export function RunnerPanel({
  result,
}: {
  result: { stdout: string; stderr: string; status: string; timeMs: number } | null;
}) {
  const statusColors: Record<string, string> = {
    ok: "text-emerald-400",
    error: "text-red-400",
    timeout: "text-amber-400",
    cancelled: "text-slate-400",
    "not-available": "text-slate-400",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          Hasil eksekusi
        </span>
        <span
          className={`text-xs font-bold uppercase tracking-wide ${statusColors[result?.status ?? "not-available"] ?? ""}`}
        >
          {result?.status ?? "siap"}
        </span>
        {result && (
          <span className="text-xs text-foreground/50">{result.timeMs.toFixed(0)} ms</span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-3 text-sm font-mono leading-relaxed">
        {result?.stdout ? (
          <>
            <p className="mb-1 text-xs font-semibold text-emerald-400">stdout</p>
            <pre className="whitespace-pre-wrap mb-2 text-foreground">{result.stdout}</pre>
          </>
        ) : null}
        {result?.stderr ? (
          <>
            <p className="mb-1 text-xs font-semibold text-red-400">stderr</p>
            <pre className="whitespace-pre-wrap text-foreground">{result.stderr}</pre>
          </>
        ) : null}
        {!result || (!result.stdout && !result.stderr) ? (
          <p className="text-foreground/50">Belum ada output. Tulis kode lalu klik Jalankan.</p>
        ) : null}
      </div>
    </div>
  );
}
