/**
 * data.ts
 * Static configuration: logos, images, and Quick Access links.
 * Card data (kategori + layanan) is fetched from the API — see src/lib/api.ts.
 */

// Logos
export const heroLogo = "/Hero/SIPASTIwLogo.png";
export const navbarLogo = "/BPS Logo.png";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type CardLink = {
  label: string;
  href: string;
  logo?: string;
};

export type CardData = {
  title: string;
  category: string;
  description: string;
  links: CardLink[];
};

export type QuickAccessItem = {
  label: string;
  href: string;
  logo: string;
};

// ─────────────────────────────────────────────
// QUICK ACCESS
// Static shortcuts — logos live in public/QuickAccess/
// ─────────────────────────────────────────────

export const quickAccessItems: QuickAccessItem[] = [
  {
    label: "BPS Kabupaten Solok Selatan",
    href: "https://solokselatankab.bps.go.id",
    logo: "/QuickAccess/BPSSolSel.png",
  },
  {
    label: "BPS Indonesia",
    href: "https://www.bps.go.id",
    logo: "/QuickAccess/BPSIndo.png",
  },
  {
    label: "AllStats",
    href: "https://allstats.bps.go.id",
    logo: "/QuickAccess/AllStats.png",
  },
  {
    label: "SILASTIK",
    href: "#",
    logo: "/QuickAccess/SILASTIK.png",
  },
  {
    label: "PPID",
    href: "https://ppid.bps.go.id/?mfd=1310",
    logo: "/QuickAccess/PPID.png",
  },
];