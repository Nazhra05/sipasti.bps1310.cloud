import { test, expect } from "@playwright/test";

test.describe("Portal Homepage E2E Test Suite (App B)", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept API calls with mock backend data wrapped in standard ApiResponse envelope
    await page.route("**/api/kategori", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: true,
          message: "OK",
          data: [
            { id_kategori: 1, nama_kategori: "Kependudukan & Sosial", deskripsi: "Layanan sosial" },
            { id_kategori: 2, nama_kategori: "Pertanian & Ekonomi", deskripsi: "Layanan ekonomi" },
          ],
        }),
      });
    });

    await page.route("**/api/layanan", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: true,
          message: "OK",
          data: [
            {
              id_layanan: 1,
              nama_layanan: "Sistem Informasi Desa Terpadu",
              deskripsi_layanan: "Layanan statistik desa terpadu",
              url: "https://simdasi.example.go.id",
              id_kategori: 1,
              is_active: 1,
              keyword: "simdasi desa",
              logo: "simdasi.png",
              akses: "publik",
            },
            {
              id_layanan: 2,
              nama_layanan: "Aplikasi Internal Kedinasan Solok Selatan",
              deskripsi_layanan: "Aplikasi khusus pegawai via VPN",
              url: "http://10.13.10.5/internal",
              id_kategori: 2,
              is_active: 1,
              keyword: "vpn kedinasan internal",
              logo: "internal.png",
              akses: "internal",
              vpn: "yes",
            },
          ],
        }),
      });
    });

    await page.goto("/");
  });

  test("should render portal homepage with branding and metrics", async ({ page }) => {
    await expect(page.getByRole("link", { name: /BADAN PUSAT STATISTIK/i }).first()).toBeVisible();
    await expect(page.getByText("KABUPATEN SOLOK SELATAN").first()).toBeVisible();
  });

  test("should perform client-side live search filtering", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Cari aplikasi, akronim, kata kunci, atau nama fungsi.../i);
    await searchInput.fill("Simdasi");

    await expect(page.getByText("Sistem Informasi Desa Terpadu")).toBeVisible();
    await expect(page.getByText("Aplikasi Internal Kedinasan Solok Selatan")).not.toBeVisible();

    // Clear search
    await searchInput.fill("");
    await expect(page.getByText("Aplikasi Internal Kedinasan Solok Selatan")).toBeVisible();
  });

  test("should filter applications by access type (Public vs VPN)", async ({ page }) => {
    // Filter Public Access
    await page.getByRole("button", { name: /Publik/i }).first().click();
    await expect(page.getByText("Sistem Informasi Desa Terpadu")).toBeVisible();

    // Filter Internal VPN Access
    await page.getByRole("button", { name: /Internal/i }).first().click();
    await expect(page.getByText("Aplikasi Internal Kedinasan Solok Selatan")).toBeVisible();
  });

  test("should open and close the Info VPN guide modal", async ({ page }) => {
    await page.getByRole("button", { name: /Info VPN/i }).click();
    await expect(page.getByText(/Panduan Akses VPN & Jaringan BPS/i)).toBeVisible();

    await page.getByRole("button", { name: /Tutup panduan/i }).click();
    await expect(page.getByText(/Panduan Akses VPN & Jaringan BPS/i)).not.toBeVisible();
  });

  test("should open and close the Kebijakan Privasi (Privacy Policy) modal", async ({ page }) => {
    await page.getByRole("button", { name: /Kebijakan Privasi/i }).click();
    await expect(page.getByText(/Kebijakan Privasi & Keamanan Informasi/i)).toBeVisible();

    await page.getByRole("button", { name: /Saya Mengerti/i }).click();
    await expect(page.getByText(/Kebijakan Privasi & Keamanan Informasi/i)).not.toBeVisible();
  });

  test("should toggle light and dark theme mode", async ({ page }) => {
    const htmlElement = page.locator("html");
    const initialClass = (await htmlElement.getAttribute("class")) || "";
    const wasDarkInitially = initialClass.includes("dark");

    const themeBtn = page.getByTitle(/Beralih ke Mode/i);
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    if (wasDarkInitially) {
      await expect(htmlElement).not.toHaveClass(/dark/);
    } else {
      await expect(htmlElement).toHaveClass(/dark/);
    }
  });
});
