# Piston / Layanan Eksekusi Terisolasi

## Status

- **API publik `emkc.org`** sudah **tutup akses publik sejak 15 Feb 2026** (butuh token).
- **OnlineCompiler.io** (Piston-compatible) tersedia gratis: 100.000 runs/bulan, tapi perlu API key.
- **Self-host Piston** (MIT) direkomendasikan untuk produksi.

## Batas & Syarat (catatan dari pengecekan web)

- Rate limit umum Piston publik: **5 request/detik**.
- Default timeout eksekusi: **3 detik**.
- Batas memori: default tidak dibatasi, tapi bisa diatur (`compile_memory_limit`, `run_memory_limit`).
- **Tidak ada overage charge** pada plan gratis OnlineCompiler.io.

## Rekomendasi Praktis

1. Untuk **MVP / portofolio**: gunakan `pistonAdapter` (default) dengan peringatan ke pengguna bahwa layanan ini mungkin perlu diganti.
2. Untuk **produksi**: daftarkan API key di `OnlineCompiler.io`, ubah `PISTON_API_URL` di `.env.local`, dan aktifkan rate limit di server.
3. **Jangan** menyimpan kode pengguna di server aplikasi; hanya proxy ke layanan terisolasi.

## Penggunaan di Proyek Ini

- Route `/api/run` hanya menerima `c` dan `csharp` (terisolasi), dengan validasi input, batas ukuran, rate limit per IP, dan penanganan error dalam bahasa Indonesia.
- Adapter sudah terdaftar di `lib/runners/register.ts`.
