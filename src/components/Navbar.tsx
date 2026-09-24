"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navbarLogo } from "@/data";

/**
 * Navbar
 * - Left: BPS logo placeholder (swap the <Image> src once the real logo is ready)
 * - Right: Home / Layanan / Kontak links
 *
 * "Layanan" scrolls to <section id="websites"> (WebsitesSection)
 * "Kontak" scrolls to <footer id="footer"> (Footer)
 * Make sure those ids exist on the target elements — see notes below.
 *
 * Requires: Tailwind CSS (default in a standard `create-next-app` setup)
 * Optional: lucide-react for icons -> npm install lucide-react
 */

type NavLink = {
  label: string;
  href: string;
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const navLinks: NavLink[] = [
    { label: "Home", href: "#hero" },
    { label: "Layanan", href: "#websites" },
    { label: "Kontak", href: "#footer" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#032454] bg-[#043277]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + text */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={navbarLogo}
            alt="BPS Logo"
            width={300}
            height={120}
            className="h-10 w-auto object-contain"
          />
          <div
            className="hidden flex-col leading-tight text-white italic font-bold sm:flex"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <span className="text-sm md:text-base">BADAN PUSAT STATISTIK</span>
            <span className="text-sm md:text-base">
              KABUPATEN SOLOK SELATAN
            </span>
          </div>
        </Link>

        {/* Right: Nav links (desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-white/85 hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#043277] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}