import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import {
  API_BASE,
  mockKategoriData,
  mockLayananData,
  mockWebsiteData,
} from "@/test/mocks/handlers";
import Home from "@/app/page";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

describe("Landing Page Data Fetching and UI (Home / App Router)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ─────────────────────────────────────────────
  // 1. CORRECT REQUEST URL AND PARAMS
  // ─────────────────────────────────────────────
  it("requests data from the correct API endpoints and URLs", async () => {
    const requestedUrls: string[] = [];

    server.use(
      http.get(`${API_BASE}/kategori.php`, ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json({
          status: true,
          message: "Success",
          data: mockKategoriData,
        });
      }),
      http.get(`${API_BASE}/layanan.php`, ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json({
          status: true,
          message: "Success",
          data: mockLayananData,
        });
      }),
      http.get(`${API_BASE}/website.php`, ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json({
          status: true,
          message: "Success",
          data: mockWebsiteData,
        });
      })
    );

    const ui = await Home();
    render(ui);

    expect(requestedUrls).toContain(`${API_BASE}/kategori.php`);
    expect(requestedUrls).toContain(`${API_BASE}/layanan.php`);
    expect(requestedUrls).toContain(`${API_BASE}/website.php`);
  });

  // ─────────────────────────────────────────────
  // 2. LOADING STATE
  // ─────────────────────────────────────────────
  it("renders loading indicator and message for users during page streaming", () => {
    render(<Loading />);

    expect(screen.getByText("Memuat halaman…")).toBeInTheDocument();
  });

  // ─────────────────────────────────────────────
  // 3. SUCCESS STATE
  // ─────────────────────────────────────────────
  it("renders services, categories, and search options when data is successfully fetched", async () => {
    const ui = await Home();
    render(ui);

    // Hero title
    expect(
      screen.getByRole("heading", {
        name: /Sistem Portal Statistik Terintegrasi/i,
      })
    ).toBeInTheDocument();

    // Section title
    expect(
      screen.getByRole("heading", { name: /Jelajahi Layanan BPS/i })
    ).toBeInTheDocument();

    // Categories fetched from API (filter pill buttons)
    expect(
      screen.getByRole("button", { name: "Katalog Layanan" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Website Resmi" })
    ).toBeInTheDocument();

    // Carousel dot pagination buttons
    expect(
      screen.getByRole("button", { name: "Ke kategori Katalog Layanan" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ke kategori Website Resmi" })
    ).toBeInTheDocument();

    // Service items inside cards
    expect(
      screen.getByText("Pelayanan Statistik Terpadu (PST)")
    ).toBeInTheDocument();
    expect(screen.getByText("Website BPS Solsel")).toBeInTheDocument();

    // Search bar placeholder
    expect(
      screen.getByPlaceholderText("Cari layanan, data, atau publikasi...")
    ).toBeInTheDocument();
  });

  // ─────────────────────────────────────────────
  // 4. EMPTY STATE
  // ─────────────────────────────────────────────
  it("renders empty state notice when the API returns no items", async () => {
    server.use(
      http.get(`${API_BASE}/kategori.php`, () => {
        return HttpResponse.json({
          status: true,
          message: "Empty",
          data: [],
        });
      }),
      http.get(`${API_BASE}/layanan.php`, () => {
        return HttpResponse.json({
          status: true,
          message: "Empty",
          data: [],
        });
      }),
      http.get(`${API_BASE}/website.php`, () => {
        return HttpResponse.json({
          status: true,
          message: "Empty",
          data: [],
        });
      })
    );

    const ui = await Home();
    render(ui);

    expect(
      screen.getByText("Data layanan belum tersedia saat ini.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Silakan coba beberapa saat lagi.")
    ).toBeInTheDocument();
  });

  // ─────────────────────────────────────────────
  // 5. ERROR STATES (500, 404, NETWORK FAILURE)
  // ─────────────────────────────────────────────
  it("handles HTTP 500 internal server error gracefully and shows user fallback message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE}/kategori.php`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      }),
      http.get(`${API_BASE}/layanan.php`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      }),
      http.get(`${API_BASE}/website.php`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      })
    );

    const ui = await Home();
    render(ui);

    expect(
      screen.getByText("Data layanan belum tersedia saat ini.")
    ).toBeInTheDocument();
  });

  it("handles HTTP 404 not found error gracefully and shows user fallback message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE}/kategori.php`, () => {
        return new HttpResponse(null, {
          status: 404,
          statusText: "Not Found",
        });
      }),
      http.get(`${API_BASE}/layanan.php`, () => {
        return new HttpResponse(null, {
          status: 404,
          statusText: "Not Found",
        });
      }),
      http.get(`${API_BASE}/website.php`, () => {
        return new HttpResponse(null, {
          status: 404,
          statusText: "Not Found",
        });
      })
    );

    const ui = await Home();
    render(ui);

    expect(
      screen.getByText("Data layanan belum tersedia saat ini.")
    ).toBeInTheDocument();
  });

  it("handles network failure gracefully and shows user fallback message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE}/kategori.php`, () => {
        return HttpResponse.error();
      }),
      http.get(`${API_BASE}/layanan.php`, () => {
        return HttpResponse.error();
      }),
      http.get(`${API_BASE}/website.php`, () => {
        return HttpResponse.error();
      })
    );

    const ui = await Home();
    render(ui);

    expect(
      screen.getByText("Data layanan belum tersedia saat ini.")
    ).toBeInTheDocument();
  });

  it("renders error boundary UI with retry button when an unhandled error occurs", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const resetMock = vi.fn();

    render(
      <ErrorBoundary
        error={new Error("Simulated client error")}
        reset={resetMock}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Terjadi Kesalahan" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Halaman tidak dapat dimuat saat ini. Silakan coba lagi atau kembali nanti."
      )
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: "Coba Lagi" });
    expect(retryButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(retryButton);
    expect(resetMock).toHaveBeenCalledTimes(1);
  });

  // ─────────────────────────────────────────────
  // 6. USER INTERACTIONS (CATEGORY SWITCHING & SEARCH)
  // ─────────────────────────────────────────────
  it("updates active category styling when user clicks a category filter tab", async () => {
    const user = userEvent.setup();
    const ui = await Home();
    render(ui);

    const websiteResmiTab = screen.getByRole("button", { name: "Website Resmi" });
    await user.click(websiteResmiTab);

    // After click, the tab has active text styling
    expect(websiteResmiTab).toHaveClass("text-white");
  });

  it("filters and displays search results in the dropdown when user types in SearchBar", async () => {
    const user = userEvent.setup();
    const ui = await Home();
    render(ui);

    const searchInput = screen.getByPlaceholderText("Cari layanan, data, atau publikasi...");
    await user.click(searchInput);
    await user.type(searchInput, "Ekspor");

    // Wait for debounce (250ms) to trigger search results
    await waitFor(
      () => {
        expect(screen.getByText("Ekspor Impor Solsel")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Displays the category badge
    expect(screen.getByText("Distribusi")).toBeInTheDocument();
  });

  it("displays no results notice when user searches for non-existent term", async () => {
    const user = userEvent.setup();
    const ui = await Home();
    render(ui);

    const searchInput = screen.getByPlaceholderText("Cari layanan, data, atau publikasi...");
    await user.click(searchInput);
    await user.type(searchInput, "xyznonexistent");

    await waitFor(
      () => {
        expect(screen.getByText("Tidak ada hasil ditemukan")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  // ─────────────────────────────────────────────
  // 7. PARTIAL API FAILURE & MALFORMED PAYLOAD RESILIENCE
  // ─────────────────────────────────────────────
  it("renders service cards gracefully even if website search index fails with 500", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE}/website.php`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      })
    );

    const ui = await Home();
    render(ui);

    // Categories and cards still display properly
    expect(screen.getByRole("button", { name: "Katalog Layanan" })).toBeInTheDocument();
    expect(screen.getByText("Pelayanan Statistik Terpadu (PST)")).toBeInTheDocument();
  });

  it("handles malformed API response (status=false, null data) gracefully", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE}/kategori.php`, () => {
        return HttpResponse.json({
          status: false,
          message: "Database connection failed",
          data: null,
        });
      }),
      http.get(`${API_BASE}/layanan.php`, () => {
        return HttpResponse.json({
          status: false,
          message: "Database connection failed",
          data: null,
        });
      })
    );

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Data layanan belum tersedia saat ini.")).toBeInTheDocument();
  });
});

