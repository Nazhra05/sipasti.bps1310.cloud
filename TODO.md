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

Daftar ide opsional untuk iterasi rilis App B di masa menda- [x] **Penyimpanan Bookmark & Favorit Pegawai (Terintegrasi Backend)**
  - Pegawai dapat menandai tautan aplikasi favorit yang tersimpan terpusat dan aman di repositori pegawai.
- [x] **Pemberitahuan Status Server Backend Terintegrasi (Healthcheck Ping)**
  - Menampilkan indikator dot hijau/merah kecil jika server App A sedang maintenance.
- [x] **Pencatatan Analytics Akses Lokal (Privacy-Friendly Counter)**
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

---

## 11. Rencana Peningkatan dan Pengerasan Sistem (Berdasarkan Audit Dokumentasi Root)

Bagian ini memuat daftar perbaikan, penyempurnaan UI/UX, dan pengerasan arsitektur untuk **App B** hasil evaluasi 6 dokumen arsitektur di root (`API_and_Interface_Design.md`, `Business_Logic.md`, `Code_Quality_and_Architecture.md`, `Project_Context.md`, `Security.md`, dan `UI_UX.md`). Seluruh butir diurutkan berdasarkan tingkat kemandirian eksekusi (mulai dari peningkatan lokal yang aman tanpa dependensi eksternal, hingga penyelarasan kontrak terkoordinasi).

### Prioritas 1: Perbaikan Mandiri & Non-Breaking (Peningkatan UI/UX & Pengerasan Route Handler)
*Dapat dikerjakan langsung di sisi Next.js tanpa dependensi backend PHP dan tanpa risiko gangguan ke pengguna.*

- [x] **Penerapan Skeleton Loading Shimmer pada Ruang Kerja Mandiri (`PersonalRepository.tsx`)**:
  - Mengganti animasi spinner pemuatan sederhana dengan kartu placeholder berefek kilau (*shimmer*) bergradasi halus pada sub-tab repositori pegawai, sehingga transisi visual saat data dimuat terasa lebih elegan dan modern.
- [x] **Penyempurnaan Visual Status Data Kosong (*Empty State Illustration*)**:
  - Mengganti teks polos "Data tidak ditemukan" pada hasil pencarian katalog layanan dan repositori pribadi dengan komponen grafis ilustrasi SVG ramah pengguna, dilengkapi tombol pintas interaktif "Reset Filter / Tampilkan Semua Layanan".
- [x] **In-Memory Rate Limiting pada Route Handler Autentikasi (`/api/login` & `/api/register`)**:
  - Menerapkan pembatasan frekuensi pengiriman request berbasis alamat IP klien (maksimal 5 percobaan gagal per menit) langsung di lapisan Route Handler Next.js guna melindungi gerbang portal dari upaya brute-force dan spam akun.
- [x] **Pemberian Indikator Salin Tautan (*Copy URL*) Berhasil yang Lebih Responsif**:
  - Menambahkan mikro-animasi centang hijau seketika pada tombol salin di samping notifikasi Toast untuk memberikan penegasan visual instan kepada pegawai saat menyalin alamat tautan.

### Prioritas 2: Resiliensi Interaksi Pengguna & Pemantauan Sistem (Client-Side Enhancements)
*Peningkatan toleransi kesalahan dan fitur bantu pengguna di portal.*

- [x] **Indikator Kesehatan Layanan Backend (*Backend Healthcheck Ping*)**:
  - Menerapkan pemantauan status konektivitas ke backend App A secara periodik (indikator status dot hijau/oranye yang halus di footer atau navbar) guna memberi transparansi kondisi jaringan dinas kepada pengunjung.
- [x] **Tampilan Panduan & Penanganan Masa Berlaku Verifikasi Akun**:
  - Menambahkan modal dialog edukatif dan formulir pengajuan kirim ulang token verifikasi pada status pending/unverified di dialog login jika pegawai belum menerima atau token 24 jam telah kedaluwarsa.
- [x] **Pencatatan Analytics Akses Aplikasi Mandiri (*Privacy-Friendly Local Counter*)**:
  - Mengimplementasikan penghitung frekuensi klik tautan kedinasan yang tersimpan lokal di browser atau diagregasikan tanpa merekam identitas pribadi untuk membantu evaluasi aplikasi yang paling sering dibutuhkan pegawai.

