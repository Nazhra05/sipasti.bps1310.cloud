// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders 3 columns with correct headings, links, and contact information", () => {
    const onOpenPrivacyPolicy = vi.fn();
    const onOpenVpnGuide = vi.fn();

    render(
      <Footer
        onOpenPrivacyPolicy={onOpenPrivacyPolicy}
        onOpenVpnGuide={onOpenVpnGuide}
      />
    );

    // Column 1: RANCAK
    expect(screen.getByText("RANCAK")).toBeInTheDocument();
    expect(
      screen.getByText(/Ruang Akses dan Navigasi Cepat/i)
    ).toBeInTheDocument();
    const websiteLink = screen.getByText("Website BPS Solok Selatan").closest("a");
    expect(websiteLink).toHaveAttribute("href", "https://solokselatankab.bps.go.id");
    expect(websiteLink).toHaveAttribute("target", "_blank");

    // Column 2: Kontak & Bantuan
    expect(screen.getByText(/Kontak & Bantuan/i)).toBeInTheDocument();

    const waPst = screen.getByText("WhatsApp PST").closest("a");
    expect(waPst).toHaveAttribute("href", "https://wa.me/62821800001310");
    expect(waPst).toHaveAttribute("target", "_blank");

    const waAdmin = screen.getByText("WhatsApp Admin").closest("a");
    expect(waAdmin).toHaveAttribute("href", "https://wa.me/6282288338444");
    expect(waAdmin).toHaveAttribute("target", "_blank");

    const emailLink = screen.getByText("Email BPS Solok Selatan").closest("a");
    expect(emailLink).toHaveAttribute("href", "mailto:bps1310@bps.go.id");

    // Column 3: Informasi
    expect(screen.getByText("Informasi")).toBeInTheDocument();

    const privacyBtn = screen.getByText("Kebijakan Privasi");
    fireEvent.click(privacyBtn);
    expect(onOpenPrivacyPolicy).toHaveBeenCalledTimes(1);

    const vpnBtn = screen.getByText("Panduan VPN");
    fireEvent.click(vpnBtn);
    expect(onOpenVpnGuide).toHaveBeenCalledTimes(1);

    // Bottom Copyright
    expect(
      screen.getByText(/BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi./i)
    ).toBeInTheDocument();
  }, 15000);
});
