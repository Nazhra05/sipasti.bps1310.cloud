import { LayananItem, KategoriItem } from "./api";

export type AccessType = "public" | "internal";

export interface EnrichedLayanan extends LayananItem {
  access_type: AccessType;
  requires_vpn: boolean;
  technical_note: string;
  category_name: string;
}

/**
 * Mapper presentasi UI untuk aksesibilitas dan catatan teknis.
 * Jika nantinya database menambahkan kolom `akses` dan `catatan`,
 * fungsi ini akan langsung memprioritaskan data dari API tersebut.
 */
export function enrichLayanan(
  item: LayananItem,
  kategoriMap: Map<number, string>
): EnrichedLayanan {
  // 1. Tentukan Kategori
  const categoryName =
    item.nama_kategori ||
    kategoriMap.get(item.id_kategori) ||
    "Umum";

  // 2. Evaluasi Status VPN dari API (yes/no/1/0/true/false/ya/tidak)
  let requiresVpn = false;
  const rawVpn = item.vpn ?? item.is_vpn ?? item.requires_vpn ?? item.akses_vpn;

  if (rawVpn !== undefined && rawVpn !== null) {
    if (typeof rawVpn === "boolean") {
      requiresVpn = rawVpn;
    } else if (typeof rawVpn === "number") {
      requiresVpn = rawVpn === 1;
    } else if (typeof rawVpn === "string") {
      const v = rawVpn.toLowerCase().trim();
      requiresVpn = v === "yes" || v === "ya" || v === "1" || v === "true" || v === "wajib";
    }
  } else if (item.akses) {
    const rawAkses = item.akses.toLowerCase().trim();
    requiresVpn = rawAkses.includes("vpn");
  } else {
    const checkString = `${item.nama_layanan} ${item.url} ${item.keyword ?? ""} ${item.deskripsi_layanan ?? ""}`.toLowerCase();
    requiresVpn = checkString.includes("vpn");
  }

  // 3. Evaluasi Aksesibilitas (Internal vs Publik)
  let accessType: AccessType = "public";
  if (item.akses) {
    const rawAkses = item.akses.toLowerCase().trim();
    if (rawAkses.includes("internal") || rawAkses.includes("vpn") || rawAkses.includes("terbatas")) {
      accessType = "internal";
    } else {
      accessType = "public";
    }
  } else {
    const checkString = `${item.nama_layanan} ${item.url} ${item.keyword ?? ""} ${item.deskripsi_layanan ?? ""}`.toLowerCase();
    if (
      requiresVpn ||
      checkString.includes("intranet") ||
      checkString.includes("internal") ||
      checkString.includes("kedinasan")
    ) {
      accessType = "internal";
    } else {
      accessType = "public";
    }
  }

  // 3. Catatan Teknis Ringkas
  let technicalNote = item.catatan || "";
  if (!technicalNote) {
    if (requiresVpn) {
      technicalNote = "butuh penggunaan VPN BPS untuk mengakses";
    } else if (accessType === "internal") {
      technicalNote = "Akses Internal: Khusus penggunaan kedinasan pegawai dan operasional internal BPS.";
    } else {
      technicalNote = "Akses Publik: Dapat diakses langsung melalui internet dari browser tanpa VPN.";
    }
  }

  return {
    ...item,
    access_type: accessType,
    requires_vpn: requiresVpn,
    technical_note: technicalNote,
    category_name: categoryName,
  };
}
