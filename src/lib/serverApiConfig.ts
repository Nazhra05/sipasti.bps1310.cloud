/**
 * Shared API configuration helper for App B (Next.js server-side proxy handlers).
 * Ensures secret API keys are exclusively accessed server-side and never exposed to the client.
 */
export function getApiConfig() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://administators.bps1310.cloud/api";

  const API_KEY =
    process.env.BPS_API_KEY ??
    "BPS_SOLSEL_API_2026_GANTI_DENGAN_KEY_RAHASIA";

  return {
    API_BASE: API_BASE.replace(/\/+$/, ""),
    API_KEY,
    headers: {
      "X-API-KEY": API_KEY.trim(),
      "Content-Type": "application/json",
    },
  };
}
