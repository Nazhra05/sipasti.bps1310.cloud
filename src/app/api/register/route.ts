import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimit";

export async function POST(request: Request) {
  const { API_BASE, headers } = getApiConfig();
  const clientIp = getClientIp(request);
  const rateLimitKey = `register:${clientIp}`;

  // Rate Limiting Check (Max 5 failed attempts per minute)
  const rateCheck = checkRateLimit(rateLimitKey, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        status: false,
        message: `Terlalu banyak permintaan pendaftaran. Silakan coba kembali dalam ${rateCheck.retryAfterSeconds} detik.`,
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

    const firstName = typeof body.first_name === "string" ? body.first_name.trim() : "";
    const lastName = typeof body.last_name === "string" ? body.last_name.trim() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirm_password === "string" ? body.confirm_password : "";

    // Validation checks
    if (!firstName || !username || !email || !password) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Nama depan, username, email, dan kata sandi wajib diisi", data: null },
        { status: 400 }
      );
    }

    if (firstName.length > 100 || lastName.length > 100 || username.length > 100 || email.length > 150) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Panjang karakter melebihi batas keamanan yang diizinkan", data: null },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Format email kedinasan tidak valid", data: null },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Kata sandi minimal 6 karakter", data: null },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { status: false, message: "Konfirmasi kata sandi tidak cocok dengan kata sandi", data: null },
        { status: 400 }
      );
    }

    // Forward cleanly to PHP backend (App A)
    const res = await fetch(`${API_BASE}/auth/registerPortal.php`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
      }),
      cache: "no-store",
    });

    const finalData = await safeParseJsonResponse<Record<string, any>>(res);

    if (!finalData) {
      return NextResponse.json(
        { status: false, message: "Respon server pendaftaran tidak valid (Bukan format JSON)", data: null },
        { status: 502 }
      );
    }

    if (!finalData.status) {
      recordFailedAttempt(rateLimitKey);
    } else {
      resetRateLimit(rateLimitKey);
    }

    return NextResponse.json(finalData, { status: res.status });
  } catch (err) {
    console.error("[Proxy register error]:", err);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan sistem saat memproses pendaftaran", data: null },
      { status: 500 }
    );
  }
}

