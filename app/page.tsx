import Link from "next/link";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { getLessonList } from "@/lib/content";
import { LANGUAGES } from "@/lib/languages";

export default function Home() {
  const topics = LANGUAGES.map((language) => ({
    ...language,
    lessonCount: getLessonList(language.slug).length,
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Belajar dengan contoh
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Belajar Coding dalam Bahasa Indonesia
        </h1>
        <p className="mt-3 text-foreground/70">
          Konsep seperti W3Schools, tetapi materi orisinal dan berbahasa Indonesia. Pilih topik
          untuk mulai, atau tekan{" "}
          <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">Ctrl</kbd> +{" "}
          <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">K</kbd> untuk mencari.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/${topic.slug}`}
            className="group rounded-xl border border-border bg-background p-5 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold group-hover:text-primary">{topic.label}</h2>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/60">
                {topic.lessonCount} bab
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{topic.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary">
              Lihat materi →
            </span>
          </Link>
        ))}
      </div>
      <ProgressIndicator />
    </section>
  );
}
