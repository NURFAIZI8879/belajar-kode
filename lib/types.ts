export type LanguageSlug = "c" | "csharp" | "python" | "php" | "sql";

export type LanguageInfo = {
  slug: LanguageSlug;
  label: string;
  description: string;
  shortDescription: string;
};

export type LessonSummary = {
  title: string;
  slug: string;
  order: number;
  language: LanguageSlug;
  description: string;
  objectives: string[];
  readingTime: number;
  updatedAt?: string;
};

export type SearchItem = LessonSummary & {
  languageLabel: string;
  href: string;
  content: string;
};
