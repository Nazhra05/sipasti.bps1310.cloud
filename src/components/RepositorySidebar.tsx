"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Globe,
  FileSpreadsheet,
  HardDrive,
  Smartphone,
  Image as ImageIcon,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeft,
  Trash2,
  FolderHeart,
  LucideIcon,
  LogIn,
} from "lucide-react";
import { UserInfo } from "@/context/AuthContext";
import { CustomRepoCategory, UserRepoCounts } from "@/types/userRepo";
import { getRepoIcon } from "@/lib/repoIcons";

export type RepoCategoryKey =
  | "favorites"
  | "websites"
  | "data"
  | "drive"
  | "mobile"
  | "photos"
  | "others"
  | string;

interface StandardCategoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
  countKey: keyof UserRepoCounts;
}

export const STANDARD_CATEGORIES: StandardCategoryItem[] = [
  { id: "favorites", name: "Layanan Favorit", icon: Star, countKey: "favorite" },
  { id: "websites", name: "Link Website", icon: Globe, countKey: "website" },
  { id: "data", name: "Data & Dokumen", icon: FileSpreadsheet, countKey: "data" },
  { id: "drive", name: "Link Drive", icon: HardDrive, countKey: "drive" },
  { id: "mobile", name: "Aplikasi Mobile", icon: Smartphone, countKey: "mobile_app" },
  { id: "photos", name: "Galeri Foto", icon: ImageIcon, countKey: "photo" },
  { id: "others", name: "Referensi & Catatan", icon: Bookmark, countKey: "other" },
];

interface RepositorySidebarProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  counts: UserRepoCounts;
  customCategories: CustomRepoCategory[];
  customCategoryCounts: Record<string, number>;
  onOpenAddCategoryModal: () => void;
  onDeleteCustomCategory?: (categoryId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  user?: UserInfo | null;
  isAuthenticated?: boolean;
  onOpenAccountModal?: () => void;
}

