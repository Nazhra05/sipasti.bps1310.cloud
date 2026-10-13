import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET, POST, PUT, DELETE } from "./route";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

describe("Route Handlers /api/layanan", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  const mockBackendLayanan = [
    {
      id_layanan: 1,
      id_kategori: 1,
      created_by: 1,
      nama_layanan: "SIMDASI Publik",
      url: "https://simdasi.bps.go.id",
      akses: "publik",
      deskripsi_layanan: "Sistem statistik terbuka untuk umum",
    },
    {
      id_layanan: 2,
      id_kategori: 4,
      created_by: 42,
      nama_layanan: "Portal Intranet Kedinasan BPS",
      url: "http://10.13.10.5/intranet",
      akses: "internal",
      vpn: "yes",
      deskripsi_layanan: "Presensi dan data kepegawaian internal",
    },
    {
      id_layanan: 3,
      id_kategori: 4,
      created_by: 99,
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

    global.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.includes("layanan.php")) {
        const method = init?.method || "GET";

        if (method === "GET") {
          if (url.includes("created_by=42")) {
            return {
              ok: true,
              status: 200,
              text: async () =>
                JSON.stringify({
                  status: true,
                  message: "Data layanan milik user 42",
                  data: [mockBackendLayanan[1]],
                }),
            } as unknown as Response;
          }

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

        if (method === "POST") {
          return {
            ok: true,
            status: 201,
            text: async () =>
              JSON.stringify({
                status: true,
                message: "Layanan berhasil ditambahkan",
                data: { id_layanan: 101 },
              }),
          } as unknown as Response;
        }

        if (method === "PUT") {
          return {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify({
                status: true,
                message: "Layanan berhasil diperbarui",
              }),
          } as unknown as Response;
        }

        if (method === "DELETE") {
          return {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify({
                status: true,
                message: "Layanan berhasil dihapus",
              }),
          } as unknown as Response;
        }
      }
      return { ok: false, status: 404, text: async () => "" } as unknown as Response;
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe("GET /api/layanan", () => {
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

      expect(simdasi.url).toBe("https://simdasi.bps.go.id");
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

      expect(intranet.url).toBe("http://10.13.10.5/intranet");
      expect(adminKhusus.url).toBe("http://192.168.1.100/admin");
    });

    it("should handle my_services=1 filter correctly", async () => {
      const validToken = createSessionToken({
        userId: 42,
        username: "pegawai_bps",
      });

      const req = new Request("http://localhost:3000/api/layanan?my_services=1", {
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${validToken}`,
        },
      });

      const res = await GET(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.length).toBe(1);
      expect(json.data[0].id_layanan).toBe(2);
    });

    it("should reject my_services=1 with 401 when unauthenticated", async () => {
      const req = new Request("http://localhost:3000/api/layanan?my_services=1");
      const res = await GET(req);
      expect(res.status).toBe(401);
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

  describe("POST /api/layanan", () => {
    it("should reject unauthenticated caller with 401", async () => {
      const req = new Request("http://localhost:3000/api/layanan", {
        method: "POST",
        body: JSON.stringify({ nama_layanan: "Test" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("should inject session userId as created_by and call backend", async () => {
      const validToken = createSessionToken({ userId: 42, username: "pegawai_bps" });
      const req = new Request("http://localhost:3000/api/layanan", {
        method: "POST",
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${validToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_layanan: "Layanan Baru",
          url: "https://baru.bps.go.id",
          id_kategori: 1,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.status).toBe(true);
      expect(json.data.id_layanan).toBe(101);
    });
  });

  describe("PUT /api/layanan", () => {
    it("should reject unauthenticated caller with 401", async () => {
      const req = new Request("http://localhost:3000/api/layanan?id=2", {
        method: "PUT",
        body: JSON.stringify({ nama_layanan: "Updated" }),
      });
      const res = await PUT(req);
      expect(res.status).toBe(401);
    });

    it("should forward user_id and succeed when authenticated", async () => {
      const validToken = createSessionToken({ userId: 42, username: "pegawai_bps" });
      const req = new Request("http://localhost:3000/api/layanan?id=2", {
        method: "PUT",
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${validToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama_layanan: "Updated" }),
      });

      const res = await PUT(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe(true);
    });
  });

  describe("DELETE /api/layanan", () => {
    it("should reject unauthenticated caller with 401", async () => {
      const req = new Request("http://localhost:3000/api/layanan?id=2", {
        method: "DELETE",
      });
      const res = await DELETE(req);
      expect(res.status).toBe(401);
    });

    it("should succeed when authenticated", async () => {
      const validToken = createSessionToken({ userId: 42, username: "pegawai_bps" });
      const req = new Request("http://localhost:3000/api/layanan?id=2", {
        method: "DELETE",
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${validToken}`,
        },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe(true);
    });
  });
});
