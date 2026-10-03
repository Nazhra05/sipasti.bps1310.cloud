# 📑 LAPORAN AKHIR REKAYASA TEKNOLOGI PROYEK (FINAL PROJECT REPORT)
## Portal Tautan Internal BPS Kabupaten Solok Selatan (App B - Next.js 16)

---

### 📋 Ringkasan Eksekutif (Executive Summary)

Dokumen ini menyajikan laporan rekayasa perangkat lunak dan arsitektur teknis lengkap untuk **Portal Tautan Internal BPS Kabupaten Solok Selatan**. Proyek ini dirancang untuk menyatukan seluruh repositori aplikasi kedinasan, layanan publik, dan alat kerja internal ke dalam satu pintu akses (*Single Sign-On & Portal Access*) yang responsif, cepat, serta memenuhi standar keamanan siber modern.

Aplikasi ini mengadopsi arsitektur terdekoppel dua tingkat (*Two-Tier Decoupled Architecture*):
- **App A (Backend Legacy VPS)**: Aplikasi berbasis PHP dan MySQL yang berjalan di server remote VPS (berfungsi sebagai penyedia data dan database utama).
- **App B (Frontend Portal & Server-Side Proxy)**: Aplikasi Next.js 16 (App Router) berbasis TypeScript dan Tailwind CSS yang bertindak sebagai antarmuka pengguna serta *buffer proxy* sisi server.

---

## 🏗️ 1. Arsitektur Sistem & Alur Aliran Data

### 1.1 Diagram Komunikasi Dua Tingkat
```
[ Browser Pengguna ]
       │
       ▼ (HTTPS / Port 443)
[ Nginx Reverse Proxy (CloudPanel VPS) ]
       │
       ▼ (HTTP / Port 3000)
[ Next.js App B (Server-Side Proxy Route Handlers) ]
       │  ├─ Menginjeksikan X-API-KEY rahasia dari .env.local
       │  └─ Menetapkan Cookie HTTP-Only (bps_solsel_auth_verified)
       ▼ (HTTPS API Call)
[ App A Backend (PHP VPS Remote / Database MySQL) ]
```

### 1.2 Pola Komunikasi Berimbang (Decoupled API Proxy)
Client (browser pengguna) **tidak pernah berkomunikasi langsung** dengan domain backend App A. Seluruh permintaan dikirim ke rute proxy internal App B (`/api/login`, `/api/layanan`, `/api/kategori`). Hal ini memberikan 3 keuntungan utama:
1. **Penyembunyian Kredensial**: Kunci rahasia `X-API-KEY` disimpan secara eksklusif di variabel lingkungan server (`.env.local`) dan tidak pernah bocor ke bundel JavaScript browser.
2. **Eliminasi Masalah CORS**: Pengguna browser berkomunikasi dengan *same-origin* domain Next.js, menghilangkan isu *Cross-Origin Resource Sharing* (CORS).
3. **Penyaringan & Keamanan Respon**: Fungsi parser aman `safeParseJsonResponse` mencegah *crash* aplikasi apabila backend App A mengembalikan halaman error HTML 500/502.

---

## 🚀 2. Fitur Lengkap Aplikasi (App B Features)

### 2.1 Live Search & Filtering Tanpa Latensi (In-Memory Search)
- **Zero API Request per Keystroke**: Seluruh data aplikasi dimuat 1x saat inisialisasi halaman, kemudian pencarian dilakukan secara *in-memory* di browser pengguna.
- **Pencarian Multi-Bidang**: Memindai judul aplikasi, deskripsi, kata kunci, catatan teknis, hingga URL target secara instan.
- **Tab 7 Kategori & Counter Metrik**: Penyaringan interaktif berdasarkan kategori kerja dengan indikator jumlah aplikasi real-time.

### 2.2 Segmentasi Aksesibilitas (Publik vs. VPN Kedinasan)
- **Penyaringan Segmentasi Akses**: Pengguna dapat memfilter aplikasi berdasarkan kategori **Publik** (dapat dibuka langsung dari mana saja) atau **Internal / VPN Kedinasan** (memerlukan jaringan kantor/VPN BPS).
- **Visual Badge & Indikator Status**: Setiap kartu aplikasi dilengkapi badge warna kontras dan catatan teknis otomatis untuk membantu pegawai.

