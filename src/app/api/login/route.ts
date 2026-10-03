import { NextResponse } from "next/server";
import crypto from "crypto";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";

/**
 * Computes hash variations for legacy compatibility across different DB hashing algorithms
 * (SHA-256, MD5, SHA-1, plain text BCRYPT).
 */
function getPasswordHashes(password: string) {
  const sha256 = crypto.createHash("sha256").update(password).digest("hex");
  const md5 = crypto.createHash("md5").update(password).digest("hex");
  const sha1 = crypto.createHash("sha1").update(password).digest("hex");
  return { sha256, md5, sha1 };
}

export async function POST(request: Request) {
  const { API_BASE, headers } = getApiConfig();

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { status: false, message: "Format payload data tidak valid", data: null },
        { status: 400 }
      );
    }

    // Input Sanitization & Type Validation
    const rawIdentity = typeof body.identity === "string" ? body.identity.trim() : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";

    if (!rawIdentity || !rawPassword) {
      return NextResponse.json(
        { status: false, message: "Identity (username/email) dan kata sandi wajib diisi", data: null },
        { status: 400 }
      );
    }

    // Enforce max length safety limits
    if (rawIdentity.length > 255 || rawPassword.length > 255) {
      return NextResponse.json(
        { status: false, message: "Panjang input melebihi batas keamanan yang diizinkan", data: null },
        { status: 400 }
      );
    }

    const { sha256: sha256Pass, md5: md5Pass, sha1: sha1Pass } = getPasswordHashes(rawPassword);

    // Password variants to handle legacy database password hashing mismatch:
    // 1. Raw plain text (for password_verify BCRYPT or plain text)
    // 2. SHA-256 hex string (for legacy SHA-256 DB fields)
    // 3. MD5 hex string (for legacy MD5 DB fields)
    // 4. SHA-1 hex string (for legacy SHA-1 DB fields)
    const passwordVariants = Array.from(new Set([
      rawPassword,
      sha256Pass,
      md5Pass,
      sha1Pass,
    ]));

    let finalData: Record<string, any> | null = null;
    let finalStatus = 401;

    // Try password variants sequentially until backend authenticates successfully
    for (const passVariant of passwordVariants) {
      const res = await fetch(`${API_BASE}/auth/loginPortal.php`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          identity: rawIdentity,
          password: passVariant,
          password_raw: rawPassword,
          password_sha256: sha256Pass,
          password_md5: md5Pass,
        }),
        cache: "no-store",
      });

      const data = await safeParseJsonResponse<Record<string, any>>(res);

      if (data) {
        finalData = data;
        finalStatus = res.status;

        // If login succeeded, break out of fallback loop immediately
        if (data.status) {
          break;
        }
      }
    }

    if (!finalData) {
      return NextResponse.json(
        { status: false, message: "Respon server backend tidak valid (Bukan format JSON)", data: null },
        { status: 502 }
      );
    }

    const response = NextResponse.json(finalData, { status: finalStatus });

    // On successful login, set HTTP-Only security cookie
    if (finalData && finalData.status) {
      const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
      const isProd = process.env.NODE_ENV === "production";

      // HTTP-Only cookie protected from client JS (XSS defense)
      response.cookies.set("bps_solsel_auth_verified", "true", {
        path: "/",
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: MAX_AGE,
      });

      // User metadata cookie for UI display
      if (finalData.data) {
        response.cookies.set("bps_solsel_auth_user", JSON.stringify(finalData.data), {
          path: "/",
          httpOnly: false,
          secure: isProd,
          sameSite: "lax",
          maxAge: MAX_AGE,
        });
      }
    }

    return response;
  } catch (err) {
    console.error("[Proxy login error]:", err);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan sistem saat memproses login", data: null },
      { status: 500 }
    );
  }
}
