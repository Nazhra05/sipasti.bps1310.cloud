/**
 * api.ts
 * Client & Server API functions for fetching kategori, layanan, website, and authentication.
 * Uses internal Next.js proxy routes (/api/*) on client-side to prevent CORS issues.
 */

import { getApiConfig } from "./serverApiConfig";

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
  logo?: string;
  nama_kategori?: string;
  deskripsi_layanan?: string;
  keyword?: string;
  akses?: string;
  vpn?: string | number | boolean;
  is_vpn?: string | number | boolean;
  requires_vpn?: string | number | boolean;
  akses_vpn?: string | number | boolean;
  catatan?: string;
  is_active?: number | string | boolean;
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
  [key: string]: any;
};

export type ApiResponse<T> = {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data: T | null;
  meta?: ApiMeta;
};

export type PaginatedResult<T> = {
  data: T[];
  meta?: ApiMeta;
};

// ─────────────────────────────────────────────
// SAFE JSON PARSER HELPER
// Prevents "Unexpected token < in JSON" crashes when server returns HTML/500 pages
// ─────────────────────────────────────────────

export async function safeParseJsonResponse<T>(res: Response): Promise<T | null> {
  try {
    if (typeof res.text === "function") {
      const rawText = await res.text();
      if (!rawText || !rawText.trim()) return null;

      // Check if the response is HTML error page (begins with < or <!DOCTYPE)
      if (rawText.trim().startsWith("<")) {
        console.warn("[API] Server returned HTML page instead of JSON. Status:", res.status);
        return null;
      }

      return JSON.parse(rawText) as T;
    }

    if (typeof res.json === "function") {
      return (await res.json()) as T;
    }

    return null;
  } catch (err) {
    console.warn("[API] Failed to parse JSON response:", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// GENERIC SAFE FETCHER (ARRAY)
// Delegated directly to safeFetchPaginated for DRY, unified handling
// ─────────────────────────────────────────────

async function safeFetch<T>(endpoint: string, label: string): Promise<T[]> {
  const result = await safeFetchPaginated<T>(endpoint, label);
  return result.data;
}

// ─────────────────────────────────────────────
// GENERIC SAFE FETCHER (WITH PAGINATION META)
// ─────────────────────────────────────────────

export async function safeFetchPaginated<T>(
  endpoint: string,
  label: string
): Promise<PaginatedResult<T>> {
  try {
    const isClient = typeof window !== "undefined";
    const { API_BASE, headers: serverHeaders } = isClient
      ? { API_BASE: "", headers: {} }
      : getApiConfig();

    const targetUrl = isClient
      ? `/api/${endpoint.replace(".php", "")}`
      : `${API_BASE}/${endpoint}`;

    const headers: Record<string, string> = isClient
      ? { "Content-Type": "application/json" }
      : serverHeaders;

    const res = await fetch(targetUrl, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[API] ${label}: HTTP ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await safeParseJsonResponse<ApiResponse<T[]>>(res);

    const isSuccessful =
      Boolean(json) &&
      (json?.success === true ||
        json?.status === true ||
        json?.status === "success" ||
        json?.status === "ok");

    if (!isSuccessful || !Array.isArray(json?.data)) {
      console.warn(`[API] ${label}: Invalid or non-array payload returned.`);
      return { data: [] };
    }

    return {
      data: json.data,
      meta: json.meta,
    };
  } catch (err) {
    console.warn(`[API] ${label}: Network/fetch error —`, err instanceof Error ? err.message : err);
    return { data: [] };
  }
}

// ─────────────────────────────────────────────
// FETCHERS
// ─────────────────────────────────────────────

export async function fetchKategori(): Promise<KategoriItem[]> {
  return safeFetch<KategoriItem>("kategori.php", "fetchKategori");
}

export async function fetchLayanan(): Promise<LayananItem[]> {
  return safeFetch<LayananItem>("layanan.php", "fetchLayanan");
}

// ─────────────────────────────────────────────
// AUTHENTICATION LOGIN API
// ─────────────────────────────────────────────

export type AdminUserData = {
  id_admin: number;
  username: string;
  email: string;
  role: string;
};

export type LoginApiResponse = {
  status: boolean;
  message: string;
  data: AdminUserData | null;
};

export async function loginApi(identity: string, password: string): Promise<LoginApiResponse> {
  try {
    const isClient = typeof window !== "undefined";
    const { API_BASE, headers: serverHeaders } = isClient
      ? { API_BASE: "", headers: {} }
      : getApiConfig();

    const targetUrl = isClient ? "/api/login" : `${API_BASE}/auth/loginPortal.php`;
    const headers: Record<string, string> = isClient
      ? { "Content-Type": "application/json" }
      : serverHeaders;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ identity: identity.trim(), password }),
      cache: "no-store",
    });

    const json = await safeParseJsonResponse<LoginApiResponse>(res);

    if (!json) {
      return {
        status: false,
        message: "Layanan sedang tidak dapat diakses saat ini. Silakan coba beberapa saat lagi.",
        data: null,
      };
    }

    return json;
  } catch (err) {
    console.error("[API] loginApi error:", err);
    return {
      status: false,
      message: "Gagal memproses masuk. Periksa koneksi internet Anda dan coba lagi.",
      data: null,
    };
  }
}

export type RegisterPayload = {
  first_name: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
  confirm_password?: string;
};

export type RegisterApiResponse = {
  status: boolean;
  message: string;
  data?: {
    id_admin?: number;
    username?: string;
    email?: string;
    role?: string;
    status?: string;
  } | null;
};

export async function registerApi(payload: RegisterPayload): Promise<RegisterApiResponse> {
  try {
    const isClient = typeof window !== "undefined";
    const { API_BASE, headers: serverHeaders } = isClient
      ? { API_BASE: "", headers: {} }
      : getApiConfig();

    const targetUrl = isClient ? "/api/register" : `${API_BASE}/auth/registerPortal.php`;
    const headers: Record<string, string> = isClient
      ? { "Content-Type": "application/json" }
      : serverHeaders;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await safeParseJsonResponse<RegisterApiResponse>(res);

    if (!json) {
      return {
        status: false,
        message: "Layanan pendaftaran sedang tidak dapat diakses saat ini. Silakan coba beberapa saat lagi.",
        data: null,
      };
    }

    return json;
  } catch (err) {
    console.error("[API] registerApi error:", err);
    return {
      status: false,
      message: "Gagal memproses pendaftaran. Periksa koneksi internet Anda dan coba lagi.",
      data: null,
    };
  }
}

