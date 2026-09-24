/**
 * data.ts
 * Centralized dummy data for the project. Edit this one file to change
 * images, logo, or card content — no need to touch the components.
 */

// Background image for the Hero section
// File lives at: public/hero/BackgroundBPS.png
export const heroBackgroundImage = "/hero/Dotsbg.jfif";

export const heroLogo = "/Hero/SIPASTIwLogo.png"; // Logo for the Hero section

// Logo for the Navbar
// File lives at: public/LogoBPS.png
export const navbarLogo = "/BPS Logo.png";

export type CardLink = {
  label: string;
  href: string;
};

export type CardData = {
  title: string;
  category: string;
  description: string;
  links: CardLink[];
};

// Top row — 3 cards
export const websitesCardsTop: CardData[] = [
  {
    title: "Distribusi",
    category: "Distribusi",
    description:
      "Perdagangan, harga, transportasi, pariwisata, dan distribusi barang/jasa.",
    links: [
      {
        label: "Website BPS Kabupaten Solok Selatan — Data Distribusi",
        href: "/distribusi/website-bps-solsel",
      },
      {
        label: "Web Sensus / Kegiatan Sensus Distribusi",
        href: "/distribusi/web-sensus",
      },
      {
        label: "Sistem/Aplikasi Statistik Distribusi",
        href: "/distribusi/sistem-statistik",
      },
      { label: "Akses Data Ekspor-Impor", href: "/distribusi/ekspor-impor" },
      { label: "Akses Data Harga / Inflasi", href: "/distribusi/harga-inflasi" },
      { label: "Data Perdagangan", href: "/distribusi/perdagangan" },
      { label: "Data Transportasi", href: "/distribusi/transportasi" },
      { label: "Data Pariwisata", href: "/distribusi/pariwisata" },
      { label: "KBLI", href: "/distribusi/kbli" },
    ],
  },
  {
    title: "Produksi",
    category: "Produksi",
    description:
      "Pertanian, industri, pertambangan, energi, konstruksi, peternakan, kehutanan, perikanan.",
    links: [
      { label: "Sistem Statistik Produksi", href: "/produksi/sistem-statistik" },
      { label: "Data Pertanian", href: "/produksi/pertanian" },
      { label: "Data Tanaman Pangan", href: "/produksi/tanaman-pangan" },
      { label: "Data Hortikultura", href: "/produksi/hortikultura" },
      { label: "Data Perkebunan", href: "/produksi/perkebunan" },
      { label: "Data Peternakan", href: "/produksi/peternakan" },
      { label: "Data Perikanan", href: "/produksi/perikanan" },
      { label: "Data Kehutanan", href: "/produksi/kehutanan" },
      { label: "Data Industri", href: "/produksi/industri" },
      {
        label: "Data Pertambangan & Penggalian",
        href: "/produksi/pertambangan",
      },
      { label: "Data Energi", href: "/produksi/energi" },
      { label: "Data Konstruksi", href: "/produksi/konstruksi" },
      { label: "Sensus Pertanian / ST2023", href: "/produksi/st2023" },
      { label: "SIGESIT", href: "/produksi/sigesit" },
    ],
  },
  {
    title: "Neraca",
    category: "Neraca",
    description:
      "PDRB, neraca wilayah, neraca produksi/pengeluaran, dan analisis ekonomi makro.",
    links: [
      { label: "Sistem/Website Neraca Wilayah", href: "/neraca/neraca-wilayah" },
      { label: "PDRB", href: "/neraca/pdrb" },
      { label: "Data Pendapatan Regional", href: "/neraca/pendapatan-regional" },
      { label: "Neraca Produksi", href: "/neraca/produksi" },
      { label: "Neraca Pengeluaran", href: "/neraca/pengeluaran" },
      { label: "Tabel/Database PDRB", href: "/neraca/tabel-pdrb" },
      { label: "Analisis Statistik", href: "/neraca/analisis-statistik" },
      { label: "Indikator Ekonomi Makro", href: "/neraca/indikator-makro" },
    ],
  },
];

