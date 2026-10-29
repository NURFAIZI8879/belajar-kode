"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGE_LABELS: Record<string, string> = {
  c: "C",
  csharp: "C#",
  cpp: "C++",
  python: "Python",
  php: "PHP",
};

const MONACO_LANGUAGE: Record<string, string> = {
  c: "c",
  csharp: "csharp",
  cpp: "cpp",
  python: "python",
  php: "php",
};

type CodeEditorProps = {
  language: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
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
      <div className="flex-1 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
        <MonacoEditor
          height="100%"
          language={MONACO_LANGUAGE[language] ?? "plaintext"}
          value={value}
          onChange={(v) => onChange?.(v ?? "")}
          theme="vs-dark"
          options={{
            readOnly: readOnly ?? false,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}