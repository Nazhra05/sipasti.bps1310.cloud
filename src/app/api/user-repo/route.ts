import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  return verifySessionToken(sessionCookie);
}

/**
 * GET /api/user-repo
 * Proxy handler untuk mengambil data repositori pegawai dari backend App A.
 */
export async function GET(request: Request) {
  const payload = await getAuthenticatedUser();
  if (!payload || !payload.userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak valid atau telah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  const { API_BASE, headers } = getApiConfig();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "get_all";

  const targetUrl = new URL(`${API_BASE}/user_repo.php`);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });
  targetUrl.searchParams.set("action", action);

  try {
    const res = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        ...headers,
        "X-User-Id": String(payload.userId),
      },
      cache: "no-store",
    });

    const data = await safeParseJsonResponse<Record<string, any>>(res);

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Gagal memproses respon dari server repositori" },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Proxy user-repo GET error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi gangguan komunikasi dengan backend repositori" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user-repo
 * Proxy handler untuk mutasi data repositori pegawai (tambah, edit, hapus, toggle favorit).
 */
export async function POST(request: Request) {
  const payload = await getAuthenticatedUser();
  if (!payload || !payload.userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak valid atau telah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  const { API_BASE, headers } = getApiConfig();

  try {
    const body = await request.json().catch(() => ({}));

    const res = await fetch(`${API_BASE}/user_repo.php`, {
      method: "POST",
      headers: {
        ...headers,
        "X-User-Id": String(payload.userId),
      },
      body: JSON.stringify({
        ...body,
        user_id: payload.userId,
      }),
      cache: "no-store",
    });

    const data = await safeParseJsonResponse<Record<string, any>>(res);

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Gagal memproses respon mutasi dari server repositori" },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Proxy user-repo POST error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi gangguan komunikasi saat menyimpan data repositori" },
      { status: 500 }
    );
  }
}
