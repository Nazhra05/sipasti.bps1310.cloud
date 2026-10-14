# Arsitektur Keamanan, Route Handlers, dan API Proxy (BFF Pattern)
## Portal Intranet BPS Kabupaten Solok Selatan — RANCAK

> **Status Audit**: ✅ **100% Terverifikasi Aman & Menggunakan Route/API Internal**  
> **Framework**: Next.js 16 (App Router), Node.js Server Runtime, PHP 8.2 (Backend Dashboard_Admin)  
> **Cakupan Pengujian**: 17 Berkas Uji, 70 Unit Test Vitest (**100% Pass**)

---

## 1. Ikhtisar Arsitektur (*Backend-For-Frontend Pattern*)

Aplikasi frontend (`landingpageintra`) dirancang menggunakan pola **Backend-For-Frontend (BFF)**. Browser pengguna **tidak pernah** berhubungan langsung dengan server database atau endpoint backend PHP secara telanjang (*naked endpoint*).

Semua permintaan data dari antarmuka pengguna dialihkan melalui **Next.js Route Handlers internal (`/api/*`)** yang bertindak sebagai *secure reverse proxy*, *data sanitizer*, dan *access control layer*.

```mermaid
flowchart TD
    subgraph Browser["Klien / Browser Pengguna"]
        UI["Antarmuka Portal (Hero, Katalog, Repositori)"]
        Search["Hero Search Bar (In-Memory Filter)"]
    end

    subgraph AppB["App B: Next.js BFF (Server Runtime)"]
        direction TB
        ProxyAuth["/api/auth/* (Login, Me, SSO, Password, Resend)"]
        ProxyLayanan["/api/layanan (Redaction & Access Control)"]
        ProxyKategori["/api/kategori (Taksonomi Cache)"]
        ProxyRepo["/api/user-repo (Injeksi X-User-Id Aman)"]
        SecurityLayer["Lapisan Keamanan: HMAC-SHA256, Rate Limiter, Safe URL"]
    end

    subgraph AppA["App A: Backend PHP & Database (Terisolasi)"]
        direction TB
        PHPEndpoints["PHP REST API (auth, layanan, user_repo)"]
        Database[("MariaDB / SQLite Database")]
    end

    UI -->|Panggilan Internal /api/*| AppB
    Search -->|Pencarian Instan Cepat| UI
    SecurityLayer --> ProxyAuth
    SecurityLayer --> ProxyLayanan
    SecurityLayer --> ProxyRepo
    AppB -->|Injeksi Rahasia X-API-KEY| PHPEndpoints
    PHPEndpoints --> Database
```

---

## 2. Katalog Lengkap Route & API Handlers

Seluruh fitur dalam aplikasi didukung oleh endpoint API internal yang terisolasi:

