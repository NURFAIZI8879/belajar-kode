"use client";

type CodeEditorProps = {
  language: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
};

const LANGUAGE_LABELS: Record<string, string> = {
  c: "C",
  csharp: "C#",
  python: "Python",
  php: "PHP",
  sql: "SQL",
};

export function CodeEditor({ language, value, onChange, readOnly }: CodeEditorProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-foreground/60">
          {LANGUAGE_LABELS[language] ?? language}
        </span>
        <span className="text-xs text-foreground/40">Editor kode</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="h-full w-full bg-[#0d1117] p-4 text-sm font-mono leading-relaxed text-zinc-100 focus:outline-none resize-none"
        spellCheck={false}
      />
    </div>
  );
}
