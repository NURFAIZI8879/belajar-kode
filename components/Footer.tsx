import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 BelajarKode. Materi orisinal.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary">
            Kebijakan Privasi
          </Link>
          <Link href="/about" className="hover:text-primary">
            Tentang
          </Link>
        </div>
      </div>
    </footer>
  );
}
