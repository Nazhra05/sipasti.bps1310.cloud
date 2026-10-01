"use client";

import Image from "next/image";
import { heroLogo } from "@/data";
import SearchBar from "@/components/SearchBar";
import type { FlatResult } from "@/components/SearchBar";

interface HeroProps {
  searchIndex: FlatResult[];
}

export default function Hero({ searchIndex }: HeroProps) {
  return (
    <section id="hero" className="hero-gradient-bg relative w-full pt-10 pb-0 border-b border-slate-200" data-purpose="hero-section">
      {/* Hero Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* SIPASTI Logo & Top Badge Indicator */}
        <div className="flex flex-col items-center justify-center mb-6">
          {/* <Image
            src={heroLogo}
            alt="SIPASTI BPS Kabupaten Solok Selatan"
            width={600}
            height={240}
            className="h-16 w-auto object-contain sm:h-20 mb-4"
            priority
          /> */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide uppercase shadow-sm" data-purpose="portal-badge">
            {/* Civic / Landmark Building Icon */}
            <svg aria-hidden="true" className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span>Portal Statistik Terintegrasi Kabupaten Solok Selatan</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-4">
          <span className="sr-only">Sistem Portal Statistik Terintegrasi - </span>
          Temukan berbagai website dan informasi statistik BPS Kabupaten Solok Selatan
        </h1>

        {/* Subtitle Description */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
          Satu gerbang terpusat untuk mengakses website resmi, dashboard analitik sektoral, layanan publik statistik, publikasi, dan metadata resmi Solok Selatan.
        </p>

        {/* Search Bar Input Container & Quick Search Tags */}
        <SearchBar searchIndex={searchIndex} />

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-3xl mx-auto mb-12" data-purpose="metrics-summary-grid">
          {/* Metric 1 */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 sm:p-4 text-center shadow-xs transition-all hover:bg-blue-50">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none mb-1">7</div>
            <div className="text-xs font-medium text-slate-600">Kategori Utama</div>
          </div>
          {/* Metric 2 */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 sm:p-4 text-center shadow-xs transition-all hover:bg-blue-50">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none mb-1">32+</div>
            <div className="text-xs font-medium text-slate-600">Layanan &amp; Portal Digital</div>
          </div>
          {/* Metric 3 */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 sm:p-4 text-center shadow-xs transition-all hover:bg-blue-50">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none mb-1">100%</div>
            <div className="text-xs font-medium text-slate-600">Data Resmi BPS</div>
          </div>
          {/* Metric 4 */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 sm:p-4 text-center shadow-xs transition-all hover:bg-blue-50">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-none mb-1">SDI</div>
            <div className="text-xs font-medium text-slate-600">Standar Satu Data</div>
          </div>
        </div>
      </div>

      {/* BEGIN: BRS Release Notification Banner (Ticker) */}
      <div className="w-full bg-[#043277] text-white text-xs py-2.5 px-4 sm:px-6" data-purpose="brs-ticker-banner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Left details: Tag & Title & Date */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold tracking-wider text-[10px] uppercase border border-amber-500/30">
              Rilis BRS Terdekat
            </span>
            <span className="font-normal text-slate-200">
              <strong className="font-semibold text-white">Perkembangan IPH dan Pertumbuhan Ekonomi Triwulan II:</strong>{" "}
              Rilis serentak terjadwal pada <span className="font-medium text-amber-200">5 Agustus 2025 (Pukul 11.00 WIB)</span>
            </span>
          </div>
          {/* Right actions: Countdown & CTA Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              {/* Clock Icon */}
              <svg aria-hidden="true" className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Hitung Mundur: <strong className="text-white">14 Hari Lagi</strong></span>
            </div>
            <a className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium transition-colors shadow-sm whitespace-nowrap" href="#kalender-rilis">
              Lihat Kalender Rilis
            </a>
          </div>
        </div>
      </div>
      {/* END: BRS Release Notification Banner */}
    </section>
  );
}