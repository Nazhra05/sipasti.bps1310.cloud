// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeroSection from "./HeroSection";
import { LayananItem } from "@/lib/api";

// Mock gsap
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn((fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    }),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
    })),
    set: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("gsap/SplitText", () => ({
  SplitText: vi.fn().mockImplementation((el: HTMLElement) => ({
    chars: Array.from(el.textContent || "").map((c) => {
      const s = document.createElement("span");
      s.textContent = c;
      return s;
    }),
  })),
}));

const mockLayananList: LayananItem[] = [
  { id_layanan: 1, id_kategori: 1, nama_layanan: "Pelayanan Statistik Terpadu (PST)", url: "https://pst.bps.go.id", deskripsi_layanan: "Layanan konsultasi data" },
  { id_layanan: 2, id_kategori: 2, nama_layanan: "Sensus Pertanian 2023", url: "https://sensus.bps.go.id", deskripsi_layanan: "Portal sensus nasional" },
  { id_layanan: 3, id_kategori: 3, nama_layanan: "Simpeg Kepegawaian", url: "https://simpeg.bps.go.id", deskripsi_layanan: "Sistem kepegawaian BPS" },
  { id_layanan: 4, id_kategori: 4, nama_layanan: "Romantik Statistik", url: "https://romantik.bps.go.id", deskripsi_layanan: "Rekomendasi kegiatan statistik" },
  { id_layanan: 5, id_kategori: 5, nama_layanan: "Web Portal BPS Solsel", url: "https://solokselatankab.bps.go.id", deskripsi_layanan: "Website publik resmi" },
];

describe("HeroSection Floating Spotlight Search Modal", () => {
  it("opens modal and displays Terakhir Digunakan (maks 2) and Paling Sering Diakses (maks 3) on focus", () => {
    render(<HeroSection searchQuery="" layananList={mockLayananList} />);

    const searchInput = screen.getByPlaceholderText(/Cari aplikasi/i);
    fireEvent.focus(searchInput);

    // Verify modal appeared
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Verify sections
    expect(screen.getByText("Terakhir Digunakan")).toBeInTheDocument();
    expect(screen.getByText("Paling Sering Diakses")).toBeInTheDocument();

    // Verify "Maks. 2 tautan" and "Maks. 3 tautan" are removed
    expect(screen.queryByText(/Maks\. 2 tautan/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Maks\. 3 tautan/i)).not.toBeInTheDocument();

    // Verify label "Populer" is removed
    expect(screen.queryByText("Populer")).not.toBeInTheDocument();

    // Verify "Paling dicari:" is hidden when modal is open
    expect(screen.queryByText(/Paling dicari:/i)).not.toBeInTheDocument();
  });

  it("filters services in-memory instantly without API call when user types", () => {
    const onSearchChange = vi.fn();
    const { rerender } = render(
      <HeroSection searchQuery="" onSearchChange={onSearchChange} layananList={mockLayananList} />
    );

    const searchInput = screen.getByPlaceholderText(/Cari aplikasi/i);
    fireEvent.focus(searchInput);

    // Simulate typing "PST"
    rerender(
      <HeroSection searchQuery="PST" onSearchChange={onSearchChange} layananList={mockLayananList} />
    );

    expect(screen.getByText(/Hasil Pencarian:/i)).toBeInTheDocument();
    expect(screen.getByText("Pelayanan Statistik Terpadu (PST)")).toBeInTheDocument();
    expect(screen.queryByText("Sensus Pertanian 2023")).not.toBeInTheDocument();
  });

  it("closes modal on Escape key press", () => {
    render(<HeroSection searchQuery="" layananList={mockLayananList} />);

    const searchInput = screen.getByPlaceholderText(/Cari aplikasi/i);
    fireEvent.focus(searchInput);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the first search result link when Enter is pressed while searching", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    render(<HeroSection searchQuery="PST" layananList={mockLayananList} />);

    const searchInput = screen.getByPlaceholderText(/Cari aplikasi/i);
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(window.open).toHaveBeenCalledWith(
      "https://pst.bps.go.id/",
      "_blank",
      "noopener,noreferrer"
    );

    window.open = originalOpen;
  });

  it("finds service via synonym (contoh: kueri 'gaji' memunculkan Simpeg Kepegawaian)", () => {
    const onSearchChange = vi.fn();
    const { rerender } = render(
      <HeroSection searchQuery="" onSearchChange={onSearchChange} layananList={mockLayananList} />
    );

    const input = screen.getByPlaceholderText(/Cari aplikasi/i);
    fireEvent.focus(input);

    rerender(
      <HeroSection searchQuery="gaji" onSearchChange={onSearchChange} layananList={mockLayananList} />
    );

    expect(screen.getByText("Simpeg Kepegawaian")).toBeInTheDocument();
  });

  it("finds service via description (contoh: kueri 'rekomendasi' memunculkan Romantik)", () => {
    const onSearchChange = vi.fn();
    const { rerender } = render(
      <HeroSection searchQuery="" onSearchChange={onSearchChange} layananList={mockLayananList} />
    );

    const input = screen.getByPlaceholderText(/Cari aplikasi/i);
    fireEvent.focus(input);

    rerender(
      <HeroSection searchQuery="rekomendasi" onSearchChange={onSearchChange} layananList={mockLayananList} />
    );

    expect(screen.getByText("Romantik Statistik")).toBeInTheDocument();
  });
});
