# BelajarKode

Website belajar coding berbahasa Indonesia untuk lima topik: **C, C#, Python, PHP, dan Database (SQL)**. Konsepnya mirip W3Schools, tetapi seluruh materi ditulis orisinal dan disimpan sebagai file Markdown/MDX di dalam repo.

> Status: **Tahap 0 selesai** — setup proyek, layout dasar, mode gelap, lint, formatter, dan CI.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Konten Markdown/MDX (Tahap 1)
- Runner browser: sql.js (SQL), Pyodide (Python), php-wasm (PHP)
- Runner eksternal untuk C/C#: Piston public API (default) atau Judge0
- Database akun (Tahap 5): Prisma + PostgreSQL
- Deploy: Vercel

## Menjalankan proyek

Prasyarat: Node.js 20.9+ dan npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka <http://localhost:3000>.

Jika memakai PowerShell, gunakan `Copy-Item .env.example .env.local`.

## Script

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # jalankan hasil build
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run format       # Prettier (tulis)
npm run format:check # Prettier (cek)
```

## Struktur folder

```text
app/                  # route Next.js App Router
components/           # komponen UI reusable
content/              # materi Markdown/MDX per bahasa (Tahap 1)
exercises/            # soal latihan JSON/YAML (Tahap 3)
lib/runners/          # adapter runner dengan antarmuka seragam (Tahap 2-4)
tests/                # unit test (Tahap 6)
.github/workflows/    # CI lint + typecheck + build
```

## Keputusan teknis

- **Next.js App Router** dipilih karena kebutuhan SEO (server-rendered/static), route API untuk runner C/C#, dan ekosistem yang matang.
- **Mode gelap** memakai class `dark` di `<html>`, disimpan di `localStorage`, dengan skrip anti-flash di layout.
- **Piston** dipilih sebagai default runner C/C# karena dapat dipakai tanpa API key. Batas gratis/rate limit dapat berubah; verifikasi sebelum produksi. Alternatif: Judge0 (butuh API key) atau self-host Piston.
- **php-wasm** dan runtime berat lain dimuat lazy saat dibutuhkan agar halaman materi tetap ringan.

## Keamanan

- Kode pengguna untuk C/C# **tidak** dieksekusi di server aplikasi; server hanya menjadi proxy ke layanan eksekusi terisolasi.
- API key disimpan di `.env.local` dan tidak pernah di-commit.
- Tahap 4 akan menambahkan rate limiting per IP, validasi ukuran input, timeout, dan pesan error bahasa Indonesia.

## Roadmap

- [x] Tahap 0: setup, layout, dark mode
- [ ] Tahap 1: sistem konten MDX, sidebar otomatis, navigasi, pencarian
- [ ] Tahap 2: editor + runner SQL/Python
- [ ] Tahap 3: kuis, fill-in-the-blank, coding challenge
- [ ] Tahap 4: runner C/C#/PHP via API terisolasi
- [ ] Tahap 5: akun, progres, sertifikat
- [ ] Tahap 6: SEO, performa, aksesibilitas, tes, deploy
