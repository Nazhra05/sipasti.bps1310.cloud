import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "./route";

describe("GET /api/health (System Connectivity Healthcheck)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should return ok and connected when backend responds with 200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    }) as unknown as typeof fetch;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.backend).toBe("connected");
    expect(typeof data.latencyMs).toBe("number");
  });

  it("should return degraded when backend responds with non-ok status code", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    }) as unknown as typeof fetch;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("degraded");
    expect(data.backend).toBe("HTTP 503");
  });

  it("should return offline when fetch throws network error or timeout", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network timeout")) as unknown as typeof fetch;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("offline");
    expect(data.backend).toBe("unreachable");
  });
});
