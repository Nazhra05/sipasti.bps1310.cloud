"use client";

import { useState, useEffect, useMemo } from "react";
import { ExternalLink, ShieldCheck, X, ChevronDown } from "lucide-react";
import type { LayananItem } from "@/lib/api";

interface DirectorySectionProps {
  layanans: LayananItem[];
}

// Fallback services matching HTML reference if API is empty or offline
const fallbackLayanans: LayananItem[] = [
  {
    id_layanan: 1,
    id_kategori: 1,
    nama_layanan: "Website Resmi BPS Solok Selatan",
    url: "https://solokselatankab.bps.go.id",
    logo: "",
    nama_kategori: "Umum & Portal Induk",
  },
  {
    id_layanan: 2,
    id_kategori: 2,
    nama_layanan: "SE2026 - Sensus Ekonomi 2026",
    url: "https://se2026.bps.go.id",
    logo: "",
    nama_kategori: "Distribusi",
  },
  {
    id_layanan: 3,
    id_kategori: 3,
    nama_layanan: "AllStats BPS",
    url: "https://allstats.bps.go.id",
    logo: "",
    nama_kategori: "Diseminasi",
  },
  {
    id_layanan: 4,
    id_kategori: 4,
    nama_layanan: "Silastik – PST BPS Solok Selatan",
    url: "https://pst.bps.go.id",
    logo: "",
    nama_kategori: "Diseminasi",
  },
  {
    id_layanan: 5,
    id_kategori: 5,
    nama_layanan: "Dashboard PDRB & Pertumbuhan",
    url: "https://solokselatankab.bps.go.id",
    logo: "",
    nama_kategori: "Neraca Wilayah",
  },
  {
    id_layanan: 6,
    id_kategori: 6,
    nama_layanan: "Portal Satu Data Solok Selatan (SDI)",
    url: "https://satudata.solokselatankab.go.id",
    logo: "",
    nama_kategori: "TI & IPDS",
  },
  {
    id_layanan: 7,
    id_kategori: 7,
    nama_layanan: "Indikator Kesejahteraan & Kemiskinan",
    url: "https://solokselatankab.bps.go.id",
    logo: "",
    nama_kategori: "Sosial & Penduduk",
  },
  {
    id_layanan: 8,
    id_kategori: 8,
    nama_layanan: "PPID BPS Solok Selatan",
    url: "https://ppid.bps.go.id/?mfd=1310",
    logo: "",
    nama_kategori: "Umum & PPID",
  },
];

