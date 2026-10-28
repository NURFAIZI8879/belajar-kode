export type ProgressItem = {
  lang: string;
  slug: string;
  completed: boolean;
  score?: number;
};

const KEY = "belajar-kode-progress";

export function getProgress(): ProgressItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProgress(items: ProgressItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function markLessonComplete(lang: string, slug: string) {
  const current = getProgress();
  const existing = current.find((p) => p.lang === lang && p.slug === slug);
  if (existing) {
    existing.completed = true;
  } else {
    current.push({ lang, slug, completed: true });
  }
  saveProgress(current);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("belajar-kode:progress"));
  }
}
