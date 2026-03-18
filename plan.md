# 🗺️ App Development Plan — Tour Package Platform

## Overview

Platform pemesanan paket tour berbasis web dengan stack modern: **PostgreSQL** (database), **local file storage** (foto), **Next.js** (frontend), **Shadcn UI** + **Framer Motion** (UI/UX), dan **Docker** (deployment).

---

## Phase 1 — Persiapan Database (PostgreSQL)

### Schema Design

**Tabel `destinations`**
```sql
CREATE TABLE destinations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  category    text,
  description text,
  created_at  timestamptz DEFAULT now()
);
```

**Tabel `packages`**
```sql
CREATE TABLE packages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES destinations(id),
  title          text NOT NULL,
  slug           text UNIQUE NOT NULL,
  price          numeric NOT NULL,
  duration_days  int,
  description    text,
  cover_image    text,   -- path lokal, misal /uploads/packages/nama-file.jpg
  is_featured    boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);
```

**Tabel `bookings`**
```sql
CREATE TABLE bookings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid REFERENCES packages(id),
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text NOT NULL,
  travel_date  date NOT NULL,
  pax          int DEFAULT 1,
  notes        text,
  status       text DEFAULT 'pending',  -- pending | confirmed | cancelled
  created_at   timestamptz DEFAULT now()
);
```

### Koneksi Database

Gunakan **`pg`** (node-postgres) atau **Drizzle ORM** untuk query dari Next.js:

```ts
// lib/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // DATABASE_URL=postgresql://user:password@postgres:5432/tourdb
});
```

### Storage Foto

- Foto disimpan di **volume Docker** yang di-mount ke `/app/public/uploads/`.
- Next.js melayani gambar statis via folder `public/` sehingga bisa diakses langsung.
- Struktur folder:
  ```
  public/
  └── uploads/
      ├── destinations/
      └── packages/
  ```

---

## Phase 2 — Pengembangan Frontend (Next.js)

### Struktur Proyek

```
src/
├── app/
│   ├── page.tsx                  # Landing page (Home)
│   ├── packages/
│   │   ├── page.tsx              # Daftar semua paket
│   │   └── [slug]/page.tsx       # Detail paket + form booking
│   └── layout.tsx
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedPackages.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   ├── ui/                       # Shadcn UI components
│   └── BookingForm.tsx
├── lib/
│   ├── db.ts                     # PostgreSQL pool
│   ├── queries/
│   │   ├── packages.ts
│   │   └── destinations.ts
│   └── actions/
│       └── booking.ts            # Server Actions
└── types/
    └── index.ts
```

### Struktur UI — Landing Page

| Section | Konten |
|---|---|
| **Hero** | Headline, sub-headline, search bar destinasi |
| **Featured Packages** | Grid kartu paket unggulan (gambar, judul, harga, durasi) |
| **Why Us** | Icon + teks keunggulan layanan |
| **Testimonials** | Carousel ulasan pelanggan |
| **Footer** | Kontak, link navigasi, sosial media |

### Library & Tools

- **Shadcn UI** — komponen siap pakai (Card, Button, Input, Select, Badge)
- **Framer Motion** — animasi fade-in scroll, hover card, transisi halaman
- **Next.js Server Components** — fetching data paket langsung di server untuk SEO optimal
- **Tailwind CSS** — utility-first styling

---

## Phase 3 — Fitur Utama & Interaksi

### Form Booking (Server Actions)

```ts
// lib/actions/booking.ts
"use server";

import { pool } from "@/lib/db";

export async function createBooking(formData: FormData) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO bookings (package_id, name, email, phone, travel_date, pax, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        formData.get("package_id"),
        formData.get("name"),
        formData.get("email"),
        formData.get("phone"),
        formData.get("travel_date"),
        Number(formData.get("pax")),
        formData.get("notes"),
      ]
    );
  } finally {
    client.release();
  }
}
```

- Validasi input dengan **Zod** sebelum eksekusi query.
- Tampilkan toast notifikasi sukses/gagal menggunakan Shadcn `<Toast />`.

### Filter Destinasi

- Filter berdasarkan **kategori** (pantai, gunung, budaya, dll.) dan **range harga**.
- Implementasi via URL search params (`?category=pantai&max_price=2000000`) agar shareable dan SEO-friendly.
- State dikelola dengan `useSearchParams` + `useRouter` (Client Component ringan).

