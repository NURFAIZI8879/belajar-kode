import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";
import { LANGUAGES } from "./languages";
import type { LanguageSlug, LessonSummary } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const frontmatterSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug harus berupa huruf kecil dan tanda hubung"),
  order: z.number().int().positive(),
  language: z.enum(["c", "csharp", "python", "php", "sql"]),
  description: z.string().trim().min(10).max(300),
  objectives: z
    .array(z.string().trim().min(3).max(200))
    .min(1, "minimal satu tujuan belajar")
    .max(8, "maksimal delapan tujuan belajar"),
  updatedAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "format tanggal harus YYYY-MM-DD")
    .optional(),
});

type LessonFile = {
  meta: LessonSummary;
  content: string;
};

function countWords(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain ? plain.split(" ").length : 0;
}

function readLessonFile(language: LanguageSlug, filename: string): LessonFile {
  const filePath = path.join(CONTENT_DIR, language, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Frontmatter tidak valid di ${filePath}:\n${parsed.error.issues
        .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
  }

  if (parsed.data.language !== language) {
    throw new Error(
      `Frontmatter ${filePath} menyatakan bahasa "${parsed.data.language}", tetapi file berada di folder "${language}".`,
    );
  }

  const readingTime = Math.max(1, Math.ceil(countWords(content) / 200));

  return {
    meta: {
      ...parsed.data,
      readingTime,
    },
    content,
  };
}

function getLessonFiles(language: LanguageSlug): string[] {
  const directory = path.join(CONTENT_DIR, language);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".mdx"))
    .sort();
}

export const getLessonList = cache((language: LanguageSlug): LessonSummary[] => {
  const lessons = getLessonFiles(language).map(
    (filename) => readLessonFile(language, filename).meta,
  );

  const slugs = new Set<string>();
  const orders = new Set<number>();

  for (const lesson of lessons) {
    if (slugs.has(lesson.slug)) {
      throw new Error(`Slug "${lesson.slug}" dipakai lebih dari sekali di bahasa ${language}.`);
    }
    if (orders.has(lesson.order)) {
      throw new Error(
        `Urutan bab ${lesson.order} dipakai lebih dari sekali di bahasa ${language}.`,
      );
    }
    slugs.add(lesson.slug);
    orders.add(lesson.order);
  }

  return lessons.sort((a, b) => a.order - b.order);
});

export const getLesson = cache((language: LanguageSlug, slug: string): LessonFile | null => {
  for (const filename of getLessonFiles(language)) {
    const lesson = readLessonFile(language, filename);
    if (lesson.meta.slug === slug) {
      return lesson;
    }
  }

  return null;
});

export function getAdjacentLessons(language: LanguageSlug, slug: string) {
  const lessons = getLessonList(language);
  const index = lessons.findIndex((lesson) => lesson.slug === slug);

  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

export function getAllLessonParams() {
  return getLanguageList().flatMap((language) =>
    getLessonList(language.slug).map((lesson) => ({
      lang: language.slug,
      slug: lesson.slug,
    })),
  );
}

export function getLanguageList() {
  return LANGUAGES;
}