### Prioritas 3: Harmonisasi Kontrak Terkoordinasi & Sinkronisasi Sesi dengan App A
*Penyelarasan konsumsi data saat App A merilis kontrak terpadu.*

- [x] **Adaptasi Safe Parser untuk Skema Envelope JSON Terpadu**:
  - Memperbarui antarmuka TypeScript dan pembungkus pemanggilan API di `src/lib/api.ts` agar siap mengonsumsi bentuk envelope standar `{ success: true, message: "...", data: [...], meta: {...} }` dari App A secara mulus.
- [x] **Dukungan Paginasi / Infinite Scrolling pada Katalog Layanan Portal**:
  - Menyiapkan komponen grid katalog layanan untuk mendukung konsumsi data bertahap berbasis paginasi atau lazy load jika jumlah layanan statistik bertumbuh melampaui batas efisiensi in-memory browser.
- [x] **Integrasi Validasi Status Akun Real-Time pada Route `/api/auth/me`**:
  - Menghubungkan pengecekan berkala ke endpoint validasi status akun di App A agar pegawai yang akunnya dinonaktifkan atau dihapus oleh administrator langsung dikeluarkan dari portal tanpa menunggu cookie sesi kedaluwarsa.

---

## 12. Rekayasa Desain Antarmuka: Redesign Navbar & Hero Berbasis Google Antigravity (REA Inspection)

Menerapkan bahasa desain modern, *frosted glassmorphism*, *smart scroll reactive behavior*, serta restrukturisasi tata letak komponen navbar dan hero section terinspirasi dari hasil *reverse engineering* (REA) arsitektur **Google Antigravity** (`https://antigravity.google`).

### A. Redesign Navbar (Header Terpadu)
- [x] **Struktur & Efek Glassmorphism Modern**:
  - [x] Transformasi latar belakang dari warna biru pekat legacy (`bg-[#005AA9]`) ke *ultra-sleek frosted glassmorphism* (`backdrop-blur-md bg-white/80 dark:bg-[#0c1424]/80`).
  - [x] Implementasi *smart scroll behavior* (`data-scroll-reactive="true"`): navbar otomatis bersembunyi halus saat pengguna scroll ke bawah (`-translate-y-full`) dan muncul kembali seketika saat scroll naik (`translate-y-0`) dengan bayangan elevasi adaptif.
- [x] **Restrukturisasi Sisi Kiri Navbar**:
  - [x] **Logo**: Branding resmi BPS Kabupaten Solok Selatan dengan transisi interaktif.
  - [x] **Home**: Tautan beranda dengan deteksi rute aktif dan smooth scroll ke hero.
  - [x] **Kategori (Dropdown 7 Kategori)**: Tombol pemicu dengan chevron SVG interaktif dan popover menu kaca yang memuat ke-7 kategori layanan statistik (Distribusi, Produksi, Neraca, Sosial, TI, Umum, Diseminasi) untuk pemfilteran instan (hover-triggered).
  - [x] **Repositori Pribadi**: Tombol pintas menuju ruang kerja mandiri, favorit, dan koleksi tautan pegawai.
  - [x] **Katalog Layanan**: Tombol pintas menuju direktori katalog lengkap (`/katalog`).
  - [x] **Panduan**: Akses cepat menuju dialog panduan VPN dan tata cara akses jaringan kedinasan.
- [x] **Restrukturisasi Sisi Kanan Navbar**:
  - [x] **Mode (Dark/Light Toggle)**: Pengalih tema rotasi halus dengan ikon Sun/Moon.
  - [x] **Kontak**: Popover bantuan cepat (WhatsApp Pelayanan, Email resmi BPS Solok Selatan, dan Website resmi) berbasis hover.
  - [x] **Akun**: Indikator status login, profil pengguna, dan menu keluar.

### B. Redesign Hero Section
- [x] **Penyelarasan Identitas & Headline**:
  - [x] Memperbarui identitas Logo RANCAK tipografi bergradasi tematik Biru (`#005AA9`), Hijau (`#6DBE45`), dan Orange (`#F37021`).
  - [x] Menetapkan judul utama bersih dan tegas: `"Temukan Informasi Relevan BPS Solok Selatan dengan RANCAK"`.
  - [x] Subheadline deskriptif dengan tipografi modern dan typographic reveal via GSAP SplitText.
