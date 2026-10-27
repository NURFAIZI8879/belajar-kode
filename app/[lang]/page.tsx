const LANGS = ["c", "csharp", "python", "php", "sql"];

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Topik: {lang.toUpperCase()}</h1>
      <p className="mt-3 text-foreground/70">Daftar bab akan muncul di sini pada Tahap 1.</p>
    </section>
  );
}
