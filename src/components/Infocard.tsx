"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

/**
 * InfoCard
 * - Structure mirrors the Pricing18 reference card: heading (category
 *   name, like "Starter"), subheading (description, like "Build your
 *   foundation"), a "Core Features"-style section (here: a short
 *   preview of related links with a CheckCircle2 icon each), and a
 *   CTA button at the bottom of the card.
 * - `featured` (default false) applies the reference's "Pro plan"
 *   treatment: solid brand-blue (#043277, same as the Navbar) surface,
 *   scale-105, a floating pulsing orange badge on top. The CTA button
 *   on a featured card is green (#89F336) with white text by default,
 *   flipping to a white background with black text on hover.
 * - Brand colors: blue #043277 (matches the Navbar background), orange
 *   accent #FF7E42, CTA green #89F336.
 * - `linkCount` controls how many links are previewed (default 3).
 * - "Lihat Semua" opens a popup listing every link for this category.
 *
 * Requires: Tailwind CSS, framer-motion, lucide-react
 */

type CardLink = {
  label: string;
  href: string;
};

type InfoCardProps = {
  title: string;
  description: string;
  links: CardLink[];
  linkCount?: number;
  featured?: boolean;
};

export default function InfoCard({
  title,
  description,
  links,
  linkCount = 3,
  featured = false,
}: InfoCardProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const previewLinks = links.slice(0, linkCount);

  return (
    <>
      <motion.div
        whileHover={reduce || featured ? undefined : { y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={[
          "relative flex h-full w-full flex-col rounded-2xl p-6 transition-all duration-300",
          featured
            ? "scale-105 border border-[#043277]/40 bg-[#043277] text-white shadow-xl shadow-[#043277]/30 hover:scale-[1.07]"
            : "border border-slate-200 bg-white hover:shadow-xl",
        ].join(" ")}
      >
        {featured && (
          <motion.span
            animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#FF7E42] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
          >
            Kategori Pilihan
          </motion.span>
        )}

        <div className={["mb-4", featured && "mt-3"].filter(Boolean).join(" ")}>
          <h3
            className={[
              "mb-1 text-lg font-semibold",
              featured ? "text-white" : "text-slate-800",
            ].join(" ")}
          >
            {title}
          </h3>
          <p
            className={[
              "line-clamp-2 text-sm",
              featured ? "text-white/70" : "text-slate-500",
            ].join(" ")}
          >
            {description}
          </p>
        </div>

        <div className="flex-1">
          <p
            className={[
              "mb-3 text-xs font-semibold uppercase tracking-widest",
              featured ? "text-white/60" : "text-slate-400",
            ].join(" ")}
          >
            Tautan Populer
          </p>
          <ul className="space-y-2.5">
            {previewLinks.map((link) => (
              <li key={link.href} className="flex items-start gap-2.5">
                <CheckCircle2
                  className={[
                    "mt-0.5 h-4 w-4 shrink-0",
                    featured ? "text-white" : "text-[#043277]",
                  ].join(" ")}
                />
                <Link
                  href={link.href}
                  onClick={(e) => e.stopPropagation()}
                  className={[
                    "truncate text-sm transition-colors",
                    featured
                      ? "text-white/90 hover:text-[#FF7E42]"
                      : "text-slate-700 hover:text-[#FF7E42]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className={[
            "mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors",
            featured
              ? "bg-[#89F336] text-white hover:bg-white hover:text-black"
              : "border border-[#043277]/30 text-[#043277] hover:border-[#043277] hover:bg-[#043277]/5",
          ].join(" ")}
        >
          Lihat Semua
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      {/* Popup: full list of links for this category */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-[#043277] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="shrink-0 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-white/70">{description}</p>

            <ul className="mt-4 flex flex-col gap-2 border-t border-white/20 pt-4">
              {links.map((link) => (
                <li
                  key={link.href}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
                >
                  <span className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FF7E42]" />
                    {link.label}
                  </span>
                  <Link
                    href={link.href}
                    className="flex shrink-0 items-center gap-1 rounded-xl border border-white/30 px-3 py-1 text-xs font-medium text-white transition-colors hover:border-[#FF7E42] hover:text-[#FF7E42]"
                  >
                    Buka
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}