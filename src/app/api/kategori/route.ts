import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";

export async function GET() {
  const { API_BASE, headers } = getApiConfig();

  try {
    const res = await fetch(`${API_BASE}/kategori.php`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[Proxy kategori] HTTP ${res.status}: ${res.statusText}`);
      return NextResponse.json(
        { status: false, message: "Gagal memuat kategori", data: [] },
        { status: res.status }
      );
    }

    const data = await safeParseJsonResponse(res);

    if (!data) {
      return NextResponse.json(
        { status: false, message: "Kategori sedang tidak dapat diproses. Silakan coba beberapa saat lagi.", data: [] },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Proxy kategori] Error:", err);
    return NextResponse.json({ status: false, message: "Gagal memuat data kategori", data: [] }, { status: 500 });
  }
}
