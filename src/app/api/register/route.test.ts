import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";

describe("POST /api/register (App B Proxy Route Handler)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should return 400 Bad Request when required fields are missing", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: "",
        username: "budi",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.status).toBe(false);
    expect(data.message).toContain("wajib diisi");
  });

  it("should return 400 Bad Request when password confirmation does not match", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: "Budi",
        username: "budi.santoso",
        email: "budi@bps.go.id",
        password: "Password123#",
        confirm_password: "DifferentPassword#",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.status).toBe(false);
    expect(data.message).toContain("tidak cocok");
  });

  it("should forward valid registration payload to PHP backend with X-API-KEY", async () => {
    const mockBackendResponse = {
      status: true,
      message: "Pendaftaran akun berhasil!",
      data: { id_admin: 120, username: "budi.santoso", role: "USER", status: "pending" },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      status: 201,
      json: async () => mockBackendResponse,
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: "Budi",
        last_name: "Santoso",
        username: "budi.santoso",
        email: "budi@bps.go.id",
        password: "Password123#",
        confirm_password: "Password123#",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [
      string,
      { headers: Record<string, string>; method: string; body?: string }
    ];

    expect(url).toContain("/auth/registerPortal.php");
    expect(options.method).toBe("POST");
    expect(options.headers["X-API-KEY"]).toBeDefined();

    expect(res.status).toBe(201);
    expect(data.status).toBe(true);
    expect(data.data.username).toBe("budi.santoso");
  });

  it("should handle backend 502 error gracefully when response is unparseable", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 502,
      json: async () => {
        throw new Error("Invalid JSON HTML");
      },
      text: async () => "<html>502 Bad Gateway</html>",
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: "Budi",
        username: "budi.santoso",
        email: "budi@bps.go.id",
        password: "Password123#",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.status).toBe(false);
  });
});
