"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { LayananItem } from "@/lib/api";
import { getAllServiceClicks, getTopClickedServiceIds, recordServiceClick } from "@/lib/localAnalytics";
import { toSafeExternalUrl } from "@/lib/safeUrl";
import { searchAndRankServices } from "@/lib/searchMatcher";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface HeroSectionProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalCount?: number;
  layananList?: LayananItem[];
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
  layananList = [],
  onScrollToCatalog,
}: HeroSectionProps) {
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Floating Spotlight Search Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  // Keyboard navigation: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Zero-Cost In-Memory Caching & Filtering (Tanpa menembak API saat user mengetik)
  // ─────────────────────────────────────────────────────────────────────────────

  // 1. Terakhir Digunakan (maks 2 buah link)
  const recentServices = useMemo(() => {
    if (!layananList || layananList.length === 0) return [];
    try {
      const records = getAllServiceClicks();
      const sortedIds = Object.values(records)
        .filter((r) => r.lastClicked)
        .sort((a, b) => new Date(b.lastClicked).getTime() - new Date(a.lastClicked).getTime())
        .map((r) => r.id);

      const matched: LayananItem[] = [];
      for (const id of sortedIds) {
        const found = layananList.find((l) => l.id_layanan === id);
        if (found && !matched.some((m) => m.id_layanan === found.id_layanan)) {
          matched.push(found);
          if (matched.length === 2) break;
        }
      }

      // Fallback jika riwayat klik belum mencapai 2 item
      if (matched.length < 2) {
        for (const item of layananList) {
          if (!matched.some((m) => m.id_layanan === item.id_layanan)) {
            matched.push(item);
            if (matched.length === 2) break;
          }
        }
      }

      return matched.slice(0, 2);
    } catch {
      return layananList.slice(0, 2);
    }
  }, [layananList, isModalOpen]);

  // 2. Paling Sering Diakses (oleh semua user portal) (maks 3 buah link)
  const popularServices = useMemo(() => {
    if (!layananList || layananList.length === 0) return [];
    try {
      const topIds = getTopClickedServiceIds(6);
      const matched: LayananItem[] = [];

      for (const id of topIds) {
        const found = layananList.find((l) => l.id_layanan === id);
        if (found && !matched.some((m) => m.id_layanan === found.id_layanan)) {
          matched.push(found);
          if (matched.length === 3) break;
        }
      }

      // Lengkapi hingga 3 item jika klik masih sedikit
      if (matched.length < 3) {
        for (const item of layananList) {
          if (
            !matched.some((m) => m.id_layanan === item.id_layanan) &&
            !recentServices.some((r) => r.id_layanan === item.id_layanan)
          ) {
            matched.push(item);
            if (matched.length === 3) break;
          }
        }
      }

      if (matched.length < 3) {
        for (const item of layananList) {
          if (!matched.some((m) => m.id_layanan === item.id_layanan)) {
            matched.push(item);
            if (matched.length === 3) break;
          }
        }
      }

      return matched.slice(0, 3);
    } catch {
      return layananList.slice(0, 3);
    }
  }, [layananList, recentServices, isModalOpen]);

  // 3. Fast In-Memory Search dengan Pembobotan Nama, Deskripsi, dan Sinonim
  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q || !layananList) return [];

    return searchAndRankServices(layananList, q).slice(0, 5); // 5 hasil teratas berdasarkan relevansi
  }, [searchQuery, layananList]);

  const handleServiceClick = (item: LayananItem) => {
    recordServiceClick(item.id_layanan, item.nama_layanan);
    setIsModalOpen(false);

    const safeUrl = toSafeExternalUrl(item.url);
    if (safeUrl) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    } else if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleTagClick = (tagQuery: string) => {
    if (onSearchChange) {
      onSearchChange(tagQuery);
    }
    setIsModalOpen(true);
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Jika user sedang mencari/mengetikkan layanan dan ada hasil:
    // Langsung buka link layanan urutan pertama seolah mengklik hasil pertama
    if (searchQuery.trim() !== "" && searchResults.length > 0) {
      handleServiceClick(searchResults[0]);
      return;
    }

    setIsModalOpen(false);
    if (onScrollToCatalog) {
      onScrollToCatalog(searchQuery);
    }
  };

  const handleViewInCatalog = () => {
    setIsModalOpen(false);
    if (onScrollToCatalog) {
      onScrollToCatalog(searchQuery);
    }
  };

  return (
    <>
      {/* Dimmed Backdrop Overlay saat Search Mengambang (Modal Mode) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
          aria-hidden="true"
        />
      )}

      <section
        id="hero"
        className="relative overflow-visible min-h-[64vh] sm:min-h-[74vh] md:min-h-[80vh] flex flex-col justify-center items-center pt-28 pb-20 sm:pt-36 sm:pb-28 md:pt-40 md:pb-36 bg-white dark:bg-[#0c1424] transition-colors"
      >
        {/* Ambient Radial Gradient Mesh */}
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
            {/* Headline Utama */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.16] max-w-4xl mx-auto">
              Temukan dan Kelola Referensi Digital
              <br className="hidden sm:inline" />{" "}
              Badan Pusat Statistik Solok Selatan
              <br className="hidden sm:inline" />{" "}
              dengan Lebih{" "}
              <span className="bg-gradient-to-r from-[#005AA9] via-[#6DBE45] to-[#F37021] bg-clip-text text-transparent">
                RANCAK
              </span>
            </h1>

            {/* Subheading dengan Typographic Reveal via SplitText */}
            <p
              ref={subheadingRef}
              className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Ruang Akses dan Navigasi Cepat Aplikasi dan Koleksi
            </p>

            {/* Centered Search Bar Wrapper (Mengambang, Membesar & Sejajar dengan Heading Hero saat Aktif) */}
            <div
              ref={searchContainerRef}
              className={`w-full max-w-2xl mt-5 sm:mt-6 transition-all duration-300 ease-out ${
                isModalOpen
                  ? "relative z-50 transform -translate-y-32 sm:-translate-y-36 md:-translate-y-44 lg:-translate-y-48 scale-[1.02] sm:scale-105"
                  : "relative z-10 transform translate-y-0 scale-100"
              }`}
            >
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div
                  className={`relative flex items-center rounded-xl bg-white/95 dark:bg-slate-900/95 border transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl ${
                    isModalOpen
                      ? "border-[#005AA9] dark:border-sky-500 shadow-2xl ring-2 ring-[#005AA9]/20 dark:ring-sky-500/25"
                      : "border-slate-300/80 dark:border-slate-700/80 shadow-md hover:shadow-lg focus-within:shadow-xl focus-within:border-[#005AA9] dark:focus-within:border-sky-500"
                  }`}
                >
                  {/* Search Icon */}
                  <div className="pl-1 pr-2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005AA9] dark:group-focus-within:text-sky-400 transition-colors">
                    <Search className="w-5 h-5" />
                  </div>

                  {/* Main Search Input */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsModalOpen(true)}
                    onClick={() => setIsModalOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (searchQuery.trim() !== "" && searchResults.length > 0) {
                          e.preventDefault();
                          handleServiceClick(searchResults[0]);
                        }
                      }
                    }}
                    onChange={(e) => {
                      onSearchChange?.(e.target.value);
                      if (!isModalOpen) setIsModalOpen(true);
                    }}
                    placeholder="Cari aplikasi, akronim, kata kunci, atau nama fungsi..."
                    className="flex-1 bg-transparent py-2 sm:py-2.5 px-2 text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange?.("")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer mr-1"
                      title="Bersihkan pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* ───────────────────────────────────────────────────────────
                  MODAL SEARCH PANEL (BERSIH TANPA ICON, RADIUS ROUNDED-XL)
              ─────────────────────────────────────────────────────────── */}
              {isModalOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/98 dark:bg-slate-900/98 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden p-3.5 sm:p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200"
                  role="dialog"
                  aria-label="Pencarian Cepat Layanan"
                >
                  {searchQuery.trim() === "" ? (
                    /* STATE 1: SEBELUM USER MENGETIK */
                    <div className="space-y-4">
                      {/* Section 1: Terakhir Digunakan (maks 2 buah link) */}
                      <div>
                        <div className="mb-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Terakhir Digunakan
                          </span>
                        </div>

                        {recentServices.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recentServices.map((item) => (
                              <button
                                key={`recent-${item.id_layanan}`}
                                type="button"
                                onClick={() => handleServiceClick(item)}
                                className="w-full p-2.5 sm:p-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-all text-left group cursor-pointer"
                              >
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#005AA9] dark:group-hover:text-sky-400 transition-colors">
                                  {item.nama_layanan}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  {item.nama_kategori || "Layanan Portal"}
                                </p>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic py-1">Belum ada riwayat layanan yang dibuka.</p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 dark:border-slate-800/80" />

                      {/* Section 2: Paling Sering Diakses (oleh semua user portal) (maks 3 buah link) */}
                      <div>
                        <div className="mb-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Paling Sering Diakses
                          </span>
                        </div>

                        {popularServices.length > 0 ? (
                          <div className="space-y-1.5">
                            {popularServices.map((item) => (
                              <button
                                key={`popular-${item.id_layanan}`}
                                type="button"
                                onClick={() => handleServiceClick(item)}
                                className="w-full p-2.5 sm:p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200/80 dark:border-slate-700/60 transition-all text-left group cursor-pointer"
                              >
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#005AA9] dark:group-hover:text-sky-400 transition-colors">
                                  {item.nama_layanan}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  {item.deskripsi_layanan || item.nama_kategori || "Layanan unggulan portal BPS"}
                                </p>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic py-1">Belum ada statistik layanan.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* STATE 2: SAAT USER MENGETIK (FAST IN-MEMORY FILTERING) */
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Hasil Pencarian: &ldquo;{searchQuery}&rdquo;
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {searchResults.length} layanan ditemukan
                        </span>
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                          {searchResults.map((item) => (
                            <button
                              key={`result-${item.id_layanan}`}
                              type="button"
                              onClick={() => handleServiceClick(item)}
                              className="w-full p-2.5 sm:p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200/80 dark:border-slate-700/60 transition-all text-left group cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#005AA9] dark:group-hover:text-sky-400 transition-colors">
                                  {item.nama_layanan}
                                </p>
                                {item.nama_kategori && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                    {item.nama_kategori}
                                  </span>
                                )}
                                {item.vpn === "Yes" && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-[#005AA9] dark:bg-sky-950/60 dark:text-sky-300 shrink-0">
                                    VPN
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {item.deskripsi_layanan || item.url}
                              </p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center space-y-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Tidak ada layanan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                          </p>
                          <button
                            type="button"
                            onClick={handleViewInCatalog}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-[#005AA9] dark:text-sky-400 hover:underline cursor-pointer"
                          >
                            Cari di semua katalog layanan portal
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Modal Search */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="hidden sm:inline">
                      Tekan <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">ESC</kbd> untuk menutup
                    </span>
                    <button
                      type="button"
                      onClick={handleViewInCatalog}
                      className="font-bold text-[#005AA9] dark:text-sky-400 hover:underline cursor-pointer ml-auto"
                    >
                      Lihat Semua di Katalog
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Suggestions & Popular Search Tags (sembunyi saat floating) */}
              {!isModalOpen && (
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Paling dicari:</span>
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag.query}
                      type="button"
                      onClick={() => handleTagClick(tag.query)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
