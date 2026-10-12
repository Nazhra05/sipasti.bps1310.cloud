import { NextResponse } from "next/server";
import { getApiConfig } from "@/lib/serverApiConfig";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Lightweight healthcheck route verifying connectivity between App B (Next.js)
 * and App A (PHP Backend).
 */
export async function GET() {
  const startTime = Date.now();
  const { API_BASE, headers } = getApiConfig();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE}/kategori.php`, {
      method: "GET",
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      return NextResponse.json({
        status: "ok",
        backend: "connected",
        latencyMs,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        status: "degraded",
        backend: `HTTP ${res.status}`,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "offline",
        backend: "unreachable",
        latencyMs,
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : "Connection timeout",
      },
      { status: 200 }
    );
  }
}
