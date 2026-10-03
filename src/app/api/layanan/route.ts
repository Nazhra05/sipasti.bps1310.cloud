import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse } from "@/lib/api";

export async function GET() {
  const { API_BASE, headers } = getApiConfig();

  try {
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

    const data = await safeParseJsonResponse(res);

    if (!data) {
      return NextResponse.json(
        { status: false, message: "Respon backend tidak dapat diproses (Bukan format JSON)", data: [] },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Proxy layanan] Error:", err);
    return NextResponse.json({ status: false, message: "Kesalahan jaringan server proxy", data: [] }, { status: 500 });
  }
}