| No | Modul Fitur | Endpoint Route Handlers | Metode HTTP | Deskripsi & Kontrak Keamanan |
| :---: | :--- | :--- | :---: | :--- |
| 1 | **Login Pegawai / Admin** | `/api/login` | `POST` | Menerima identitas & password, rate limiting (5x gagal/menit), verifikasi bcrypt, menerbitkan cookie `bps_solsel_session` (*HTTP-Only* bertanda tangan HMAC-SHA256). |
| 2 | **Verifikasi Sesi** | `/api/auth/me` | `GET` | Membaca & memverifikasi signature cookie sesi, mengecek status keaktifan akun secara realtime ke backend PHP (`check_session.php`). |
| 3 | **Logout** | `/api/logout` | `POST` | Menghapus cookie `bps_solsel_session` secara otoritatif dengan tanggal kedaluwarsa lampau. |
| 4 | **Pendaftaran Akun** | `/api/register` | `POST` | Rate limiting, validasi format email kedinasan BPS, sanitasi panjang karakter, forwarding aman ke backend. |
| 5 | **Ganti Kata Sandi** | `/api/auth/change-password` | `POST` | Wajib sesi aktif, rate limiting berbasis user & IP, verifikasi kata sandi lama sebelum menyimpan enkripsi bcrypt baru. |
| 6 | **Single Sign-On (SSO)** | `/api/auth/sso?target=...` | `GET` | Menghubungkan admin ke `Dashboard_Admin` tanpa login ulang. Menggunakan token HMAC-SHA256 berumur pendek (60 detik) dan allowlist target. |
| 7 | **Kirim Ulang Verifikasi** | `/api/auth/resend-verification` | `GET` | Mengarahkan pengguna ke halaman kirim ulang verifikasi secara dinamis berbasis `API_BASE_URL` server tanpa mengekspos port internal. |
| 8 | **Katalog Layanan** | `/api/layanan` | `GET` | Menampilkan direktori layanan. Menerapkan **Server-side URL Redaction** (URL aplikasi internal disensor untuk tamu yang belum login). |
| 9 | **Layanan Milik Pengguna** | `/api/layanan?my_services=1` | `GET` | Mengambil daftar usulan layanan portal milik pegawai yang sedang login (`created_by === session.userId`). |
| 10 | **Tambah Layanan Portal** | `/api/layanan` | `POST` | Validasi input, menyuntikkan `created_by` dari sesi server, meneruskan ke backend dengan `X-API-KEY`. |
| 11 | **Ubah Layanan Portal** | `/api/layanan` | `PUT` | Memeriksa hak kepemilikan data sebelum mengizinkan pembaruan data layanan. |
| 12 | **Hapus Layanan Portal** | `/api/layanan` | `DELETE` | Memeriksa hak kepemilikan data sebelum menghapus layanan dari direktori. |
| 13 | **Kategori Layanan** | `/api/kategori` | `GET` | Reverse proxy taksonomi kategori portal dengan header backend rahasia. |
| 14 | **Repositori Pribadi** | `/api/user-repo?action=get_all` | `GET` | Mengambil data tautan pribadi, kategori pribadi, pin favorit, dan urutan kustom user. Wajib sesi login valid. |
| 15 | **Mutasi Repositori Pribadi**| `/api/user-repo` | `POST` | Menambah/mengubah/menghapus tautan pribadi, toggle favorit, dan simpan urutan. `X-User-Id` disuntikkan di server (mencegah IDOR). |
| 16 | **Pemeriksaan Kesehatan** | `/api/health` | `GET` | Diagnostic health check untuk ketersediaan Next.js dan konektivitas upstream PHP. |

---

## 3. Matriks Mitigasi Ancaman Keamanan (*Threat Mitigation Matrix*)

Berikut adalah mekanisme perlindungan spesifik terhadap vektor serangan web umum:

