# 📚 Master Catalog & Index of Scanned Skills

> **Hasil Pemindaian Global & Workspace Antigravity**  
> **Waktu Pemindaian:** 2026-10-08  
> **Total Skill Terdata:** 34 Global Skills + 4 Subagents Khusus + 9 Workspace Skills  
> **Prioritas Resolusi:** `Workspace (.agents/skills)` > `Global (~/.gemini/config/)` > `Built-in IDE`

---

## 🧭 Ringkasan Cepat: Decision Matrix Berdasarkan Fase Kerja

Gunakan panduan berikut untuk memilih skill yang paling tepat sesuai tahapan tugas:

| Tahapan Kerja / Kebutuhan | Rekomendasi Global Skill | Trigger / Kata Kunci |
| :--- | :--- | :--- |
| **Kebutuhan belum jelas / masih samar** | `interview-me` | "interview me", "grill me", "are we sure?" |
| **Ide kasar, butuh alternatif variasi** | `idea-refine` | "ideate", "refine this idea", "stress-test" |
| **Memulai fitur baru / proyek baru** | `spec-driven-development` | "buatkan spec", "PRD", "requirements" |
| **Menetapkan standar batas kualitas** | `constraint-driven-development` | "set up constraints", "define standards" |
| **Pecah spec menjadi task terurut** | `planning-and-task-breakdown` | "breakdown tasks", "plan execution" |
| **Coding bertahap & irisan tipis** | `incremental-implementation` | "step-by-step implementation", "thin slices" |
| **Membangun UI/UX antarmuka pengguna** | `frontend-ui-engineering` | "frontend", "responsive layout", "WCAG" |
| **Desain kontrak API & interface modul** | `api-and-interface-design` | "REST API", "GraphQL", "interface design" |
| **Keputusan berisiko tinggi / kode asing** | `doubt-driven-development` | "adversarial review", "high stakes", "auth" |
| **Penerapan berbasis dokumentasi resmi** | `source-driven-development` | "official docs", "canonical patterns" |
| **Optimasi context & file rules** | `context-engineering` | "context setup", "rules configuration" |
| **Menulis tes dengan metode TDD** | `test-driven-development` | "TDD", "red-green-refactor", "unit test" |
| **Pengujian browser via Chrome DevTools** | `browser-testing-with-devtools` | "DevTools MCP", "inspect DOM", "console error" |
| **Menyelidiki akar masalah (Bug)** | `debugging-and-error-recovery` | "root-cause", "debug error", "kenapa gagal" |
| **Review kode multi-dimensi** | `code-review-and-quality` | "review diff", "PR review", "code quality" |
| **Penyederhanaan kode rumit / refactor** | `code-simplification` | "simplify code", "refactor complexity" |
| **Audit keamanan & celah OWASP** | `security-and-hardening` | "security audit", "OWASP", "sanitize input" |
| **Optimasi performa & Core Web Vitals** | `performance-optimization` | "LCP", "CWV", "query optimization", "speed" |
| **Solusi paling ringkas & anti-bloat** | `ponytail` | "ponytail", "be lazy", "YAGNI", "do less" |
| **Audit seluruh repo dari over-engineering** | `ponytail-audit` | "/ponytail-audit", "find bloat", "audit repo" |
| **Commit, branching & versioning Git** | `git-workflow-and-versioning` | "atomic commit", "resolve conflict", "semver" |
| **Penyusunan pipeline CI/CD** | `ci-cd-and-automation` | "CI/CD", "GitHub Actions", "pipeline" |
| **Migrasi schema / penghapusan modul lama**| `deprecation-and-migration` | "deprecate", "expand-contract", "migration" |
| **Dokumentasi arsitektur (ADR)** | `documentation-and-adrs` | "ADR", "architecture decision", "docs" |
| **Pencatatan log, metrik & telemetry** | `observability-and-instrumentation` | "metrics", "tracing", "structured logs" |
| **Persiapan rilis produksi & launch** | `shipping-and-launch` | "pre-launch checklist", "rollback plan" |
| **Visualisasi Knowledge Graph Codebase** | `graphify` | "/graphify", "arsitektur repo", "knowledge graph"|
| **Panduan sistem kustomisasi Antigravity** | `agy-customizations` | "customization", "buat skill", "buat plugin" |
| **Buku panduan lengkap Antigravity CLI/IDE** | `antigravity-guide` | "antigravity guide", "agy CLI", "slash commands" |