export default function RepositorySidebar({
  activeCategory,
  onSelectCategory,
  counts,
  customCategories,
  customCategoryCounts,
  onOpenAddCategoryModal,
  onDeleteCustomCategory,
  isMobileOpen,
  onCloseMobile,
  user,
  isAuthenticated,
  onOpenAccountModal,
}: RepositorySidebarProps) {
  // Collapsible state (collapsed by default or expanded)
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        id="repository-sidebar"
        aria-label="Navigasi Repositori Pegawai"
        className={`fixed top-0 bottom-0 left-0 z-50 lg:sticky lg:top-0 lg:h-screen flex flex-col bg-[#005AA9] dark:bg-[#0c1424] text-white border-r border-[#004887] dark:border-slate-800 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none select-none ${
          /* Desktop collapsed / expanded */
          isCollapsed ? "lg:w-20" : "lg:w-68"
        } ${
          /* Mobile slide-in */
          isMobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header: Title & Collapsible Toggle (Mirrors Admin Dashboard layout) */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 dark:border-slate-800 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-white/15 dark:bg-sky-500/20 text-white flex items-center justify-center shrink-0">
                <FolderHeart className="w-4.5 h-4.5" />
              </div>
              <div className="truncate">
                <h2 className="font-bold text-sm tracking-tight text-white leading-tight">
                  Repositori Pegawai
                </h2>
                <p className="text-[10px] text-blue-100/70 dark:text-slate-400 truncate">
                  Ruang Kerja Mandiri
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-white/15 dark:bg-sky-500/20 text-white flex items-center justify-center shrink-0">
                <FolderHeart className="w-4.5 h-4.5" />
              </div>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
            title={isCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
            className="hidden lg:flex p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          {/* Section 1: Standard Categories */}
          <div>
            {!isCollapsed && (
              <span className="block px-2 mb-2 text-[10px] font-bold tracking-wider uppercase text-blue-200/60 dark:text-slate-500">
                Kategori Utama
              </span>
            )}

            <ul className="space-y-1">
              {STANDARD_CATEGORIES.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeCategory === item.id;
                const count = counts[item.countKey] || 0;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(item.id);
                        onCloseMobile();
                      }}
                      title={`${item.name} (${count})`}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isCollapsed ? "justify-center" : "justify-between"
                      } ${
                        isActive
                          ? "bg-white text-[#005AA9] dark:bg-sky-500/20 dark:text-sky-300 dark:border dark:border-sky-500/40 shadow-sm font-bold"
                          : "text-white/90 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <IconComponent
                          className={`w-4.5 h-4.5 shrink-0 ${
                            isActive
                              ? "text-[#005AA9] dark:text-sky-300"
                              : "text-white/80 dark:text-slate-300"
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {!isCollapsed && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isActive
                              ? "bg-[#005AA9]/10 text-[#005AA9] dark:bg-sky-400/20 dark:text-sky-300"
                              : "bg-white/15 text-white/90 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Section 2: Custom Categories (Created by user) */}
          {customCategories.length > 0 && (
            <div>
              {!isCollapsed && (
                <span className="block px-2 mb-2 text-[10px] font-bold tracking-wider uppercase text-blue-200/60 dark:text-slate-500">
                  Jenis Repositori Khusus
                </span>
              )}

              <ul className="space-y-1">
                {customCategories.map((custom) => {
                  const CustomIcon = getRepoIcon(custom.iconName);
                  const isActive = activeCategory === custom.id;
                  const count = customCategoryCounts[custom.id] || 0;

                  return (
                    <li key={custom.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCategory(custom.id);
                          onCloseMobile();
                        }}
                        title={`${custom.name} (${count})`}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                          isCollapsed ? "justify-center" : "justify-between"
                        } ${
                          isActive
                            ? "bg-white text-[#005AA9] dark:bg-sky-500/20 dark:text-sky-300 dark:border dark:border-sky-500/40 shadow-sm font-bold"
                            : "text-white/90 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <CustomIcon
                            className={`w-4.5 h-4.5 shrink-0 ${
                              isActive
                                ? "text-[#005AA9] dark:text-sky-300"
                                : "text-white/80 dark:text-slate-300"
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{custom.name}</span>}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? "bg-[#005AA9]/10 text-[#005AA9] dark:bg-sky-400/20 dark:text-sky-300"
                                  : "bg-white/15 text-white/90 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {count}
                            </span>
                            {onDeleteCustomCategory && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(
                                      `Hapus jenis repositori "${custom.name}"? Tautan di dalamnya akan dialihkan ke Referensi.`
                                    )
                                  ) {
                                    onDeleteCustomCategory(custom.id);
                                  }
                                }}
                                title="Hapus jenis kategori ini"
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-300 transition"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Action: Tombol Tambah Jenis Repositori */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAddCategoryModal}
              title="Tambah Jenis Repositori Baru"
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border border-dashed border-white/40 dark:border-slate-700 hover:border-white hover:bg-white/15 dark:hover:bg-slate-800 text-white shadow-xs ${
                isCollapsed ? "px-0" : ""
              }`}
            >
              <Plus className="w-4 h-4 text-white shrink-0" />
              {!isCollapsed && <span>Tambah Jenis Repositori</span>}
            </button>
          </div>

          {/* Action: Tombol Akun (Memanggil Modal Akun) */}
          <div className="pt-1.5">
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={onOpenAccountModal}
                title={`Akun: ${user.name || user.username} (Buka Detail Akun)`}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all duration-150 cursor-pointer bg-white/10 hover:bg-white/20 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-white/15 dark:border-slate-700/80 text-white shadow-xs group ${
                  isCollapsed ? "justify-center px-0" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-white text-[#005AA9] dark:bg-sky-400 dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  {(user.name || user.username || "P").charAt(0).toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-white truncate text-xs leading-tight">
                      {user.name || "Pegawai"}
                    </div>
                    <div className="text-[10px] text-blue-200/80 dark:text-slate-400 truncate leading-tight">
                      @{user.username}
                    </div>
                  </div>
                )}
                {!isCollapsed && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/15 text-white/90 shrink-0">
                    Akun
                  </span>
                )}
              </button>
            ) : (
              <Link
                href="/login"
                title="Masuk ke Akun"
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer bg-white/10 hover:bg-white/20 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-white/15 dark:border-slate-700/80 text-white shadow-xs ${
                  isCollapsed ? "justify-center px-0" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                  <LogIn className="w-4 h-4" />
                </div>
                {!isCollapsed && <span>Masuk Akun</span>}
              </Link>
            )}
          </div>
        </div>

        {/* Footer: Kembali ke Portal */}
        <div className="p-3 border-t border-white/10 dark:border-slate-800 shrink-0">
          <Link
            href="/"
            title="Kembali ke Portal Utama SIPASTI BPS"
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-blue-100 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800/80 transition-colors cursor-pointer ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Kembali ke Portal</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
