"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  FolderHeart,
  PlusCircle,
  HelpCircle,
  Sun,
  Moon,
  Phone,
  Mail,
  ExternalLink,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Globe,
  Menu,
  LayoutGrid,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { KategoriItem } from "@/lib/api";
import AccountDetailModal from "./AccountDetailModal";

interface NavbarProps {
  onOpenVpnGuide?: () => void;
  onOpenRepository?: () => void;
  categories?: KategoriItem[];
  selectedCategoryId?: number | null;
  onSelectCategory?: (id: number | null) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

// 7 Kategori Resmi BPS Kabupaten Solok Selatan
const DEFAULT_CATEGORIES: Array<{ id: number; name: string; desc: string }> = [
  { id: 1, name: "Distribusi", desc: "Perdagangan, transportasi, pariwisata & sensus ekonomi" },
  { id: 2, name: "Produksi", desc: "Pertanian, industri pengolahan, pertambangan & energi" },
  { id: 3, name: "Neraca", desc: "PDRB, neraca wilayah, dan analisis ekonomi makro" },
  { id: 4, name: "Sosial", desc: "Kependudukan, ketenagakerjaan, kemiskinan & IPM" },
  { id: 5, name: "TI (Teknologi Informasi)", desc: "Sistem otomasi, integrasi data, GIS & portal dinas" },
  { id: 6, name: "Umum", desc: "Administrasi kepegawaian, persuratan & PPID" },
  { id: 7, name: "Diseminasi", desc: "Pelayanan statistik terpadu (PST) & publikasi data" },
];

export default function Navbar({
  onOpenVpnGuide,
  onOpenRepository,
  categories = [],
  selectedCategoryId = null,
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
}: NavbarProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Antigravity Smart Scroll States
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

  // Popover / Dropdown States
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const categoryRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contactTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    if (contactTimeoutRef.current) {
      clearTimeout(contactTimeoutRef.current);
      contactTimeoutRef.current = null;
    }
    setIsContactOpen(false);
    setIsCategoryOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  const handleContactMouseEnter = () => {
    if (contactTimeoutRef.current) {
      clearTimeout(contactTimeoutRef.current);
      contactTimeoutRef.current = null;
    }
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    setIsCategoryOpen(false);
    setIsContactOpen(true);
  };

  const handleContactMouseLeave = () => {
    contactTimeoutRef.current = setTimeout(() => {
      setIsContactOpen(false);
    }, 150);
  };

  const handleCategoryButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCategoryOpen(false);
    try {
      const smoother = (window as unknown as { ScrollSmootherInstance?: { scrollTo: (target: string | number, smooth?: boolean) => void } }).ScrollSmootherInstance;
      if (smoother && typeof smoother.scrollTo === "function") {
        smoother.scrollTo("#kategori-carousel", true);
        return;
      }
    } catch {
      // fallback
    }
    const targetEl = document.getElementById("kategori-carousel");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactOpen(false);
    try {
      const smoother = (window as unknown as { ScrollSmootherInstance?: { scrollTo: (target: string | number, smooth?: boolean) => void } }).ScrollSmootherInstance;
      if (smoother && typeof smoother.scrollTo === "function") {
        smoother.scrollTo("#footer", true);
        return;
      }
    } catch {
      // fallback
    }
    const targetEl = document.getElementById("footer");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
    setIsContactOpen(false);
    if (pathname === "/") {
      e.preventDefault();
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
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
    setIsContactOpen(false);
    if (typeof window !== "undefined" && window.location.pathname === "/katalog") {
      try {
        const smoother = (window as unknown as { ScrollSmootherInstance?: { scrollTo: (target: string | number, smooth?: boolean) => void } }).ScrollSmootherInstance;
        if (smoother && typeof smoother.scrollTo === "function") {
          smoother.scrollTo("#katalog-layanan", true);
          return;
        }
      } catch {
        // fallback
      }
      const catalogEl = document.getElementById("katalog-layanan");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push("/katalog");
  };

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    // Scroll listener: reactive glassmorphism and smart hide/show
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Click outside handler for popovers
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }
      if (contactRef.current && !contactRef.current.contains(target)) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
      if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    };
  }, []);

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.contains("dark");
    if (isDarkNow) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleSelectCategory = (id: number | null) => {
    if (onSelectCategory) {
      onSelectCategory(id);
    }
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
    if (typeof window !== "undefined" && window.location.pathname === "/katalog") {
      const catalogEl = document.getElementById("katalog-layanan");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(id !== null ? `/katalog?kategori=${id}` : "/katalog");
    }
  };

  const handleLogout = () => {
    logout();
    setIsAccountModalOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  // Combine fetched categories with fallback defaults
  const displayCategories =
    categories.length >= 7
      ? categories.slice(0, 7).map((c) => ({
          id: c.id_kategori,
          name: c.nama_kategori,
          desc: c.deskripsi || "Kategori layanan statistik terpadu",
        }))
      : DEFAULT_CATEGORIES;

  return (
    <>
      {/* Main Navbar Header Shell (Google Antigravity Architecture) */}
      <header
        data-analytics-nav="header"
        data-scroll-reactive="true"
        data-opaque={isScrolled ? "true" : "false"}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full bg-white/80 dark:bg-[#0c1424]/80 backdrop-blur-md transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-3">
              {/* =========================================================
                  SISI KIRI:
                  Logo sipasti, Kategori (dropdown 7 kategori), 
                  Repositori Pribadi, Tambah Layanan, Panduan, Kontak
              ========================================================= */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0 min-w-0">
                {/* 1. Logo SIPASTI */}
                <Link
                  href="/"
                  className="flex items-center gap-2 group focus:outline-none shrink-0 mr-1 sm:mr-2"
                  aria-label="SIPASTI - BADAN PUSAT STATISTIK KABUPATEN SOLOK SELATAN"
                >
                  <div className="relative flex items-center justify-center h-9 w-auto shrink-0 select-none">
                    <Image
                      src="/SIPASTI Logo.png"
                      alt="Logo SIPASTI"
                      width={130}
                      height={40}
                      className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-2xs"
                      priority
                    />
                  </div>
                </Link>

                {/* Vertical Divider Line */}
                <div className="hidden xl:block h-4 w-px bg-slate-200 dark:bg-slate-700/60 mx-1" />

                {/* 2. Home Link */}
                <Link
                  href="/"
                  onClick={handleHomeClick}
                  className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    pathname === "/"
                      ? "bg-[#005AA9]/10 dark:bg-sky-500/15 text-[#005AA9] dark:text-sky-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
                  title="Kembali ke Beranda"
                >
                  <span>Home</span>
                </Link>

                {/* 2. Kategori (Dropdown 7 Kategori - Hover Trigger) */}
                <div
                  className="relative"
                  ref={categoryRef}
                  onMouseEnter={handleCategoryMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <button
                    type="button"
                    onClick={handleCategoryButtonClick}
                    aria-expanded={isCategoryOpen}
                    aria-haspopup="true"
                    aria-controls="kategori-menu"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isCategoryOpen || selectedCategoryId !== null
                        ? "bg-[#005AA9]/10 dark:bg-sky-500/15 text-[#005AA9] dark:text-sky-300 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <span>Kategori</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                        isCategoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Antigravity Subnav Dropdown Card */}
                  {isCategoryOpen && (
                    <div
                      id="kategori-menu"
                      role="menu"
                      className="absolute left-0 mt-2.5 w-76 sm:w-84 rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          7 Kategori Statistik BPS
                        </span>
                        {selectedCategoryId !== null && (
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(null)}
                            className="text-[11px] font-semibold text-[#005AA9] dark:text-sky-400 hover:underline cursor-pointer"
                          >
                            Reset Filter
                          </button>
                        )}
                      </div>

                      <div className="space-y-0.5 max-h-80 overflow-y-auto">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleSelectCategory(null)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            selectedCategoryId === null
                              ? "bg-sky-50 dark:bg-sky-950/60 text-[#005AA9] dark:text-sky-300 font-semibold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                          }`}
                        >
                          <span>Semua Layanan</span>
                          <span className="text-[10px] text-slate-400">Pusat Katalog</span>
                        </button>

                        {displayCategories.map((cat, idx) => (
                          <button
                            key={cat.id || idx}
                            type="button"
                            role="menuitem"
                            onClick={() => handleSelectCategory(cat.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition-colors cursor-pointer ${
                              selectedCategoryId === cat.id
                                ? "bg-sky-50 dark:bg-sky-950/60 text-[#005AA9] dark:text-sky-300 font-semibold border-l-2 border-[#005AA9] dark:border-sky-400 pl-2.5"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {cat.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {cat.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Repositori Pribadi */}
                {onOpenRepository ? (
                  <button
                    type="button"
                    onClick={onOpenRepository}
                    className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-200 cursor-pointer"
                    title="Buka Ruang Kerja & Koleksi Repositori Pribadi"
                  >
                    <span>Repositori Pribadi</span>
                  </button>
                ) : (
                  <Link
                    href="/repositori"
                    className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-200 cursor-pointer"
                    title="Buka Ruang Kerja & Koleksi Repositori Pribadi"
                  >
                    <span>Repositori Pribadi</span>
                  </Link>
                )}

                {/* 4. Katalog Layanan */}
                <button
                  type="button"
                  onClick={handleCatalogClick}
                  className={`hidden lg:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    pathname === "/katalog"
                      ? "bg-[#005AA9]/10 dark:bg-sky-500/15 text-[#005AA9] dark:text-sky-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
                  title="Lihat Seluruh Katalog Layanan & Aplikasi BPS"
                >
                  <span>Katalog Layanan</span>
                </button>

                {/* 5. Panduan */}
                <button
                  type="button"
                  onClick={() => onOpenVpnGuide && onOpenVpnGuide()}
                  aria-label="Panduan Info VPN"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-200 cursor-pointer"
                  title="Panduan Akses VPN & Jaringan Kedinasan BPS"
                >
                  <span>Panduan</span>
                </button>

                {/* 6. Kontak (Dropdown - Hover Trigger) */}
                <div
                  className="relative"
                  ref={contactRef}
                  onMouseEnter={handleContactMouseEnter}
                  onMouseLeave={handleContactMouseLeave}
                >
                  <button
                    type="button"
                    onClick={handleContactButtonClick}
                    aria-expanded={isContactOpen}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isContactOpen
                        ? "bg-[#005AA9]/10 dark:bg-sky-500/15 text-[#005AA9] dark:text-sky-300 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    }`}
                    title="Kontak & Pusat Bantuan BPS Solok Selatan"
                  >
                    <span>Kontak</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                        isContactOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Popover Kontak */}
                  {isContactOpen && (
                    <div className="absolute left-0 mt-2.5 w-68 rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Pusat Bantuan & Layanan
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <a
                          href="https://wa.me/628116661310"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div>
                            <p className="font-semibold">WhatsApp PST BPS</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Konsultasi data statistik</p>
                          </div>
                        </a>

                        <a
                          href="mailto:bps1310@bps.go.id"
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                          <div>
                            <p className="font-semibold">Email Resmi</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">bps1310@bps.go.id</p>
                          </div>
                        </a>

                        <a
                          href="https://solokselatankab.bps.go.id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div>
                            <p className="font-semibold">Website Utama</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">solokselatankab.bps.go.id</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* =========================================================
                  SISI KANAN:
                  Mode (dark/white), Akun
              ========================================================= */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* 1. Mode (Dark / Light Toggle) */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
                  title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-transform active:scale-90 hover:rotate-12 cursor-pointer"
                >
                  {mounted && isDark ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* 3. Akun (Masuk / Profil Avatar - Direct Modal Trigger) */}
                <div>
                  {!isAuthenticated ? (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#005AA9] hover:bg-[#004280] dark:bg-sky-600 dark:hover:bg-sky-500 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Akun</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountModalOpen(true);
                        setIsCategoryOpen(false);
                        setIsContactOpen(false);
                      }}
                      aria-label="Detail Akun Pengguna"
                      title="Buka Detail Akun"
                      className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold bg-[#005AA9]/10 dark:bg-sky-500/15 text-[#005AA9] dark:text-sky-300 border border-[#005AA9]/20 dark:border-sky-500/30 hover:bg-[#005AA9]/15 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#005AA9] dark:bg-sky-600 text-white flex items-center justify-center font-bold text-[11px]">
                        {user?.name?.[0]?.toUpperCase() || "P"}
                      </div>
                      <span className="hidden sm:inline max-w-[80px] md:max-w-[110px] truncate">{user?.name || "Akun"}</span>
                    </button>
                  )}
                </div>

                {/* Mobile Menu Hamburger Trigger */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  aria-label="Menu Navigasi Mobile"
                  className="sm:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Antigravity Mobile Journey) */}
        {isMobileMenuOpen && (
          <div className="sm:hidden w-full bg-white/90 dark:bg-[#0c1424]/90 backdrop-blur-md shadow-xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Link
                href="/"
                onClick={handleHomeClick}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium cursor-pointer ${
                  pathname === "/"
                    ? "bg-[#005AA9]/15 text-[#005AA9] dark:text-sky-300 font-semibold"
                    : "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <Home className="w-4 h-4 text-[#005AA9] dark:text-sky-400" />
                <span>Home</span>
              </Link>

              <button
                type="button"
                onClick={handleCatalogClick}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium cursor-pointer ${
                  pathname === "/katalog"
                    ? "bg-[#005AA9]/15 text-[#005AA9] dark:text-sky-300 font-semibold"
                    : "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-[#005AA9] dark:text-sky-400" />
                <span>Katalog Layanan</span>
              </button>

              {onOpenRepository ? (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRepository();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                >
                  <FolderHeart className="w-4 h-4 text-rose-500" />
                  <span>Repositori</span>
                </button>
              ) : (
                <Link
                  href="/repositori"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                >
                  <FolderHeart className="w-4 h-4 text-rose-500" />
                  <span>Repositori</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onOpenVpnGuide) onOpenVpnGuide();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Panduan</span>
              </button>

              <a
                href="https://wa.me/628116661310"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
              >
                <Phone className="w-4 h-4 text-sky-500" />
                <span>Kontak PST</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Modal Detail Akun Pengguna */}
      <AccountDetailModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
        onLogout={handleLogout}
        onOpenRepository={onOpenRepository}
      />
    </>
  );
}
