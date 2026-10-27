const LANGS = ["c", "csharp", "python", "php", "sql"];

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang, slug: "pengenalan" }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">
        {lang}/{slug}
      </h1>
      <p className="mt-3 text-foreground/70">Halaman materi (Tahap 1).</p>
    </section>
  );
}
