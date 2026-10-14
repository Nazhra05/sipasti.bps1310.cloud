import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";

/**
 * GET /api/auth/me
 * Endpoint to safely verify the HTTP-Only signed session token from the browser.
 * Returns authenticated user details if the cryptographic token signature is valid,
 * or 401 unauthenticated if missing, forged, expired, or revoked by Admin in App A.
 */
export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { authenticated: false, message: "Sesi tidak ditemukan", user: null },
      { status: 401 }
    );
  }

  const payload = verifySessionToken(sessionCookie);

  if (!payload) {
    return NextResponse.json(
      { authenticated: false, message: "Token sesi tidak valid atau telah kedaluwarsa", user: null },
      { status: 401 }
    );
  }

  // Real-time backend account status revocation check (App A)
  if (process.env.CHECK_REMOTE_SESSION === "true" || (process.env.NODE_ENV !== "test" && payload.userId)) {
    try {
      const { API_BASE, headers } = getApiConfig();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const checkUrl = `${API_BASE}/auth/check_session.php?id_user=${encodeURIComponent(
        payload.userId
      )}&username=${encodeURIComponent(payload.username)}`;

      const checkRes = await fetch(checkUrl, {
        method: "GET",
        headers,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (checkRes.status === 401 || checkRes.status === 403 || checkRes.status === 404) {
        // Account has been deleted or deactivated in App A database
        const res = NextResponse.json(
          {
            authenticated: false,
            message: "Akun telah dinonaktifkan atau dihapus oleh administrator",
            user: null,
          },
          { status: 401 }
        );
        res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", expires: new Date(0) });
        res.cookies.set("bps_solsel_auth_user", "", { path: "/", expires: new Date(0) });
        return res;
      }

      if (checkRes.ok) {
        const checkData = await safeParseJsonResponse<Record<string, any>>(checkRes);
        const isAccountRevoked =
          checkData &&
          checkData.data &&
          (checkData.data.revoked === true ||
           checkData.data.valid === false ||
           checkData.data.active === false);

        if (isAccountRevoked) {
          const res = NextResponse.json(
            {
              authenticated: false,
              message: "Akun telah dinonaktifkan oleh administrator",
              user: null,
            },
            { status: 401 }
          );
          res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", expires: new Date(0) });
          res.cookies.set("bps_solsel_auth_user", "", { path: "/", expires: new Date(0) });
          return res;
        }
      }
    } catch (err) {
      // If App A is temporarily unreachable, fallback gracefully to cryptographically signed session token
      console.warn("[Auth me] Remote session check bypassed due to network/timeout:", err);
    }
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id_admin: payload.userId,
      username: payload.username,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  });
}