### 2.3 Manajemen Sesi & Otentikasi Terverifikasi
- **HTTP-Only Cookie Security**: Menetapkan cookie `bps_solsel_auth_verified` dengan atribut `HttpOnly: true`, `SameSite: Lax`, dan `maxAge: 30 hari`. Cookie ini kebal terhadap pencurian skrip jahat JavaScript (*Cross-Site Scripting / XSS defense*).
- **Multi-Hash Password Engine**: Mendukung pengujian variasi algoritma hashing password legacy (SHA-256, MD5, SHA-1, BCRYPT) untuk mendukung seluruh akun tabel `admin` dari backend database.
- **Synchronous Submit Lock**: Menggunakan kombinasi `isSubmitting` state dan `isProcessingRef` synchronous lock untuk mencegah *race condition* akibat klik ganda secara cepat pada form login.

### 2.4 Antarmuka Pengguna & Aksesibilitas (UI/UX)
- **Dark Mode & Light Mode**: Dukungan mode gelap dan terang otomatis dengan sistem penyimpanan preferensi lokal (`localStorage`).
- **Desain Responsif**: Tata letak grid yang menyesuaikan tampilan perangkat ponsel, tablet, hingga layar desktop.
- **Modul Panduan VPN**: Modal panduan interaktif langkah demi langkah penggunaan FortiClient VPN BPS.
- **Modal Kebijakan Privasi (GDPR Compliance)**: Penjelasan transparansi pengelolaan data dan cookie tanpa pelacak pihak ketiga.

---

## 🛡️ 3. Keamanan Siber & Audit Rekayasa (Security Audit Compliance)

Berdasarkan pengujian audit keamanan siber pihak ketiga (**ImmuniWeb® Website Security Audit Report**), aplikasi telah disempurnakan dengan konfigurasi keamanan berikut:

