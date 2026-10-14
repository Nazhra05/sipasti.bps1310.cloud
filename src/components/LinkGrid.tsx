"use client";

import { useState, useMemo, useEffect } from "react";
import { RefreshCw, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import LinkCard from "./LinkCard";
import ErrorBoundary from "./ErrorBoundary";
import { EnrichedLayanan } from "@/lib/accessibilityMapper";

interface LinkGridProps {
  layananList: EnrichedLayanan[];
  isLoading: boolean;
  searchQuery: string;
  onResetSearch: () => void;
  onCopyLink: (url: string, name: string) => void;
  onRefresh: () => void;
  favoriteIds?: number[];
  onToggleFavorite?: (id_layanan: number) => void;
}

const ITEMS_PER_PAGE = 12;

export default function LinkGrid({
  layananList,
  isLoading,
  searchQuery,
  onResetSearch,
  onCopyLink,
  onRefresh,
  favoriteIds = [],
  onToggleFavorite,
}: LinkGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page whenever search query or list size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, layananList.length]);

  const totalPages = Math.ceil(layananList.length / ITEMS_PER_PAGE);

  const paginatedList = useMemo(() => {
    if (layananList.length <= ITEMS_PER_PAGE) return layananList;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return layananList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [layananList, currentPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-5 space-y-4 animate-shimmer"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-md" />
            </div>
            <div className="flex gap-3">
              <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md" />
              </div>
            </div>
            <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl" />
            <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (layananList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Modern Vector Empty State Graphic */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#005AA9] dark:text-[#38a0f0] opacity-80"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="10" y="14" width="44" height="38" rx="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M22 26H42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 34H36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="43" cy="41" r="9" fill="white" className="dark:fill-[#151f32]" stroke="#FFA500" strokeWidth="2.5" />
              <path d="M49 47L54 52" stroke="#FFA500" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
          {searchQuery
            ? `Tidak ada aplikasi yang cocok dengan "${searchQuery}"`
            : "Belum ada aplikasi yang terdaftar"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {searchQuery
            ? "Coba periksa ejaan kata kunci, gunakan sinonim umum, atau reset filter pencarian untuk melihat semua layanan yang tersedia."
            : "Katalog layanan saat ini belum tersedia atau sedang dalam proses pembaruan data."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {searchQuery && (
            <button
              onClick={onResetSearch}
              className="px-4.5 py-2.5 rounded-xl text-xs font-bold bg-[#005AA9] hover:bg-[#004280] text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-xs"
            >
              Reset Filter / Tampilkan Semua Layanan
            </button>
          )}
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan Data API</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid Kartu Layanan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {paginatedList.map((item) => (
          <ErrorBoundary key={item.id_layanan} fallbackTitle="Gagal Memuat Kartu Aplikasi">
            <LinkCard
              layanan={item}
              onCopyLink={onCopyLink}
              isFavorite={favoriteIds.includes(item.id_layanan)}
              onToggleFavorite={onToggleFavorite}
            />
          </ErrorBoundary>
        ))}
      </div>

      {/* Pagination Controls (Only displayed when items exceed ITEMS_PER_PAGE) */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Layers className="w-4 h-4 text-[#005AA9] dark:text-[#38a0f0]" />
            <span>
              Menampilkan{" "}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, layananList.length)}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {layananList.length}
              </strong>{" "}
              aplikasi
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#005AA9] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition font-medium"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

