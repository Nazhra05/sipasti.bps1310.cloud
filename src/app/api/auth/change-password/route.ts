import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimit";

/**
 * POST /api/auth/change-password
 * Endpoint untuk mengubah kata sandi akun pengguna terautentikasi.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, message: "Sesi login Anda telah berakhir. Silakan masuk kembali." },
      { status: 401 }
    );
  }

  const payload = verifySessionToken(sessionCookie);
  if (!payload || !payload.userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak valid. Silakan masuk kembali." },
      { status: 401 }
    );
  }

  const clientIp = getClientIp(request);
  const rateLimitKey = `change_password:${payload.userId}:${clientIp}`;

  const rateCheck = checkRateLimit(rateLimitKey, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Terlalu banyak percobaan yang gagal. Silakan coba kembali dalam ${rateCheck.retryAfterSeconds} detik.`,
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
        { success: false, message: "Data yang dikirimkan tidak sesuai" },
        { status: 400 }
      );
    }

    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!currentPassword) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Kata sandi saat ini wajib diisi" },
        { status: 400 }
      );
    }

    if (!newPassword) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Kata sandi baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Kata sandi baru minimal harus 6 karakter" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Konfirmasi kata sandi baru tidak cocok" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini" },
        { status: 400 }
      );
    }

    const { API_BASE, headers } = getApiConfig();

    const res = await fetch(`${API_BASE}/auth/change_password.php`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        user_id: payload.userId,
        current_password: currentPassword,
        new_password: newPassword,
      }),
      cache: "no-store",
    });

    const result = await safeParseJsonResponse<{ status?: boolean; message?: string }>(res);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Layanan sedang tidak dapat diakses. Silakan coba kembali beberapa saat lagi." },
        { status: 502 }
      );
    }

    if (!result.status) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: result.message || "Gagal memperbarui kata sandi" },
        { status: res.status >= 400 ? res.status : 400 }
      );
    }

    resetRateLimit(rateLimitKey);

    return NextResponse.json({
      success: true,
      message: "Kata sandi Anda berhasil diperbarui.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kendala pada sistem. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
