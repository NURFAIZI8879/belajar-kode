"use client";

import { useRouter } from "next/navigation";

export function TryItButton({ code, language }: { code: string; language: string }) {
  const router = useRouter();

  function handleClick() {
    let lang = (language || "").trim().toLowerCase();
    // Derive from current page URL if language missing/invalid
    if (!lang || lang === "text" || lang === "bash" || lang === "plaintext") {
      const path = window.location.pathname;
      if (path.includes("/c/") || path.includes("/c?")) lang = "c";
      else if (path.includes("/csharp/") || path.includes("/csharp?")) lang = "csharp";
      else if (path.includes("/python/") || path.includes("/python?")) lang = "python";
      else if (path.includes("/php/") || path.includes("/php?")) lang = "php";
      else if (path.includes("/cpp/") || path.includes("/cpp?")) lang = "cpp";
    }
    if (!lang) lang = "python";

    try {
      sessionStorage.setItem("belajar-kode:try-code", code);
      sessionStorage.setItem("belajar-kode:try-language", lang);
    } finally {
      router.push(`/try?lang=${encodeURIComponent(lang)}`);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!code.trim()}
      className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Coba Sendiri
    </button>
  );
}
