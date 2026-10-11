# TODO & Checklist Pencapaian Proyek: App B (Next.js Portal & Proxy Buffer)

> **Konteks Sistem:**  
> Dokumen ini mencatat seluruh fitur, arsitektur, pengamanan, dan modul yang **telah dicapai** pada **App B** (Frontend Portal Satu Pintu & Server-Side Proxy Buffer berbasis Next.js 16).  
> App B bertindak sebagai gerbang antarmuka pengguna yang aman dan berkinerja tinggi, bertukar data dengan **App A** (Dashboard Admin & Backend REST API PHP pada remote VPS). Seluruh item di bawah difokuskan **khusus pada lingkup rekayasa App B**.

---

## 📊 Status Kesiapan Aplikasi
- **Status Rilis**: ✅ **Siap Produksi (Production Ready v1.0.0)**
- **Framework Inti**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling & Desain**: Tailwind CSS v4, Lucide React
- **Status Pengujian**: Unit Test (Vitest) **100% Lolos**, E2E Test (Playwright) **100% Lolos**

---

## 1. Arsitektur Proxy & Integrasi Data dengan App A (PHP)

Lapisan server proxy di App B mengisolasi komunikasi client dengan backend PHP legacy sehingga tidak ada celah keamanan di browser pengguna.

- [x] **Server-Side API Proxy Router (`/api/*`)**
  - [x] Implementasi endpoint proksi `GET /api/layanan` untuk menjembatani data tautan dari App A.
  - [x] Implementasi endpoint proksi `GET /api/kategori` untuk mengambil data taksonomi kategori dari App A.
  - [x] Implementasi endpoint proksi `POST /api/login` untuk meneruskan kredensial otentikasi ke App A.
  - [x] Implementasi endpoint proksi `POST /api/logout` untuk pembersihan sesi aman.
- [x] **Isolasi Kredensial Rahasia (*Zero Secret Exposure*)**
  - [x] Penyimpanan `BPS_API_KEY`, `SESSION_SECRET`, dan `API_BASE_URL` strictly di server environment (`.env.local`) tanpa prefix `NEXT_PUBLIC_` sehingga URL VPS dan kredensial tidak pernah masuk ke bundel JavaScript browser.
  - [x] Injeksi header `X-API-KEY` secara otomatis di sisi server Next.js tanpa terekspos ke bundle JavaScript browser.
- [x] **Pemberantasan Masalah CORS (*Same-Origin Compliance*)**
  - [x] Seluruh panggilan dari antarmuka pengguna diarahkan ke relative path internal (`/api/*`), menghilangkan kendala lintas origin ke server VPS PHP.
- [x] **Resiliensi Penguraian Data Backend (*Safe JSON Parser*)**
  - [x] Pembuatan utilitas `safeParseJsonResponse` untuk mengantisipasi jika backend PHP mengembalikan respon HTML (seperti layar error 500/502 Nginx/Apache), mencegah insiden *crash* `Unexpected token < in JSON`.

---

## 2. Antarmuka Pengguna (UI/UX) & Interaktivitas Portal

Desain responsif premium, modern, dan intuitif untuk navigasi puluhan tautan aplikasi kedinasan.

- [x] **Sistem Live Search In-Memory Kilat (*Zero API Spam*)**
  - [x] Data di-cache di memori browser saat pemuatan halaman pertama kali.
  - [x] Pencarian langsung per ketukan tombol (*instant keystroke filter*) terhadap nama layanan, deskripsi, kata kunci (*keywords*), nama kategori, tautan, dan catatan teknis tanpa membuat beban request ke server.
- [x] **Filter Segmentasi & Navigasi Kategori**
  - [x] Filter pill dinamis berdasarkan kategori layanan dengan penghitung jumlah data (*counter badges*).
  - [x] Filter khusus tipe aksesibilitas: **Semua**, **Akses Publik**, dan **Akses Internal (VPN)**.
  - [x] State reset otomatis saat pencarian atau kategori dikosongkan.
