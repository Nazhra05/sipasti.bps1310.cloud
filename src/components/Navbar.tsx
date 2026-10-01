"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, User, Clock, ShieldCheck, BookOpen } from "lucide-react";
import { navbarLogo, heroLogo } from "@/data";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeString, setTimeString] = useState<string>("");
  const [miniSearch, setMiniSearch] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTimeString(now.toLocaleTimeString("id-ID", options) + " WIB");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [activeNavCategory, setActiveNavCategory] = useState("Semua Kategori");

  const categoryList = [
    "Semua Kategori",
    "Distribusi",
    "Produksi",
    "Neraca",
    "Sosial",
    "TI & IPDS",
    "Umum",
    "Diseminasi",
  ];

  useEffect(() => {
    const handleCategoryChanged = (e: Event) => {
      const cat = (e as CustomEvent<{ category: string }>).detail?.category;
      if (cat) {
        const found = categoryList.find(
          (item) =>
            item.toLowerCase() === cat.toLowerCase() ||
            cat.toLowerCase().includes(item.toLowerCase()) ||
            item.toLowerCase().includes(cat.toLowerCase())
        );
        setActiveNavCategory(found || cat);
      }
    };

    window.addEventListener("category-changed", handleCategoryChanged);
    return () => window.removeEventListener("category-changed", handleCategoryChanged);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveNavCategory(cat);
    window.dispatchEvent(
      new CustomEvent("select-category", {
        detail: { category: cat },
      })
    );
    const websitesSection = document.getElementById("websites");
    if (websitesSection) {
      websitesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMiniSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniSearch.trim()) return;
    const heroInput = document.getElementById("search-layanan") as HTMLInputElement | null;
    if (heroInput) {
      heroInput.value = miniSearch;
      heroInput.focus();
      heroInput.dispatchEvent(new Event("input", { bubbles: true }));
      const heroSection = document.getElementById("hero");
      if (heroSection) heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm" data-purpose="primary-portal-header">
      {/* BEGIN: InstitutionalTopBar */}
      <div className="w-full bg-[#043277] text-slate-300 text-xs px-4 sm:px-6 lg:px-8 py-1.5 border-b border-slate-800" data-purpose="top-utility-bar">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Identitas Instansi & Sistem */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            {/* Navbar Logo BPS menggantikan bendera */}
            <Image
              src={navbarLogo}
              alt="BPS Logo"
              width={30}
              height={30}
              className="h-4 w-auto object-contain flex-shrink-0"
              priority
            />
            <span className="font-semibold tracking-wide text-white">
              BADAN PUSAT STATISTIK KABUPATEN SOLOK SELATAN
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              Sistem Informasi Pelayanan Statistik Terintegrasi (SIPASTI)
            </span>
          </div>

          {/* Informasi PST (Real Time Clock) */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300" data-purpose="service-hours">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                PST: 08.00 - 15.30 WIB
                {timeString && (
                  <span className="ml-1.5 text-amber-300 font-medium font-mono text-[11px]">
                    • {timeString}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* END: InstitutionalTopBar */}

      {/* BEGIN: MainNavigationBar */}
      <nav className="w-full bg-[#0b1d3a]/5 sm:bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5" data-purpose="main-navigation">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          {/* Logo SIPASTI Solok Selatan (Menggunakan Hero Logo) */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link href="#" className="flex items-center gap-2 group" title="SIPASTI Solok Selatan Beranda">
              <Image
                src={heroLogo}
                alt="SIPASTI BPS Solok Selatan"
                width={200}
                height={60}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold leading-tight hidden xl:block">
                Portal BPS Solok Selatan
              </span>
            </Link>
          </div>

          {/* Menu Kategori Statistik DataStore */}
          <div className="hidden lg:flex items-center space-x-1 font-medium text-xs text-slate-600">
            {categoryList.map((cat) => {
              const isActive = cat.toLowerCase() === activeNavCategory.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={
                    isActive
                      ? "bg-[#0b1d3a] text-white px-3.5 py-2 rounded font-semibold transition hover:bg-slate-800 shadow-sm flex items-center gap-1.5"
                      : "px-3 py-2 rounded text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition font-medium"
                  }
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Navigasi Sisi Kanan: Tautan Eksternal, Cari, Profil Pengguna & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs flex-shrink-0">
            {/* Tautan Cepat Internal BPS */}
            <div className="hidden xl:flex items-center space-x-3 pr-2 border-r border-slate-200 text-slate-600 font-medium">
              <a
                className="hover:text-blue-700 transition"
                href="https://solokselatankab.bps.go.id/id"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portal BPS
              </a>
              <a
                className="hover:text-blue-700 transition"
                href="https://allstats.bps.go.id"
                target="_blank"
                rel="noopener noreferrer"
              >
                AllStats
              </a>
              <a className="hover:text-blue-700 transition" href="#footer">
                Bantuan
              </a>
            </div>

            {/* Kotak Input Pencarian Mini */}
            <form onSubmit={handleMiniSearchSubmit} className="relative w-36 sm:w-44 lg:w-48" data-purpose="mini-search">
              <input
                type="text"
                value={miniSearch}
                onChange={(e) => setMiniSearch(e.target.value)}
                placeholder="Cari Data..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-700 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
            </form>

            {/* Tombol Akun / Pengguna */}
            {/* <a
              href="#"
              aria-label="Profil Pengguna"
              title="Profil Pengguna"
              className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition shadow-sm"
            >
              <User className="w-4 h-4" />
            </a> */}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Category Dropdown Menu */}
        {mobileOpen && (
          <div className="mt-2.5 border-t border-slate-200 pt-2 lg:hidden">
            <div className="grid grid-cols-2 gap-1 text-xs">
              {categoryList.map((cat) => {
                const isActive = cat.toLowerCase() === activeNavCategory.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      handleCategoryClick(cat);
                      setMobileOpen(false);
                    }}
                    className={
                      isActive
                        ? "bg-[#0b1d3a] text-white px-3 py-2 rounded font-semibold text-center"
                        : "px-3 py-2 rounded text-slate-700 hover:bg-slate-100 text-center"
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      {/* END: MainNavigationBar */}

      {/* BEGIN: SubHeaderStatusBar */}
      <div className="w-full bg-[#f8fafc] border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2 text-[11px] sm:text-xs text-slate-600" data-purpose="status-ribbon">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-1.5">
          {/* Indikator Layanan PST & Standar Satu Data Indonesia */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="inline-flex items-center text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Layanan Terpadu Aktif • PST Online
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-blue-700 transition"
              title="Standar Satu Data Indonesia PDF"
            >
              Standar Satu Data Indonesia (SDI) Perpres No. 39/2019
            </a>
          </div>

          {/* Validasi Domain Resmi & Tautan Bantuan Panduan */}
          <div className="flex items-center space-x-3 text-slate-500">
            <div className="flex items-center space-x-1" title="Situs resmi terverifikasi BPS">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium text-slate-700">
                Domain Resmi:{" "}
                <a
                  href="https://solokselatankab.bps.go.id/id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-semibold"
                  title="Badan Pusat Statistik Kabupaten Solok Selatan"
                >
                  bps.go.id/1310
                </a>
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 flex items-center space-x-1 text-slate-700 transition"
              title="Unduh Panduan Penggunaan Portal"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">Panduan Pengguna</span>
            </a>
          </div>
        </div>
      </div>
      {/* END: SubHeaderStatusBar */}
    </header>
  );
}