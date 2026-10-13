import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse, LayananItem } from "@/lib/api";
import { authenticateRouteHandler } from "@/lib/session";
import { isInternalLayanan } from "@/lib/accessibilityMapper";

export async function GET(request: Request) {
  const { API_BASE, headers } = getApiConfig();
  const { searchParams } = new URL(request.url);
  const isMyServices = searchParams.get("my_services") === "1";

  try {
    const session = await authenticateRouteHandler(request);

    // If caller specifically requests only their own portal services
    if (isMyServices) {
      if (!session) {
        return NextResponse.json(
          { status: false, message: "Harap login untuk melihat repositori portal Anda.", data: [] },
          { status: 401 }
        );
      }

      const res = await fetch(`${API_BASE}/layanan.php?created_by=${session.userId}`, {
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        return NextResponse.json(
          { status: false, message: `Server backend HTTP ${res.status}`, data: [] },
          { status: res.status }
        );
      }

      const data = await safeParseJsonResponse<{ status: boolean; message?: string; data: LayananItem[] }>(res);
      return NextResponse.json(data || { status: true, data: [] });
    }

    // Default: Public & Internal service directory
    const res = await fetch(`${API_BASE}/layanan.php`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[Proxy layanan] HTTP ${res.status}: ${res.statusText}`);
      return NextResponse.json(
        { status: false, message: `Server backend HTTP ${res.status}`, data: [] },
        { status: res.status }
      );
    }

    const data = await safeParseJsonResponse<{ status: boolean; message?: string; data: LayananItem[] }>(res);

    if (!data) {
      return NextResponse.json(
        { status: false, message: "Respon backend tidak dapat diproses (Bukan format JSON)", data: [] },
        { status: 502 }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AUTHORITATIVE SERVER-SIDE ACCESS CONTROL
    // Unauthenticated clients MUST NEVER receive internal application URLs.
    // ─────────────────────────────────────────────────────────────────────────
    const isAuthenticated = session !== null;

    if (!isAuthenticated && Array.isArray(data.data)) {
      data.data = data.data.map((item) => {
        if (isInternalLayanan(item)) {
          return {
            ...item,
            url: "", // Redact internal application URL for unauthenticated callers
          };
        }
        return item;
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Proxy layanan] Error:", err);
    return NextResponse.json({ status: false, message: "Kesalahan jaringan server proxy", data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { API_BASE, headers } = getApiConfig();

  try {
    const session = await authenticateRouteHandler(request);
    if (!session) {
      return NextResponse.json(
        { status: false, message: "Harap login untuk menambah layanan portal." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ status: false, message: "Data JSON tidak valid." }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/layanan.php`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        created_by: session.userId,
      }),
      cache: "no-store",
    });

    const data = await safeParseJsonResponse<{ status: boolean; message?: string; data?: any }>(res);

    return NextResponse.json(
      data || { status: res.ok, message: res.statusText },
      { status: res.status }
    );
  } catch (err) {
    console.error("[Proxy layanan POST] Error:", err);
    return NextResponse.json({ status: false, message: "Gagal menyimpan layanan ke portal." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { API_BASE, headers } = getApiConfig();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ status: false, message: "ID layanan diperlukan." }, { status: 400 });
  }

  try {
    const session = await authenticateRouteHandler(request);
    if (!session) {
      return NextResponse.json(
        { status: false, message: "Harap login untuk mengubah layanan portal." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ status: false, message: "Data JSON tidak valid." }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/layanan.php?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        user_id: session.userId,
      }),
      cache: "no-store",
    });

    const data = await safeParseJsonResponse<{ status: boolean; message?: string }>(res);

    return NextResponse.json(
      data || { status: res.ok, message: res.statusText },
      { status: res.status }
    );
  } catch (err) {
    console.error("[Proxy layanan PUT] Error:", err);
    return NextResponse.json({ status: false, message: "Gagal memperbarui layanan portal." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { API_BASE, headers } = getApiConfig();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ status: false, message: "ID layanan diperlukan." }, { status: 400 });
  }

  try {
    const session = await authenticateRouteHandler(request);
    if (!session) {
      return NextResponse.json(
        { status: false, message: "Harap login untuk menghapus layanan portal." },
        { status: 401 }
      );
    }

    const res = await fetch(
      `${API_BASE}/layanan.php?id=${encodeURIComponent(id)}&user_id=${encodeURIComponent(String(session.userId))}`,
      {
        method: "DELETE",
        headers,
        cache: "no-store",
      }
    );

    const data = await safeParseJsonResponse<{ status: boolean; message?: string }>(res);

    return NextResponse.json(
      data || { status: res.ok, message: res.statusText },
      { status: res.status }
    );
  } catch (err) {
    console.error("[Proxy layanan DELETE] Error:", err);
    return NextResponse.json({ status: false, message: "Gagal menghapus layanan portal." }, { status: 500 });
  }
}
