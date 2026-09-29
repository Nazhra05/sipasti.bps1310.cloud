import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import {
  API_BASE,
  mockKategoriData,
  mockLayananData,
  mockWebsiteData,
} from "@/test/mocks/handlers";
import { fetchKategori, fetchLayanan, fetchWebsite } from "@/lib/api";

describe("API Client Layer (src/lib/api.ts)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchKategori", () => {
    it("returns kategori items when response is successful", async () => {
      const data = await fetchKategori();
      expect(data).toEqual(mockKategoriData);
      expect(data).toHaveLength(2);
      expect(data[0].nama_kategori).toBe("Katalog Layanan");
    });

    it("sends X-API-KEY header with request", async () => {
      let apiKeyHeader: string | null = null;
      server.use(
        http.get(`${API_BASE}/kategori.php`, ({ request }) => {
          apiKeyHeader = request.headers.get("X-API-KEY");
          return HttpResponse.json({
            status: true,
            message: "Success",
            data: mockKategoriData,
          });
        })
      );

      await fetchKategori();
      expect(apiKeyHeader).toBeDefined();
    });

    it("returns empty array when API returns 500 status", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      server.use(
        http.get(`${API_BASE}/kategori.php`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const data = await fetchKategori();
      expect(data).toEqual([]);
    });

    it("returns empty array when API returns status=false", async () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      server.use(
        http.get(`${API_BASE}/kategori.php`, () => {
          return HttpResponse.json({
            status: false,
            message: "Unauthorized or missing parameter",
            data: null,
          });
        })
      );

      const data = await fetchKategori();
      expect(data).toEqual([]);
    });

    it("returns empty array on network failure", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      server.use(
        http.get(`${API_BASE}/kategori.php`, () => {
          return HttpResponse.error();
        })
      );

      const data = await fetchKategori();
      expect(data).toEqual([]);
    });
  });

  describe("fetchLayanan", () => {
    it("returns layanan items when response is successful", async () => {
      const data = await fetchLayanan();
      expect(data).toEqual(mockLayananData);
      expect(data).toHaveLength(2);
      expect(data[0].nama_layanan).toBe("Pelayanan Statistik Terpadu (PST)");
    });

    it("returns empty array on 404 response", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      server.use(
        http.get(`${API_BASE}/layanan.php`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const data = await fetchLayanan();
      expect(data).toEqual([]);
    });
  });

  describe("fetchWebsite", () => {
    it("returns website items when response is successful", async () => {
      const data = await fetchWebsite();
      expect(data).toEqual(mockWebsiteData);
      expect(data[0].links[0].label).toBe("Ekspor Impor Solsel");
    });

    it("returns empty array when data property is not an array", async () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      server.use(
        http.get(`${API_BASE}/website.php`, () => {
          return HttpResponse.json({
            status: true,
            message: "Malformed data",
            data: "string instead of array",
          });
        })
      );

      const data = await fetchWebsite();
      expect(data).toEqual([]);
    });
  });
});
