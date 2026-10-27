import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getLessonList } from "@/lib/content";
import { getLanguage } from "@/lib/languages";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = getLanguage(lang);

  if (!language) {
    notFound();
  }

  const lessons = getLessonList(language.slug);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 md:flex">
      <Sidebar language={language} lessons={lessons} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