- [x] **Search Bar Utama (Pengganti CTA Download Google Antigravity)**:
  - [x] Mengganti model CTA tombol download tunggal menjadi **Search Bar Mengambang Berukuran Besar (Prominent Hero Search Box)** berbentuk pill (`rounded-full`) dengan efek bayangan mendalam, ikon pencarian aksen sky, dan input yang nyaman.
  - [x] Tombol pembersih instan (`X`) dan tag pencarian terpopuler (*Popular Search Tags*: Sensus & Survei, Simpeg, PDRB Neraca, Pelayanan PST, Koneksi VPN) yang mengarahkan langsung ke `/katalog` dengan query pencarian terkait.
- [x] **Visual Ambient Background**:
  - [x] Menambahkan gradien latar belakang bertingkat dan aksen *radial ambient glow* halus untuk menghadirkan atmosfer ruang modern berteknologi tinggi (*liftoff experience*).

### C. Pemisahan Repositori & Favorit ke Halaman Mandiri (`/repositori`)
- [x] **Dedicated Page Architecture**: Memindahkan Ruang Kerja Mandiri & Repositori dari modal/tab embedded di homepage ke halaman khusus [`src/app/repositori/page.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/app/repositori/page.tsx) dengan redirect dari `/repository`.
- [x] **Unified Collapsible Sidebar (`RepositorySidebar.tsx`)**: Menyesuaikan arsitektur sidebar menyerupai Dashboard Admin BPS dengan toggle collapsible (lebar 256px saat terbuka, 80px saat tertutup), badge count real-time, dan styling khas `landingpageintra`.
- [x] **Dukungan Kategori Standar**: Layanan Favorit, Link Website, Data & Dokumen, Link Drive, Aplikasi Mobile, Galeri Foto, dan Referensi.
- [x] **Tombol Tambah Jenis Repositori & Palet 28 Ikon**: Modal interaktif [`AddRepoCategoryModal.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/components/AddRepoCategoryModal.tsx) dengan pilihan 28 ikon Lucide yang diselaraskan dengan kebutuhan kedinasan & statistik.
- [x] **Integrasi Multi-Item & Pencarian Instan**: Modal penambahan item [`AddRepoItemModal.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/components/AddRepoItemModal.tsx), kartu item terpadu [`RepoCardItem.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/components/RepoCardItem.tsx), filter pencarian real-time, dan feedback salin tautan instan.
- [x] **Peniadaan Navbar di Halaman Repositori & Penempatan Akun di Sidebar**:
  - [x] Tiadakan `Navbar` di [`src/app/repositori/page.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/app/repositori/page.tsx), layout full-height bersih dengan sidebar sticky dan top bar minimalis (dilengkapi pengalih tema Dark/Light mode).
  - [x] Tempatkan tombol Akun pengguna tepat di bawah tombol *Tambah Jenis Repositori* di [`RepositorySidebar.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/components/RepositorySidebar.tsx) yang memanggil modal detail akun (`AccountDetailModal`).
  - [x] Kontekstualisasi [`AccountDetailModal.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/components/AccountDetailModal.tsx) dengan prop `isInsideRepository={true}`: tombol "Repositori Pribadi" otomatis beralih menjadi tombol "Kembali ke Portal" dengan ikon panah kiri hijau/emerald dan redirect langsung ke `/`.

### D. Section 3D Stacked Carousel 7 Kategori
- [x] **Heading**: `"Memudahkan pencarian link per kategori"`.
- [x] **Arsitektur 7 Kartu Bertumpuk (*Tightened 3D Motion*)**:
  - Mengimplementasikan pustaka `motion/react` dengan kalkulasi fanning yang diperketat (*tightened spacing*) agar 7 kategori statistik fanning secara presisi tanpa tumpang tindih berlebih.
  - Interaksi drag & swipe responsif (spring physics: `stiffness: 220`, `damping: 28`).
  - Dilengkapi tombol panah kiri/kanan dan 7 indikator pil navigasi langsung.
- [x] **Tata Letak Konten Kartu**:
  - Kiri atas: Nama Kategori, ikon tematik, dan badge nomor pilar.
  - Deskripsi: Penjelasan ringkas lingkup bidang statistik.
  - Cuplikan Layanan: 2-3 peek links riil dari database (lengkap dengan badge akses Publik/Internal & ikon eksternal).
  - Kanan bawah: Tombol *"Lihat semua"* yang otomatis mengarahkan ke `/katalog?kategori={id}`.

### E. Section Why RANCAK & Bouncer Icons
- [x] **Antigravity Bouncer Icons**: 16 ikon murni (7 kategori statistik, 8 koleksi repositori, 1 search spark) dengan floating physics dan horizontal parallax drift tanpa border/tombol.
- [x] **Why RANCAK Section**: 3 kartu referensi terpadu (Find What You Need, Access BPS Resources, Keep Your References) dengan navigasi langsung ke Hero dan Katalog.
- [x] **Penyatuan Warna Latar & Penghapusan Border Antar Seksi**: Unifikasi token latar belakang (`bg-white` & `dark:bg-[#0c1424]`) di seluruh halaman dan navbar guna menghadirkan estetika satu kesatuan yang mulus dan hemat beban GPU.

---

## 13. Arsitektur Halaman Khusus Katalog Layanan (`/katalog`) & Navigasi Terpadu

Pemisahan modul katalog layanan ke rute mandiri guna merampingkan beban DOM beranda, meningkatkan performa Core Web Vitals, serta penyempurnaan hierarki navigasi.

- [x] **Dedicated Page Katalog (`src/app/katalog/page.tsx`)**:
  - [x] Pemindahan modul pencarian, filter akses (Semua/Publik/Internal), tombol *Tambah Layanan*, tab 7 kategori, counter status, dan grid kartu layanan (`LinkGrid`) ke rute dedicated `/katalog`.
  - [x] Mempertahankan konsistensi visual penuh dengan `Navbar` dan `Footer` pada rute katalog.
  - [x] Dukungan sinkronisasi parameter URL (*deep-linking* query `?kategori={id}` dan `?search={query}`) yang dibungkus `<Suspense>`.
- [x] **Heading & Subheading BPS**:
  - [x] Penambahan judul utama: **"Semua Layanan, Satu Direktori"** dengan sentuhan gradien identitas BPS (`#005AA9` ke `#6DBE45` ke `#F37021`).
  - [x] Penambahan subjudul: `"Temukan berbagai layanan dan referensi digital BPS yang terorganisasi dalam satu tempat."`
- [x] **Typographic Reveal Terfokus (GSAP SplitText)**:
  - [x] Penerapan animasi `SplitText` yang dibatasi khusus pada subheading per seksi (tidak pada heading atau teks panjang), menghemat pembuatan node DOM berlebih dan menjaga kestabilan memori.
- [x] **Menu Home & Indikator Rute Aktif pada Navbar**:
  - [x] Penambahan tautan **Home** pada Navbar desktop dan mobile drawer lengkap dengan ikon `Home`.
  - [x] Deteksi rute aktif otomatis via `usePathname()` untuk tombol Home dan Katalog Layanan.
  - [x] Interaksi cerdas: mengklik Home saat di beranda akan melakukan *smooth scroll* ke atas, sedangkan saat di halaman lain akan mengarahkan kembali ke `/`.
  - [x] Interaksi dropdown Kategori berbasis hover dengan timer debounce 150ms yang halus.
- [x] **Peningkatan Spacing per Seksi & Clearance Katalog**:
  - [x] Penambahan *negative space* yang lapang pada Beranda (Hero `pb-20 sm:pb-36`, Carousel `py-20 sm:py-36`, Bouncer `py-16 sm:py-28`, Why RANCAK `py-20 sm:py-36`, dan Footer `mt-20 sm:mt-28`).
  - [x] Penambahan jarak lega (80–100px) antara heading katalog dengan formulir filter dan grid katalog tanpa membutuhkan garis border pemisah.
- [x] **Efisiensi Performa & Code Splitting**:
  - [x] Pemisahan bundle JavaScript via Next.js App Router: beranda tidak lagi mengunduh atau merender ratusan node kartu katalog saat first paint.
  - [x] Eliminasi komputasi filtering in-memory berat di beranda, menurunkan Total Blocking Time (TBT) dan memaksimalkan skor INP.

---

## 14. Integrasi Kelola Repositori Portal & Pengaturan Native Pegawai di Next.js

Memindahkan fungsionalitas manajemen layanan portal dan pengaturan profil/akun pegawai dari `Dashboard_Admin` ke `landingpageintra` secara menyeluruh, sehingga `Dashboard_Admin` dikhususkan penuh untuk tugas-tugas administratif.

- [x] **Hierarki Sidebar Repositori Pribadi (`RepositorySidebar.tsx`)**:
  - [x] Penambahan section **"Tambah Layanan"** di atas "Kategori Utama" dengan tombol **"Kelola Repositori Portal"** lengkap dengan badge counter layanan.
  - [x] Penempatan section **"Kategori Utama"** dan tombol repositori lainnya di bawahnya.
  - [x] Penambahan tombol **"Pengaturan"** tepat di bawah tombol Akun pada sidebar.
- [x] **Tampilan & Manajemen Kelola Repositori Portal**:
  - [x] Hanya menampilkan layanan yang ditambahkan oleh user bersangkutan (`created_by === user.id`).
  - [x] Seluruh layanan yang ditambahkan/diperbarui otomatis masuk ke tabel utama `layanan` dan langsung muncul pada direktori katalog publik/internal (`/katalog` dan beranda).
  - [x] Fitur penambahan, pengeditan, penyalinan tautan, dan penghapusan layanan dengan dialog konfirmasi aman.
  - [x] Modal form mandiri [`PortalLayananModal.tsx`](file:///d:/BPS/Rangkiang/landingpageintra/src/components/PortalLayananModal.tsx) dengan validasi nama, kategori, akses (Publik/Internal), VPN, URL, dan deskripsi.
- [x] **Tampilan Pengaturan Native Pegawai**:
  - [x] Panel profil pengguna lengkap dengan inisial avatar, nama, username, email, dan status verifikasi akun.
  - [x] Preferensi tema tampilan (pengalih Dark/Light mode instan).
  - [x] Panel keamanan sesi dan tombol logout terenkripsi aman.
  - [x] Tautan cepat Single Sign-On (SSO) khusus peran `ADMIN` untuk membuka Dashboard Admin tanpa perlu login ulang.
- [x] **Proksi Endpoint Layanan Terotorisasi (`/api/layanan`)**:
  - [x] Dukungan parameter `?my_services=1` untuk memuat layanan portal milik user yang sedang aktif.
  - [x] Implementasi metode `POST`, `PUT`, dan `DELETE` yang memvalidasi cookie sesi `bps_solsel_session` dan menginjeksi `created_by`/`user_id` secara server-side.
  - [x] Suite pengujian unit Vitest terverifikasi 100% lulus (58 skenario uji).

---

## 15. Rebranding Identitas Menjadi RANCAK & Harmonisasi Palet 3 Warna

Transformasi identitas merek dari SIPASTI menjadi **RANCAK** beserta pembaruan palet gradien tematik 3 warna: Biru, Hijau, dan Orange.

- [x] **Penggantian Nama Merek Seluruh Aplikasi**:
  - [x] Mengganti seluruh teks `SIPASTI` menjadi `RANCAK` pada Headline Hero, Why Section, Halaman Login, Tooltip Sidebar, dan dokumentasi.
  - [x] Pembaruan heading login: `"Login RANCAK"`.
  - [x] Pembaruan section intro: `"Why RANCAK?"` dengan `id="why-rancak"`.
- [x] **Harmonisasi Palet 3 Warna (Biru, Hijau, Orange)**:
  - [x] Memperbarui skema 3 warna dari *Biru (`#005AA9`), Biru Muda (`#00A6B4`), Hijau (`#6DBE45`)* menjadi **Biru (`#005AA9`), Hijau (`#6DBE45`), dan Orange (`#F37021`)**.
  - [x] Penerapan gradasi tematik baru pada headline Hero (`bg-gradient-to-r from-[#005AA9] via-[#6DBE45] to-[#F37021]`), judul Why RANCAK, dan headline Katalog Layanan ("Satu Direktori").
- [x] **Logo Typographic RANCAK pada Navbar**:
  - [x] Mengganti logo gambar statis SIPASTI pada Navbar dengan teks **RANCAK** yang didesain tebal, dinamis, dan bernyawa seolah logo resmi (`font-black tracking-wider` dengan gradasi Biru, Hijau, dan Orange).
  - [x] Efek interaksi hover scale dan klik cerdas kembali ke beranda.
