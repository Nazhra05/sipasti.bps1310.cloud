"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Search, LayoutGrid, FolderHeart, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface WhyRancakSectionProps {
  onScrollToHero?: () => void;
  onScrollToCatalog?: () => void;
  onOpenRepository?: () => void;
}

export default function WhyRancakSection({
  onScrollToHero,
  onScrollToCatalog,
  onOpenRepository,
}: WhyRancakSectionProps) {
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
            start: "top 88%",
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
        console.warn("Why RANCAK SplitText warning:", err);
      }
    });

    return () => ctx.revert();
  }, []);

  const handleHeroClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToHero) {
      onScrollToHero();
    } else {
      try {
        const smoother = (window as unknown as { ScrollSmootherInstance?: { scrollTo: (target: string | number, smooth?: boolean) => void } }).ScrollSmootherInstance;
        if (smoother && typeof smoother.scrollTo === "function") {
          smoother.scrollTo("#hero", true);
          return;
        }
      } catch {
        // fallback
      }
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleCatalogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToCatalog) {
      onScrollToCatalog();
    } else {
      const catalogEl = document.getElementById("katalog-layanan");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="why-rancak"
      aria-label="Mengapa Memilih RANCAK"
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-white dark:bg-[#0c1424] transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading (Sesuai Heading Style Landing Page BPS) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Why{" "}
            <span className="bg-gradient-to-r from-[#005AA9] via-[#6DBE45] to-[#F37021] bg-clip-text text-transparent">
              RANCAK?
            </span>
          </h2>
          <p
            ref={subheadingRef}
            className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Semua tautan BPS yang kamu butuhkan, dalam satu tempat. Temukan, akses, dan simpan referensimu dengan mudah.
          </p>
        </div>

        {/* 3 Cards Grid (Warna: Card 1 Biru, Card 2 Hijau, Card 3 Oranye) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Find What You Need (Warna Biru #005AA9) */}
          <div className="group relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-[#e1ebfa] dark:bg-[#005AA9]/15 border border-[#c3daf5] dark:border-[#005AA9]/30 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              {/* Number Circle Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#005AA9] dark:bg-[#1a73e8] text-white flex items-center justify-center font-extrabold text-sm sm:text-base shadow-xs mb-5">
                1
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-3">
                Find What You Need
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                Temukan layanan dan situs web BPS melalui pencarian dan kategori yang terorganisasi. Tak perlu mengingat nama atau alamat setiap tautan.
              </p>
            </div>

            {/* CTA Redirect ke Hero (Kompak, teks "Ayo cari layananmu") */}
            <button
              type="button"
              onClick={handleHeroClick}
              className="group/btn inline-flex items-center gap-2 w-fit px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#005AA9] dark:text-[#60a5fa] hover:bg-[#005AA9] hover:text-white dark:hover:bg-[#005AA9] dark:hover:text-white border border-[#005AA9]/30 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer active:scale-[0.98]"
              title="Kembali ke area pencarian Hero"
            >
              <Search className="w-3.5 h-3.5 text-[#005AA9] dark:text-[#60a5fa] group-hover/btn:text-white transition-colors" />
              <span>Ayo cari layananmu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Access BPS Resources (Warna Hijau #6DBE45) */}
          <div className="group relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-[#dff5ec] dark:bg-[#6DBE45]/15 border border-[#b2e8d5] dark:border-[#6DBE45]/30 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              {/* Number Circle Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2f7d1f] dark:bg-[#6DBE45] text-white flex items-center justify-center font-extrabold text-sm sm:text-base shadow-xs mb-5">
                2
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-3">
                Access BPS Resources
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                Akses berbagai situs web, aplikasi, dan layanan yang berkaitan dengan pekerjaan BPS melalui direktori tautan terpusat.
              </p>
            </div>

            {/* CTA Redirect ke Katalog Layanan (Kompak, Icon LayoutGrid Semua Kategori) */}
            <button
              type="button"
              onClick={handleCatalogClick}
              className="group/btn inline-flex items-center gap-2 w-fit px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#255e16] dark:text-[#8ee064] hover:bg-[#2f7d1f] hover:text-white dark:hover:bg-[#6DBE45] dark:hover:text-slate-950 border border-[#6DBE45]/40 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer active:scale-[0.98]"
              title="Gulir langsung ke Katalog Layanan"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#255e16] dark:text-[#8ee064] group-hover/btn:text-white dark:group-hover/btn:text-slate-950 transition-colors" />
              <span>Jelajahi Katalog Layanan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Keep Your References (Warna Peach / Oranye #FFA500) */}
          <div className="group relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-[#fee8d6] dark:bg-[#FFA500]/15 border border-[#fed0ad] dark:border-[#FFA500]/30 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              {/* Number Circle Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e67e22] dark:bg-[#FFA500] text-white flex items-center justify-center font-extrabold text-sm sm:text-base shadow-xs mb-5">
                3
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-3">
                Keep Your References
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                Simpan layanan favorit, tautan website, dokumen, folder Drive, foto, dan referensi lainnya dalam repositori pribadi yang dapat kamu kelola sendiri.
              </p>
            </div>

            {/* CTA Redirect ke Repositori Pribadi (Kompak, Icon FolderHeart / folder_love) */}
            {onOpenRepository ? (
              <button
                type="button"
                onClick={onOpenRepository}
                className="group/btn inline-flex items-center gap-2 w-fit px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#8c5200] dark:text-[#ffbe4d] hover:bg-[#e67e22] hover:text-white dark:hover:bg-[#FFA500] dark:hover:text-slate-950 border border-[#FFA500]/40 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer active:scale-[0.98]"
                title="Buka Repositori Pribadi"
              >
                <FolderHeart className="w-3.5 h-3.5 text-[#e67e22] dark:text-[#FFA500] group-hover/btn:text-white dark:group-hover/btn:text-slate-950 transition-colors" />
                <span>Buka Repositori Pribadi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                href="/repositori"
                className="group/btn inline-flex items-center gap-2 w-fit px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#8c5200] dark:text-[#ffbe4d] hover:bg-[#e67e22] hover:text-white dark:hover:bg-[#FFA500] dark:hover:text-slate-950 border border-[#FFA500]/40 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer active:scale-[0.98]"
                title="Buka Repositori Pribadi"
              >
                <FolderHeart className="w-3.5 h-3.5 text-[#e67e22] dark:text-[#FFA500] group-hover/btn:text-white dark:group-hover/btn:text-slate-950 transition-colors" />
                <span>Buka Repositori Pribadi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Footnote Ringkas Sesuai Foto Referensi */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Ketersediaan akses layanan dan repositori disesuaikan untuk kebutuhan kerja seluruh pegawai BPS Kabupaten Solok Selatan.
        </p>
      </div>
    </section>
  );
}
