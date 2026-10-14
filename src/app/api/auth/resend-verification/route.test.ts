import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "./route";

describe("GET /api/auth/resend-verification", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      API_BASE_URL: "http://localhost/Dashboard_Admin/public/api",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("1. mengalihkan ke resend_verification.php dengan query email yang sesuai", async () => {
    const req = new Request("http://localhost:3000/api/auth/resend-verification?email=pegawai@bps.go.id");
    const res = await GET(req);

    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toBe("http://localhost/Dashboard_Admin/public/resend_verification.php?email=pegawai%40bps.go.id");
  });

  it("2. mengalihkan ke resend_verification.php tanpa parameter ketika email kosong", async () => {
    const req = new Request("http://localhost:3000/api/auth/resend-verification");
    const res = await GET(req);

    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toBe("http://localhost/Dashboard_Admin/public/resend_verification.php");
  });
});
