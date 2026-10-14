import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "./route";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

let mockCookieValue: string | undefined = undefined;

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      mockCookieValue !== undefined && name === "bps_solsel_session"
        ? { value: mockCookieValue }
        : undefined,
  }),
}));

describe("GET /api/auth/me (Session Verification Route Handler)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockCookieValue = undefined;
    process.env = { ...originalEnv, SESSION_SECRET: "test-auth-me-secret-key-12345" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return 401 unauthenticated when no session cookie is provided", async () => {
    mockCookieValue = undefined;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.authenticated).toBe(false);
    expect(data.user).toBeNull();
  });

  it("should return 401 when attacker sets fake cookie 'true' in DevTools", async () => {
    mockCookieValue = "true";

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.authenticated).toBe(false);
    expect(data.user).toBeNull();
  });

  it("should return 200 authenticated when valid signed token is present", async () => {
    const validToken = createSessionToken({
      userId: 77,
      username: "pegawai_solsel",
      name: "Budi Santoso",
      email: "budi@bps.go.id",
      role: "admin",
    });

    mockCookieValue = validToken;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.authenticated).toBe(true);
    expect(data.user.id_admin).toBe(77);
    expect(data.user.username).toBe("pegawai_solsel");
    expect(data.user.name).toBe("Budi Santoso");
    expect(data.user.role).toBe("admin");
  });

  it("should return 401 and expire session cookie when backend App A reports account is deactivated", async () => {
    process.env.CHECK_REMOTE_SESSION = "true";

    const validToken = createSessionToken({
      userId: 88,
      username: "revoked_user",
      name: "Revoked Officer",
      email: "revoked@bps.go.id",
      role: "pegawai",
    });

    mockCookieValue = validToken;

    // Mock fetch to simulate App A reporting active: false
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { active: false },
      }),
    }) as unknown as typeof fetch;

    try {
      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.authenticated).toBe(false);
      expect(data.message).toContain("dinonaktifkan");

      // Verify cookie is expired
      const setCookie = res.headers.get("set-cookie") || "";
      expect(setCookie).toContain("bps_solsel_session=;");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("should return 401 and expire session cookie when backend App A reports revoked: true", async () => {
    process.env.CHECK_REMOTE_SESSION = "true";

    const validToken = createSessionToken({
      userId: 89,
      username: "revoked_flag_user",
      name: "Revoked Flag Officer",
      email: "revoked2@bps.go.id",
      role: "pegawai",
    });

    mockCookieValue = validToken;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { revoked: true, valid: false },
      }),
    }) as unknown as typeof fetch;

    try {
      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.authenticated).toBe(false);
      expect(data.message).toContain("dinonaktifkan");

      const setCookie = res.headers.get("set-cookie") || "";
      expect(setCookie).toContain("bps_solsel_session=;");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

