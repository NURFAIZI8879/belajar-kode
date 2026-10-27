"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { SearchItem } from "@/lib/types";

const FUSE_OPTIONS = {
  keys: [
    { name: "title" as const, weight: 0.5 },
    { name: "description" as const, weight: 0.3 },
    { name: "content" as const, weight: 0.2 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useMounted();

  const fuse = useMemo(() => (index ? new Fuse(index, FUSE_OPTIONS) : null), [index]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!fuse || trimmed.length < 2) {
      return [];
    }
    return fuse
      .search(trimmed)
      .slice(0, 8)
      .map((result) => result.item);
  }, [fuse, query]);

  useEffect(() => {
    if (!open || index) {
      return;
    }

    let cancelled = false;

    fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal memuat indeks.");
        }
        return response.json() as Promise<SearchItem[]>;
      })
      .then((items) => {
        if (!cancelled) {
          setIndex(items);
          setError(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Indeks pencarian gagal dimuat. Coba muat ulang halaman.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, index]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        if (!index) {
          setLoading(true);
          setError(null);
        }
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index]);

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  function openSearch() {
    setOpen(true);
    if (!index) {
      setLoading(true);
      setError(null);
    }
  }

  function closeSearch() {
    setOpen(false);
    setQuery("");
  }

  const dialog = (
    <div
      className="fixed inset-0 z-50 bg-black/50 p-4 pt-20 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeSearch();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        <h2 id="search-title" className="sr-only">
          Pencarian materi
        </h2>

        <div className="flex items-center gap-3 border-b border-border px-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 shrink-0 text-foreground/50"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari materi, misalnya pointer atau SELECT..."
            aria-label="Cari materi"
            className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="rounded border border-border px-2 py-1 text-xs text-foreground/60 hover:bg-muted"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && <p className="p-3 text-sm text-foreground/60">Memuat indeks pencarian...</p>}

          {!loading && error && <p className="p-3 text-sm text-red-600">{error}</p>}

          {!loading && !error && query.trim().length < 2 && (
            <p className="p-3 text-sm text-foreground/60">
              Ketik minimal 2 huruf untuk mencari materi.
            </p>
          )}

          {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
            <p className="p-3 text-sm text-foreground/60">
              Tidak ada materi yang cocok dengan pencarian kamu.
            </p>
          )}

          {!loading && !error && results.length > 0 && (
            <>
              <p className="sr-only" aria-live="polite">
                {results.length} hasil ditemukan.
              </p>
              <ul className="space-y-1">
                {results.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeSearch}
                      className="block rounded-lg px-3 py-2.5 transition hover:bg-muted"
                    >
                      <span className="text-xs font-medium text-primary">{item.languageLabel}</span>
                      <span className="mt-0.5 block font-medium">{item.title}</span>
                      <span className="mt-0.5 block text-sm text-foreground/60">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-foreground/50">
          <span>Pencarian materi BelajarKode</span>
          <span>
            <kbd className="rounded border border-border px-1.5 py-0.5">Ctrl</kbd>{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Cari materi"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden sm:inline">Cari</span>
      </button>

      {mounted && open ? createPortal(dialog, document.body) : null}
    </>
  );
}