| Parameter Keamanan | Pengaturan Terimplementasi | Lokasi File / Konfigurasi | Keterangan & Tujuan |
| :--- | :--- | :--- | :--- |
| **Content-Security-Policy (CSP)** | `default-src 'self'; script-src 'self' ...; upgrade-insecure-requests;` | [`next.config.ts`](file:///d:/Development/landingpageintra/next.config.ts) | Mencegah injeksi kode jahat (XSS) & *unauthorized resource loading*. |
| **Strict-Transport-Security (HSTS)** | `max-age=31536000; includeSubDomains; preload` | [`next.config.ts`](file:///d:/Development/landingpageintra/next.config.ts) | Memaksa koneksi enkripsi HTTPS selama 1 tahun. |
| **X-Frame-Options** | `SAMEORIGIN` | [`next.config.ts`](file:///d:/Development/landingpageintra/next.config.ts) | Mencegah serangan *Clickjacking* dan menghilangkan duplikasi header Nginx. |
| **X-Content-Type-Options** | `nosniff` | [`next.config.ts`](file:///d:/Development/landingpageintra/next.config.ts) | Mencegah browser menebak *MIME type* file secara tidak aman. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=(), payment=()` | [`next.config.ts`](file:///d:/Development/landingpageintra/next.config.ts) | Membatasi akses ke API perangkat keras yang tidak diperlukan. |
| **Header Deprecated** | `X-XSS-Protection` Dihapus | [`src/proxy.ts`](file:///d:/Development/landingpageintra/src/proxy.ts) | Menghapus header usang sesuai rekomendasi OWASP & ImmuniWeb audit. |
| **Proteksi AI Bot & Scraper** | Aturan `robots.txt` Komprehensif | [`src/app/robots.ts`](file:///d:/Development/landingpageintra/src/app/robots.ts) & [`public/robots.txt`](file:///d:/Development/landingpageintra/public/robots.txt) | Memblokir bot pengikis AI (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Gemini). |
| **Kepatuhan GDPR** | Modal & Footer Kebijakan Privasi | [`PrivacyPolicyModal.tsx`](file:///d:/Development/landingpageintra/src/components/PrivacyPolicyModal.tsx) | Pengungkapan transparansi hak privasi dan penggunaan cookie internal. |

---

## 🧪 4. Jaminan Kualitas & Pengujian Otomatis (QA Testing)

Proyek ini dilengkapi dengan 2 suite pengujian otomatis lengkap yang telah teruji dengan tingkat kelulusan **100%**:

```
TOTAL SUITE PENGUJIANKU: 14 / 14 TEST SCENARIOS PASSED (100% SUCCESS)
```

### 4.1 Vitest Unit Testing Suite (5/5 PASSED)
- **`route.test.ts`**: Testing penanganan error 400 payload kosong, injeksi rahasia `X-API-KEY` pada HTTP 200, dan toleransi aman parsing HTML error 502.
- **`accessibilityMapper.test.ts`**: Testing fungsi mapper `enrichLayanan()` untuk deteksi kata kunci VPN dan klasifikasi akses publik vs. internal.
- **Laporan Visual**: [`VITEST_REPORT.html`](file:///d:/Development/landingpageintra/VITEST_REPORT.html)

### 4.2 Playwright End-to-End (E2E) Testing Suite (9/9 PASSED)
- **`login.spec.ts`**: Pengujian render elemen login, alur verifikasi login sukses, dan tampilan pesan error 401 saat kredensial salah.
- **`portal.spec.ts`**: Pengujian render identitas portal, pencarian *live search*, filter segmentasi Publik/VPN, buka-tutup modal VPN & Privasi, serta tombol beralih *Dark/Light mode*.
- **Laporan Visual**: [`PLAYWRIGHT_REPORT.html`](file:///d:/Development/landingpageintra/PLAYWRIGHT_REPORT.html)

---

## ⚙️ 5. Kebersihan Repository & Panduan Operasional (Operations Guide)

### 5.1 Keamanan Repository Git ([`.gitignore`](file:///d:/Development/landingpageintra/.gitignore))
Semua file rahasia dan file temporer hasil pengujian telah dimasukkan ke dalam `.gitignore` sehingga **aman 100% untuk di-push ke repositori publik GitHub**:
- `.env*.local` (File kredensial & API Key VPS)
- `.agents/` (Folder instruksi internal agen AI)
- `/test-results/`, `/playwright-report/`, `/coverage/`, `vitest-results.json` (Artifacts pengujian lokal)

### 5.2 Konfigurasi Nginx di VPS (Hostinger / CloudPanel)
File konfigurasi Nginx di VPS (`/etc/nginx/sites-enabled/sipasti.bps1310.cloud.conf`):
```nginx
server {
  listen 80;
  listen [::]:80;
  listen 443 quic;
  listen 443 ssl;
  listen [::]:443 quic;
  listen [::]:443 ssl;
  http2 on;
  http3 off;
  ssl_certificate_key /etc/nginx/ssl-certificates/sipasti.bps1310.cloud.key;
  ssl_certificate /etc/nginx/ssl-certificates/sipasti.bps1310.cloud.crt;
  server_name sipasti.bps1310.cloud;
  root /home/bps1310-sipasti/htdocs/sipasti.bps1310.cloud;

  # Menyembunyikan informasi versi Nginx
  server_tokens off;

  access_log /home/bps1310-sipasti/logs/nginx/access.log main;
  error_log /home/bps1310-sipasti/logs/nginx/error.log;

  if ($scheme != "https") {
    rewrite ^ https://$host$request_uri permanent;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### 5.3 Langkah Deployment & Pembaruan VPS
Untuk memperbarui aplikasi di VPS:
```bash
# 1. Tarik kode terbaru
git pull origin main

# 2. Kompilasi aplikasi produksi Next.js
npm run build

# 3. Restart layanan PM2
pm2 restart sipasti
```

---

## 📌 6. Kesimpulan & Penutup

Aplikasi **Portal Tautan Internal BPS Kabupaten Solok Selatan (App B)** telah berhasil dibangun, diamankan, dan diuji secara komprehensif. Dengan arsitektur terdekoppel, proteksi header keamanan tingkat tinggi, manajemen sesi HTTP-Only, jaminan pengujian 100% lulus, serta kebersihan repositori Git, portal ini siap dioperasikan dalam lingkungan produksi secara andal dan aman.
