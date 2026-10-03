# 🏢 Repositori Portal Tautan Internal BPS Kabupaten Solok Selatan
### App B: Next.js 16 Client Portal & Security API Proxy Buffer

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright)
![Status](https://img.shields.io/badge/Production-Ready-emerald)

**App B (Next.js 16)** adalah aplikasi portal web modern berbasis *Single Access Gateway* bagi seluruh pegawai Badan Pusat Statistik (BPS) Kabupaten Solok Selatan. Aplikasi ini bertindak sebagai antarmuka klien sekaligus **Security API Proxy Buffer** yang menghubungkan pengguna secara aman dengan backend legacy **App A (PHP Native di VPS)**.

---

## ✨ Fitur Utama

- 🛡️ **Server-Side API Proxy Buffer:** Mengisolasikan kunci rahasia `BPS_API_KEY` dan menyuntikkannya secara eksplisit via header `X-API-KEY` di server Node.js. Kunci rahasia **0% bocor ke skrip browser**.
- 🔑 **Multi-Algorithm Hash Fallback:** Menghitung varian hash (`SHA-256`, `MD5`, `SHA-1`, plain text) secara server-side dan menjalankannya dalam skema pencocokan fallback berurutan. Menjamin **seluruh akun di tabel `admin` (role apapun)** dapat login tanpa mengubah database VPS.
- 🍪 **Keamanan Sesi Cookie `HTTP-Only`:** Mengamankan sesi login pengguna selama 30 hari menggunakan cookie `httpOnly`, `SameSite: Lax`, dan `Secure` yang terlindung dari serangan XSS.
- ⚡ **In-Memory Live Search & Filter:** Fitur pencarian instan dan filter 7 kategori bidang kerja + status aksesibilitas (Publik vs VPN) dengan perolehan data cepat tanpa beban API ekstra per ketikan.
- 🛡️ **Penanganan Crash & Resiliensi**:
  - **Double-Submit Protection:** Pengunci klik ganda instan (`isProcessingRef = useRef(false)`) untuk mencegah penekanan tombol berulang saat jaringan lambat.
  - **Malformed JSON Defense:** Pengisolasi respon `safeParseJsonResponse()` untuk menangani crash balasan HTML 500/502 dari VPS backend.
  - **Loading UX:** Pulse skeleton loading cards dan inline button spinners.
- 🧪 **Automated Testing Suite:** Pengujian unit proxy ultra-cepat (<3s) menggunakan **Vitest** dan pengujian visual alur pengguna menggunakan **Playwright (Headless Mode)**.

---

## 🏗️ Topologi Arsitektur Ringkas

```
[ User Browser ] ──(HTTPS + Cookie)──> [ App B: Next.js Proxy Buffer ] ──(HTTPS + X-API-KEY)──> [ App A: PHP VPS ] ──> [ MySQL DB ]
```

---

## 📂 Struktur Utama Direktori

```
landingpageintra/
├── .env.local                       # Konfigurasi rahasia server (URL VPS & BPS_API_KEY)
├── vitest.config.mts                # Konfigurasi pengujian unit Vitest (ESM Native)
├── playwright.config.ts             # Konfigurasi pengujian E2E Playwright
├── MODUL_PEMBELAJARAN.md            # Modul pembelajaran & detail fungsi setiap file
├── LAPORAN_TEKNIS_PROYEK.md         # Laporan rekayasa sistem formal & audit keamanan
├── MODUL_PEMBELAJARAN.html          # Versi interaktif HTML Modul Pembelajaran
├── LAPORAN_TEKNIS_PROYEK.html       # Versi interaktif HTML Laporan Teknis
└── src/
    ├── proxy.ts                     # Edge Middleware (Next.js 16 Server Route Guard)
    ├── app/
    │   ├── api/                     # Server Proxy Routes (/api/login, /api/layanan, /api/kategori)
    │   ├── login/page.tsx           # Form UI Login + Synchronous Double-Submit Guard
    │   └── page.tsx                 # Portal Landing Page & Live Search
    ├── components/                  # Komponen UI (LinkGrid, LinkCard, HeroSection, Navbar)
    ├── context/                     # AuthContext (State Otentikasi Global)
    └── lib/                         # safeParseJsonResponse, accessibilityMapper, serverApiConfig
```

---

## ⚙️ Konfigurasi Environment Variable (`.env.local`)

Buat file `.env.local` di direktori root dengan isi sebagai berikut:

```env
# URL Dasar Backend VPS (App A)
NEXT_PUBLIC_API_BASE_URL=https://administators.bps1310.cloud/api

# Rahasia Server API Key (Zero exposure ke browser)
BPS_API_KEY=BPS_SOLSEL_API_2026_GANTI_DENGAN_KEY_RAHASIA
```

---

## 🚀 Memulai Pengoperasian (Getting Started)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Membuka Mode Pengembangan (Development Server)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 3. Kompilasi Build Produksi (Production Build)
```bash
npm run build
npm run start
```

---

## 🧪 Skrip Pengujian Otomatis (QA Testing Suite)

### Pengujian Unit & Proxy Routes (Vitest)
```bash
npm run test:unit
```

### Pengujian Alur End-to-End (Playwright Headless)
```bash
npm run test:e2e
```

### Pengujian E2E dengan UI Mode
```bash
npm run test:e2e:ui
```

---

## 📚 Dokumentasi & Modul Pembelajaran Lengkap

Proyek ini dilengkapi dengan dokumentasi teknis dan modul pembelajaran yang dapat diakses langsung dari workspace:

- 📘 **Modul Pembelajaran Developer:** [`MODUL_PEMBELAJARAN.md`](MODUL_PEMBELAJARAN.md) | Versi Web: [`MODUL_PEMBELAJARAN.html`](MODUL_PEMBELAJARAN.html)
- 🏛️ **Laporan Rekayasa Sistem Formal:** [`LAPORAN_TEKNIS_PROYEK.md`](LAPORAN_TEKNIS_PROYEK.md) | Versi Web: [`LAPORAN_TEKNIS_PROYEK.html`](LAPORAN_TEKNIS_PROYEK.html)

---

© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi.
