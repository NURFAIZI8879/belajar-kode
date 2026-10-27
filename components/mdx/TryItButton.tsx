"use client";

import { useRouter } from "next/navigation";

export function TryItButton({ code, language }: { code: string; language: string }) {
  const router = useRouter();

  function handleClick() {
    try {
      sessionStorage.setItem("belajar-kode:try-code", code);
      sessionStorage.setItem("belajar-kode:try-language", language);
    } finally {
      router.push("/try");
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
