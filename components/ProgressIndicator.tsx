"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress } from "@/lib/progress";
import { getLanguage } from "@/lib/languages";

export function ProgressIndicator() {
  const [items, setItems] = useState<import("@/lib/progress").ProgressItem[]>(() => {
    try {
      return getProgress();
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const refresh = () => {
      try {
        setItems(getProgress());
      } catch {}
    };
    const id = requestAnimationFrame(refresh);
    window.addEventListener("belajar-kode:progress", refresh);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("belajar-kode:progress", refresh);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label="Progres belajar" className="mx-auto w-full max-w-3xl px-4 py-6">
      <h2 className="text-lg font-bold">Progres Belajar</h2>
      <p className="text-sm text-foreground/60">Disimpan di browser (localStorage).</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const lang = getLanguage(item.lang);
          return (
            <li key={`${item.lang}/${item.slug}`}>
              <Link
                href={`/${item.lang}/${item.slug}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold dark:bg-emerald-950 dark:text-emerald-200">
                  ✓
                </span>
                <div className="min-w-0">
                  <span className="block text-sm font-medium truncate">
                    {lang?.label ?? item.lang}
                  </span>
                  <span className="block text-xs text-foreground/50">{item.slug}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
