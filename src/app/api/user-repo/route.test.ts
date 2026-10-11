import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET, POST } from "./route";
import { createSessionToken } from "@/lib/session";

let mockCookieValue: string | undefined = undefined;

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      mockCookieValue !== undefined && name === "bps_solsel_session"
        ? { value: mockCookieValue }
        : undefined,
  }),
}));

describe("User Repository Proxy Route Handlers (/api/user-repo)", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockCookieValue = undefined;
    process.env = {
      ...originalEnv,
      SESSION_SECRET: "test-user-repo-secret-key-12345",
      BPS_API_KEY: "test-bps-api-key",
      API_BASE_URL: "http://mock-backend/api",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should return 401 on GET when not authenticated", async () => {
    mockCookieValue = undefined;
    const req = new Request("http://localhost:3000/api/user-repo?action=get_all");
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("should return 401 on POST when not authenticated", async () => {
    mockCookieValue = undefined;
    const req = new Request("http://localhost:3000/api/user-repo", {
      method: "POST",
      body: JSON.stringify({ action: "toggle_favorite", id_layanan: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("should forward GET request with X-API-KEY and X-User-Id when user is authenticated", async () => {
    const validToken = createSessionToken({
      userId: 42,
      username: "pegawai_bps",
      name: "Budi",
      email: "budi@bps1310.cloud",
      role: "USER",
    });
    mockCookieValue = validToken;

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () =>
        JSON.stringify({
          success: true,
          data: {
            counts: { favorite: 1, website: 2, data: 0, mobile_app: 0, drive: 0, photo: 0, other: 0 },
            favorites: [],
            links: [],
          },
        }),
    } as any);

    const req = new Request("http://localhost:3000/api/user-repo?action=get_all");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.counts.favorite).toBe(1);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("user_repo.php?action=get_all"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-API-KEY": "test-bps-api-key",
          "X-User-Id": "42",
        }),
      })
    );
  });

  it("should forward POST mutation request with X-API-KEY and verified userId in body", async () => {
    const validToken = createSessionToken({
      userId: 42,
      username: "pegawai_bps",
      name: "Budi",
      email: "budi@bps1310.cloud",
      role: "USER",
    });
    mockCookieValue = validToken;

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () =>
        JSON.stringify({
          success: true,
          is_favorite: true,
          message: "Layanan berhasil ditambahkan ke Favorite!",
        }),
    } as any);

    const req = new Request("http://localhost:3000/api/user-repo", {
      method: "POST",
      body: JSON.stringify({ action: "toggle_favorite", id_layanan: 12 }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.is_favorite).toBe(true);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("user_repo.php"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-API-KEY": "test-bps-api-key",
          "X-User-Id": "42",
        }),
        body: JSON.stringify({
          action: "toggle_favorite",
          id_layanan: 12,
          user_id: 42,
        }),
      })
    );
  });
});
