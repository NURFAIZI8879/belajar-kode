import Link from "next/link";
import { Search } from "./Search";
import { ThemeToggle } from "./ThemeToggle";

const LANGS = [
  { slug: "c", label: "C" },
  { slug: "csharp", label: "C#" },
  { slug: "cpp", label: "C++" },
  { slug: "python", label: "Python" },
  { slug: "php", label: "PHP" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav className="sticky top-0 z-40 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border">
        <Link href="/" className="text-lg font-bold text-primary">
          BelajarKode
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {LANGS.map((l) => (
            <Link key={l.slug} href={`/${l.slug}`} className="text-sm hover:text-primary sm:text-base">
              {l.label}
            </Link>
          ))}
          <Link href="/about" className="text-sm hover:text-primary sm:text-base">
            Tentang
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Search />
          <ThemeToggle />
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-sm">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-2 flex w-48 flex-col gap-1 rounded-lg border border-border bg-background p-2 shadow-lg">
              {LANGS.map((l) => (
                <Link
                  key={l.slug}
                  href={`/${l.slug}`}
                  className="rounded px-2 py-1.5 text-sm hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/about" className="rounded px-2 py-1.5 text-sm hover:bg-muted">
                Tentang
              </Link>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