---

## 1. Global Skills: Built-in Antigravity IDE

Terletak pada direktori internal sistem Antigravity IDE:

### 1.1 `agy-customizations`
- **Path:** `C:\Users\user\.gemini\antigravity-ide\builtin\skills\agy-customizations\SKILL.md`
- **Deskripsi:** Panduan komprehensif sistem kustomisasi Antigravity. Mengatur prioritas pemuatan (*loading priority*), mekanisme penemuan (*discovery*), aturan hierarkis (`GEMINI.md`, `AGENTS.md`), pembuatan Skill, Plugin, Hooks, dan MCP Servers.
- **Kapan Digunakan:** Ketika ingin merancang skill baru, mengonfigurasi aturan kustom, atau memahami alur kerja hook dan MCP.

### 1.2 `antigravity-guide`
- **Path:** `C:\Users\user\.gemini\antigravity-ide\builtin\skills\antigravity_guide\SKILL.md`
- **Deskripsi:** Dokumentasi lengkap dan peta situs untuk ekosistem Google Antigravity (AGY), mencakup Antigravity CLI, IDE 2.0, Python SDK, slash commands, serta keybindings.
- **Kapan Digunakan:** Ketika memerlukan bantuan mengenai penggunaan fitur CLI/IDE dan pintasan Antigravity.

---

## 2. Global Skills: Standalone Knowledge Graph

### 2.1 `graphify`
- **Path:** `C:\Users\user\.gemini\config\skills\graphify\SKILL.md`
- **Deskripsi:** Mengubah struktur folder, kode sumber, dokumen, dan media menjadi *Knowledge Graph* persisten dengan deteksi komunitas (*community detection*), node hierarkis (*god nodes*), serta ekspor interaktif (HTML, GraphRAG JSON, Markdown Report, Neo4j, FalkorDB, Gephi).
- **Perintah & Opsi:**
  - `/graphify`: Eksekusi pipeline penuh pada direktori saat ini.
  - `/graphify <path> --mode deep`: Ekstraksi mendalam dengan inferensi relasi antar file.
  - `/graphify query "<pertanyaan>"`: Penelusuran graf kontekstual berbasis BFS/DFS.
- **Kapan Digunakan:** Saat menganalisis struktur arsitektur repositori yang besar atau menelusuri hubungan antar modul yang kompleks.

---

## 3. Global Plugin: `agent-skills` (25 Workflow Skills & 4 Subagents)

