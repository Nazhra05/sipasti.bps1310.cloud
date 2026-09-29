/**
 * api.ts
 * Fungsi fetch ke backend PHP.
 * GET layanan & kategori tidak memerlukan API key.
 *
 * All fetch functions return empty arrays on failure
 * so the page always renders (graceful degradation).
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://administators.bps1310.cloud/api";

const API_KEY =
  process.env.BPS_API_KEY ??
  process.env.NEXT_PUBLIC_API_KEY ??
  "";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type KategoriItem = {
  id_kategori: number;
  nama_kategori: string;
  deskripsi: string;
};

export type LayananItem = {
  id_layanan: number;
  id_kategori: number;
  nama_layanan: string;
  url: string;
  logo: string;
  nama_kategori: string;
};

export type WebsiteLink = {
  id_layanan: number;
  label: string;
  href: string;
  logo: string;
};

export type WebsiteCategory = {
  title: string;
  category: string;
  description: string;
  links: WebsiteLink[];
};

type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T | null;
};

// ─────────────────────────────────────────────
// GENERIC SAFE FETCHER
// ─────────────────────────────────────────────

async function safeFetch<T>(endpoint: string, label: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // cache 5 menit, ISR-friendly
    });

    if (!res.ok) {
      console.error(`[API] ${label}: HTTP ${res.status} ${res.statusText}`);
      return [];
    }

    const json: ApiResponse<T[]> = await res.json();

    if (!json.status || !Array.isArray(json.data)) {
      console.warn(`[API] ${label}: status=${json.status}, message="${json.message}"`);
      return [];
    }

    return json.data;
  } catch (err) {
    console.error(`[API] ${label}: Network/parse error —`, err instanceof Error ? err.message : err);
    return [];
  }
}

// ─────────────────────────────────────────────
// FETCH KATEGORI
// ─────────────────────────────────────────────

export async function fetchKategori(): Promise<KategoriItem[]> {
  return safeFetch<KategoriItem>("kategori.php", "fetchKategori");
}

// ─────────────────────────────────────────────
// FETCH LAYANAN
// ─────────────────────────────────────────────

export async function fetchLayanan(): Promise<LayananItem[]> {
  return safeFetch<LayananItem>("layanan.php", "fetchLayanan");
}

// ─────────────────────────────────────────────
// FETCH WEBSITE (untuk search)
// ─────────────────────────────────────────────

export async function fetchWebsite(): Promise<WebsiteCategory[]> {
  return safeFetch<WebsiteCategory>("website.php", "fetchWebsite");
}
