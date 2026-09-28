"use client";

import Image from "next/image";
import { heroLogo } from "@/data";
import SearchBar from "@/components/SearchBar";
import type { FlatResult } from "@/components/SearchBar";

interface HeroProps {
  searchIndex: FlatResult[];
}

export default function Hero({ searchIndex }: HeroProps) {
  return (
    <section id="hero" className="scroll-mt-16 w-full bg-white py-8 md:py-12 mb-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <Image
          src={heroLogo}
          alt="SIPASTI"
          width={600}
          height={240}
          className="h-20 w-auto object-contain sm:h-28"
          priority
        />

        <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:whitespace-nowrap sm:text-4xl md:text-5xl">
          Sistem Portal Statistik Terintegrasi
        </h1>

        <p className="mt-3 max-w-md text-sm text-slate-500 sm:max-w-xl sm:text-base md:text-lg">
          Temukan berbagai website dan informasi statistik BPS Kabupaten Solok Selatan.
        </p>

        <SearchBar searchIndex={searchIndex} />
      </div>
    </section>
  );
}