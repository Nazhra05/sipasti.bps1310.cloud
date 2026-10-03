/**
 * Shared API configuration helper for App B (Next.js server-side proxy handlers).
 * Ensures secret API keys are exclusively accessed server-side and never exposed to the client.
 */
export function getApiConfig() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000/api";

  const API_KEY =
    process.env.BPS_API_KEY ??
    "YOUR_API_KEY_HERE";

  return {
    API_BASE: API_BASE.replace(/\/+$/, ""),
    API_KEY,
    headers: {
      "X-API-KEY": API_KEY.trim(),
      "Content-Type": "application/json",
    },
  };
}
