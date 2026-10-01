"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import InfoCard from "@/components/Infocard";
import type { CardData } from "@/data";

export default function WebsitesSection({ cards }: { cards: CardData[] }) {
  const categories = useMemo(() => cards.map((c) => c.category), [cards]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const activeIndex = categories.indexOf(activeCategory);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Arrow enabled state based on actual scroll position
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function syncArrowState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  // Attach scroll listener once
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncArrowState();
    el.addEventListener("scroll", syncArrowState, { passive: true });
    return () => el.removeEventListener("scroll", syncArrowState);
  }, []);

  // Center the active card whenever category changes (from toggle OR arrow)
  useEffect(() => {
    const container = scrollRef.current;
    const card = cardRefs.current[activeIndex];
    if (!container || !card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Exact scroll position of card relative to container's scroll content
    const cardLeftInScroll = cardRect.left - containerRect.left + container.scrollLeft;

    // Available extra horizontal space in the container around the card
    const extraSpace = container.clientWidth - card.offsetWidth;

    // Center if card fits inside container; align cleanly to start if narrower
    const offset = extraSpace > 0 
      ? cardLeftInScroll - extraSpace / 2 
      : cardLeftInScroll;

    container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    // Re-sync after animation settles
    setTimeout(syncArrowState, 450);
  }, [activeCategory, activeIndex]);

  // Listen for category selection events (e.g. from Navbar)
  useEffect(() => {
    const handleSelectCategory = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: string }>;
      const targetCategory = customEvent.detail?.category;
      if (!targetCategory) return;

      if (targetCategory === "Semua Kategori") {
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
      } else {
        const found = categories.find(
          (c) =>
            c.toLowerCase() === targetCategory.toLowerCase() ||
            c.toLowerCase().includes(targetCategory.toLowerCase()) ||
            targetCategory.toLowerCase().includes(c.toLowerCase())
        );
        if (found) {
          setActiveCategory(found);
        }
      }
    };

    window.addEventListener("select-category", handleSelectCategory);
    return () => {
      window.removeEventListener("select-category", handleSelectCategory);
    };
  }, [categories]);

  // Sync active category change back to Navbar
  useEffect(() => {
    if (activeCategory) {
      window.dispatchEvent(
        new CustomEvent("category-changed", {
          detail: { category: activeCategory },
        })
      );
    }
  }, [activeCategory]);

  // Scroll exactly one card width + gap per arrow click
  function scrollByCard(dir: "left" | "right") {
    const container = scrollRef.current;
    const firstCard = cardRefs.current[0];
    if (!container || !firstCard) return;
    const gap = typeof window !== "undefined" && window.innerWidth >= 640 ? 24 : 16;
    const amount = firstCard.offsetWidth + gap;
    container.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    setTimeout(syncArrowState, 450);
  }

  // ── Empty state ──
  if (cards.length === 0) {
    return (
      <section id="websites" className="w-full scroll-mt-2 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Jelajahi Layanan BPS
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Akses website, dashboard, dan layanan statistik BPS Kabupaten Solok Selatan.
            </p>
            <div className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-12 px-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm font-medium text-slate-500">Data layanan belum tersedia saat ini.</p>
              <p className="text-xs text-slate-400">Silakan coba beberapa saat lagi.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="websites" className="w-full scroll-mt-2 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

        {/* ══ HEADING ROW — heading left, toggle right (reference layout) ══ */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          {/* Left: title + subtitle */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Jelajahi Layanan BPS
            </h2>
            <p className="text-sm text-slate-500">
              Akses website, dashboard, dan layanan statistik BPS Kabupaten Solok Selatan.
            </p>
          </div>

          {/* Right: category filter toggle */}
          <div className="no-scrollbar inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-slate-200 bg-slate-100 p-1 sm:shrink-0">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={(e) => {
                    setActiveCategory(category);
                    (e.currentTarget as HTMLElement).scrollIntoView({
                      behavior: "smooth",
                      inline: "nearest",
                      block: "nearest",
                    });
                  }}
                  className={[
                    "relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    isActive ? "text-white" : "text-slate-500 hover:text-slate-900",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-full bg-[#043277] shadow-sm"
                      transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ CAROUSEL — 3 cards visible, arrows to scroll ══ */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            disabled={!canScrollLeft}
            aria-label="Sebelumnya"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-[#043277] hover:text-[#043277] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/*
            Scroll container.
            Mobile  : each card fixed 250px (responsive) — scroll freely
            Tablet  : 270px
            Desktop : each card = 1/3 of container — exactly 3 in view
            Formula : (100% - 2×gap-6) / 3 = 33.333% - 16px
          */}
          <div
            ref={scrollRef}
            className="relative no-scrollbar flex flex-1 gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-4"
          >
            {cards.map((card, index) => {
              const isFeatured = card.category === activeCategory;
              return (
                <div
                  key={card.title}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  onClick={() => setActiveCategory(card.category)}
                  className="w-[280px] sm:w-[320px] shrink-0 cursor-pointer lg:w-[calc(33.333%_-_16px)] flex flex-col items-stretch"
                >
                  <InfoCard
                    title={card.title}
                    description={card.description}
                    links={card.links}
                    linkCount={3}
                    featured={isFeatured}
                    paletteIndex={index}
                  />
                </div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            disabled={!canScrollRight}
            aria-label="Berikutnya"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-[#043277] hover:text-[#043277] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* ══ DOT PAGINATION ══ */}
        <div className="mt-6 flex justify-center gap-2">
          {categories.map((category, i) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-label={`Ke kategori ${category}`}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-6 bg-[#043277]"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400",
              ].join(" ")}
            />
          ))}
        </div>

      </div>
    </section>
  );
}