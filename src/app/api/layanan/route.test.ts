import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "./route";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

describe("GET /api/layanan (Authoritative Server-Side Route Handler)", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  const mockBackendLayanan = [
    {
      id_layanan: 1,
      id_kategori: 1,
      nama_layanan: "SIMDASI Publik",
      url: "https://simdasi.bps.go.id",
      akses: "publik",
      deskripsi_layanan: "Sistem statistik terbuka untuk umum",
    },
    {
      id_layanan: 2,
      id_kategori: 4,
      nama_layanan: "Portal Intranet Kedinasan BPS",
      url: "http://10.13.10.5/intranet",
      akses: "internal",
      vpn: "yes",
      deskripsi_layanan: "Presensi dan data kepegawaian internal",
    },
    {
      id_layanan: 3,
      id_kategori: 4,
      nama_layanan: "Sistem Administrasi Khusus",
      url: "http://192.168.1.100/admin",
      keyword: "internal kedinasan khusus",
      deskripsi_layanan: "Sistem operasional internal",
    },
  ];

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      API_BASE_URL: "http://mock-php-backend/api",
      BPS_API_KEY: "test-api-key-9999",
      SESSION_SECRET: "test-secret-key-at-least-32-chars-long",
    };

    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("layanan.php")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              status: true,
              message: "Data layanan",
              data: mockBackendLayanan,
            }),
        } as unknown as Response;
      }
      return { ok: false, status: 404, text: async () => "" } as unknown as Response;
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it("should redact internal application URLs when unauthenticated", async () => {
    const unauthenticatedRequest = new Request("http://localhost:3000/api/layanan");

    const res = await GET(unauthenticatedRequest);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);

    const simdasi = json.data.find((item: any) => item.id_layanan === 1);
    const intranet = json.data.find((item: any) => item.id_layanan === 2);
    const adminKhusus = json.data.find((item: any) => item.id_layanan === 3);

    // Public URL must remain accessible
    expect(simdasi.url).toBe("https://simdasi.bps.go.id");

    // Internal URLs MUST BE REDACTED at the endpoint ("Hiding is not a protection")
    expect(intranet.url).toBe("");
    expect(adminKhusus.url).toBe("");
  });

  it("should expose all URLs when authenticated with verified session token", async () => {
    const validToken = createSessionToken({
      userId: 42,
      username: "pegawai_bps",
      name: "Pegawai BPS Solsel",
    });

    const authenticatedRequest = new Request("http://localhost:3000/api/layanan", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${validToken}`,
      },
    });

    const res = await GET(authenticatedRequest);
    expect(res.status).toBe(200);

    const json = await res.json();
    const intranet = json.data.find((item: any) => item.id_layanan === 2);
    const adminKhusus = json.data.find((item: any) => item.id_layanan === 3);

    // Internal URLs must be fully present for authenticated user
    expect(intranet.url).toBe("http://10.13.10.5/intranet");
    expect(adminKhusus.url).toBe("http://192.168.1.100/admin");
  });

  it("should handle backend 500 error gracefully", async () => {
    global.fetch = vi.fn().mockImplementation(async () => ({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    }));

    const req = new Request("http://localhost:3000/api/layanan");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.status).toBe(false);
  });
});
