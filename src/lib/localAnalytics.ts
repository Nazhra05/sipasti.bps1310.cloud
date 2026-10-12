/**
 * localAnalytics.ts
 * Privacy-friendly, client-side application click counter.
 * Stores service access frequency inside the browser's localStorage (with in-memory fallback)
 * without collecting or transmitting any personally identifiable information (PII).
 */

const STORAGE_KEY = "bps_solsel_local_analytics";

export interface ServiceClickRecord {
  id: number;
  name: string;
  count: number;
  lastClicked: string;
}

let inMemoryStore: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch {}
  return inMemoryStore[key] || null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
      return;
    }
  } catch {}
  inMemoryStore[key] = value;
}

function removeStorageItem(key: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch {}
  delete inMemoryStore[key];
}

/**
 * Safely reads all click records from storage.
 */
export function getAllServiceClicks(): Record<string, ServiceClickRecord> {
  try {
    const raw = getStorageItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Increments the local click counter for a specific service.
 * Returns the updated total count for that service.
 */
export function recordServiceClick(serviceId: number, serviceName: string): number {
  if (!serviceId) return 0;

  try {
    const records = getAllServiceClicks();
    const key = String(serviceId);
    const existing = records[key];

    const updatedRecord: ServiceClickRecord = {
      id: serviceId,
      name: serviceName,
      count: (existing?.count || 0) + 1,
      lastClicked: new Date().toISOString(),
    };

    records[key] = updatedRecord;
    setStorageItem(STORAGE_KEY, JSON.stringify(records));

    // Dispatch custom event for reactive UI updates within the same tab if window is present
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("bps_analytics_updated", { detail: { serviceId } }));
    }

    return updatedRecord.count;
  } catch {
    return 0;
  }
}

/**
 * Gets the current click count for a service.
 */
export function getServiceClickCount(serviceId: number): number {
  if (!serviceId) return 0;
  const records = getAllServiceClicks();
  return records[String(serviceId)]?.count || 0;
}

/**
 * Returns the IDs of the top most frequently accessed services.
 */
export function getTopClickedServiceIds(limit: number = 6): number[] {
  const records = getAllServiceClicks();
  const entries = Object.values(records);

  return entries
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => item.id);
}

/**
 * Clears all locally stored analytics.
 */
export function clearLocalAnalytics(): void {
  removeStorageItem(STORAGE_KEY);
  inMemoryStore = {};
}
