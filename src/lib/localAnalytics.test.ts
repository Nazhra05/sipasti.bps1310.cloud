// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  recordServiceClick,
  getServiceClickCount,
  getTopClickedServiceIds,
  getAllServiceClicks,
  clearLocalAnalytics,
} from "./localAnalytics";

describe("localAnalytics utility", () => {
  beforeEach(() => {
    clearLocalAnalytics();
  });

  it("should record clicks and increment counts accurately", () => {
    expect(getServiceClickCount(10)).toBe(0);

    recordServiceClick(10, "Simdasi");
    expect(getServiceClickCount(10)).toBe(1);

    recordServiceClick(10, "Simdasi");
    expect(getServiceClickCount(10)).toBe(2);
  });

  it("should return top clicked service IDs ordered by frequency", () => {
    recordServiceClick(1, "App 1");
    recordServiceClick(2, "App 2");
    recordServiceClick(2, "App 2");
    recordServiceClick(3, "App 3");
    recordServiceClick(3, "App 3");
    recordServiceClick(3, "App 3");

    const top = getTopClickedServiceIds(2);
    expect(top).toEqual([3, 2]);
  });

  it("should clear analytics cleanly", () => {
    recordServiceClick(5, "App 5");
    expect(getServiceClickCount(5)).toBe(1);

    clearLocalAnalytics();
    expect(getServiceClickCount(5)).toBe(0);
    expect(getAllServiceClicks()).toEqual({});
  });
});
