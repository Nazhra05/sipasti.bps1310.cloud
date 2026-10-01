"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, BarChart3, Database, X } from "lucide-react";

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
// PALETTES (Matching Persona Guidance aesthetic)
// ─────────────────────────────────────────────

const PALETTES = [
  {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeColor: "text-blue-600",
    hoverLink: "group-hover/link:text-blue-600",
    Icon: Globe,
  },
  {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badgeColor: "text-amber-600",
    hoverLink: "group-hover/link:text-amber-600",
    Icon: BarChart3,
  },
  {
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    badgeColor: "text-teal-700",
    hoverLink: "group-hover/link:text-teal-700",
    Icon: Database,
  },
] as const;

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
  const IconComponent = pal.Icon;
  const previewLinks = links.slice(0, linkCount);

  return (
    <>
      {/* ══════════════════════════════════════
          CARD (PERSONA GUIDANCE STYLE)
      ══════════════════════════════════════ */}
      <motion.article
        whileHover={reduce ? undefined : { y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={[
          "bg-white rounded-xl border flex flex-col p-6 lg:p-7 h-full transition-all duration-200",
          featured
            ? "border-blue-500/50 shadow-md ring-1 ring-blue-500/20"
            : "border-slate-200/90 shadow-sm hover:shadow-md",
        ].join(" ")}
        data-purpose="web-card"
      >
        {/* Ikon Profil / Category Icon */}
        <div
          aria-hidden="true"
          className={`w-11 h-11 rounded-lg ${pal.iconBg} ${pal.iconColor} flex items-center justify-center mb-5 shrink-0`}
        >
          <IconComponent className={`w-6 h-6 ${pal.iconColor}`} />
        </div>

        {/* Target / Category Badge */}
        <div className={`text-[11px] font-bold tracking-wider ${pal.badgeColor} uppercase mb-2`}>
          {featured ? "KATEGORI PILIHAN • " + title : title}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 mb-3 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed flex-grow line-clamp-3">
          {description}
        </p>

        {/* Link Items / Service Tags */}
        <div className="space-y-2 mb-6" data-purpose="service-tags">
          {previewLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href || "#"}
              onClick={(e) => e.stopPropagation()}
              target={link.href && link.href !== "#" ? "_blank" : undefined}
              rel={link.href && link.href !== "#" ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-md px-3 py-2 transition-colors group/link"
            >
              <span className="font-medium text-slate-700 truncate flex items-center gap-2">
                <LinkLogo logo={link.logo} label={link.label} size="sm" />
                <span className={`truncate ${pal.hoverLink} transition-colors`}>{link.label}</span>
              </span>
              <span className={`text-slate-400 text-[11px] shrink-0 ml-2 ${pal.hoverLink} transition-colors`}>
                Buka
              </span>
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer mt-auto"
        >
          <span>Lihat Semua ({links.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.article>

      {/* ══════════════════════════════════════
          POPUP — Project Index row style
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
                    <span className={`inline-block h-2 w-2 rounded-full ${pal.iconBg} ${pal.iconColor}`} />
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
                      className="group flex items-center gap-3 border-t border-slate-100 py-3 outline-none sm:gap-4 sm:py-4 last:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                    >
                      {/* Logo */}
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 sm:h-8 sm:w-8">
                        <LinkLogo logo={link.logo} label={link.label} size="md" />
                      </div>

                      {/* Name + Kategori */}
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

                      {/* Buka */}
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
                          isActive ? "text-blue-600" : "text-slate-200",
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