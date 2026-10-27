import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-3 text-foreground/70">Halaman tidak ditemukan.</p>
      <Link href="/" className="mt-6 rounded-md bg-primary px-4 py-2 text-white">
        Kembali ke Beranda
      </Link>
    </section>
  );
}
