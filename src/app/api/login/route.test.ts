import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";

describe("POST /api/login (App B Proxy Route Handler)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should return 400 Bad Request when request body is empty or invalid JSON", async () => {
    const req = new Request("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.status).toBe(false);
    expect(data.message).toContain("Identity");
  });

  it("should securely inject X-API-KEY and forward payload to backend App A", async () => {
    const mockBackendResponse = {
      status: true,
      message: "Login Berhasil",
      data: { id: "101", nama: "Test User", role: "admin" },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => mockBackendResponse,
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const req = new Request("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({
        identity: "bps_test_user",
        password: "secure_password_123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    // Verify proxy forwarded to auth/loginPortal.php
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [
      string,
      { headers: Record<string, string>; method: string; body?: string }
    ];
    expect(url).toContain("/auth/loginPortal.php");
    expect(options.method).toBe("POST");
    expect(options.headers?.["X-API-KEY"]).toBeDefined();
    const parsedBody = JSON.parse(options.body || "{}");
    expect(parsedBody.identity).toBe("bps_test_user");
    expect(parsedBody.password).toBe("secure_password_123");
    // Ensure no client-side hashing occurs in Next.js
    expect(parsedBody.password_sha256).toBeUndefined();
    expect(parsedBody.password_md5).toBeUndefined();

    // Verify response status and payload
    expect(res.status).toBe(200);
    expect(data.status).toBe(true);
    expect(data.data.nama).toBe("Test User");

    // Verify session cookie is set with an unguessable signed token, not fixed 'true'
    const setCookie = res.headers.get("set-cookie") || "";
    expect(setCookie).toContain("bps_solsel_session=");
    expect(setCookie).not.toContain("bps_solsel_session=true");
  });

  it("should handle backend 502 error gracefully when response is unparseable", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const req = new Request("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({
        identity: "user@bps.go.id",
        password: "password",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.status).toBe(false);
    expect(data.message).toContain("Layanan sedang tidak dapat diakses");
  });
});
