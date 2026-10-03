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
// GENERIC SAFE FETCHER
// ─────────────────────────────────────────────

async function safeFetch<T>(endpoint: string, label: string): Promise<T[]> {
  try {
    const isClient = typeof window !== "undefined";
    const { API_BASE, headers: serverHeaders } = getApiConfig();

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
      return [];
    }

    const json = await safeParseJsonResponse<ApiResponse<T[]>>(res);

    if (!json || !json.status || !Array.isArray(json.data)) {
      console.warn(`[API] ${label}: Invalid or non-array payload returned.`);
      return [];
    }

    return json.data;
  } catch (err) {
    console.warn(`[API] ${label}: Network/fetch error —`, err instanceof Error ? err.message : err);
    return [];
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

export async function fetchWebsite(): Promise<WebsiteCategory[]> {
  return safeFetch<WebsiteCategory>("website.php", "fetchWebsite");
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
    const { API_BASE, headers: serverHeaders } = getApiConfig();

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
        message: "Server backend mengembalikan respon tidak valid. Silakan coba beberapa saat lagi.",
        data: null,
      };
    }

    return json;
  } catch (err) {
    console.error("[API] loginApi error:", err);
    return {
      status: false,
      message: err instanceof Error ? err.message : "Terjadi kesalahan jaringan atau server saat login.",
      data: null,
    };
  }
}
