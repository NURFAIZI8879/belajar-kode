"use client";

import { isValidElement, useState, type ComponentProps, type ReactNode } from "react";
import { TryItButton } from "./TryItButton";

const LANGUAGE_LABELS: Record<string, string> = {
  c: "C",
  csharp: "C#",
  cs: "C#",
  cpp: "C++",
  cplusplus: "C++",
  python: "Python",
  py: "Python",
  php: "PHP",
  bash: "Terminal",
  text: "Teks",
};

type PreProps = ComponentProps<"pre"> & {
  "data-language"?: string;
};

function extractText(node: ReactNode): string {
  if (typeof node === "string") {
    return node;
  }
  if (typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

export function MDXCodeBlock({ children, className, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);
  const code = extractText(children).replace(/\n$/, "");
  const language = (props["data-language"] as string | undefined) ?? (className?.match(/language-([a-z]+)/)?.[1] || "text");
  const label = LANGUAGE_LABELS[language] ?? language;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            aria-label="Salin kode"
            className="rounded-md px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            {copied ? "Tersalin" : "Salin"}
          </button>
          <TryItButton code={code} language={language} />
        </div>
      </div>
      <pre {...props} className={`overflow-x-auto p-4 text-sm sm:text-base leading-relaxed ${className ?? ""}`}>
        {children}
      </pre>
    </div>
  );
}