Terletak pada plugin global: `C:\Users\user\.gemini\config\plugins\agent-skills\`

### 3.1 Meta-Skill & Perencanaan
- **`using-agent-skills`** (`.../skills/using-agent-skills/SKILL.md`):  
  Meta-skill pemandu navigasi untuk mengidentifikasi dan memilih skill yang tepat pada setiap fase rekayasa.
- **`interview-me`** (`.../skills/interview-me/SKILL.md`):  
  Teknik wawancara terstruktur (satu pertanyaan per giliran) untuk menggali kebutuhan sejati pengguna hingga mencapai tingkat keyakinan 95% sebelum menulis kode.
- **`idea-refine`** (`.../skills/idea-refine/SKILL.md`):  
  Mematangkan ide mentah melalui pemikiran divergen (membuka opsi) dan konvergen (menyaring opsi terbaik).
- **`spec-driven-development`** (`.../skills/spec-driven-development/SKILL.md`):  
  Menyusun spesifikasi teknis dan PRD yang modular sebelum implementasi dimulai.
- **`constraint-driven-development`** (`.../skills/constraint-driven-development/SKILL.md`):  
  Menciptakan kontrak kualitas tertulis (`CONSTRAINTS.md`) untuk mencegah degradasi standar pengujian, aksesibilitas, atau performa.
- **`planning-and-task-breakdown`** (`.../skills/planning-and-task-breakdown/SKILL.md`):  
  Memecah dokumen spesifikasi menjadi daftar pekerjaan implementatif dengan dependensi yang jelas.

### 3.2 Implementasi & Rekayasa Kode
- **`incremental-implementation`** (`.../skills/incremental-implementation/SKILL.md`):  
  Mengirimkan perubahan kode dalam irisan tipis (*thin slices*) yang langsung dapat diverifikasi.
- **`frontend-ui-engineering`** (`.../skills/frontend-ui-engineering/SKILL.md`):  
  Membangun UI web yang responsif, memenuhi standar aksesibilitas WCAG, state management yang rapi, dan tampilan kelas produksi.
- **`api-and-interface-design`** (`.../skills/api-and-interface-design/SKILL.md`):  
  Merancang kontrak antarmuka API (REST, GraphQL) dan batasan tipe (*type boundary*) antara frontend dan backend.
- **`source-driven-development`** (`.../skills/source-driven-development/SKILL.md`):  
  Menjamin kode berpijak langsung pada dokumentasi resmi library/framework terbaru tanpa pola usang.
- **`context-engineering`** (`.../skills/context-engineering/SKILL.md`):  
  Mengatur konteks kerja agent dan aturan proyek agar respons tetap tajam dan akurat.
- **`doubt-driven-development`** (`.../skills/doubt-driven-development/SKILL.md`):  
  Review adversarial independen untuk membedah asumsi tersembunyi pada logika krusial (autentikasi, migrasi data, keamanan).

### 3.3 Verifikasi, Testing & Debugging
- **`test-driven-development`** (`.../skills/test-driven-development/SKILL.md`):  
  Pengembangan berbasis tes dengan siklus *Red-Green-Refactor* untuk membuktikan kebenaran kode.
- **`browser-testing-with-devtools`** (`.../skills/browser-testing-with-devtools/SKILL.md`):  
  Pengujian browser nyata menggunakan Chrome DevTools MCP (inspeksi DOM, console log, network payload, visual verifikasi).
- **`debugging-and-error-recovery`** (`.../skills/debugging-and-error-recovery/SKILL.md`):  
  Metode investigasi akar penyebab masalah (*root-cause analysis*) terstruktur saat sistem mengalami kerusakan.

### 3.4 Kualitas, Refactoring & Keamanan
- **`code-review-and-quality`** (`.../skills/code-review-and-quality/SKILL.md`):  
  Tinjauan kode multi-sumbu (kebenaran, keterbacaan, arsitektur, keamanan, performa).
- **`code-simplification`** (`.../skills/code-simplification/SKILL.md`):  
  Menyederhanakan kode yang berbelit-belit tanpa mengubah fungsionalitas aslinya.
- **`security-and-hardening`** (`.../skills/security-and-hardening/SKILL.md`):  
  Penguatan sistem dari celah OWASP Top 10, sanitasi input, pengelolaan sesi aman, dan audit integritas dependensi.
- **`performance-optimization`** (`.../skills/performance-optimization/SKILL.md`):  
  Optimasi frontend (Core Web Vitals), backend, query database (eliminasi N+1), dan pemangkasan latency.

### 3.5 Operasional, DevOps & Dokumentasi
- **`git-workflow-and-versioning`** (`.../skills/git-workflow-and-versioning/SKILL.md`):  
  Struktur commit atomik, pengelolaan branching, resolusi konflik, pull request, semver, dan changelog.
- **`ci-cd-and-automation`** (`.../skills/ci-cd-and-automation/SKILL.md`):  
  Pembangunan pipeline build, validasi otomatis, dan integrasi pengujian dalam CI/CD.
- **`deprecation-and-migration`** (`.../skills/deprecation-and-migration/SKILL.md`):  
  Manajemen penghentian sistem lama (*sunsetting*) dan migrasi schema database tanpa downtime (*expand/contract*).
- **`documentation-and-adrs`** (`.../skills/documentation-and-adrs/SKILL.md`):  
  Pencatatan keputusan arsitektur (ADR) dan dokumentasi kontekstual untuk kemudahan pemeliharaan jangka panjang.
- **`observability-and-instrumentation`** (`.../skills/observability-and-instrumentation/SKILL.md`):  
  Instrumentasi logging terstruktur, metrik, distributed tracing, dan sistem peringatan (*alerting*).
- **`shipping-and-launch`** (`.../skills/shipping-and-launch/SKILL.md`):  
  Checklist pra-rilis produksi, peluncuran bertahap (*canary/staged rollout*), dan skenario rollback aman.

### 3.6 Subagents Khusus (Bisa Didelegasikan Secara Mandiri)
1. **`code-reviewer`**: Senior reviewer untuk inspeksi kode komprehensif sebelum merge.
2. **`security-auditor`**: Spesialis keamanan siber untuk deteksi kerentanan dan pemodelan ancaman (*threat modeling*).
3. **`test-engineer`**: Engineer QA untuk merancang strategi pengujian, skenario edge-case, dan cakupan tes.
4. **`web-performance-auditor`**: Spesialis audit web untuk Core Web Vitals, waktu render, dan optimasi aset jaringan.

---

## 4. Global Plugin: `ponytail` (6 Anti-Bloat & Minimalism Skills)

Terletak pada plugin global: `C:\Users\user\.gemini\config\plugins\ponytail\`  
*Filosofi Inti: "Kode terbaik adalah kode yang tidak pernah ditulis. Cari solusi paling sederhana, paling pendek, dan minim dependensi."*

- **`ponytail`** (`.../skills/ponytail/SKILL.md`):  
  Mengarahkan solusi ke jalur tercepat dan termudah (YAGNI, utamakan standard library dibanding custom code atau package baru). Mendukung level intensitas: `lite`, `full` (default), dan `ultra`.
- **`ponytail-audit`** (`.../skills/ponytail-audit/SKILL.md`):  
  Audit menyeluruh satu repo untuk mengidentifikasi abstraksi berlebih (*over-engineering*), kode mati, atau dependensi redundan.
- **`ponytail-debt`** (`.../skills/ponytail-debt/SKILL.md`):  
  Mengumpulkan seluruh komentar `ponytail:` di dalam kode ke dalam buku catatan utang teknis (*debt ledger*).
- **`ponytail-gain`** (`.../skills/ponytail-gain/SKILL.md`):  
  Menampilkan papan skor dampak penghematan (baris kode berkurang, waktu respon lebih cepat, biaya komputasi turun).
- **`ponytail-help`** (`.../skills/ponytail-help/SKILL.md`):  
  Kartu referensi cepat semua perintah dan mode kerja ponytail.
- **`ponytail-review`** (`.../skills/ponytail-review/SKILL.md`):  
  Tinjauan kode khusus yang berfokus memangkas kompleksitas yang tidak diperlukan (*hunting complexity*).

---

## 5. Workspace Skills Khusus Repositori Ini (`.agents/skills/`)

Skill lokal yang terspesialisasi untuk arsitektur portal dan desain BPS Solok Selatan:

| Nama Skill | Lokasi Direktori | Fungsi Utama |
| :--- | :--- | :--- |
| **`nextjs-app-b-hardening-and-qa`** | `.agents/skills/nextjs-app-b-hardening-and-qa` | Hardening menyeluruh App B: Proxy API Key, cookie HTTP-Only, Vitest + Playwright QA, dan toleransi kegagalan backend PHP. |
| **`nextjs-clean-security`** | `.agents/skills/nextjs-clean-security` | Prosedur sanitasi kode, audit CSP, dan mitigasi submit ganda pada formulir Next.js. |
| **`ui-ux-pro-max`** | `.agents/skills/ui-ux-pro-max` | Sistem kecerdasan desain UI/UX (79 gaya, 192 palet warna terkurasi, 74 tipografi, 119 pedoman interaksi). |
| **`ui-styling`** | `.agents/skills/ui-styling` | Implementasi komponen antarmuka Tailwind CSS v4 dan shadcn/ui. |
| **`design`** | `.agents/skills/design` | Desain identitas merek, logo (55 variasi gaya), banner visual, presentasi Chart.js, dan icon SVG. |
| **`design-system`** | `.agents/skills/design-system` | Arsitektur token desain (primitif → semantik → komponen) dan variabel CSS baku. |
| **`banner-design`** | `.agents/skills/banner-design` | Perancangan banner promosi, media sosial, dan poster publikasi grafis. |
| **`brand`** | `.agents/skills/brand` | Penyelarasan pedoman visual dan nada bicara instansi (*brand consistency*). |
| **`slides`** | `.agents/skills/slides` | Pembuatan presentasi interaktif berbasis HTML dan grafik data dinamis. |

---

## 💡 Cara Menggunakan Skill dalam Sesi Kerja

1. **Pemanggilan Alami (Implicit Trigger):**  
   Cukup sebutkan kata kunci atau tugas yang relevan (contoh: *"Lakukan security audit pada route login"* otomatis memicu `security-and-hardening`).
2. **Pemanggilan Langsung (Explicit Mention):**  
   Sebutkan nama skill secara spesifik (contoh: *"Gunakan skill `code-simplification` untuk merapikan fungsi ini"*).
3. **Slash Commands:**  
   Beberapa skill memiliki pintasan instan seperti `/graphify`, `/ponytail`, `/plan`, atau `/goal`.
