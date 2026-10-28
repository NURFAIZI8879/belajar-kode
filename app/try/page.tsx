import TryItYourself from "@/components/TryItYourself";

const VALID_LANGS = ["c", "csharp", "python", "php", "cpp"];

export default async function TryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang = params.lang;
  const language = lang && VALID_LANGS.includes(lang) ? lang : "python";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8">
      <TryItYourself language={language || "python"} />
    </section>
  );
}