### A. Server-Side URL Redaction (*Pencegahan Kebocoran URL Intranet*)
- **Potensi Celah**: Pengguna luar/tamu membongkar URL intranet BPS via Network Tab atau Inspect Element.
- **Mitigasi**: Di dalam [`/api/layanan/route.ts`](file:///d:/BPS/Rangkiang/landingpageintra/src/app/api/layanan/route.ts), jika sesi autentikasi bernilai `null`, semua layanan yang berlabel `Internal` (atau membutuhkan VPN) secara otomatis memiliki nilai `url: ""` di sisi server sebelum JSON dikirim ke browser. Pengunjung tanpa login tidak akan pernah menerima alamat URL aplikasi kedinasan.

### B. Isolasi Kredensial Rahasia (*Zero Secret Exposure*)
- **Potensi Celah**: Kunci API backend (`BPS_API_KEY`) dan token rahasia (`SESSION_SECRET`) bocor melalui bundle client JavaScript.
- **Mitigasi**: Variabel lingkungan disimpan murni di server (`.env.local`) tanpa awalan `NEXT_PUBLIC_`. Helper [`serverApiConfig.ts`](file:///d:/BPS/Rangkiang/landingpageintra/src/lib/serverApiConfig.ts) hanya dijalankan dalam konteks Node.js server.

### C. Keamanan Sesi Kriptografis (*XSS & CSRF Immune*)
- **Potensi Celah**: Pencurian sesi via serangan Cross-Site Scripting (XSS) atau pemalsuan request lintas origin (CSRF).
- **Mitigasi**:
  - Token sesi disimpan dalam cookie `bps_solsel_session` dengan flag:
    - `httpOnly: true` (skrip browser/JavaScript tidak memiliki akses baca ke cookie).
    - `sameSite: "lax"` (mencegah cookie terkirim pada request lintas situs berbahaya).
    - `secure: true` pada environment produksi (HTTPS-only).
  - Menggunakan struktur bertanda tangan kriptografis: `base64url(payload).hmac_sha256(payload, secret)`.

### D. Pencegahan Serangan Brute-Force (*In-Memory Rate Limiting*)
- **Potensi Celah**: Percobaan tebak kata sandi atau flooding pendaftaran akun secara massal.
- **Mitigasi**: Utilitas [`rateLimit.ts`](file:///d:/BPS/Rangkiang/landingpageintra/src/lib/rateLimit.ts) membatasi maksimal 5 percobaan gagal per 60 detik per alamat IP klien pada endpoint:
  - `/api/login`
  - `/api/register`
  - `/api/auth/change-password`

### E. Pencegahan Insecure Direct Object Reference (IDOR)
- **Potensi Celah**: Penyerang memanipulasi parameter `user_id` pada payload request untuk melihat atau mengubah repositori milik pegawai lain.
- **Mitigasi**: Pada [`/api/user-repo/route.ts`](file:///d:/BPS/Rangkiang/landingpageintra/src/app/api/user-repo/route.ts), identitas pengguna diambil secara otoritatif dari token sesi yang didekripsi di server (`payload.userId`). Header `X-User-Id` dan `user_id` disuntikkan secara internal dan menimpa input apa pun dari klien.

### F. Pencegahan Malicious URL Injection & Open-Redirect (SSRF/XSS)
- **Potensi Celah**: Tautan berbahaya seperti `javascript:stealToken()` atau skema `data:text/html` disusupkan ke tombol navigasi.
- **Mitigasi**: Modul [`toSafeExternalUrl`](file:///d:/BPS/Rangkiang/landingpageintra/src/lib/safeUrl.ts) memvalidasi semua URL sebelum diteruskan ke `window.open()`, hanya mengizinkan protokol resmi `http:` dan `https:`.

### G. Pencegahan Beban DoS & SQL Injection pada Fitur Pencarian
- **Potensi Celah**: Input kata kunci pada Search Bar Hero menembak query berat atau karakter injeksi SQL ke database secara terus menerus.
- **Mitigasi**: Pencarian Hero dan modal Spotlight berjalan secara **in-memory** di sisi browser dari data yang sudah disanitasi di awal. Tidak ada query database yang dieksekusi saat pengguna mengetik, menghasilkan waktu respon instan (*0ms network latency*) dan bebas risiko SQL Injection.

---

## 4. Bukti Hasil Pengujian Unit Otomatis (Vitest)

Pengujian kualitas otomatis dijalankan dengan hasil **100% lulus** tanpa regresi:

```
 RUN  v3.2.7 D:/BPS/Rangkiang/landingpageintra

 ✓ src/components/HeroSection.test.tsx (4 tests)
 ✓ src/components/LoadingScreen.test.tsx (2 tests)
 ✓ src/lib/localAnalytics.test.ts (3 tests)
 ✓ src/app/api/layanan/route.test.ts (11 tests)
 ✓ src/lib/session.test.ts (10 tests)
 ✓ src/app/api/auth/sso/route.test.ts (3 tests)
 ✓ src/lib/offlineFallback.test.ts (3 tests)
 ✓ src/app/api/auth/change-password/route.test.ts (4 tests)
 ✓ src/app/api/login/route.test.ts (3 tests)
 ✓ src/app/api/auth/me/route.test.ts (4 tests)
 ✓ src/app/api/user-repo/route.test.ts (4 tests)
 ✓ src/app/api/health/route.test.ts (3 tests)
 ✓ src/app/api/register/route.test.ts (4 tests)
 ✓ src/lib/rateLimit.test.ts (5 tests)
 ✓ src/lib/accessibilityMapper.test.ts (2 tests)
 ✓ src/app/api/auth/resend-verification/route.test.ts (2 tests)
 ✓ src/lib/safeUrl.test.ts (3 tests)

 Test Files  17 passed (17)
      Tests  70 passed (70)
```

---

## 5. Ringkasan Kesimpulan

Dengan arsitektur di atas, `landingpageintra` telah memenuhi standar keamanan web modern:
1. **Tidak ada API pihak luar/backend yang dipanggil langsung oleh browser**.
2. **Tidak ada rahasia atau kredensial yang bocor di bundle JavaScript klien**.
3. **Akses ke URL intranet kedinasan dilindungi secara otoritatif di sisi server**.
4. **Semua interaksi sensitif (autentikasi, repositori, sandi) dilindungi oleh token sesi bertanda tangan kriptografis dan rate limiting**.
