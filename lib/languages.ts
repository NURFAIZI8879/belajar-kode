import type { LanguageInfo, LanguageSlug } from "./types";

export const LANGUAGES: LanguageInfo[] = [
  {
    slug: "c",
    label: "C",
    shortDescription: "Fondasi bahasa pemrograman dan manajemen memori.",
    description:
      "Pelajari dasar bahasa C, mulai dari sintaks, variabel, pointer, hingga struktur data sederhana.",
  },
  {
    slug: "csharp",
    label: "C#",
    shortDescription: "Bahasa berorientasi objek di ekosistem .NET.",
    description:
      "Bangun pemahaman C# dari dasar, lalu masuk ke class, LINQ, dan penanganan exception.",
  },
  {
    slug: "python",
    label: "Python",
    shortDescription: "Bahasa yang mudah dibaca dan cocok untuk pemula.",
    description:
      "Belajar Python langkah demi langkah: sintaks, tipe data, perulangan, fungsi, dan struktur data.",
  },
  {
    slug: "php",
    label: "PHP",
    shortDescription: "Bahasa server-side untuk membangun website.",
    description: "Kuasai PHP dari dasar, termasuk form, session, dan koneksi ke database.",
  },
  {
    slug: "sql",
    label: "Database (SQL)",
    shortDescription: "Cara menyimpan, mencari, dan mengelola data.",
    description:
      "Pelajari SQL untuk mengambil dan mengubah data: SELECT, WHERE, JOIN, GROUP BY, dan lainnya.",
  },
];

export function getLanguage(slug: string): LanguageInfo | undefined {
  return LANGUAGES.find((language) => language.slug === slug);
}

export function isLanguageSlug(slug: string): slug is LanguageSlug {
  return LANGUAGES.some((language) => language.slug === slug);
}
