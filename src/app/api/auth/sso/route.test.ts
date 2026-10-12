import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "./route";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import crypto from "crypto";

describe("GET /api/auth/sso (Single Sign-On Bridge Route)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      SESSION_SECRET: "Hashtag_1310SolokSelatan_PortalInternal_dan_DashboardAdmin_V1_BPSSolokSelatan_KotoTinggi",
      BPS_API_KEY: "Hashtag_1310SolokSelatan_PortalInternal_dan_DashboardAdmin_V1_BPSSolokSelatan_KotoTinggi",
      API_BASE_URL: "http://localhost/Dashboard_Admin/public/api",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("1. mengalihkan ke /login ketika pengguna belum memiliki sesi autentikasi", async () => {
    const req = new Request("http://localhost:3000/api/auth/sso?target=layanan.php", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(307); // NextResponse.redirect default or 302/307
    const location = res.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("error=auth_required");
    expect(location).toContain("redirect=");
  });

  it("2. mengalihkan ke sso.php di Dashboard_Admin dengan token bertanda tangan valid jika pengguna login sebagai USER", async () => {
    const userSession = createSessionToken({
      userId: 5,
      username: "user_pegawai",
      name: "Budi Pegawai",
      role: "USER",
    });

    const req = new Request("http://localhost:3000/api/auth/sso?target=layanan.php", {
      method: "GET",
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${userSession}`,
      },
    });

    const res = await GET(req);
    expect([302, 307]).toContain(res.status);
    const location = res.headers.get("location");
    expect(location).toBeDefined();

    const redirectUrl = new URL(location!);
    expect(redirectUrl.pathname).toBe("/Dashboard_Admin/public/sso.php");
    expect(redirectUrl.searchParams.get("target")).toBe("layanan.php");

    const token = redirectUrl.searchParams.get("token");
    expect(token).toBeDefined();

    const [payloadB64, signature] = token!.split(".");
    expect(payloadB64).toBeDefined();
    expect(signature).toBeDefined();

    // Verifikasi signature token SSO
    const secret = process.env.SESSION_SECRET!;
    const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
    expect(signature).toBe(expectedSig);

    // Verifikasi isi payload SSO
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    expect(payload.userId).toBe(5);
    expect(payload.username).toBe("user_pegawai");
    expect(payload.role).toBe("USER");
    expect(payload.target).toBe("layanan.php");
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("3. mendefaultkan target ke layanan.php jika target yang diminta tidak ada dalam allowlist", async () => {
    const adminSession = createSessionToken({
      userId: 1,
      username: "admin",
      role: "ADMIN",
    });

    const req = new Request("http://localhost:3000/api/auth/sso?target=evil_hacker_script.php", {
      method: "GET",
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${adminSession}`,
      },
    });

    const res = await GET(req);
    const location = res.headers.get("location");
    const redirectUrl = new URL(location!);
    expect(redirectUrl.searchParams.get("target")).toBe("layanan.php");
  });
});
