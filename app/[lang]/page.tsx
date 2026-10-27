import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonList } from "@/lib/content";
import { getLanguage, LANGUAGES } from "@/lib/languages";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((language) => ({ lang: language.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = getLanguage(lang);

  if (!language) {
    return {};
  }

  return {
    title: `${language.label} — Materi Belajar`,
    description: language.description,
    alternates: {
      canonical: `/${language.slug}`,
    },
  };
}

export default async function LangPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const language = getLanguage(lang);

  if (!language) {
    notFound();
  }

  const lessons = getLessonList(language.slug);
  const firstLesson = lessons[0];

  return (
    <section className="px-4 py-10 md:px-8">
      <div className="max-w-3xl">
        <Link href="/" className="text-sm text-foreground/60 hover:text-primary">
          ← Semua topik
        </Link>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">Topik</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{language.label}</h1>
        <p className="mt-3 text-lg leading-relaxed text-foreground/70">{language.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-border px-3 py-1 text-sm text-foreground/60">
            {lessons.length} bab contoh
          </span>
          {firstLesson && (
            <Link
              href={`/${language.slug}/${firstLesson.slug}`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Mulai belajar
            </Link>
          )}
        </div>
      </div>

      <div className="mt-10 max-w-3xl">
        <h2 className="text-lg font-semibold">Daftar bab</h2>

        {lessons.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-sm text-foreground/60">
            Materi untuk topik ini sedang disiapkan. Kembali lagi nanti.
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {lessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/${language.slug}/${lesson.slug}`}
                  className="group flex gap-4 rounded-xl border border-border p-4 transition hover:border-primary hover:bg-muted/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary">
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold group-hover:text-primary">
                      {lesson.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-foreground/60">
                      {lesson.description}
                    </span>
                    <span className="mt-2 block text-xs text-foreground/50">
                      {lesson.readingTime} menit baca
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
