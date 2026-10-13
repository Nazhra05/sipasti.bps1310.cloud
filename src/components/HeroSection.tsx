"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface HeroSectionProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalCount?: number;
  onScrollToCatalog?: (query?: string) => void;
}

const POPULAR_TAGS = [
  { label: "Sensus & Survei", query: "sensus" },
  { label: "Simpeg", query: "kepegawaian" },
  { label: "PDRB Neraca", query: "neraca" },
  { label: "Pelayanan PST", query: "pst" },
  { label: "Koneksi VPN", query: "vpn" },
];

export default function HeroSection({
  searchQuery = "",
  onSearchChange,
  onScrollToCatalog,
}: HeroSectionProps) {
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !subheadingRef.current) return;

    const ctx = gsap.context(() => {
      try {
        const split = new SplitText(subheadingRef.current, {
          type: "words, chars",
        });
        gsap.set(split.chars, { opacity: 0, y: 10 });
        gsap.timeline({
          scrollTrigger: {
            trigger: subheadingRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }).to(split.chars, {
          opacity: 1,
          y: 0,
          stagger: 0.008,
          duration: 0.35,
          ease: "power2.out",
        });
      } catch (err) {
        console.warn("Hero SplitText warning:", err);
      }
    });

    return () => ctx.revert();
  }, []);

  const handleTagClick = (tagQuery: string) => {
    if (onSearchChange) {
      onSearchChange(tagQuery);
    }
    if (onScrollToCatalog) {
      onScrollToCatalog(tagQuery);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScrollToCatalog) {
      onScrollToCatalog(searchQuery);
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden min-h-[64vh] sm:min-h-[74vh] md:min-h-[80vh] flex flex-col justify-center items-center pt-28 pb-20 sm:pt-36 sm:pb-28 md:pt-40 md:pb-36 bg-white dark:bg-[#0c1424] transition-colors">
      {/* Ambient Radial Gradient Mesh (Google Antigravity inspired glow) */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-b from-sky-400/15 via-[#005AA9]/10 to-transparent blur-3xl rounded-full opacity-70 dark:opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-16 right-10 w-72 h-72 bg-gradient-to-br from-amber-400/10 via-orange-400/5 to-transparent blur-2xl rounded-full opacity-60 dark:opacity-30"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Headline Utama (Bersih di bawah fixed navbar dengan clearance Antigravity) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.24] max-w-3xl mx-auto">
            Temukan Informasi Relevan BPS Solok Selatan dengan{" "}
            <span className="bg-gradient-to-r from-[#005AA9] via-[#6DBE45] to-[#F37021] bg-clip-text text-transparent">
              RANCAK
            </span>
          </h1>

          {/* Subheading dengan Typographic Reveal via SplitText */}
          <p
            ref={subheadingRef}
            className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Portal satu pintu direktori layanan statistik, aplikasi operasional, dan sistem kerja resmi BPS Kabupaten Solok Selatan
          </p>

          {/* Centered Search Bar (Antigravity Clean Capsule - Spacing Rapat) */}
          <div className="w-full max-w-2xl mt-5 sm:mt-6">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="relative flex items-center rounded-full bg-white/95 dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-700/80 shadow-md hover:shadow-lg focus-within:shadow-xl focus-within:border-[#005AA9] dark:focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-[#005AA9]/15 dark:focus-within:ring-sky-500/20 backdrop-blur-xl transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2">
                {/* Search Icon */}
                <div className="pl-1 pr-2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005AA9] dark:group-focus-within:text-sky-400 transition-colors">
                  <Search className="w-5 h-5" />
                </div>

                {/* Main Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Cari aplikasi, akronim, kata kunci, atau nama fungsi..."
                  className="flex-1 bg-transparent py-2 sm:py-2.5 px-2 text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />

                {/* Clear Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange?.("")}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer mr-1"
                    title="Bersihkan pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Quick Suggestions & Popular Search Tags */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-600 dark:text-slate-300">Paling dicari:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag.query}
                  type="button"
                  onClick={() => handleTagClick(tag.query)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
