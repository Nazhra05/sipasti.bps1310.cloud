import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { safeFetchPaginated, loginApi, registerApi } from "./api";

describe("api.ts Client vs Server Configuration Isolation", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "production",
      BPS_API_KEY: undefined, // Simulates browser bundle where server-side secret is absent
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should safely call internal Next.js proxy route from client without throwing BPS_API_KEY error", async () => {
    // Mock browser window environment
    vi.stubGlobal("window", {});

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          status: true,
          success: true,
          data: [{ id_layanan: 1, nama_layanan: "ROMANTIK", url: "https://romantik.bps.go.id" }],
        }),
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const result = await safeFetchPaginated<{ id_layanan: number; nama_layanan: string; url: string }>(
      "layanan.php",
      "testFetch"
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].nama_layanan).toBe("ROMANTIK");

    // Verify it routed to internal client proxy instead of PHP backend directly
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/layanan",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      })
    );

    vi.unstubAllGlobals();
  });

  it("should safely call /api/login from client without requiring server BPS_API_KEY", async () => {
    vi.stubGlobal("window", {});

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          status: true,
          message: "Login berhasil",
          data: { id_admin: 10, username: "admin_test", email: "admin@bps.go.id", role: "ADMIN" },
        }),
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const res = await loginApi("admin_test", "Secret123!");

    expect(res.status).toBe(true);
    expect(res.data?.username).toBe("admin_test");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/login",
      expect.objectContaining({
        method: "POST",
      })
    );

    vi.unstubAllGlobals();
  });

  it("should safely call /api/register from client without requiring server BPS_API_KEY", async () => {
    vi.stubGlobal("window", {});

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () =>
        JSON.stringify({
          status: true,
          message: "Pendaftaran berhasil",
          data: { id_admin: 11, username: "new_officer" },
        }),
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const res = await registerApi({
      first_name: "Budi",
      username: "new_officer",
      email: "budi@bps.go.id",
      password: "Password123!",
    });

    expect(res.status).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/register",
      expect.objectContaining({
        method: "POST",
      })
    );

    vi.unstubAllGlobals();
  });
});
