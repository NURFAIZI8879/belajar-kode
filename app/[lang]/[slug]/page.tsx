import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";
import { LessonActions } from "@/components/LessonActions";
import { getAllLessonParams, getAdjacentLessons, getLesson } from "@/lib/content";
import { getLanguage } from "@/lib/languages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const language = getLanguage(lang);
  const lesson = language ? getLesson(language.slug, slug) : null;

  if (!language || !lesson) {
    return {};
  }

  const path = `/${language.slug}/${lesson.meta.slug}`;
  const title = `${lesson.meta.title} — ${language.label}`;

  return {
    title,
    description: lesson.meta.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: lesson.meta.description,
      url: path,
      siteName: "BelajarKode",
      locale: "id_ID",
      type: "article",
    },
  };
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const language = getLanguage(lang);

  if (!language) {
    notFound();
  }

  const lesson = getLesson(language.slug, slug);

  if (!lesson) {
    notFound();
  }

  const { previous, next } = getAdjacentLessons(language.slug, lesson.meta.slug);

  return (
    <article className="px-4 py-8 md:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-foreground/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Beranda
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${language.slug}`} className="hover:text-primary">
              {language.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground/80">
            {lesson.meta.title}
          </li>
        </ol>
      </nav>

      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/60">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            {language.label}
          </span>
          <span>Bab {lesson.meta.order}</span>
          <span aria-hidden="true">•</span>
          <span>{lesson.meta.readingTime} menit baca</span>
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{lesson.meta.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-foreground/70">{lesson.meta.description}</p>

        {lesson.meta.updatedAt && (
          <p className="mt-3 text-xs text-foreground/50">
            Diperbarui {formatDate(lesson.meta.updatedAt)}
          </p>
        )}
      </header>

      {lesson.meta.objectives.length > 0 && (
        <section
          aria-labelledby="tujuan-belajar"
          className="mt-8 max-w-3xl rounded-xl border border-border bg-muted/30 p-5"
        >
          <h2 id="tujuan-belajar" className="text-base font-semibold">
            Tujuan belajar
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/80">
            {lesson.meta.objectives.map((objective) => (
              <li key={objective} className="flex gap-2">
                <span aria-hidden="true" className="text-primary">
                  ✓
                </span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mdx-content mt-8 max-w-3xl">
        <MDXRemote
          source={lesson.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: false }],
              ],
            },
          }}
        />
      </div>

      <LessonActions lang={language.slug} slug={lesson.meta.slug} />

      <nav
        aria-label="Navigasi bab"
        className="mt-12 grid max-w-3xl gap-3 border-t border-border pt-6 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            href={`/${language.slug}/${previous.slug}`}
            className="rounded-lg border border-border p-4 transition hover:border-primary hover:bg-muted/30"
          >
            <span className="text-xs text-foreground/50">← Sebelumnya</span>
            <span className="mt-1 block font-medium">{previous.title}</span>
          </Link>
        ) : (
          <Link
            href={`/${language.slug}`}
            className="rounded-lg border border-dashed border-border p-4 transition hover:border-primary hover:bg-muted/30"
          >
            <span className="text-xs text-foreground/50">← Daftar bab</span>
            <span className="mt-1 block font-medium">{language.label}</span>
          </Link>
        )}

        {next ? (
          <Link
            href={`/${language.slug}/${next.slug}`}
            className="rounded-lg border border-border p-4 text-right transition hover:border-primary hover:bg-muted/30"
          >
            <span className="text-xs text-foreground/50">Berikutnya →</span>
            <span className="mt-1 block font-medium">{next.title}</span>
          </Link>
        ) : (
          <Link
            href={`/${language.slug}`}
            className="rounded-lg border border-dashed border-border p-4 text-right transition hover:border-primary hover:bg-muted/30"
          >
            <span className="text-xs text-foreground/50">Selesai →</span>
            <span className="mt-1 block font-medium">Kembali ke daftar bab</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
