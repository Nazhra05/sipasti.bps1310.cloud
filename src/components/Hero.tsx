"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { Search, Send } from "lucide-react";
import { heroLogo } from "@/data";

/**
 * Hero
 * - Follows the reference craft-ds Hero structure (Section > Container,
 *   centered content, react-wrap-balancer for balanced line breaks)
 * - Logo sits in a rounded box filled with the brand blue (#005AA9,
 *   same as the InfoCard background) with a matching border
 * - Heading + subheading below the logo
 * - Search bar has a blue border (#005AA9) matching the logo/card
 *   color, replacing the reference's top Button
 *
 * Requires: Tailwind CSS
 * Also requires: npm install react-wrap-balancer lucide-react
 */
export default function Hero() {
  const [query, setQuery] = useState<string>("");

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    // TODO: wire this up to your actual search route/logic
    console.log("Searching for:", query);
  }

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <section id="hero" className="scroll-mt-16 w-full flex-1 flex-col justify-center bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        {/* Logo */}
        <Image
          src={heroLogo}
          alt="SIPASTI"
          width={400}
          height={160}
          className="h-24 w-auto object-contain"
          priority
        />

        {/* Heading */}
        <h1 className=" text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
          <Balancer>Sistem Portal Statistik Terintegrasi</Balancer>
        </h1>

        {/* Subheading */}
        <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          <Balancer>
            Temukan berbagai website dan informasi statistik BPS Kabupaten
            Solok Selatan.
          </Balancer>
        </p>

        {/* Search bar: blue border matching the logo/card color */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative mt-8 w-full max-w-xl"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#005AA9]" />
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Cari data, publikasi, atau berita..."
            className="w-full rounded-full border-2 border-[#005AA9] bg-white py-3 pl-12 pr-14 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#005AA9] bg-[#005AA9] text-white transition-colors hover:border-[#89F336] hover:bg-[#89F336]"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}