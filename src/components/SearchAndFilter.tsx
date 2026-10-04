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
  publicCount?: number;
  internalCount?: number;
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
  publicCount,
  internalCount,
}: SearchAndFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Input & Access Segment Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Clean Live Search Input with Clear Contrast & Focus Motion */}
        <div className="relative flex-1 max-w-lg group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00A6B4] transition-colors duration-150">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari aplikasi, akronim, kata kunci, atau nama fungsi..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all duration-200 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Segmented Access Pill with Micro-motions */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/90 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 self-start md:self-auto shadow-2xs">
          <button
            onClick={() => onSelectAccess("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.97] cursor-pointer ${
              selectedAccess === "all"
                ? "bg-[#005AA9] text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/50"
            }`}
          >
            <span>Semua Akses</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold transition-colors ${
                selectedAccess === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {totalCount}
            </span>
          </button>
          <button
            onClick={() => onSelectAccess("public")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.97] cursor-pointer ${
              selectedAccess === "public"
                ? "bg-[#6DBE45] text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:text-[#2f6318] dark:hover:text-[#8ee064] hover:bg-white/40 dark:hover:bg-slate-700/50"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publik</span>
            {publicCount !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold transition-colors ${
                  selectedAccess === "public"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {publicCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectAccess("internal")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.97] cursor-pointer ${
              selectedAccess === "internal"
                ? "bg-[#00A6B4] text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:text-[#006069] dark:hover:text-[#38d4e2] hover:bg-white/40 dark:hover:bg-slate-700/50"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Internal</span>
            {internalCount !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold transition-colors ${
                  selectedAccess === "internal"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {internalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 7 Kategori Tabs (Smooth Scroll with Hover Lift & Active Scale) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer border ${
            selectedCategoryId === null
              ? "bg-[#005AA9] text-white border-[#005AA9] shadow-xs"
              : "bg-white dark:bg-[#151f32] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-[#005AA9]/50 shadow-2xs"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Semua Kategori</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              selectedCategoryId === null
                ? "bg-white/20 text-white"
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
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer border ${
                isSelected
                  ? "bg-[#005AA9] text-white border-[#005AA9] shadow-xs"
                  : "bg-white dark:bg-[#151f32] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-[#005AA9]/50 shadow-2xs"
              }`}
            >
              <span>{cat.nama_kategori}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
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
