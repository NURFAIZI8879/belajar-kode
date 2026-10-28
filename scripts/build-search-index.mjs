import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const LANGUAGES = [
  { slug: "c", label: "C" },
  { slug: "csharp", label: "C#" },
  { slug: "cpp", label: "C++" },
  { slug: "python", label: "Python" },
  { slug: "php", label: "PHP" },
];

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_FILE = path.join(process.cwd(), "public", "search-index.json");

function toPlainText(source) {
  return source
    .replace(/```[a-z]*\n([\s\S]*?)```/gi, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(source) {
  const plain = toPlainText(source);
  return plain ? plain.split(" ").length : 0;
}

function readLesson(language, filename) {
  const filePath = path.join(CONTENT_DIR, language.slug, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const required = ["title", "slug", "order", "language", "description"];
  for (const field of required) {
    if (data[field] === undefined || data[field] === "") {
      throw new Error(`Frontmatter "${field}" kosong di ${filePath}`);
    }
  }

  if (data.language !== language.slug) {
    throw new Error(
      `Bahasa pada ${filePath} adalah "${data.language}", seharusnya "${language.slug}".`,
    );
  }

  return {
    title: String(data.title),
    slug: String(data.slug),
    order: Number(data.order),
    language: language.slug,
    languageLabel: language.label,
    description: String(data.description),
    objectives: Array.isArray(data.objectives) ? data.objectives.map(String) : [],
    readingTime: Math.max(1, Math.ceil(countWords(content) / 200)),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    href: `/${language.slug}/${data.slug}`,
    content: toPlainText(content).slice(0, 4000),
  };
}

function buildIndex() {
  const items = [];

  for (const language of LANGUAGES) {
    const directory = path.join(CONTENT_DIR, language.slug);
    if (!fs.existsSync(directory)) {
      continue;
    }

    const files = fs
      .readdirSync(directory)
      .filter((filename) => filename.endsWith(".mdx"))
      .sort();

    for (const filename of files) {
      items.push(readLesson(language, filename));
    }
  }

  items.sort((a, b) => {
    const languageOrder =
      LANGUAGES.findIndex((language) => language.slug === a.language) -
      LANGUAGES.findIndex((language) => language.slug === b.language);
    return languageOrder || a.order - b.order;
  });

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items), "utf8");
  console.log(`Indeks pencarian dibuat: ${items.length} bab -> public/search-index.json`);
}

try {
  buildIndex();
} catch (error) {
  console.error("Gagal membuat indeks pencarian:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