function getCategoryBadgeStyle(catName: string) {
  const c = catName.toLowerCase();
  if (c.includes("distribusi")) return { bg: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-600" };
  if (c.includes("produksi")) return { bg: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-600" };
  if (c.includes("neraca")) return { bg: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-600" };
  if (c.includes("sosial")) return { bg: "bg-violet-50 text-violet-700", dot: "bg-violet-600" };
  if (c.includes("ti") || c.includes("ipds")) return { bg: "bg-cyan-50 text-cyan-700", dot: "bg-cyan-600" };
  if (c.includes("diseminasi")) return { bg: "bg-amber-50 text-amber-700", dot: "bg-amber-600" };
  if (c.includes("umum") || c.includes("ppid")) return { bg: "bg-orange-50 text-orange-700", dot: "bg-orange-600" };
  return { bg: "bg-blue-50 text-blue-700", dot: "bg-blue-600" };
}

function getDomainFromUrl(urlStr: string) {
  if (!urlStr || urlStr === "#") return "solokselatankab.bps.go.id";
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return urlStr.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "solokselatankab.bps.go.id";
  }
}

function getDummyTags(catName: string) {
  const c = catName.toLowerCase();
  if (c.includes("distribusi")) return ["Sensus Nasional", "Unit Usaha", "Peta Wilkerstat"];
  if (c.includes("produksi")) return ["Produksi Pangan", "Tabel Statis", "Survei Pertanian"];
  if (c.includes("neraca")) return ["Dashboard Interaktif", "PDRB ADHB & ADHK", "Analisis Makro"];
  if (c.includes("sosial")) return ["IPM & Kemiskinan", "Susenas", "Tabel Dinamis"];
  if (c.includes("ti") || c.includes("ipds")) return ["API Interoperabilitas", "Data Sektoral Pemda", "Metadata Baku"];
  if (c.includes("diseminasi")) return ["Data Mikro", "Ekspor Excel", "Nasional & Daerah"];
  if (c.includes("umum") || c.includes("ppid")) return ["KIP Award", "Laporan SAKIP", "Regulasi BPS"];
  return ["Resmi BPS", "Layanan Publik", "Data Solsel"];
}

export default function DirectorySection({ layanans }: DirectorySectionProps) {
  const INITIAL_LIMIT = 8;
  const [showAll, setShowAll] = useState(false);

  const displayItems = useMemo(() => {
    return layanans && layanans.length > 0 ? layanans : fallbackLayanans;
  }, [layanans]);

  const [activeCategory, setActiveCategory] = useState("Semua Layanan");
  const [selectedMetadataItem, setSelectedMetadataItem] = useState<LayananItem | null>(null);

  // Reset showAll when activeCategory changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  // Default categories filter list
  const categoryFilters = useMemo(() => {
    const set = new Set<string>();
    displayItems.forEach((item) => {
      if (item.nama_kategori) set.add(item.nama_kategori);
    });
    // Add default standard categories if not present
    ["Distribusi", "Produksi", "Neraca", "Sosial", "TI & IPDS", "Umum", "Diseminasi"].forEach((c) => set.add(c));
    return ["Semua Layanan", ...Array.from(set)];
  }, [displayItems]);

  // Listen for category selection events from Navbar
  useEffect(() => {
    const handleSelectCategory = (e: Event) => {
      const cat = (e as CustomEvent<{ category: string }>).detail?.category;
      if (!cat) return;
      if (cat === "Semua Kategori" || cat === "Semua Layanan") {
        setActiveCategory("Semua Layanan");
      } else {
        const found = categoryFilters.find(
          (c) =>
            c.toLowerCase() === cat.toLowerCase() ||
            c.toLowerCase().includes(cat.toLowerCase()) ||
            cat.toLowerCase().includes(c.toLowerCase())
        );
        if (found) setActiveCategory(found);
      }
    };
    window.addEventListener("select-category", handleSelectCategory);
    return () => window.removeEventListener("select-category", handleSelectCategory);
  }, [categoryFilters]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === "Semua Layanan") return displayItems;
    return displayItems.filter(
      (item) =>
        item.nama_kategori &&
        (item.nama_kategori.toLowerCase() === activeCategory.toLowerCase() ||
          item.nama_kategori.toLowerCase().includes(activeCategory.toLowerCase()) ||
          activeCategory.toLowerCase().includes(item.nama_kategori.toLowerCase()))
    );
  }, [displayItems, activeCategory]);

  // Visible items based on showAll state
  const visibleItems = useMemo(() => {
    if (activeCategory === "Semua Layanan" && !showAll) {
      return filteredItems.slice(0, INITIAL_LIMIT);
    }
    return filteredItems;
  }, [filteredItems, activeCategory, showAll]);

  return (
    <section id="direktori-layanan" aria-labelledby="directory-title" className="w-full bg-slate-50 py-12 md:py-16 border-t border-slate-200" data-purpose="service-directory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Block */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block mb-2">
            KATALOG DIGITAL TERPADU
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" id="directory-title">
                Direktori Layanan &amp; Website Resmi
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-1">
                Pilih kategori atau gunakan pencarian untuk menemukan tautan sistem, portal rilis, dan dashboard data BPS Solok Selatan.
              </p>
            </div>
            <div className="text-xs md:text-sm font-medium text-slate-500 whitespace-nowrap">
              Menampilkan <span className="font-semibold text-slate-800">{visibleItems.length}</span> dari{" "}
              <span className="font-semibold text-slate-800">{filteredItems.length} Layanan Utama</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 no-scrollbar" data-purpose="category-filters">
          <button
            type="button"
            aria-label="Filter Semua Layanan"
            onClick={() => setActiveCategory("Semua Layanan")}
            className={
              activeCategory === "Semua Layanan"
                ? "px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition whitespace-nowrap"
                : "px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap"
            }
          >
            Semua Layanan ({displayItems.length})
          </button>
          {categoryFilters
            .filter((cat) => cat !== "Semua Layanan")
            .map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  aria-label={`Filter ${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    isActive
                      ? "px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition whitespace-nowrap"
                      : "px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap"
                  }
                >
                  {cat}
                </button>
              );
            })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-purpose="services-grid">
          {visibleItems.map((item) => {
            const badgeStyle = getCategoryBadgeStyle(item.nama_kategori || "Umum");
            const domain = getDomainFromUrl(item.url);
            const dummyTags = getDummyTags(item.nama_kategori || "Umum");

            return (
              <article
                key={item.id_layanan}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Card Header & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${badgeStyle.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot} mr-1.5`}></span>
                      {item.nama_kategori || "Layanan BPS"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]" title={domain}>
                      {domain}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                    {item.nama_layanan}
                  </h3>

                  {/* Description: Lorem Ipsum */}
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {dummyTags.map((tag) => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href={item.url || "#"}
                    target={item.url ? "_blank" : undefined}
                    rel={item.url ? "noopener noreferrer" : undefined}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-800 transition"
                  >
                    Buka Website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedMetadataItem(item)}
                    className="w-full text-center text-xs font-medium text-slate-500 hover:text-slate-800 py-1 transition cursor-pointer"
                  >
                    Lihat Detail Metadata
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Toggle Show All Button when in Semua Layanan and items exceed initial limit */}
        {activeCategory === "Semua Layanan" && filteredItems.length > INITIAL_LIMIT && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs md:text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900/30 cursor-pointer"
            >
              <span>
                {showAll
                  ? "Tampilkan Lebih Sedikit"
                  : `Tampilkan Semua Layanan (${filteredItems.length})`}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Metadata Detail Modal */}
      {selectedMetadataItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900">Detail Metadata Layanan</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMetadataItem(null)}
                aria-label="Tutup"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Nama Layanan:</span>
                <p className="text-sm font-bold text-slate-900">{selectedMetadataItem.nama_layanan}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Kategori:</span>
                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  {selectedMetadataItem.nama_kategori || "Layanan Statistik"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">URL / Tautan Resmi:</span>
                <a
                  href={selectedMetadataItem.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-mono hover:underline break-all"
                >
                  {selectedMetadataItem.url || "https://solokselatankab.bps.go.id"}
                </a>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Standar Data:</span>
                <p className="text-slate-600">Satu Data Indonesia (SDI) - BPS Kabupaten Solok Selatan</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setSelectedMetadataItem(null)}
                className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Tutup
              </button>
              {selectedMetadataItem.url && (
                <a
                  href={selectedMetadataItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition inline-flex items-center gap-1"
                >
                  Kunjungi Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
