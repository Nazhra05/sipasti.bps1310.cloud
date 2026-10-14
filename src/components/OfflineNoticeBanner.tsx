"use client";

import { WifiOff, RefreshCw, Clock, AlertTriangle } from "lucide-react";
import { formatLastUpdatedDate } from "@/lib/offlineFallback";

export { formatLastUpdatedDate };

interface OfflineNoticeBannerProps {
  lastUpdated: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function OfflineNoticeBanner({
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: OfflineNoticeBannerProps) {
  const formattedTime = formatLastUpdatedDate(lastUpdated);

  return (
    <div
      role="alert"
      className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <WifiOff className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-3.5 h-3.5" />
                Mode Offline
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Terakhir Diperbarui: <strong>{formattedTime}</strong>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
              Koneksi internet Anda saat ini terputus atau tidak stabil. Portal menampilkan informasi yang <strong>tersimpan sebelumnya</strong>. 
              Beberapa tautan mungkin memerlukan koneksi aktif untuk diakses.
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-200 hover:bg-amber-300 dark:bg-amber-900 dark:hover:bg-amber-800 text-amber-950 dark:text-amber-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          title="Muat ulang dan perbarui data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Memeriksa..." : "Perbarui Data"}</span>
        </button>
      </div>
    </div>
  );
}
