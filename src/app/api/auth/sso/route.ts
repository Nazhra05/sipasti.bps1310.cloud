import { NextResponse } from "next/server";
import crypto from "crypto";
import { authenticateRouteHandler } from "@/lib/session";

const ALLOWED_TARGETS = [
  "layanan.php",
  "index.php",
  "tambah_layanan.php",
  "repositori_private.php",
  "kategori.php",
  "pengaturan.php",
];

/**
 * Single Sign-On (SSO) Bridge Route Handler
 * 
 * Menghubungkan sesi autentikasi Next.js (landingpageintra) ke dashboard PHP (Dashboard_Admin).
 * Menghasilkan token SSO bertanda tangan kriptografis HMAC-SHA256 berumur pendek (60 detik)
 * agar pengguna masuk dengan identitas akun aktif yang tepat (USER / ADMIN),
 * sekaligus membersihkan sesi admin lama yang mungkin menempel di browser.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawTarget = url.searchParams.get("target") || "layanan.php";

  // Sanitize target against allowlist
  const target = ALLOWED_TARGETS.includes(rawTarget) ? rawTarget : "layanan.php";

  // Autentikasi sesi aktif pengguna secara otoritatif dari cookie HTTP-Only
  const session = await authenticateRouteHandler(request);

  if (!session) {
    // Pengguna belum login pada landing page: alihkan ke form login portal
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `/api/auth/sso?target=${encodeURIComponent(target)}`);
    loginUrl.searchParams.set("error", "auth_required");
    loginUrl.searchParams.set(
      "message",
      target === "layanan.php"
        ? "Silakan masuk ke akun Anda terlebih dahulu untuk menambah layanan."
        : "Silakan masuk ke akun Anda terlebih dahulu untuk mengakses dashboard."
    );
    return NextResponse.redirect(loginUrl);
  }

  // Buat SSO exchange token berumur pendek (60 detik)
  const now = Math.floor(Date.now() / 1000);
  const secret = process.env.SESSION_SECRET || process.env.BPS_API_KEY || "";

  const ssoPayload = {
    userId: session.userId,
    username: session.username,
    name: session.name,
    role: session.role || "USER",
    target,
    iat: now,
    exp: now + 60,
    nonce: crypto.randomUUID(),
  };

  const payloadB64 = Buffer.from(JSON.stringify(ssoPayload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const token = `${payloadB64}.${signature}`;

  // Tentukan URL publik Dashboard_Admin
  const apiBase = process.env.API_BASE_URL || "http://localhost/Dashboard_Admin/public/api";
  const publicBase = apiBase.replace(/\/api\/?$/, "");

  const ssoTargetUrl = new URL(`${publicBase}/sso.php`);
  ssoTargetUrl.searchParams.set("token", token);
  ssoTargetUrl.searchParams.set("target", target);

  return NextResponse.redirect(ssoTargetUrl.toString(), 302);
}
