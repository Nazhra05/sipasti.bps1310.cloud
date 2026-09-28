"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, X } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type CardLink = {
  label: string;
  href: string;
  logo?: string;
};

type InfoCardProps = {
  title: string;
  description: string;
  links: CardLink[];
  linkCount?: number;
  featured?: boolean;
  paletteIndex?: number;
};

// ─────────────────────────────────────────────
// LOGO BASE
// ─────────────────────────────────────────────

const LOGO_BASE = "https://administators.bps1310.cloud/uploads";

// ─────────────────────────────────────────────
// 3 BPS PALETTES (Blue · Orange · Green)
// ─────────────────────────────────────────────

const PALETTES = [
  {
    headerBg: "bg-sky-50",
    headerBorder: "border-blue-100",
    dotBg: "bg-[#043277]",
    featuredBadge: "bg-[#043277]/10 text-[#043277]",
    featuredRing: "ring-[#043277]/40 shadow-lg shadow-[#043277]/10",
    ctaBase: "border border-[#043277]/25 text-[#043277] hover:bg-[#043277]/5 hover:border-[#043277]/50",
    ctaFeatured: "bg-[#89F336] text-slate-900 font-semibold hover:bg-[#89F336]/85",
    popupDot: "bg-[#043277]",
    popupArrowHover: "group-hover:text-[#043277]",
    popupRing: "focus-visible:ring-[#043277]",
  },
  {
    headerBg: "bg-orange-50",
    headerBorder: "border-orange-100",
    dotBg: "bg-[#FF7E42]",
    featuredBadge: "bg-[#FF7E42]/10 text-[#FF7E42]",
    featuredRing: "ring-[#FF7E42]/40 shadow-lg shadow-[#FF7E42]/10",
    ctaBase: "border border-[#FF7E42]/25 text-[#FF7E42] hover:bg-[#FF7E42]/5 hover:border-[#FF7E42]/50",
    ctaFeatured: "bg-[#043277] text-white font-semibold hover:bg-[#043277]/85",
    popupDot: "bg-[#FF7E42]",
    popupArrowHover: "group-hover:text-[#FF7E42]",
    popupRing: "focus-visible:ring-[#FF7E42]",
  },
  {
    headerBg: "bg-lime-50",
    headerBorder: "border-lime-100",
    dotBg: "bg-[#89F336]",
    featuredBadge: "bg-[#89F336]/15 text-slate-700",
    featuredRing: "ring-[#89F336]/50 shadow-lg shadow-[#89F336]/10",
    ctaBase: "border border-slate-200 text-slate-700 hover:bg-[#89F336]/8 hover:border-[#89F336]/60",
    ctaFeatured: "bg-[#FF7E42] text-white font-semibold hover:bg-[#FF7E42]/85",
    popupDot: "bg-[#89F336]",
    popupArrowHover: "group-hover:text-[#89F336]",
    popupRing: "focus-visible:ring-[#89F336]",
  },
] as const;

// ─────────────────────────────────────────────
// GRAIN FILTER SVG
// ─────────────────────────────────────────────

function GrainTexture({ filterId }: { filterId: string }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.38] mix-blend-overlay"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// LINK LOGO — icon with Globe fallback
// ─────────────────────────────────────────────

