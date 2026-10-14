import { LayananItem, KategoriItem } from "./api";

export type AccessType = "public" | "internal";

export interface EnrichedLayanan extends LayananItem {
  access_type: AccessType;
  requires_vpn: boolean;
  technical_note: string;
  category_name: string;
}

/**
 * Evaluates whether a service requires BPS VPN connection based on explicit API flags,
 * access descriptions, or service metadata keywords.
 */
export function resolveRequiresVpn(item: Partial<LayananItem>): boolean {
  const rawVpn = item.vpn ?? item.is_vpn ?? item.requires_vpn ?? item.akses_vpn;

  if (rawVpn !== undefined && rawVpn !== null) {
    if (typeof rawVpn === "boolean") {
      return rawVpn;
    }
    if (typeof rawVpn === "number") {
      return rawVpn === 1;
    }
    if (typeof rawVpn === "string") {
      const v = rawVpn.toLowerCase().trim();
      return v === "yes" || v === "ya" || v === "1" || v === "true" || v === "wajib";
    }
  }

  if (item.akses) {
    return item.akses.toLowerCase().trim().includes("vpn");
  }

  const checkString = `${item.nama_layanan ?? ""} ${item.url ?? ""} ${item.keyword ?? ""} ${item.deskripsi_layanan ?? ""}`.toLowerCase();
  return checkString.includes("vpn");
}

/**
 * Canonical check whether a service is restricted/internal.
 * Used both in server-side API proxy route (authoritative redaction)
 * and client-side UI mapping.
 */
export function isInternalLayanan(item: Partial<LayananItem>): boolean {
  const requiresVpn = resolveRequiresVpn(item);

  if (item.akses) {
    const rawAkses = item.akses.toLowerCase().trim();
    return rawAkses.includes("internal") || rawAkses.includes("vpn") || rawAkses.includes("terbatas");
  }

  const checkString = `${item.nama_layanan ?? ""} ${item.url ?? ""} ${item.keyword ?? ""} ${item.deskripsi_layanan ?? ""}`.toLowerCase();
  return (
    requiresVpn ||
    checkString.includes("intranet") ||
    checkString.includes("internal") ||
    checkString.includes("kedinasan")
  );
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

  // 2. Evaluasi Status VPN dari API
  const requiresVpn = resolveRequiresVpn(item);

  // 3. Evaluasi Aksesibilitas (Internal vs Publik)
  const isInternal = isInternalLayanan(item);
  const accessType: AccessType = isInternal ? "internal" : "public";

  // 4. Catatan Teknis / Keterangan Akses Ringkas
  let technicalNote = item.catatan || "";
  if (!technicalNote) {
    if (requiresVpn) {
      technicalNote = "Akses Internal: butuh penggunaan VPN BPS untuk mengakses";
    } else if (accessType === "internal") {
      technicalNote = "Akses Internal: dapat diakses langsung tanpa VPN";
    } else {
      technicalNote = "Akses Publik: dapat diakses langsung tanpa VPN";
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
