import Link from "next/link";

const LANGS = [
  { slug: "c", label: "C", desc: "Bahasa dasar yang dekat dengan mesin." },
  { slug: "csharp", label: "C#", desc: "OOP modern di ekosistem .NET." },
  { slug: "python", label: "Python", desc: "Mudah dibaca, cocok untuk pemula." },
  { slug: "php", label: "PHP", desc: "Pengembangan web server-side." },
  { slug: "sql", label: "Database (SQL)", desc: "Kelola dan query data." },
];

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold md:text-4xl">Belajar Coding dalam Bahasa Indonesia</h1>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Konsep seperti W3Schools, tapi materi orisinal dan berbahasa Indonesia. Pilih topik untuk
          mulai.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LANGS.map((l) => (
          <Link
            key={l.slug}
            href={`/${l.slug}`}
            className="rounded-lg border border-border bg-background p-5 transition hover:border-primary hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold">{l.label}</h2>
            <p className="mt-1 text-sm text-foreground/70">{l.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
