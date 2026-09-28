"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, ExternalLink, Tag } from "lucide-react";
import type { WebsiteCategory } from "@/lib/api";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type FlatResult = {
  id: number;
  label: string;
  href: string;
  category: string;
};

// ─────────────────────────────────────────────
// DEBOUNCE HOOK
// ─────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    scaleY: 0.95,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.2 },
  }),
};

// ─────────────────────────────────────────────
// CATEGORY BADGE COLORS
// ─────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Distribusi: "bg-sky-100 text-sky-700",
  Produksi: "bg-green-100 text-green-700",
  Neraca: "bg-violet-100 text-violet-700",
  Sosial: "bg-rose-100 text-rose-700",
  TI: "bg-orange-100 text-orange-700",
  Umum: "bg-slate-100 text-slate-600",
  Diseminasi: "bg-blue-100 text-blue-700",
};

function categoryBadge(cat: string) {
  return categoryColors[cat] ?? "bg-slate-100 text-slate-600";
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

interface SearchBarProps {
  /** Flat search index built from /api/website.php, passed from Server Component */
  searchIndex: FlatResult[];
}

export default function SearchBar({ searchIndex }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebounce(query);

  // Derived results
  const results: FlatResult[] = (() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8); // show top 8 when empty
    return searchIndex
      .filter((r) => r.label.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
      .slice(0, 10);
  })();

  const showDropdown = focused && (results.length > 0 || (debouncedQuery.trim().length > 0 && searchIndex.length > 0));
  const noResults = focused && debouncedQuery.trim().length > 0 && results.length === 0;
  const noData = searchIndex.length === 0;

  const handleBlur = useCallback(() => {
    // Delay so click on result fires before blur hides dropdown
    setTimeout(() => setFocused(false), 180);
  }, []);

  return (
    <div className="relative mt-8 w-full max-w-xl">
      {/* Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#005AA9]" />
        <input
          id="search-layanan"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder="Cari layanan, data, atau publikasi..."
          className="w-full rounded-full border-2 border-[#005AA9] bg-white py-3 pl-12 pr-14 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 transition-colors"
        />
        {/* Animated icon: Search ↔ Send */}
        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2">
          <AnimatePresence mode="popLayout">
            {query.length > 0 ? (
              <motion.div
                key="send"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Send className="h-5 w-5 text-[#005AA9]" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Search className="h-5 w-5 text-slate-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            key="dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: "top" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            <ul className="max-h-[360px] overflow-y-auto py-2">
              {results.map((result, i) => (
                <motion.li
                  key={result.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Link
                    href={result.href || "#"}
                    target={result.href ? "_blank" : undefined}
                    rel={result.href ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                    onClick={() => setFocused(false)}
                  >
                    {/* Left: icon + label */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#043277]/8">
                        <Tag className="h-3.5 w-3.5 text-[#043277]" />
                      </div>
                      <span className="truncate text-sm font-medium text-slate-800">
                        {result.label}
                      </span>
                    </div>

                    {/* Right: category badge + external icon */}
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`hidden rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline-block ${categoryBadge(result.category)}`}
                      >
                        {result.category}
                      </span>
                      {result.href ? (
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
              <span>
                {noResults
                  ? "Tidak ada hasil ditemukan"
                  : noData
                    ? "Data pencarian belum tersedia"
                    : query
                      ? `${results.length} hasil ditemukan`
                      : "Menampilkan layanan populer"}
              </span>
              <span>ESC untuk tutup</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export flat type so page.tsx can use it for building the index
export type { FlatResult };
