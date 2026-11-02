"use client";

import { useEffect, useState } from "react";
import TryItYourself from "@/components/TryItYourself";

const VALID_LANGS = ["c", "csharp", "python", "php", "cpp"];

export default function TryPage() {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    setLanguage(lang && VALID_LANGS.includes(lang) ? lang : "python");
  }, []);

  if (!language) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-foreground/60">Memuat editor…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8">
      <TryItYourself language={language} />
    </section>
  );
}