### WhatsApp CTA Button

```tsx
// Floating WA button — fixed bottom-right
const WA_NUMBER = "628xxxxxxxxxx";
const message  = encodeURIComponent("Halo, saya ingin konsultasi paket tour...");

<a
  href={`https://wa.me/${WA_NUMBER}?text=${message}`}
  target="_blank"
  className="fixed bottom-6 right-6 z-50 ..."
>
  <WhatsAppIcon />
</a>
```

---

## Phase 4 — Optimalisasi & Launch (Docker)

### SEO — Metadata Dinamis

```ts
// app/packages/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const pkg = await getPackageBySlug(params.slug);
  return {
    title:       `${pkg.title} | Tour Platform`,
    description: pkg.description.slice(0, 160),
    openGraph: {
      images: [`/uploads/packages/${pkg.cover_image}`],
    },
  };
}
```

### Image Optimization

- Gunakan komponen `<Image />` Next.js dengan `sizes` responsif dan `priority` pada gambar above-the-fold.
- Karena gambar disajikan dari folder `public/` lokal, tidak perlu konfigurasi `remotePatterns`.

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // wajib untuk Docker build efisien
};
module.exports = nextConfig;
```

### Dockerfile

```dockerfile
# Stage 1 — Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: touruser
      POSTGRES_PASSWORD: tourpassword
      POSTGRES_DB: tourdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # auto-run schema
    ports:
      - "5432:5432"

  app:
    build: .
    restart: always
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://touruser:tourpassword@postgres:5432/tourdb
      NODE_ENV: production
    volumes:
      - uploads_data:/app/public/uploads  # persistent photo storage
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  uploads_data:
```

### Deployment Steps

1. Pastikan server VPS/lokal sudah terinstall **Docker** dan **Docker Compose**.
2. Clone repo ke server:
   ```bash
   git clone https://github.com/username/tour-platform.git
   cd tour-platform
   ```
3. Jalankan semua service:
   ```bash
   docker compose up -d --build
   ```
4. Cek status container:
   ```bash
   docker compose ps
   docker compose logs -f app
   ```
5. (Opsional) Pasang **Nginx** sebagai reverse proxy + SSL via Certbot di depan port 3000.

---

## Checklist Progress

### Phase 1 — Database
- [ ] Siapkan file `db/init.sql` berisi schema lengkap
- [ ] Konfigurasi `DATABASE_URL` di `.env`
- [ ] Setup koneksi pool PostgreSQL di `lib/db.ts`
- [ ] Seed data awal (destinasi & paket contoh)

### Phase 2 — Frontend
- [ ] Init project Next.js + Tailwind + Shadcn UI
- [ ] Setup DB client (`lib/db.ts` + queries)
- [ ] Buat layout utama + Navbar + Footer
- [ ] Implementasi HeroSection
- [ ] Implementasi FeaturedPackages (Server Component)
- [ ] Implementasi WhyUs & Testimonials
- [ ] Halaman daftar paket (`/packages`)
- [ ] Halaman detail paket (`/packages/[slug]`)

### Phase 3 — Fitur
- [ ] BookingForm + Server Action + validasi Zod
- [ ] Filter destinasi (kategori & harga)
- [ ] WhatsApp floating button
- [ ] Animasi Framer Motion (scroll reveal, hover)

### Phase 4 — Launch
- [ ] Buat `Dockerfile` + set `output: "standalone"` di next.config.js
- [ ] Buat `docker-compose.yml` (service app + postgres)
- [ ] Test `docker compose up` di lokal
- [ ] Upload ke server & jalankan production build
- [ ] Setup Nginx reverse proxy + SSL (opsional)
- [ ] Test form booking end-to-end
- [ ] Go live 🚀

---

## Tech Stack Summary

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Database | PostgreSQL 16 |
| ORM / Query | node-postgres (`pg`) / Drizzle ORM |
| Storage Foto | Docker Volume (lokal) |
| UI Components | Shadcn UI + Tailwind CSS |
| Animasi | Framer Motion |
| Validasi | Zod |
| Deployment | Docker + Docker Compose |
| Reverse Proxy | Nginx + Certbot (opsional) |
| Notifikasi | WhatsApp API (wa.me) |
