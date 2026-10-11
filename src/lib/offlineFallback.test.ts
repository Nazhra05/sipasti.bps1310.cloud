import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  savePortalCache,
  getPortalCache,
  PORTAL_CACHE_KEY,
  SNAPSHOT_TIMESTAMP,
  formatLastUpdatedDate,
} from "./offlineFallback";

describe("Offline Fallback Cache & Notice", () => {
  let store: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  beforeEach(() => {
    store = {};
    vi.stubGlobal("window", { localStorage: mockLocalStorage });
    vi.stubGlobal("localStorage", mockLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return built-in snapshot when cache is empty", () => {
    const cache = getPortalCache();
    expect(cache.isSnapshot).toBe(true);
    expect(cache.cachedAt).toBe(SNAPSHOT_TIMESTAMP);
    expect(cache.categories.length).toBeGreaterThan(0);
    expect(cache.layanan.length).toBeGreaterThan(0);
  });

  it("should save and retrieve fresh data with ISO timestamp", () => {
    const mockCategories = [{ id_kategori: 9, nama_kategori: "Kategori Khusus", deskripsi: "Deskripsi" }];
    const mockLayanan = [
      {
        id_layanan: 99,
        id_kategori: 9,
        nama_layanan: "Layanan Khusus",
        url: "https://khusus.bps.go.id",
      },
    ];

    savePortalCache(mockCategories, mockLayanan);

    const cache = getPortalCache();
    expect(cache.isSnapshot).toBe(false);
    expect(cache.categories[0].nama_kategori).toBe("Kategori Khusus");
    expect(cache.layanan[0].nama_layanan).toBe("Layanan Khusus");
    expect(new Date(cache.cachedAt).getTime()).not.toBeNaN();
  });

  it("should format ISO timestamp correctly into Indonesian format", () => {
    const formatted = formatLastUpdatedDate("2026-10-08T12:30:00.000Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("Oktober");

    expect(formatLastUpdatedDate(null)).toBe("Waktu tidak tercatat");
    expect(formatLastUpdatedDate("invalid-date")).toBe("Waktu tidak tercatat");
  });
});
