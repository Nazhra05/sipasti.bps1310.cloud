// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

// Mock gsap to avoid DOM manipulation issues in test environment
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn((fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    }),
    timeline: vi.fn(() => ({
      set: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    })),
    set: vi.fn(),
  },
}));

vi.mock("gsap/SplitText", () => ({
  SplitText: vi.fn().mockImplementation((el: HTMLElement) => ({
    chars: Array.from(el.textContent || "").map((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      return span;
    }),
  })),
}));

describe("LoadingScreen Component", () => {
  it("renders ONLY the text RANCAK with accessible role", () => {
    render(<LoadingScreen />);

    const statusEl = screen.getByRole("status");
    expect(statusEl).toBeInTheDocument();
    expect(statusEl).toHaveAttribute("aria-label", "Memuat RANCAK");

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("RANCAK");
  });

  it("does not contain any backend terminology or spinners", () => {
    const { container } = render(<LoadingScreen />);
    const textContent = container.textContent?.toLowerCase() || "";

    expect(textContent).toBe("rancak");
    expect(textContent).not.toContain("backend");
    expect(textContent).not.toContain("server");
    expect(textContent).not.toContain("loading");
    expect(textContent).not.toContain("memuat");
  });
});
