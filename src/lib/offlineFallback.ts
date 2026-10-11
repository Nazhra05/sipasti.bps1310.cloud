import { KategoriItem, LayananItem } from "./api";

export const PORTAL_CACHE_KEY = "bps_solsel_portal_cache_v1";

export interface PortalCacheData {
  categories: KategoriItem[];
  layanan: LayananItem[];
  cachedAt: string; // ISO 8601 timestamp
  isSnapshot?: boolean;
}

/**
 * Built-in static snapshot data used as a last-resort fallback
 * if backend is down and user has never visited the portal before.
 */
export const SNAPSHOT_CATEGORIES: KategoriItem[] = [
  { id_kategori: 1, nama_kategori: "Kependudukan & Sosial", deskripsi: "Layanan statistik kependudukan dan sosial" },
  { id_kategori: 2, nama_kategori: "Pertanian & Perkebunan", deskripsi: "Layanan statistik pertanian dan komoditas pangan" },
  { id_kategori: 3, nama_kategori: "Ekonomi & Moneter", deskripsi: "Layanan data PDRB, inflasi, dan keuangan daerah" },
  { id_kategori: 4, nama_kategori: "Umum & Kedinasan", deskripsi: "Aplikasi administrasi internal BPS Kabupaten Solok Selatan" },
];

export const SNAPSHOT_LAYANAN: LayananItem[] = [
  {
    id_layanan: 101,
    id_kategori: 1,
    nama_layanan: "Sistem Informasi Manajemen Data Statistik Terpadu (SIMDASI)",
    url: "https://simdasi.bps.go.id",
    nama_kategori: "Kependudukan & Sosial",
    deskripsi_layanan: "Kompilasi tabel statistik daerah dan integrasi indikator sektoral",
    keyword: "simdasi kompilasi data publikasi dda",
    akses: "publik",
    is_active: 1,
  },
  {
    id_layanan: 102,
    id_kategori: 4,
    nama_layanan: "Portal Intranet Pegawai & Presensi Kedinasan",
    url: "",
    nama_kategori: "Umum & Kedinasan",
    deskripsi_layanan: "Sistem administrasi kehadiran pegawai BPS Kabupaten Solok Selatan",
    keyword: "presensi intranet pegawai harian vpn",
    akses: "internal",
    vpn: "yes",
    is_active: 1,
  },
  {
    id_layanan: 103,
    id_kategori: 2,
    nama_layanan: "Sistem Informasi Pendataan Pertanian Terpadu",
    url: "https://pertanian.bps.go.id",
    nama_kategori: "Pertanian & Perkebunan",
    deskripsi_layanan: "Basis data ubinan, komoditas pangan, dan sensus pertanian",
    keyword: "pertanian ubinan pangan sensus",
    akses: "publik",
    is_active: 1,
  },
  {
    id_layanan: 104,
    id_kategori: 3,
    nama_layanan: "Database PDRB & Statistik Distribusi Daerah",
    url: "https://solokselatankab.bps.go.id",
    nama_kategori: "Ekonomi & Moneter",
    deskripsi_layanan: "Publikasi indikator ekonomi makro dan tabel data PDRB Solok Selatan",
    keyword: "pdrb ekonomi inflasi distribusi",
    akses: "publik",
    is_active: 1,
  },
];

export const SNAPSHOT_TIMESTAMP = "2026-10-08T00:00:00.000Z";

/**
 * Saves fresh portal categories & services into browser localStorage with timestamp.
 */
export function savePortalCache(categories: KategoriItem[], layanan: LayananItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const data: PortalCacheData = {
      categories,
      layanan,
      cachedAt: new Date().toISOString(),
      isSnapshot: false,
    };
    localStorage.setItem(PORTAL_CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[Cache] Gagal menyimpan data portal ke localStorage:", err);
  }
}

/**
 * Retrieves cached portal data from browser localStorage.
 * Falls back to built-in snapshot if cache is missing.
 */
export function getPortalCache(): PortalCacheData {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(PORTAL_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PortalCacheData;
        if (Array.isArray(parsed.categories) && Array.isArray(parsed.layanan) && parsed.cachedAt) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("[Cache] Gagal membaca data cache portal dari localStorage:", err);
    }
  }

  // Last-resort initial bundled snapshot
  return {
    categories: SNAPSHOT_CATEGORIES,
    layanan: SNAPSHOT_LAYANAN,
    cachedAt: SNAPSHOT_TIMESTAMP,
    isSnapshot: true,
  };
}

/**
 * Formats ISO 8601 timestamp to human-readable Indonesian date & time string.
 * Example output: "08 Oktober 2026, pukul 12:30 WIB"
 */
export function formatLastUpdatedDate(isoString: string | null | undefined): string {
  if (!isoString) return "Waktu tidak tercatat";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Waktu tidak tercatat";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return isoString;
  }
}

