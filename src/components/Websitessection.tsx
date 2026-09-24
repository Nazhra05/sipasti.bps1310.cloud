"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import InfoCard from "@/components/Infocard";
import { websitesCardsTop, websitesCardsBottom } from "@/data";

/**
 * WebsitesSection
 * - bg-white. Brand colors: blue accent #4272FF, orange accent #FF7E42
 *   (used for the active toggle pill, arrow hover states, and active
 *   pagination dot).
 * - Heading + subheading, then a pill toggle with a sliding highlight
 *   (mb-6 below it so it sits close to the carousel).
 * - Carousel of all 7 category cards (h-[380px]); the active category
 *   sits centered and renders as the "featured" card.
 * - Scroll container has extra horizontal padding (px-6/sm:px-10) so
 *   edge cards' scale-up never gets clipped.
 * - Clicking any card, a toggle pill, an arrow, or a dot all set that
 *   category active, smoothly re-centering the carousel on it.
 * - Card content comes from `websitesCardsTop` / `websitesCardsBottom`
 *   in data.ts — edit that file to change categories or links.
 * - id="websites" lets the Navbar's "Layanan" link (#websites) scroll here.
 */
export default function WebsitesSection() {
  const cards = useMemo(
    () => [...websitesCardsTop, ...websitesCardsBottom],
    []
  );
  const categories = useMemo(() => cards.map((c) => c.category), [cards]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeIndex = categories.indexOf(activeCategory);

  function centerCard(index: number) {
    const container = scrollRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;
    const offset =
      card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }

  useEffect(() => {
    centerCard(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  return (
    <section id="websites" className="w-full scroll-mt-2 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Jelajahi Layanan BPS
          </h2>
          <p className="mt-4 text-base text-slate-500 sm:text-lg">
            Temukan website, dashboard, dan layanan terkait BPS Solok Selatan.
          </p>
        </div>

        {/* Category toggle: sliding pill highlight */}
        <div className="mb-6 flex justify-center">
          <div className="no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-slate-200 bg-slate-100 p-1.5">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-[#FF7E42]",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="category-toggle-pill"
                      className="absolute inset-0 rounded-full bg-[#4272FF]"
                      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel: active category centered + featured */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory(categories[Math.max(activeIndex - 1, 0)])}
            disabled={activeIndex === 0}
            aria-label="Sebelumnya"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-[#4272FF] hover:text-[#4272FF] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar flex flex-1 items-center gap-6 overflow-x-auto scroll-smooth px-6 py-6 sm:px-10"
          >
            {cards.map((card, index) => {
              const isFeatured = card.category === activeCategory;
              return (
                <div
                  key={card.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onClick={() => setActiveCategory(card.category)}
                  className="h-[380px] w-[260px] shrink-0 cursor-pointer"
                >
                  <InfoCard
                    title={card.title}
                    description={card.description}
                    links={card.links}
                    linkCount={3}
                    featured={isFeatured}
                  />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveCategory(
                categories[Math.min(activeIndex + 1, categories.length - 1)]
              )
            }
            disabled={activeIndex === categories.length - 1}
            aria-label="Berikutnya"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-[#4272FF] hover:text-[#4272FF] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot pagination */}
        <div className="mt-6 flex justify-center gap-2">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-label={`Ke kategori ${category}`}
              className={[
                "h-2 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-6 bg-[#4272FF]"
                  : "w-2 bg-slate-300 hover:bg-slate-400",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}