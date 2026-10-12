import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimit";

export async function POST(request: Request) {
  const { API_BASE, headers } = getApiConfig();
  const clientIp = getClientIp(request);
  const rateLimitKey = `login:${clientIp}`;

  // Rate Limiting Check (Max 5 failed attempts per minute)
  const rateCheck = checkRateLimit(rateLimitKey, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        status: false,
        message: `Terlalu banyak percobaan login yang gagal. Silakan coba kembali dalam ${rateCheck.retryAfterSeconds} detik.`,
        data: null,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Format payload data tidak valid", data: null },
        { status: 400 }
      );
    }

    // Input Sanitization & Type Validation
    const rawIdentity = typeof body.identity === "string" ? body.identity.trim() : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";

    if (!rawIdentity || !rawPassword) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Identity (username/email) dan kata sandi wajib diisi", data: null },
        { status: 400 }
      );
    }

    // Enforce max length safety limits
    if (rawIdentity.length > 255 || rawPassword.length > 255) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Panjang input melebihi batas keamanan yang diizinkan", data: null },
        { status: 400 }
      );
    }

    // Forward credentials cleanly to PHP backend (App A) for native password_verify()
    // and transparent upgrade to password_hash() (bcrypt). No client-side pre-hashing.
    const res = await fetch(`${API_BASE}/auth/loginPortal.php`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        identity: rawIdentity,
        password: rawPassword,
      }),
      cache: "no-store",
    });

    const finalData = await safeParseJsonResponse<Record<string, any>>(res);

    if (!finalData) {
      return NextResponse.json(
        { status: false, message: "Respon server backend tidak valid (Bukan format JSON)", data: null },
        { status: 502 }
      );
    }

    if (!finalData.status) {
      recordFailedAttempt(rateLimitKey);
    } else {
      resetRateLimit(rateLimitKey);
    }

    const response = NextResponse.json(finalData, { status: res.status });

    // On successful login, generate unguessable, cryptographically signed session token
    if (finalData && finalData.status) {
      const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
      const isProd = process.env.NODE_ENV === "production";

      const sessionToken = createSessionToken(
        {
          userId: finalData.data?.id_admin || finalData.data?.id || 0,
          username: finalData.data?.username || rawIdentity,
          name: finalData.data?.name || finalData.data?.username || "Pegawai BPS",
          email: finalData.data?.email || "",
          role: finalData.data?.role || "Pegawai",
        },
        MAX_AGE
      );

      // HTTP-Only cookie carrying unguessable signed session token
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        path: "/",
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: MAX_AGE,
      });

      // Expire legacy fixed-flag cookie if present
      response.cookies.set("bps_solsel_auth_verified", "", {
        path: "/",
        expires: new Date(0),
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
