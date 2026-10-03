"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Application Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 p-4">
      <div className="max-w-md w-full rounded-3xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-300 dark:border-red-800 shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Terjadi Kesalahan Sistem
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Halaman mengalami kendala saat memuat data. Silakan coba segarkan kembali halaman ini.
          </p>
          {error?.message && (
            <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 text-left overflow-x-auto border border-slate-200 dark:border-slate-700">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-500 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Segarkan Halaman</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
