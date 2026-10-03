"use client";

import { Search, X, Globe, Lock, LayoutGrid } from "lucide-react";
import { KategoriItem } from "@/lib/api";
import { AccessType } from "@/lib/accessibilityMapper";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: KategoriItem[];
  selectedCategoryId: number | null; // null = Semua
  onSelectCategory: (id: number | null) => void;
  selectedAccess: AccessType | "all";
  onSelectAccess: (access: AccessType | "all") => void;
  categoryCounts: Map<number, number>;
  totalCount: number;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedAccess,
  onSelectAccess,
  categoryCounts,
  totalCount,
}: SearchAndFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Input & Access Segment Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Clean Live Search Input with Clear Contrast */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari aplikasi, akronim, kata kunci, atau nama fungsi..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 dark:focus:ring-slate-100/20 focus:border-slate-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Segmented Access Pill with Clear Contrast */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/90 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 self-start md:self-auto shadow-2xs">
          <button
            onClick={() => onSelectAccess("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedAccess === "all"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            Semua Akses
          </button>
          <button
            onClick={() => onSelectAccess("public")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedAccess === "public"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publik</span>
          </button>
          <button
            onClick={() => onSelectAccess("internal")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedAccess === "internal"
                ? "bg-[#003366] dark:bg-blue-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Internal</span>
          </button>
        </div>
      </div>

      {/* 7 Kategori Tabs (Comfortable Scrolling Tabs with Crisp Contrast) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
            selectedCategoryId === null
              ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-xs"
              : "bg-white dark:bg-[#151f32] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-2xs"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Semua Kategori</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              selectedCategoryId === null
                ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {totalCount}
          </span>
        </button>

        {categories.map((cat) => {
          const count = categoryCounts.get(cat.id_kategori) ?? 0;
          const isSelected = selectedCategoryId === cat.id_kategori;
          return (
            <button
              key={cat.id_kategori}
              onClick={() => onSelectCategory(cat.id_kategori)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-xs"
                  : "bg-white dark:bg-[#151f32] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-2xs"
              }`}
            >
              <span>{cat.nama_kategori}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
