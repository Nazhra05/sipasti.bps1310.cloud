"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navbarLogo } from "@/data";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "Layanan", href: "#websites" },
  { label: "Kontak", href: "#footer" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#032454] bg-[#043277]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + name */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={navbarLogo}
            alt="BPS Solok Selatan"
            width={300}
            height={120}
            className="h-10 w-auto object-contain"
          />
          <div
            className="hidden flex-col font-bold italic leading-tight text-white sm:flex"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <span className="text-sm md:text-base">BADAN PUSAT STATISTIK</span>
            <span className="text-sm md:text-base">KABUPATEN SOLOK SELATAN</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
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

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/85 hover:bg-white/10 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
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