- [x] **Kartu Layanan Interaktif (`LinkCard`)**
  - [x] Penanda visual tipe akses (Badge Hijau untuk Publik, Badge Oranye/Kuning untuk Akses VPN Kedinasan).
  - [x] Tombol *Copy Link* cepat dengan umpan balik visual (*Toast notification*).
  - [x] Tombol *Kunjungi Tautan* dengan validasi URL aman (`toSafeExternalUrl`) guna memblokir protokol berbahaya (`javascript:`, `data:`).
  - [x] Indikator logo layanan otomatis dengan fallback inisial dinamis jika logo belum terpasang.
- [x] **Tema Gelap & Terang Bebas Kedip (*No Flash of Unstyled Theme*)**
  - [x] Penyimpanan preferensi tema pengguna di `localStorage`.
  - [x] Injeksi skrip inisialisasi tema di `<head>` layout untuk mencegah kedipan putih (*white flash*) saat halaman dimuat ulang.
- [x] **Komponen Pendukung & Edukasi Pengguna**
  - [x] **Modal Panduan VPN**: Penjelasan langkah demi langkah cara mengaktifkan VPN Kedinasan BPS bagi tautan berlabel internal.
  - [x] **Modal Kebijakan Privasi**: Dokumentasi keterbukaan penggunaan data pengguna dan penyimpanan cookie.
  - [x] **Hero Section Dinamis**: Menampilkan statistik total layanan terdaftar, layanan publik, dan layanan internal secara realtime.
  - [x] **Tombol Scroll-to-Top**: Tombol pintas kembali ke atas dengan animasi halus saat posisi scroll melampaui batas ambang.

---

## 3. Otentikasi, Manajemen Sesi & Kompatibilitas Legacy

Mendukung validasi akun admin dari sistem PHP lama dengan pengamanan standar industri modern.

