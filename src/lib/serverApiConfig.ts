/**
 * Shared API configuration helper for App B (Next.js server-side proxy handlers).
 * Ensures secret API keys are exclusively accessed server-side and never exposed to the client.
 */
export function getApiConfig() {
  const API_BASE =
    process.env.API_BASE_URL ??
    "http://localhost:8000/api";

  const rawApiKey = process.env.BPS_API_KEY;
  if (process.env.NODE_ENV === "production" && (!rawApiKey || rawApiKey === "YOUR_API_KEY_HERE")) {
    throw new Error("FATAL CONFIGURATION ERROR: BPS_API_KEY must be securely defined in production environment.");
  }

  const API_KEY = rawApiKey ?? "YOUR_API_KEY_HERE";

  return {
    API_BASE: API_BASE.replace(/\/+$/, ""),
    API_KEY,
    headers: {
      "X-API-KEY": API_KEY.trim(),
      "Content-Type": "application/json",
    },
  };
}
