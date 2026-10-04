"use client";

import { Inbox, RefreshCw, SearchX } from "lucide-react";
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
}

export default function LinkGrid({
  layananList,
  isLoading,
  searchQuery,
  onResetSearch,
  onCopyLink,
  onRefresh,
}: LinkGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-5 space-y-4 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="flex gap-3">
              <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
            <div className="h-12 bg-slate-100 dark:bg-slate-700/40 rounded-xl" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (layananList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
          {searchQuery ? <SearchX className="w-8 h-8" /> : <Inbox className="w-8 h-8" />}
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
          {searchQuery
            ? `Tidak ada aplikasi yang cocok dengan "${searchQuery}"`
            : "Belum ada aplikasi yang terdaftar"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5">
          {searchQuery
            ? "Coba gunakan kata kunci lain, atau periksa filter kategori dan status jaringan."
            : "Silakan periksa koneksi backend API atau segarkan kembali halaman."}
        </p>
        <div className="flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={onResetSearch}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#005AA9] hover:bg-[#004280] text-white transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs"
            >
              Reset Pencarian
            </button>
          )}
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang API</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {layananList.map((item) => (
        <ErrorBoundary key={item.id_layanan} fallbackTitle="Gagal Memuat Kartu Aplikasi">
          <LinkCard layanan={item} onCopyLink={onCopyLink} />
        </ErrorBoundary>
      ))}
    </div>
  );
}