- [x] **Pengamanan Sesi Berbasis Cryptographic Signed Session Token (`bps_solsel_session`)**
  - [x] Penerbitan cookie `bps_solsel_session` yang membawa token bertanda tangan kriptografis HMAC-SHA256 dengan identifier unik acak tak-tertebak (*unguessable* UUID `sessionId`).
  - [x] Eliminasi celah pemalsuan status (*Privilege Escalation via DevTools*): menggantikan string tetap `bps_solsel_auth_verified=true` dengan token yang wajib lolos verifikasi kriptografis server.
  - [x] Verifikasi integritas tanda tangan server-side di [`src/proxy.ts`](file:///d:/Development/landingpageintra/src/proxy.ts) dan [`src/app/api/auth/me/route.ts`](file:///d:/Development/landingpageintra/src/app/api/auth/me/route.ts) menggunakan *constant-time comparison* (`crypto.timingSafeEqual`) anti *timing-attacks*.
  - [x] Atribut cookie standar industri: `HttpOnly: true`, `SameSite: Lax`, `Path: /`, serta `Secure` pada environment produksi.
- [x] **Otentikasi Bersih & Pendelegasian Hashing ke Backend PHP (Bcrypt `password_hash`)**
  - [x] Penghapusan pra-hashing di sisi Next.js (mencegah kerentanan *pass-the-hash* di mana hash statis berubah fungsi menjadi kata sandi).
  - [x] Kredensial diteruskan secara langsung dan aman melalui kanal server-to-server TLS ke backend PHP App A (`/auth/loginPortal.php`).
  - [x] Verifikasi dan peningkatan keamanan kata sandi terpusat di PHP: pemanfaatan standar baku `password_verify()` serta peningkatan otomatis hash lama (MD5/SHA-256) ke `password_hash()` (Bcrypt) melalui `password_needs_rehash()`.
- [x] **Perlindungan Terhadap Submit Ganda (*Double-Submit Lock*)**
  - [x] Penggunaan `isProcessingRef` synchronous pada tombol login untuk mencegah duplikasi pengiriman formulir akibat klik beruntun cepat.
- [x] **Validasi Input Ketat & Sanitasi**
  - [x] Pengecekan tipe dan batas maksimal panjang karakter input (maks 255 karakter) untuk mencegah serangan payload berbahaya.
  - [x] Normalisasi pesan error login yang ramah pengguna tanpa membocorkan struktur internal server.

---

## 4. Penguatan Keamanan Siber (Security Hardening)

Konfigurasi keamanan menyeluruh dengan prinsip pertahanan berlapis (*Defense-in-Depth*).

- [x] **Prinsip Pertahanan Berlapis (Middleware Bukan Security Boundary Tunggal)**
  - [x] **Peran `proxy.ts` / Middleware**: Bertindak murni sebagai *Optimistic UX Redirector* (pengalihan halaman ramah pengguna) dan dekorator header keamanan (CSP nonce), bukan benteng otorisasi tunggal (menghindari kerentanan *middleware bypass*).
  - [x] **Verifikasi Otoritatif di Route Handler**: Pemeriksaan token sesi kriptografis dijalankan secara mandiri di lapisan Data Layer Route Handler via [`authenticateRouteHandler`](file:///d:/Development/landingpageintra/src/lib/session.ts) sebelum mengeksekusi logika backend.
  - [x] **Validasi Otoritas Mutlak di PHP (App A)**: Backend VPS memegang kendali data utama (*Ultimate Source of Truth*) dengan validasi `X-API-KEY`, kontrol hak akses berbasis peran (RBAC), dan parameterisasi query SQL.
- [x] **Content-Security-Policy (CSP) Level 3 & Cryptographic Nonce**
  - [x] Pembuatan cryptographic nonce acak via `crypto.randomUUID()` pada setiap request melalui [`src/proxy.ts`](file:///d:/Development/landingpageintra/src/proxy.ts).
  - [x] Penegakan restriksi script, font, image, connect, dan style origin.
  - [x] Proteksi dari serangan *Clickjacking* via directive `frame-ancestors 'self'` dan header `X-Frame-Options: SAMEORIGIN`.
- [x] **Header Keamanan Standar Industri (OWASP Standard)**
  - [x] `Strict-Transport-Security (HSTS)` aktif (`max-age=31536000; includeSubDomains`) — direktif `preload` dinonaktifkan untuk menjaga kompatibilitas layanan subdomain lain pada shared domain instansi.
  - [x] `X-Content-Type-Options: nosniff` untuk mencegah MIME-type sniffing.
  - [x] `Permissions-Policy` mematikan akses kamera, mikrofon, geolocation, dan modul pembayaran yang tidak relevan.
- [x] **Perlindungan Privasi dari AI Scraping Bot**
  - [x] Konfigurasi [`src/app/robots.ts`](file:///d:/Development/landingpageintra/src/app/robots.ts) dan `public/robots.txt` yang memblokir bot pengikis AI (GPTBot, ClaudeBot, PerplexityBot, Bytespider, CCBot, Google-Extended).
- [x] **Proteksi Open Redirect & Script Injection**
  - [x] Pengecekan URL tujuan eksternal via utilitas [`safeUrl.ts`](file:///d:/Development/landingpageintra/src/lib/safeUrl.ts) guna mencegah manipulasi alamat tautan.
- [x] **Eliminasi Celah "Hiding is not a Protection" pada Endpoint API (`/api/layanan`)**
  - [x] **Authoritative Server-Side Redaction**: Endpoint [`src/app/api/layanan/route.ts`](file:///d:/Development/landingpageintra/src/app/api/layanan/route.ts) memvalidasi token sesi bertanda tangan via `authenticateRouteHandler`. Bagi pengguna tak-terotentikasi (*unlogin*), seluruh `url` aplikasi internal diredaksi menjadi string kosong (`url: ""`), mencegah pembocoran tautan internal melalui DevTools Network/cURL.
  - [x] **Zero URL Leakage di Client**: Tidak ada tautan internal yang disimpan di `sessionStorage` maupun query params saat dialihkan ke `/login`. Hanya metadata aman (`id`, `name`) yang diteruskan.
  - [x] **Resolusi Aman Berbasis ID Pasca-Otentikasi**: Setelah login berhasil, aplikasi mengambil data segar dari endpoint `/api/layanan` terotentikasi untuk membuka tautan target secara dinamis dan aman.

---

## 5. Toleransi Kerusakan (Fault Tolerance) & Resiliensi Error

Menjamin App B tetap tampil informatif dan ramah pengguna meskipun backend App A mengalami gangguan sementara.

- [x] **Fallback Data Cadangan Lokal & Notifikasi Transparan (*Visible Offline Notice*)**
  - [x] Penyediaan data cache lokal (dengan persistensi `localStorage` dan snapshot bawaan) saat koneksi backend PHP terputus atau offline.
  - [x] **Transparansi Integritas Data**: Penerapan komponen [`OfflineNoticeBanner`](file:///d:/Development/landingpageintra/src/components/OfflineNoticeBanner.tsx) yang secara eksplisit memperingatkan pengguna bahwa data yang ditampilkan adalah salinan offline.
  - [x] **Pencatatan Timestamp Terakhir Diperbarui**: Menampilkan waktu pasti sinkronisasi terakhir (contoh: *"Terakhir Diperbarui: 08 Oktober 2026, pukul 12:30 WIB"*) guna mencegah kebingungan akibat tautan yang mungkin telah diperbarui, dipindahkan, atau dinonaktifkan di server utama.
  - [x] **Tombol Sinkronisasi Ulang**: Menyediakan tombol coba ulang interaktif (*Re-sync*) untuk memulihkan koneksi begitu server kembali online.
- [x] **React Error Boundary & Custom Error Page**
  - [x] Implementasi [`src/components/ErrorBoundary.tsx`](file:///d:/Development/landingpageintra/src/components/ErrorBoundary.tsx) untuk menangkap error pada pohon komponen React.
  - [x] Implementasi halaman penanganan error global [`src/app/error.tsx`](file:///d:/Development/landingpageintra/src/app/error.tsx) dengan tombol coba lagi (*Retry*).
- [x] **Penanganan Status HTTP Terstandarisasi**
  - [x] Normalisasi error 500, 502, dan timeout jaringan ke format respon JSON standar dengan pesan berbahasa Indonesia yang jelas.

---

## 6. Jaminan Kualitas & Pengujian Otomatis (QA Testing Suite)

Pengujian komprehensif dua lapis untuk menjamin keandalan fungsionalitas dan logika bisnis App B.

- [x] **Unit Testing (Vitest)**
  - [x] Pengujian modul `accessibilityMapper`: verifikasi logika enrichment status VPN dan hak akses publik/internal.
  - [x] Pengujian modul `safeUrl`: verifikasi penolakan skema berbahaya (`javascript:`, skrip relatif ilegal).
  - [x] Pengujian Route Handler `src/app/api/login/route.test.ts`: verifikasi sanitasi input, transmisi kredensial bersih tanpa pra-hashing, penanganan respon, dan penerbitan cookie sesi kriptografis.
- [x] **End-to-End Testing (Playwright)**
  - [x] Skenario portal utama: live search, filter kategori, badge VPN, dan penyalinan link.
  - [x] Skenario otentikasi: form submission, validasi error input kosong, dan logout.
  - [x] Skenario modal interaktif: pembukaan dan penutupan panduan VPN serta kebijakan privasi.
  - [x] Skenario tema: pergantian Dark Mode dan Light Mode.
- [x] **Laporan Hasil Uji Otomatis**
  - [x] Tersedia artefak laporan visual: [`VITEST_REPORT.html`](file:///d:/Development/landingpageintra/VITEST_REPORT.html) & [`PLAYWRIGHT_REPORT.html`](file:///d:/Development/landingpageintra/PLAYWRIGHT_REPORT.html).

---

## 7. Kesiapan Deployment & Konfigurasi Server (DevOps)

- [x] **Konfigurasi Reverse Proxy Nginx untuk VPS Produksi**
  - [x] Template konfigurasi Nginx untuk meneruskan traffic HTTPS/HTTP ke proses internal Node.js port 3000.
  - [x] Konfigurasi WebSocket/Upgrade header, pemfilteran IP asli (`X-Real-IP`, `X-Forwarded-For`), dan penonaktifan `server_tokens`.
- [x] **Skrip Build & Pipeline Standar**
  - [x] Perintah `npm run build` tervalidasi bersih tanpa error TypeScript maupun linting.
  - [x] Pemisahan environment development dan production yang aman.

---

## 8. Rencana Pengembangan Lanjutan (Backlog / Future Enhancements)

Daftar ide opsional untuk iterasi rilis App B di masa mendatang:

- [x] **Penyimpanan Bookmark & Favorit Pegawai (Terintegrasi Backend)**
  - Pegawai dapat menandai tautan aplikasi favorit yang tersimpan terpusat dan aman di repositori pegawai.
- [ ] **Pemberitahuan Status Server Backend Terintegrasi (Healthcheck Ping)**
  - Menampilkan indikator dot hijau/merah kecil jika server App A sedang maintenance.
- [ ] **Pencatatan Analytics Akses Lokal (Privacy-Friendly Counter)**
  - Mengukur aplikasi kedinasan mana yang paling sering diklik pegawai untuk keperluan evaluasi internal tanpa melacak data pribadi.

---

## 9. Integrasi Repositori Pegawai & Portal Satu Pintu Digital Terpadu

Integrasi langsung dengan App A (Dashboard Admin) sebagai headless backend REST API, menghadirkan ruang kerja mandiri pegawai tanpa friksi perpindahan aplikasi.

- [x] **Kontrak Tipe Data Repositori (`src/types/userRepo.ts`)**
  - [x] Definisi struktur TypeScript untuk 7 entitas: Link Cepat (`cepat`), Bookmark (`bookmark`), Repositori Berkas (`file`), Catatan Dinas (`catatan`), Tugas/Kerjaan (`tugas`), Kontak Internal (`kontak`), dan Layanan Favorit (`favorite`).
  - [x] Definisi struktur response API seragam (`UserRepoResponse<T>`, `UserRepositoryData`).
- [x] **Secure Server-Side API Proxy Router (`src/app/api/user-repo/route.ts`)**
  - [x] Handler `GET` dan `POST` meneruskan request ke backend PHP dengan otentikasi lapis dua (`X-API-KEY` server-to-server + `X-User-Id` dari cookie sesi terenkripsi).
  - [x] Proteksi dari manipulasi identitas: `userId` diekstrak langsung dari token sesi bertanda tangan kriptografis di sisi server Next.js.
  - [x] Isolasi total rahasia `BPS_API_KEY` dari peramban pengguna.
- [x] **Klien API Pembantu (`src/lib/userRepoApi.ts`)**
  - [x] Fungsi pembantu untuk `fetchUserRepository`, penambahan entitas (`addUserRepoItem`), penghapusan entitas (`deleteUserRepoItem`), dan toggle status favorit layanan (`toggleFavoriteService`).
- [x] **Komponen Ruang Kerja Mandiri (`src/components/PersonalRepository.tsx`)**
  - [x] 7 sub-tab navigasi untuk seluruh kategori ruang kerja mandiri pegawai BPS.
  - [x] Modal interaktif tambah item per kategori dengan validasi formulir dan loading state.
  - [x] Aksi cepat salin tautan dengan Toast notification dan tombol hapus konfirmasi.
  - [x] Kartu ringkasan statistik total berkas dan item tersimpan.
- [x] **Fitur Layanan Favorit Interaktif (`LinkCard.tsx` & `LinkGrid.tsx`)**
  - [x] Ikon bintang favorit interaktif di setiap kartu layanan portal.
  - [x] Integrasi status favorit langsung ke repositori pegawai di backend PHP.
  - [x] Pengalihan otomatis ke halaman login jika pengguna belum terotentikasi saat mengklik favorit.
- [x] **Navigasi & Akses Peran Terpadu (`Navbar.tsx` & `page.tsx`)**
  - [x] Badge peran pengguna dinamis (ADMIN / PEGAWAI) di profil dropdown.
  - [x] Tombol langsung menuju "Panel Admin BPS" di dropdown navbar khusus untuk akun ber-role `ADMIN`.
  - [x] Switcher tampilan utama di halaman depan: beralih antara "Katalog Layanan BPS" dan "Repositori & Favorit Saya".
  - [x] Kartu edukasi dan ajakan login yang ramah saat membuka repositori dalam status tamu.
- [x] **Jaminan Kualitas Unit Test Proxy (`src/app/api/user-repo/route.test.ts`)**
  - [x] Pengujian penolakan request tanpa sesi login valid (401 Unauthorized).
  - [x] Pengujian forwarding request GET dan query action dengan header `X-API-KEY` dan `X-User-Id`.
  - [x] Pengujian forwarding request POST payload data ke backend PHP.

---

## 10. Halaman & Alur Registrasi Mandiri Pegawai (Employee Self-Registration)

Pendaftaran mandiri akun pegawai BPS Solok Selatan kini dilakukan langsung dari landing page (Next.js), terhubung secara aman dengan backend App A untuk verifikasi dan persetujuan administrator.

- [x] **Halaman Antarmuka Registrasi Modern (`src/app/register/page.tsx`)**
  - [x] Desain terpadu yang selaras dengan tema portal BPS (Navy `#005AA9`, Dark mode `#0b1120`, Emerald `#6DBE45`).
  - [x] Bidang formulir lengkap: Nama Depan, Nama Belakang, Username Pegawai, Email Kedinasan, Kata Sandi, Konfirmasi Sandi, serta Persetujuan Syarat & Ketentuan.
  - [x] Tombol toggle visibilitas kata sandi (Eye/EyeOff) untuk kedua kolom sandi.
  - [x] Perlindungan submit ganda (*Double-Submit Lock*) dengan animasi loading spinner.
  - [x] Tampilan konfirmasi pendaftaran berhasil dengan penjelasan status *Pending* demi keamanan informasi kedinasan sebelum disetujui Administrator.
  - [x] Tautan navigasi bolak-balik yang mulus antara halaman `/login` dan `/register`.
- [x] **Server-Side API Proxy Router (`src/app/api/register/route.ts`)**
  - [x] Validasi dan sanitasi input ketat (panjang karakter, format email resmi, pencocokan kata sandi).
  - [x] Injeksi header aman `X-API-KEY` server-to-server ke backend App A (`/auth/registerPortal.php`) tanpa mengekspos kredensial ke bundel klien.
  - [x] Penanganan respons terstandarisasi untuk galat validasi (400), konflik duplikasi akun (409), serta keberhasilan registrasi (201).
- [x] **Klien API Pembantu (`src/lib/api.ts`)**
  - [x] Penambahan fungsi `registerApi` dan kontrak tipe `RegisterPayload` serta `RegisterApiResponse`.
- [x] **Penguatan Perlindungan Robot (`src/app/robots.ts`)**
  - [x] Menambahkan `/register` pada direktif `disallow` untuk memblokir perayap bot pencari dan AI scraper.
- [x] **Jaminan Kualitas Pengujian Otomatis (`src/app/api/register/route.test.ts`)**
  - [x] Pengujian penolakan input kosong/tidak lengkap (HTTP 400).
  - [x] Pengujian penolakan ketidakcocokan konfirmasi kata sandi (HTTP 400).
  - [x] Pengujian keberhasilan penerusan data ke backend dengan injeksi `X-API-KEY` (HTTP 201).
  - [x] Pengujian penanganan respons server yang tidak valid (HTTP 502).

