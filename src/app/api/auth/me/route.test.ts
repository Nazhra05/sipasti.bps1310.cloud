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
});
