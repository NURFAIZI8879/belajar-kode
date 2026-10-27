"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LanguageInfo, LessonSummary } from "@/lib/types";

type SidebarProps = {
  language: LanguageInfo;
  lessons: LessonSummary[];
};

function ActiveLessonList({
  language,
  lessons,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  if (lessons.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-3 text-sm text-foreground/60">
        Materi untuk topik ini sedang disiapkan.
      </p>
    );
  }

  return (
    <ol className="space-y-1">
      {lessons.map((lesson) => {
        const href = `/${language.slug}/${lesson.slug}`;
        const active = pathname === href;

        return (
          <li key={lesson.slug}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group flex gap-3 rounded-md px-2 py-2 text-sm transition ${
                active ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <span
                className={`mt-0.5 font-mono text-xs ${
                  active ? "text-primary/70" : "text-foreground/40"
                }`}
              >
                {String(lesson.order).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{lesson.title}</span>
                <span className="mt-0.5 block text-xs text-foreground/50">
                  {lesson.readingTime} menit baca
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function Sidebar({ language, lessons }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="border-b border-border bg-muted/20 p-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link href={`/${language.slug}`} className="text-sm font-semibold hover:text-primary">
              {language.label}
            </Link>
            <p className="text-xs text-foreground/50">{lessons.length} bab</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-lesson-list"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Daftar Bab {mobileOpen ? "▲" : "▼"}
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-lesson-list" className="mt-3 max-h-80 overflow-y-auto">
            <ActiveLessonList
              language={language}
              lessons={lessons}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        )}
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4">
          <Link href="/" className="text-xs text-foreground/50 hover:text-primary">
            ← Semua topik
          </Link>
          <h2 className="mt-4 text-lg font-semibold">{language.label}</h2>
          <p className="mt-1 text-xs text-foreground/50">{lessons.length} bab dalam topik ini</p>
          <nav aria-label={`Daftar bab ${language.label}`} className="mt-4">
            <ActiveLessonList language={language} lessons={lessons} />
          </nav>
        </div>
      </aside>
    </>
  );
}
