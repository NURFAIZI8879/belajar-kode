# BelajarKode

Website belajar coding berbahasa Indonesia untuk topik: **C, C#, C++, Python, dan PHP**. Konsepnya mirip W3Schools, tetapi seluruh materi ditulis orisinal dan disimpan sebagai file Markdown/MDX di dalam repo.

## Status

- ✅ Build sukses (`npm run build`)
- ✅ SEO dasar: title, meta description, Open Graph, sitemap.xml, robots.txt
- ✅ Aksesibilitas: link skip-to-content, label tombol, aria-label, kontras warna
- ✅ Editor kode: Monaco (lazy-load) + runner di browser/Wandbox
- ⚠ Tes: lint, typecheck, build; tes unit runner bisa ditambahkan nanti
- ⚠ Deploy: siap ke Vercel dengan `npm run build`

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Konten Markdown/MDX
- Runner browser: Pyodide (Python), Wandbox API (C, C++, C#, PHP)
- Database akun (Tahap 5): belum dikonfigurasi

## Menjalankan proyek secara lokal

Prasyarat: Node.js 20.9+ dan npm.

```powershell
npm install
npm run dev
# Buka http://localhost:3000
```

Script yang tersedia:

```powershell
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
content/              # materi Markdown/MDX per bahasa
exercises/            # soal latihan JSON
lib/runners/          # adapter runner dengan antarmuka seragam
public/               # aset statis
```

## Catatan

- Eksekusi kode C/C++/C#/PHP menggunakan layanan Wandbox (tidak perlu API key). Jika layanan tidak tersedia, pesan error akan ditampilkan.
- Kode Python dijalankan sepenuhnya di browser (Pyodide).
- Progres belajar disimpan di `localStorage` browser.
