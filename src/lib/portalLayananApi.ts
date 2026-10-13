/**
 * portalLayananApi.ts
 * Client API functions for managing User's Portal Services.
 * Allows regular users to manage services they contributed to the BPS Portal catalog.
 */

import { LayananItem, safeParseJsonResponse } from "./api";

export type PortalLayananPayload = {
  nama_layanan: string;
  deskripsi_layanan: string;
  url: string;
  id_kategori: number;
  akses: "Public" | "Internal";
  vpn: "Yes" | "No";
  logo?: string;
};

export type PortalApiResponse<T = unknown> = {
  status: boolean;
  success?: boolean;
  message?: string;
  data?: T;
};

export async function fetchUserPortalServices(): Promise<LayananItem[]> {
  try {
    const res = await fetch("/api/layanan?my_services=1", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[fetchUserPortalServices] HTTP ${res.status}`);
      return [];
    }

    const json = await safeParseJsonResponse<{ status: boolean; data?: LayananItem[] }>(res);
    if (!json || !Array.isArray(json.data)) {
      return [];
    }

    return json.data;
  } catch (err) {
    console.error("[fetchUserPortalServices] Error:", err);
    return [];
  }
}

export async function createPortalLayanan(
  payload: PortalLayananPayload
): Promise<PortalApiResponse<{ id_layanan: number }>> {
  try {
    const res = await fetch("/api/layanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await safeParseJsonResponse<PortalApiResponse<{ id_layanan: number }>>(res);
    return json || { status: res.ok, message: res.ok ? "Layanan berhasil ditambahkan." : "Gagal menambahkan layanan." };
  } catch (err) {
    console.error("[createPortalLayanan] Error:", err);
    return { status: false, message: "Terjadi kesalahan jaringan saat menyimpan layanan." };
  }
}

export async function updatePortalLayanan(
  id_layanan: number,
  payload: PortalLayananPayload
): Promise<PortalApiResponse> {
  try {
    const res = await fetch(`/api/layanan?id=${encodeURIComponent(id_layanan)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await safeParseJsonResponse<PortalApiResponse>(res);
    return json || { status: res.ok, message: res.ok ? "Layanan berhasil diperbarui." : "Gagal memperbarui layanan." };
  } catch (err) {
    console.error("[updatePortalLayanan] Error:", err);
    return { status: false, message: "Terjadi kesalahan jaringan saat memperbarui layanan." };
  }
}

export async function deletePortalLayanan(
  id_layanan: number
): Promise<PortalApiResponse> {
  try {
    const res = await fetch(`/api/layanan?id=${encodeURIComponent(id_layanan)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await safeParseJsonResponse<PortalApiResponse>(res);
    return json || { status: res.ok, message: res.ok ? "Layanan berhasil dihapus." : "Gagal menghapus layanan." };
  } catch (err) {
    console.error("[deletePortalLayanan] Error:", err);
    return { status: false, message: "Terjadi kesalahan jaringan saat menghapus layanan." };
  }
}
