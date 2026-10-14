import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "./route";
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

describe("POST /api/auth/change-password", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockCookieValue = undefined;
    process.env = { ...originalEnv, SESSION_SECRET: "test-auth-secret-12345" };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return 401 when no session cookie is provided", async () => {
    mockCookieValue = undefined;
    const req = new Request("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "pass", newPassword: "new", confirmPassword: "new" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should validate that new password must be at least 6 characters", async () => {
    mockCookieValue = createSessionToken({
      userId: 1,
      username: "admin",
      name: "Admin BPS",
      email: "admin@bps.go.id",
      role: "admin",
    });

    const req = new Request("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "oldpassword123", newPassword: "123", confirmPassword: "123" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain("minimal harus 6 karakter");
  });

  it("should validate that confirm password must match new password", async () => {
    mockCookieValue = createSessionToken({
      userId: 1,
      username: "admin",
      name: "Admin BPS",
      email: "admin@bps.go.id",
      role: "admin",
    });

    const req = new Request("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "oldpassword123", newPassword: "passwordbaru123", confirmPassword: "berbeda123" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain("tidak cocok");
  });

  it("should successfully change password when backend returns success", async () => {
    mockCookieValue = createSessionToken({
      userId: 1,
      username: "admin",
      name: "Admin BPS",
      email: "admin@bps.go.id",
      role: "admin",
    });

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ status: true, message: "Kata sandi berhasil diperbarui" }),
    } as unknown as Response);

    const req = new Request("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("berhasil diperbarui");
  });
});
