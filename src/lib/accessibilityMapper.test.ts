import { describe, it, expect } from "vitest";
import { enrichLayanan } from "./accessibilityMapper";
import { LayananItem } from "./api";

describe("enrichLayanan Utility Function", () => {
  const sampleCategories = new Map<number, string>([
    [1, "Kependudukan & Sosial"],
    [2, "Pertanian & Ekonomi"],
  ]);

  it("should enrich public application correctly", () => {
    const rawLayanan: LayananItem = {
      id_layanan: 10,
      nama_layanan: "Portal Web Publik BPS",
      url: "https://solselkab.bps.go.id",
      id_kategori: 1,
      deskripsi_layanan: "Website informasi publik",
    };

    const enriched = enrichLayanan(rawLayanan, sampleCategories);

    expect(enriched.category_name).toBe("Kependudukan & Sosial");
    expect(enriched.access_type).toBe("public");
    expect(enriched.requires_vpn).toBe(false);
    expect(enriched.technical_note).toContain("Akses Publik");
  });

  it("should detect VPN requirement and internal access from keyword or explicit fields", () => {
    const rawLayanan: LayananItem = {
      id_layanan: 11,
      nama_layanan: "Aplikasi SIMDASI Kedinasan",
      url: "http://10.13.10.20/simdasi",
      id_kategori: 2,
      vpn: "yes",
      deskripsi_layanan: "Aplikasi khusus via VPN",
    };

    const enriched = enrichLayanan(rawLayanan, sampleCategories);

    expect(enriched.category_name).toBe("Pertanian & Ekonomi");
    expect(enriched.access_type).toBe("internal");
    expect(enriched.requires_vpn).toBe(true);
    expect(enriched.technical_note).toContain("VPN");
  });
});