function LinkLogo({ logo, label, size = "sm" }: { logo?: string; label: string; size?: "sm" | "md" }) {
  const [errored, setErrored] = useState(false);
  const dim = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  if (!logo || errored) {
    return <Globe className={`${dim} shrink-0 text-slate-400`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${LOGO_BASE}/${logo}`}
      alt=""
      aria-hidden
      width={size === "md" ? 16 : 14}
      height={size === "md" ? 16 : 14}
      className={`${dim} shrink-0 rounded-[3px] object-contain`}
      onError={() => setErrored(true)}
    />
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function InfoCard({
  title,
  description,
  links,
  linkCount = 3,
  featured = false,
  paletteIndex = 0,
}: InfoCardProps) {
  const [open, setOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const pal = PALETTES[paletteIndex % PALETTES.length];
  const previewLinks = links.slice(0, linkCount);
  const filterId = `grain-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <>
      {/* ══════════════════════════════════════
          CARD
      ══════════════════════════════════════ */}
      <motion.div
        whileHover={reduce || featured ? undefined : { y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={[
          "relative flex flex-col rounded-2xl border bg-white p-1 transition-all duration-300",
          featured
            ? `ring-2 ${pal.featuredRing}`
            : "border-slate-200 hover:shadow-md hover:border-slate-300",
        ].join(" ")}
      >
        {/* ── COLORED HEADER ── */}
        <div
          className={[
            "relative overflow-hidden rounded-xl border p-5",
            pal.headerBg,
            pal.headerBorder,
          ].join(" ")}
        >
          <GrainTexture filterId={filterId} />
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${pal.dotBg}`} />
              {featured && (
                <motion.span
                  animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${pal.featuredBadge}`}
                >
                  Kategori Pilihan
                </motion.span>
              )}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
              <p className="line-clamp-2 text-sm text-slate-500">{description}</p>
            </div>
            <p className="text-xs text-slate-400">{links.length} tautan tersedia</p>
          </div>
        </div>

        {/* ── LINK LIST ── */}
        <div className="flex flex-1 flex-col px-1 pt-5 pb-4">
          <p className="mb-4 px-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Tautan Populer
          </p>
          <ul className="space-y-4">
            {previewLinks.map((link) => (
              <li key={link.label} className="flex items-center gap-3 text-sm">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                  <LinkLogo logo={link.logo} label={link.label} />
                </div>
                <Link
                  href={link.href || "#"}
                  onClick={(e) => e.stopPropagation()}
                  className="truncate text-slate-700 transition-colors hover:text-[#FF7E42]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── LIHAT SEMUA BUTTON ── */}
        <div className="mt-auto border-t border-slate-100 px-1 pt-4 pb-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className={[
              "flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm transition-all duration-200",
              featured ? pal.ctaFeatured : pal.ctaBase,
            ].join(" ")}
          >
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════
          POPUP — Project Index row style
          Layout per row:
          [logo] [Name · Kategori ──flex-1──] [Buka] [→]
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8"
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-4 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${pal.popupDot}`} />
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {title}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Row list */}
              <div className="max-h-[60vh] overflow-y-auto px-4 pb-6 sm:px-8 sm:pb-8">
                {links.map((link, i) => {
                  const isActive = hoveredRow === null || hoveredRow === i;
                  const hasUrl = Boolean(link.href && link.href !== "#");

                  return (
                    <Link
                      key={link.label}
                      href={link.href || "#"}
                      target={hasUrl ? "_blank" : undefined}
                      rel={hasUrl ? "noopener noreferrer" : undefined}
                      onClick={() => { if (hasUrl) setOpen(false); }}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={[
                        "group flex items-center gap-3 border-t border-slate-100 py-3 outline-none sm:gap-4 sm:py-4",
                        "last:border-b focus-visible:outline-none",
                        `focus-visible:ring-2 focus-visible:ring-inset ${pal.popupRing}`,
                      ].join(" ")}
                    >
                      {/* Logo */}
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 sm:h-8 sm:w-8">
                        <LinkLogo logo={link.logo} label={link.label} size="md" />
                      </div>

                      {/* Name + Kategori — left group, acts as spacer */}
                      <div className="flex min-w-0 flex-1 items-baseline gap-2 overflow-hidden">
                        <span
                          className={[
                            "truncate text-[13px] font-semibold transition-colors duration-150 sm:text-[15px]",
                            isActive ? "text-slate-900" : "text-slate-300",
                          ].join(" ")}
                        >
                          {link.label}
                        </span>
                        <span
                          className={[
                            "shrink-0 whitespace-nowrap text-[11px] transition-colors duration-150",
                            isActive ? "text-slate-400" : "text-slate-200",
                          ].join(" ")}
                        >
                          {title}
                        </span>
                      </div>

                      {/* Buka — shown for all links */}
                      <span
                        className={[
                          "shrink-0 text-[11px] tabular-nums transition-colors duration-150",
                          isActive ? "text-slate-500" : "text-slate-200",
                        ].join(" ")}
                      >
                        Buka
                      </span>

                      {/* Arrow */}
                      <span
                        aria-hidden
                        className={[
                          "shrink-0 text-[13px] transition-all duration-300 group-hover:translate-x-1",
                          isActive
                            ? `text-slate-300 ${pal.popupArrowHover}`
                            : "text-slate-200",
                        ].join(" ")}
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}