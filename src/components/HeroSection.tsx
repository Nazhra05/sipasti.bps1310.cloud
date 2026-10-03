import { Globe, Lock, Layers, LayoutGrid } from "lucide-react";

interface HeroSectionProps {
  totalLinks: number;
  publicCount: number;
  internalCount: number;
  categoryCount: number;
}

export default function HeroSection({
  totalLinks,
  publicCount,
  internalCount,
  categoryCount,
}: HeroSectionProps) {
  return (
    <div className="pt-8 pb-6 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111c2e] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Title & Context */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Satu Pintu Akses Kerja Pegawai
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Repositori Tautan Internal BPS Solok Selatan
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Direktori resmi aplikasi operasional, sistem sensus, administrasi, dan layanan statistik dengan panduan status akses jaringan yang transparan.
            </p>
          </div>

          {/* Clean Minimalist Metric Cards with Clear Contrast */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            {/* Total */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total</span>
                <LayoutGrid className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {totalLinks}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Aplikasi Aktif
              </div>
            </div>

            {/* Publik */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-slate-800/60 border border-emerald-300/80 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">Publik</span>
                <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-emerald-900 dark:text-white">
                {publicCount}
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-slate-400 mt-0.5 font-medium">
                Bebas VPN
              </div>
            </div>

            {/* Internal */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-slate-800/60 border border-blue-300/80 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Internal</span>
                <Lock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              </div>
              <div className="text-xl font-extrabold text-blue-950 dark:text-white">
                {internalCount}
              </div>
              <div className="text-[11px] text-blue-700/80 dark:text-slate-400 mt-0.5 font-medium">
                Akses Kantor / VPN
              </div>
            </div>

            {/* Kategori */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Fungsi</span>
                <Layers className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {categoryCount}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Bidang Kerja
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