// Bottom row — 4 cards
export const websitesCardsBottom: CardData[] = [
  {
    title: "Sosial",
    category: "Sosial",
    description:
      "Penduduk, ketenagakerjaan, kemiskinan, pendidikan, kesehatan, sosial, dan kesejahteraan.",
    links: [
      { label: "Sistem Statistik Sosial", href: "/sosial/sistem-statistik" },
      { label: "Data Kependudukan", href: "/sosial/kependudukan" },
      { label: "Data Ketenagakerjaan", href: "/sosial/ketenagakerjaan" },
      { label: "Data Kemiskinan", href: "/sosial/kemiskinan" },
      {
        label: "Data Kesejahteraan Rakyat",
        href: "/sosial/kesejahteraan-rakyat",
      },
      { label: "Data Pendidikan", href: "/sosial/pendidikan" },
      { label: "Data Kesehatan", href: "/sosial/kesehatan" },
      { label: "Data Ketahanan Sosial", href: "/sosial/ketahanan-sosial" },
      { label: "Sensus Penduduk", href: "/sosial/sensus-penduduk" },
      { label: "Susenas", href: "/sosial/susenas" },
      { label: "Sakernas", href: "/sosial/sakernas" },
      { label: "Long Form SP2020", href: "/sosial/long-form-sp2020" },
      {
        label: "Data Sosial Ekonomi Masyarakat",
        href: "/sosial/sosial-ekonomi",
      },
    ],
  },
  {
    title: "TI",
    category: "TI",
    description:
      "Sistem dan infrastruktur/alat BPS — bukan data statistik bidang tertentu, melainkan sistem nasional.",
    links: [
      { label: "INDAH — Indonesia Data Hub", href: "/ti/indah" },
      { label: "BPS WebAPI", href: "/ti/webapi" },
      { label: "MMS — Metadata Management System", href: "/ti/mms" },
      { label: "KBLI", href: "/ti/kbli" },
      { label: "KBKI", href: "/ti/kbki" },
      { label: "Geoportal BPS", href: "/ti/geoportal" },
      {
        label: "Sistem/API Internal Integrasi Data",
        href: "/ti/api-internal",
      },
      {
        label: "Sistem Autentikasi/Layanan Internal",
        href: "/ti/autentikasi",
      },
    ],
  },
  {
    title: "Umum",
    category: "Umum",
    description:
      "Administrasi, kepegawaian, pengadaan, regulasi, dan urusan internal.",
    links: [
      { label: "PPID BPS", href: "/umum/ppid" },
      { label: "JDIH BPS", href: "/umum/jdih" },
      { label: "Portal Kepegawaian", href: "/umum/kepegawaian" },
      { label: "Sistem Pengadaan / LPSE", href: "/umum/lpse" },
      { label: "Sistem Keuangan", href: "/umum/keuangan" },
      { label: "Sistem Kinerja", href: "/umum/kinerja" },
      { label: "Sistem Persuratan", href: "/umum/persuratan" },
      { label: "Sistem Arsip", href: "/umum/arsip" },
      { label: "Sistem Perjalanan Dinas", href: "/umum/perjalanan-dinas" },
      {
        label: "Sistem Administrasi Internal",
        href: "/umum/administrasi-internal",
      },
      {
        label: "Portal BPS / Informasi Kelembagaan",
        href: "/umum/portal-kelembagaan",
      },
      { label: "LAPOR! / Kanal Pengaduan", href: "/umum/lapor" },
    ],
  },
  {
    title: "Diseminasi",
    category: "Diseminasi",
    description:
      "Kategori dengan isi paling banyak — tugasnya menyebarkan data ke pengguna.",
    links: [
      {
        label: "Website BPS Kabupaten Solok Selatan",
        href: "/diseminasi/website-bps-solsel",
      },
      { label: "Website BPS RI", href: "/diseminasi/website-bps-ri" },
      { label: "AllStats BPS", href: "/diseminasi/allstats" },
      { label: "Tabel Statistik", href: "/diseminasi/tabel-statistik" },
      { label: "Tabel Dinamis", href: "/diseminasi/tabel-dinamis" },
      { label: "Publikasi", href: "/diseminasi/publikasi" },
      { label: "Berita Resmi Statistik (BRS)", href: "/diseminasi/brs" },
      { label: "Infografik", href: "/diseminasi/infografik" },
      { label: "Data Sektoral", href: "/diseminasi/data-sektoral" },
    ],
  },
];

export type QuickAccessItem = {
  label: string;
  href: string;
  logo: string;
};

// Quick Access section — logo shortcuts to frequently used external sites.
// Files live at: public/QuickAccess/<name>.png
// ⚠️ Replace these hrefs with the real destination URLs.
export const quickAccessItems: QuickAccessItem[] = [
  {
    label: "BPS Kabupaten Solok Selatan",
    href: "https://solokselatankab.bps.go.id",
    logo: "/QuickAccess/BPSSolSel.png",
  },
  {
    label: "BPS Indonesia",
    href: "https://www.bps.go.id",
    logo: "/QuickAccess/BPSIndo.png",
  },
  {
    label: "AllStats",
    href: "https://allstats.bps.go.id",
    logo: "/QuickAccess/AllStats.png",
  },
  {
    label: "SILASTIK",
    href: "#",
    logo: "/QuickAccess/SILASTIK.png",
  },
  {
    label: "PPID",
    href: "/umum/ppid",
    logo: "/QuickAccess/PPID.png",
  },
];