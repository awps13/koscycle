# KosCycle — Marketplace Barang Bekas Mahasiswa

Platform untuk anak kos **menjual, membarter, atau menghibahkan** barang (meja, rak, kipas, dispenser, alat masak, dll.) saat pindah kos.

**Stack:** Next.js 16 (App Router, Cache Components) · shadcn/ui (Base UI) · Tailwind CSS v4 · Drizzle ORM · Vercel Postgres (Neon) · Better Auth · Cloudinary

## Fitur

- Landing page sesuai desain (hero + pencarian kampus/kategori, kategori, katalog dengan filter jenis)
- Jelajah barang: cari kata kunci, filter kategori/kampus/jenis, urutkan harga, pagination
- Barter Hub & Hibah Gratis
- Detail barang: galeri foto, info penjual + badge KTM, barang serupa
- Daftar/Masuk (email + password)
- Pasang & edit iklan, upload foto langsung ke **Cloudinary** (signed upload)
- Wajib unggah KTM sebelum pasang iklan; badge "terverifikasi" setelah dicek admin
- Dashboard "Iklan Saya": ubah status (Aktif / Dipesan / Laku), edit, hapus
- Favorit (ikon hati)
- Chat pembeli ↔ penjual per barang (auto-refresh tiap 5 detik) + indikator pesan belum dibaca
- Profil: nama, kampus, nomor WhatsApp, foto profil
- Halaman Tips Pindah Kos & panduan COD aman

## Setup

### 1. Install

```bash
pnpm install
cp .env.example .env.local
```

### 2. Database (Vercel Postgres / Neon)

1. Vercel Dashboard → **Storage** → **Create Database** → pilih **Neon (Postgres)** → hubungkan ke project.
2. Salin `DATABASE_URL` ke `.env.local` (atau `vercel link` lalu `vercel env pull .env.local`).
3. Buat tabel & isi data contoh:

```bash
pnpm db:push     # buat/sinkronkan tabel dari src/db/schema.ts
pnpm db:seed     # opsional: 4 akun demo + 12 iklan contoh
```

Akun demo: `raka@demo.koscycle.id` / `koscycle123` (juga salsa@, dimas@, nadia@).

> Untuk development offline, `DATABASE_URL` juga boleh berisi Postgres lokal biasa (mis. `postgresql://postgres@localhost:5432/koscycle`). URL Neon/Vercel otomatis memakai driver HTTP serverless.

### 3. Better Auth

```bash
openssl rand -base64 32   # tempel ke BETTER_AUTH_SECRET
```

Set `BETTER_AUTH_URL` dan `NEXT_PUBLIC_APP_URL` ke URL aplikasi (lokal `http://localhost:3000`, produksi `https://domainmu.vercel.app`).

### 4. Cloudinary

Cloudinary Console → Dashboard → salin **Cloud name, API Key, API Secret** ke:
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
Tidak perlu membuat upload preset — upload memakai signature dari server.

### 5. Jalankan

```bash
pnpm dev
```

## Verifikasi KTM (admin)

Belum ada panel admin. Cek foto KTM lewat Drizzle Studio (`pnpm db:studio`), lalu ubah kolom `ktm_verified` user menjadi `true`. Atau dengan SQL:

```sql
update "user" set ktm_verified = true where email = 'mahasiswa@ui.ac.id';
```

## Deploy ke Vercel

1. Push repo ke GitHub → Import di Vercel.
2. Isi semua env dari `.env.example` di **Settings → Environment Variables** (`DATABASE_URL` otomatis terisi jika database dihubungkan dari tab Storage).
3. Jalankan `pnpm db:push` sekali dari lokal ke database produksi.

## Struktur

```
src/
  app/                 # routes (/, /jelajah, /barter, /hibah, /barang/[id], /pasang-iklan, /dashboard, /pesan, /profil, ...)
  components/          # ui/ (shadcn), layout/, home/, listing/, forms/, chat/
  db/                  # schema.ts (Drizzle), index.ts, seed.ts
  lib/
    actions/           # Server Actions (iklan, favorit, chat, profil, upload)
    queries.ts         # akses data (read)
    auth.ts            # konfigurasi Better Auth
    cloudinary.ts      # signing & hapus gambar
    constants.ts       # kategori, kampus, jenis iklan, kondisi
  proxy.ts             # proteksi route yang butuh login
```

Kategori dan daftar kampus diatur di `src/lib/constants.ts`.
