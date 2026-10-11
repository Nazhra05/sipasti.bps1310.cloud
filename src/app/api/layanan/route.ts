import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";
import { safeParseJsonResponse, LayananItem } from "@/lib/api";
import { authenticateRouteHandler } from "@/lib/session";
import { isInternalLayanan } from "@/lib/accessibilityMapper";

export async function GET(request: Request) {
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

    const data = await safeParseJsonResponse<{ status: boolean; message?: string; data: LayananItem[] }>(res);

    if (!data) {
      return NextResponse.json(
        { status: false, message: "Respon backend tidak dapat diproses (Bukan format JSON)", data: [] },
        { status: 502 }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AUTHORITATIVE SERVER-SIDE ACCESS CONTROL
    // "Hiding is not a protection": The endpoint itself enforces authorization.
    // Unauthenticated clients MUST NEVER receive internal application URLs.
    // ─────────────────────────────────────────────────────────────────────────
    const session = await authenticateRouteHandler(request);
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

