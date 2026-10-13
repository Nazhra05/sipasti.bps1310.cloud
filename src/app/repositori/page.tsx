"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  Search,
  Star,
  Globe,
  FileSpreadsheet,
  HardDrive,
  Smartphone,
  Image as ImageIcon,
  Bookmark,
  FolderHeart,
  Lock,
  ExternalLink,
  Copy,
  Check,
  FolderOpen,
  ArrowRight,
  Sun,
  Moon,
  Layers,
  Settings,
  Edit3,
  Trash2,
  User,
} from "lucide-react";
import Toast from "@/components/Toast";
import VpnGuideModal from "@/components/VpnGuideModal";
import RepositorySidebar, { STANDARD_CATEGORIES } from "@/components/RepositorySidebar";
import AddRepoCategoryModal from "@/components/AddRepoCategoryModal";
import AddRepoItemModal from "@/components/AddRepoItemModal";
import AccountDetailModal from "@/components/AccountDetailModal";
import PortalLayananModal from "@/components/PortalLayananModal";
import RepoCardItem from "@/components/RepoCardItem";
import { useAuth } from "@/context/AuthContext";
import { UserRepositoryData, CustomRepoCategory } from "@/types/userRepo";
import { LayananItem, KategoriItem, fetchKategori } from "@/lib/api";
import { fetchUserPortalServices, deletePortalLayanan } from "@/lib/portalLayananApi";
import {
  fetchUserRepository,
  toggleFavoriteService,
  deleteWebsiteLink,
  deleteDataLink,
  deleteDriveLink,
  deleteMobileApp,
  deletePhotoLink,
  deleteOtherLink,
} from "@/lib/userRepoApi";
import { getRepoIcon } from "@/lib/repoIcons";

const CUSTOM_CATEGORIES_STORAGE_KEY = "bps_user_custom_repo_categories";

export default function RepositoriPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>("favorites");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Repository Data State (Personal links, bookmarks, files)
  const [repoData, setRepoData] = useState<UserRepositoryData | null>(null);
  const [isLoadingRepo, setIsLoadingRepo] = useState<boolean>(true);

  // Portal Services State (Services added by current user)
  const [userPortalServices, setUserPortalServices] = useState<LayananItem[]>([]);
  const [isLoadingPortalServices, setIsLoadingPortalServices] = useState<boolean>(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState<boolean>(false);
  const [editingPortalItem, setEditingPortalItem] = useState<LayananItem | null>(null);
  const [kategoriList, setKategoriList] = useState<KategoriItem[]>([]);

  // Custom Categories State
  const [customCategories, setCustomCategories] = useState<CustomRepoCategory[]>([]);

  // Mobile Sidebar Drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isVpnModalOpen, setIsVpnModalOpen] = useState<boolean>(false);

  // Theme State
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }

    // Support ?tab= in URL query
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveCategory(tabParam);
      }
    }
  }, []);

  const toggleTheme = () => {
    const isDark = theme === "dark" || document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clipboard tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Load custom categories from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (stored) {
        setCustomCategories(JSON.parse(stored));
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Load categories list for portal modal
  useEffect(() => {
    fetchKategori()
      .then((cats) => {
        if (cats && cats.length > 0) {
          setKategoriList(cats);
        }
      })
      .catch(() => {});
  }, []);

  // Save custom categories to localStorage
  const saveCustomCategories = useCallback((cats: CustomRepoCategory[]) => {
    setCustomCategories(cats);
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Fetch repository data from backend
  const loadRepoData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoadingRepo(false);
      return;
    }

    setIsLoadingRepo(true);
    try {
      const res = await fetchUserRepository();
      if (res.success && res.data) {
        setRepoData(res.data);
      }
    } catch {
      showToast("Gagal memuat data repositori.");
    } finally {
      setIsLoadingRepo(false);
    }
  }, [isAuthenticated, showToast]);

  // Fetch user's portal services
  const loadPortalServices = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoadingPortalServices(false);
      return;
    }

    setIsLoadingPortalServices(true);
    try {
      const data = await fetchUserPortalServices();
      setUserPortalServices(data);
    } catch {
      showToast("Gagal memuat layanan portal.");
    } finally {
      setIsLoadingPortalServices(false);
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        loadRepoData();
        loadPortalServices();
      } else {
        setIsLoadingRepo(false);
        setIsLoadingPortalServices(false);
      }
    }
  }, [isAuthenticated, isAuthLoading, loadRepoData, loadPortalServices]);

  // Handle Add Category
  const handleAddCategory = (newCategory: CustomRepoCategory) => {
    const updated = [...customCategories, newCategory];
    saveCustomCategories(updated);
    setActiveCategory(newCategory.id);
    showToast(`Jenis repositori "${newCategory.name}" berhasil ditambahkan!`);
  };

  // Handle Delete Custom Category
  const handleDeleteCustomCategory = (categoryId: string) => {
    const target = customCategories.find((c) => c.id === categoryId);
    const updated = customCategories.filter((c) => c.id !== categoryId);
    saveCustomCategories(updated);
    if (activeCategory === categoryId) {
      setActiveCategory("favorites");
    }
    showToast(`Jenis repositori "${target?.name || ""}" berhasil dihapus.`);
  };

  // Handle Copy Link
  const handleCopy = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    showToast("Tautan berhasil disalin ke papan klip!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Remove Favorite
  const handleRemoveFavorite = async (id_layanan: number) => {
    const res = await toggleFavoriteService(id_layanan);
    if (res.success) {
      showToast("Layanan dihapus dari daftar favorit.");
      loadRepoData();
    }
  };

  // Handle Delete Items (Repository pribadi)
  const handleDeleteItem = async (category: string, id: number) => {
    let ok = false;
    if (category === "websites") ok = (await deleteWebsiteLink(id)).success;
    else if (category === "data") ok = (await deleteDataLink(id)).success;
    else if (category === "drive") ok = (await deleteDriveLink(id)).success;
    else if (category === "mobile") ok = (await deleteMobileApp(id)).success;
    else if (category === "photos") ok = (await deletePhotoLink(id)).success;
    else if (category === "others" || category.startsWith("custom_")) ok = (await deleteOtherLink(id)).success;

    if (ok) {
      showToast("Item repositori berhasil dihapus.");
      loadRepoData();
    } else {
      showToast("Gagal menghapus item.");
    }
  };

  // Handle Delete Portal Service
  const handleDeletePortalService = async (service: LayananItem) => {
    if (!window.confirm(`Hapus layanan "${service.nama_layanan}" dari katalog portal?`)) {
      return;
    }
    const res = await deletePortalLayanan(service.id_layanan);
    if (res.status) {
      showToast(`Layanan "${service.nama_layanan}" berhasil dihapus.`);
      loadPortalServices();
    } else {
      showToast(res.message || "Gagal menghapus layanan.");
    }
  };

  // Compute counts for custom categories
  const customCategoryCounts = useMemo(() => {
    const countsMap: Record<string, number> = {};
    if (!repoData?.other_links) return countsMap;

    customCategories.forEach((cat) => {
      countsMap[cat.id] = repoData.other_links.filter(
        (link) => link.label_kategori === cat.name
      ).length;
    });
    return countsMap;
  }, [repoData?.other_links, customCategories]);

  // Active Category Meta
  const activeCategoryMeta = useMemo(() => {
    if (activeCategory === "portal_services") {
      return {
        name: "Kelola Repositori Portal",
        icon: Layers,
        description: "Layanan yang Anda daftarkan ke direktori portal BPS. Otomatis tampil di Katalog Layanan utama.",
        count: userPortalServices.length,
      };
    }

    if (activeCategory === "settings") {
      return {
        name: "Pengaturan Akun & Profil",
        icon: Settings,
        description: "Kelola informasi identitas, preferensi ruang kerja, dan keamanan akun BPS Anda.",
        count: 0,
      };
    }

    const standard = STANDARD_CATEGORIES.find((c) => c.id === activeCategory);
    if (standard) {
      const descriptions: Record<string, string> = {
        favorites: "Koleksi layanan BPS yang Anda sematkan dengan tanda bintang.",
        websites: "Tautan website dinas, portal eksternal, dan referensi daring harian.",
        data: "Kumpulan berkas dokumen, laporan statistik, format tabel, dan lembar kerja.",
        drive: "Tautan penyimpanan berkas Google Drive, OneDrive, atau cloud storage tim.",
        mobile: "Daftar aplikasi mobile operasional dan APK pendukung survei BPS.",
        photos: "Galeri dokumentasi kegiatan sensus, rapat dinas, dan arsip publikasi.",
        others: "Catatan, referensi cepat, dan tautan kerja dinas lainnya.",
      };
      return {
        name: standard.name,
        icon: standard.icon,
        description: descriptions[standard.id] || "Ruang kerja repositori pribadi pegawai BPS.",
        count: repoData?.counts[standard.countKey] || 0,
      };
    }

    const custom = customCategories.find((c) => c.id === activeCategory);
    if (custom) {
      return {
        name: custom.name,
        icon: getRepoIcon(custom.iconName),
        description: custom.description || `Koleksi khusus untuk kategori ${custom.name}.`,
        count: customCategoryCounts[custom.id] || 0,
      };
    }

    return {
      name: "Repositori Pribadi",
      icon: FolderHeart,
      description: "Kelola seluruh koleksi dan tautan mandiri Anda.",
      count: 0,
    };
  }, [activeCategory, repoData?.counts, customCategories, customCategoryCounts, userPortalServices.length]);

  const ActiveIcon = activeCategoryMeta.icon;

  // Filter Portal Services
  const filteredPortalServices = useMemo(() => {
    if (!userPortalServices) return [];
    const query = searchFilter.trim().toLowerCase();
    if (!query) return userPortalServices;

    return userPortalServices.filter((item) => {
      return (
        item.nama_layanan?.toLowerCase().includes(query) ||
        item.deskripsi_layanan?.toLowerCase().includes(query) ||
        item.url?.toLowerCase().includes(query) ||
        item.nama_kategori?.toLowerCase().includes(query) ||
        item.akses?.toLowerCase().includes(query)
      );
    });
  }, [userPortalServices, searchFilter]);

  // Filter items in active category
  const filteredItems = useMemo(() => {
    if (!repoData) return [];
    const query = searchFilter.trim().toLowerCase();

    const matchesQuery = (text?: string, url?: string, desc?: string) => {
      if (!query) return true;
      return (
        (text && text.toLowerCase().includes(query)) ||
        (url && url.toLowerCase().includes(query)) ||
        (desc && desc.toLowerCase().includes(query))
      );
    };

    if (activeCategory === "favorites") {
      return repoData.favorites.filter((f) =>
        matchesQuery(f.nama_layanan, f.url, f.deskripsi_layanan)
      );
    }
    if (activeCategory === "websites") {
      return repoData.links.filter((l) =>
        matchesQuery(l.nama_website, l.url_website, l.deskripsi)
      );
    }
    if (activeCategory === "data") {
      return repoData.data_links.filter((d) =>
        matchesQuery(d.nama_dokumen, d.url_dokumen, d.deskripsi)
      );
    }
    if (activeCategory === "drive") {
      return repoData.drive_links.filter((dr) =>
        matchesQuery(dr.nama_drive, dr.url_drive, dr.deskripsi)
      );
    }
    if (activeCategory === "mobile") {
      return repoData.mobile_apps.filter((m) =>
        matchesQuery(m.nama_aplikasi, m.url_aplikasi, m.deskripsi)
      );
    }
    if (activeCategory === "photos") {
      return repoData.photo_links.filter((p) =>
        matchesQuery(p.judul_foto, p.url_foto, p.deskripsi)
      );
    }
    if (activeCategory === "others") {
      const customNames = new Set(customCategories.map((c) => c.name));
      return repoData.other_links.filter(
        (o) =>
          !customNames.has(o.label_kategori || "") &&
          matchesQuery(o.nama_link, o.url_link, o.deskripsi)
      );
    }

    const custom = customCategories.find((c) => c.id === activeCategory);
    if (custom) {
      return repoData.other_links.filter(
        (o) =>
          o.label_kategori === custom.name &&
          matchesQuery(o.nama_link, o.url_link, o.deskripsi)
      );
    }

    return [];
  }, [repoData, activeCategory, searchFilter, customCategories]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex w-full min-h-screen">
        {/* Sidebar Nav */}
        <RepositorySidebar
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            setActiveCategory(id);
            setSearchFilter("");
          }}
          counts={
            repoData?.counts || {
              favorite: 0,
              website: 0,
              data: 0,
              drive: 0,
              mobile_app: 0,
              photo: 0,
              other: 0,
            }
          }
          portalServicesCount={userPortalServices.length}
          customCategories={customCategories}
          customCategoryCounts={customCategoryCounts}
          onOpenAddCategoryModal={() => setIsAddCategoryOpen(true)}
          onDeleteCustomCategory={handleDeleteCustomCategory}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          user={user}
          isAuthenticated={isAuthenticated}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Top Bar inside Content Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
            {/* Left: Mobile Toggle & Category Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Buka menu kategori"
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="p-2.5 rounded-2xl bg-[#005AA9]/10 dark:bg-sky-500/20 text-[#005AA9] dark:text-sky-300">
                <ActiveIcon className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeCategoryMeta.name}
                  </h1>
                  {activeCategory !== "settings" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#005AA9]/10 text-[#005AA9] dark:bg-sky-500/20 dark:text-sky-300">
                      {activeCategoryMeta.count} item
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {activeCategoryMeta.description}
                </p>
              </div>
            </div>

            {/* Right: Search Filter, Theme Toggle, & Add Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Search Filter (if authenticated and not in settings) */}
              {isAuthenticated && activeCategory !== "settings" && (
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={
                      activeCategory === "portal_services"
                        ? "Cari layanan portal..."
                        : "Cari dalam kategori ini..."
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
                  />
                </div>
              )}

              {/* Theme Toggle (Dark/Light) */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={mounted && theme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
                title={mounted && theme === "dark" ? "Mode Terang" : "Mode Gelap"}
                className="p-2 rounded-xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                )}
              </button>

              {/* Button: Tambah Layanan Portal */}
              {isAuthenticated && activeCategory === "portal_services" && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPortalItem(null);
                    setIsPortalModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Layanan Portal</span>
                </button>
              )}

              {/* Button: Tambah Koleksi (Repositori Pribadi) */}
              {isAuthenticated &&
                activeCategory !== "favorites" &&
                activeCategory !== "portal_services" &&
                activeCategory !== "settings" && (
                  <button
                    type="button"
                    onClick={() => setIsAddItemOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Tambah Koleksi</span>
                    <span className="sm:hidden">Tambah</span>
                  </button>
                )}
            </div>
          </div>

          {/* Body Content */}
          <div className="pt-6 flex-1">
            {/* State 1: Unauthenticated */}
            {!isAuthenticated && !isAuthLoading && (
              <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-[#005AA9] dark:text-sky-300 flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Masuk ke Akun Pegawai BPS
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Silakan masuk dengan akun BPS Solok Selatan untuk mengakses ruang kerja mandiri, mengelola repositori portal, dan mengatur akun Anda.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#005AA9] hover:bg-[#004280] text-white shadow-sm transition-all cursor-pointer"
                  >
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* State 2: Ready Content */}
            {isAuthenticated && (
              <>
                {/* VIEW 1: KELOLA REPOSITORI PORTAL */}
                {activeCategory === "portal_services" && (
                  <div>
                    {isLoadingPortalServices ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="p-5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 space-y-3 animate-shimmer"
                          >
                            <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
                          </div>
                        ))}
                      </div>
                    ) : filteredPortalServices.length === 0 ? (
                      <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto my-8">
                        <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-[#005AA9] dark:text-sky-300 flex items-center justify-center mb-3.5">
                          <Layers className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                          {searchFilter
                            ? "Tidak Ditemukan Hasil Pencarian"
                            : "Belum Ada Layanan Portal yang Anda Tambahkan"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
                          {searchFilter
                            ? `Tidak ada layanan portal yang cocok dengan "${searchFilter}". Coba kata kunci lain.`
                            : "Layanan yang Anda daftarkan di sini akan otomatis bertambah ke Katalog Layanan portal BPS. Klik tombol di bawah untuk mendaftarkan layanan baru."}
                        </p>
                        {!searchFilter && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPortalItem(null);
                              setIsPortalModalOpen(true);
                            }}
                            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Layanan Pertama</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPortalServices.map((service) => (
                          <div
                            key={service.id_layanan}
                            className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 hover:border-[#005AA9]/40 dark:hover:border-sky-500/40 shadow-xs hover:shadow-md transition-all duration-200"
                          >
                            <div>
                              {/* Badges: Kategori, Akses, VPN */}
                              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                                  {service.nama_kategori || "Layanan Portal"}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                      service.akses === "Internal"
                                        ? "bg-blue-50 text-[#005AA9] dark:bg-sky-950/60 dark:text-sky-300 border-blue-200 dark:border-sky-800"
                                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                    }`}
                                  >
                                    {service.akses === "Internal" ? "Internal" : "Publik"}
                                  </span>
                                  {(String(service.vpn).toLowerCase() === "yes" || String(service.vpn) === "1") && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      VPN
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Title & Description */}
                              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                                {service.nama_layanan}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {service.deskripsi_layanan || "Layanan resmi terdaftar pada direktori BPS."}
                              </p>

                              {/* URL Preview */}
                              <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 truncate font-mono">
                                {service.url}
                              </div>
                            </div>

                            {/* Actions Bar */}
                            <div className="flex items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(service.url, `portal-${service.id_layanan}`)}
                                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold cursor-pointer active:scale-95 transition-all"
                                  title="Salin tautan"
                                >
                                  {copiedId === `portal-${service.id_layanan}` ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md animate-in zoom-in-75">
                                      <Check className="w-3.5 h-3.5" />
                                      <span className="text-[11px] font-bold">Tersalin</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1">
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Salin</span>
                                    </span>
                                  )}
                                </button>

                                <a
                                  href={service.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
                                  title="Buka layanan di tab baru"
                                >
                                  <span>Buka</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPortalItem(service);
                                    setIsPortalModalOpen(true);
                                  }}
                                  title="Edit layanan ini"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#005AA9] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePortalService(service)}
                                  title="Hapus layanan ini"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW 2: PENGATURAN AKUN */}
                {activeCategory === "settings" && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Card 1: Profil Pengguna */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2.5 rounded-2xl bg-[#005AA9]/10 text-[#005AA9] dark:bg-sky-500/20 dark:text-sky-300">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Profil Pegawai BPS
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Informasi identitas akun yang terdaftar dalam sistem
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-[#005AA9] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                          {(user?.name || user?.username || "P").charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {user?.name || "Pegawai BPS"}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                user?.role?.toUpperCase() === "ADMIN"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                                  : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-700"
                              }`}
                            >
                              {user?.role || "Pegawai"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            @{user?.username} &bull; {user?.email || `${user?.username}@bps.go.id`}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                            Sistem Portal Intranet BPS Kabupaten Solok Selatan
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                            Nama Lengkap
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {user?.name || "-"}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                            Username Akun
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            @{user?.username || "-"}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                            Alamat Email
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {user?.email || `${user?.username}@bps.go.id`}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                            Status Integrasi SSO
                          </span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Terhubung & Aktif</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Preferensi Tampilan */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
                          <Sun className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Preferensi Tampilan
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Kustomisasi tema tampilan ruang kerja Anda
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            Tema Ruang Kerja
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {theme === "dark" ? "Mode Gelap (Dark Mode) sedang aktif" : "Mode Terang (Light Mode) sedang aktif"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleTheme}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          {theme === "dark" ? (
                            <>
                              <Sun className="w-4 h-4 text-amber-500" />
                              <span>Ganti ke Mode Terang</span>
                            </>
                          ) : (
                            <>
                              <Moon className="w-4 h-4 text-slate-600" />
                              <span>Ganti ke Mode Gelap</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card 3: Keamanan & Sesi */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Keamanan & Sesi
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Kelola sesi login dan pengamanan akun
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Pastikan selalu keluar dari akun Anda jika menggunakan komputer bersama atau jaringan publik. Seluruh kredensial diamankan dengan enkripsi HMAC-SHA256 terstandarisasi BPS.
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            router.push("/");
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer"
                        >
                          <span>Keluar dari Akun (Logout)</span>
                        </button>
                      </div>
                    </div>

                    {/* Card 4: Khusus Akun Admin - SSO ke Dashboard Admin */}
                    {user?.role?.toUpperCase() === "ADMIN" && (
                      <div className="p-6 sm:p-7 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-700/50 shadow-xs space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                              Akses Khusus Administrator (SSO)
                            </h2>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Akun Anda memiliki hak akses Admin. Anda dapat membuka Dashboard Admin lengkap tanpa perlu login ulang.
                            </p>
                          </div>
                        </div>

                        <div className="pt-1">
                          <a
                            href="/api/auth/sso?target=index.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#005AA9] hover:bg-[#004280] text-white shadow-sm transition cursor-pointer"
                          >
                            <span>Buka Dashboard Admin</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW 3: REPOSITORI PRIBADI STANDARD & CUSTOM CATEGORIES */}
                {activeCategory !== "portal_services" && activeCategory !== "settings" && (
                  <>
                    {/* Loading Skeleton */}
                    {isLoadingRepo ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="p-5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 space-y-3 animate-shimmer"
                          >
                            <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                              <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredItems.length === 0 ? (
                      /* Empty State */
                      <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto my-8">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3.5">
                          <FolderOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                          {searchFilter
                            ? "Tidak Ditemukan Hasil Pencarian"
                            : `Belum Ada Item di ${activeCategoryMeta.name}`}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
                          {searchFilter
                            ? `Tidak ada item yang cocok dengan kata kunci "${searchFilter}". Coba kata kunci lain.`
                            : activeCategory === "favorites"
                            ? "Klik ikon bintang (★) pada kartu aplikasi di Katalog Layanan BPS untuk menambahkan layanan favorit ke sini."
                            : "Mulai simpan tautan atau berkas pertama Anda untuk kemudahan akses sehari-hari."}
                        </p>
                        {activeCategory !== "favorites" && !searchFilter && (
                          <button
                            type="button"
                            onClick={() => setIsAddItemOpen(true)}
                            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Item Pertama</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Cards Grid */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Render Layanan Favorit */}
                        {activeCategory === "favorites" &&
                          (filteredItems as UserRepositoryData["favorites"]).map((fav) => (
                            <div
                              key={fav.id_favorite}
                              className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 hover:border-amber-400/50 shadow-xs hover:shadow-md transition-all duration-200"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                    {fav.nama_kategori || "Layanan BPS"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFavorite(fav.id_layanan)}
                                    title="Hapus dari favorit"
                                    className="p-1 rounded-md text-amber-500 hover:bg-amber-500/15 transition cursor-pointer"
                                  >
                                    <Star className="w-4 h-4 fill-amber-400" />
                                  </button>
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                                  {fav.nama_layanan}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                  {fav.deskripsi_layanan || "Layanan resmi BPS Solok Selatan."}
                                </p>
                              </div>

                              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(fav.url, `fav-${fav.id_favorite}`)}
                                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold cursor-pointer active:scale-95 transition-all"
                                >
                                  {copiedId === `fav-${fav.id_favorite}` ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md animate-in zoom-in-75">
                                      <Check className="w-3.5 h-3.5" />
                                      <span className="text-[11px] font-bold">Tersalin!</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1">
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Salin</span>
                                    </span>
                                  )}
                                </button>

                                <a
                                  href={fav.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
                                >
                                  <span>Kunjungi</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}

                        {/* Render Websites */}
                        {activeCategory === "websites" &&
                          (filteredItems as UserRepositoryData["links"]).map((link) => (
                            <RepoCardItem
                              key={link.id_link}
                              id={link.id_link}
                              title={link.nama_website}
                              url={link.url_website}
                              desc={link.deskripsi}
                              badge="Website"
                              icon={Globe}
                              badgeColor="text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/50"
                              onDelete={() => handleDeleteItem("websites", link.id_link)}
                              onCopy={() => handleCopy(link.url_website, `link-${link.id_link}`)}
                              isCopied={copiedId === `link-${link.id_link}`}
                            />
                          ))}

                        {/* Render Data & Dokumen */}
                        {activeCategory === "data" &&
                          (filteredItems as UserRepositoryData["data_links"]).map((data) => (
                            <RepoCardItem
                              key={data.id_data_link}
                              id={data.id_data_link}
                              title={data.nama_dokumen}
                              url={data.url_dokumen}
                              desc={data.deskripsi}
                              badge={data.jenis_dokumen || "Dokumen"}
                              icon={FileSpreadsheet}
                              badgeColor="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50"
                              onDelete={() => handleDeleteItem("data", data.id_data_link)}
                              onCopy={() => handleCopy(data.url_dokumen, `data-${data.id_data_link}`)}
                              isCopied={copiedId === `data-${data.id_data_link}`}
                            />
                          ))}

                        {/* Render Link Drive */}
                        {activeCategory === "drive" &&
                          (filteredItems as UserRepositoryData["drive_links"]).map((drive) => (
                            <RepoCardItem
                              key={drive.id_drive}
                              id={drive.id_drive}
                              title={drive.nama_drive}
                              url={drive.url_drive}
                              desc={drive.deskripsi}
                              badge={drive.jenis_drive || "Drive"}
                              icon={HardDrive}
                              badgeColor="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50"
                              onDelete={() => handleDeleteItem("drive", drive.id_drive)}
                              onCopy={() => handleCopy(drive.url_drive, `drive-${drive.id_drive}`)}
                              isCopied={copiedId === `drive-${drive.id_drive}`}
                            />
                          ))}

                        {/* Render Aplikasi Mobile */}
                        {activeCategory === "mobile" &&
                          (filteredItems as UserRepositoryData["mobile_apps"]).map((app) => (
                            <RepoCardItem
                              key={app.id_mobile}
                              id={app.id_mobile}
                              title={app.nama_aplikasi}
                              url={app.url_aplikasi}
                              desc={app.deskripsi}
                              badge={app.platform || "Mobile"}
                              icon={Smartphone}
                              badgeColor="text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/50"
                              onDelete={() => handleDeleteItem("mobile", app.id_mobile)}
                              onCopy={() => handleCopy(app.url_aplikasi, `mobile-${app.id_mobile}`)}
                              isCopied={copiedId === `mobile-${app.id_mobile}`}
                            />
                          ))}

                        {/* Render Galeri Foto */}
                        {activeCategory === "photos" &&
                          (filteredItems as UserRepositoryData["photo_links"]).map((photo) => (
                            <RepoCardItem
                              key={photo.id_photo}
                              id={photo.id_photo}
                              title={photo.judul_foto}
                              url={photo.url_foto}
                              desc={photo.deskripsi}
                              badge="Galeri Foto"
                              icon={ImageIcon}
                              badgeColor="text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/50"
                              onDelete={() => handleDeleteItem("photos", photo.id_photo)}
                              onCopy={() => handleCopy(photo.url_foto, `photo-${photo.id_photo}`)}
                              isCopied={copiedId === `photo-${photo.id_photo}`}
                            />
                          ))}

                        {/* Render Referensi & Catatan */}
                        {activeCategory === "others" &&
                          (filteredItems as UserRepositoryData["other_links"]).map((other) => (
                            <RepoCardItem
                              key={other.id_other}
                              id={other.id_other}
                              title={other.nama_link}
                              url={other.url_link}
                              desc={other.deskripsi}
                              badge={other.label_kategori || "Referensi"}
                              icon={Bookmark}
                              badgeColor="text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50"
                              onDelete={() => handleDeleteItem("others", other.id_other)}
                              onCopy={() => handleCopy(other.url_link, `other-${other.id_other}`)}
                              isCopied={copiedId === `other-${other.id_other}`}
                            />
                          ))}

                        {/* Render Custom Categories */}
                        {activeCategory.startsWith("custom_") &&
                          (filteredItems as UserRepositoryData["other_links"]).map((customItem) => (
                            <RepoCardItem
                              key={customItem.id_other}
                              id={customItem.id_other}
                              title={customItem.nama_link}
                              url={customItem.url_link}
                              desc={customItem.deskripsi}
                              badge={customItem.label_kategori || activeCategoryMeta.name}
                              icon={ActiveIcon}
                              badgeColor="text-[#005AA9] bg-sky-50 dark:text-sky-300 dark:bg-sky-950/50"
                              onDelete={() => handleDeleteItem(activeCategory, customItem.id_other)}
                              onCopy={() =>
                                handleCopy(customItem.url_link, `custom-${customItem.id_other}`)
                              }
                              isCopied={copiedId === `custom-${customItem.id_other}`}
                            />
                          ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal: Tambah Layanan Portal */}
      <PortalLayananModal
        isOpen={isPortalModalOpen}
        onClose={() => {
          setIsPortalModalOpen(false);
          setEditingPortalItem(null);
        }}
        initialData={editingPortalItem}
        kategoriList={kategoriList}
        onSuccess={loadPortalServices}
        onShowToast={showToast}
      />

      {/* Modal: Tambah Jenis Repositori */}
      <AddRepoCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* Modal: Tambah Item Koleksi */}
      <AddRepoItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        activeCategory={activeCategory}
        customCategories={customCategories}
        onSuccess={loadRepoData}
        onShowToast={showToast}
      />

      {/* Modal: Panduan VPN */}
      <VpnGuideModal
        isOpen={isVpnModalOpen}
        onClose={() => setIsVpnModalOpen(false)}
      />

      {/* Modal: Detail Akun Pegawai */}
      <AccountDetailModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
        onLogout={() => {
          setIsAccountModalOpen(false);
          logout();
          router.push("/");
        }}
        isInsideRepository={true}
        onNavigateTab={(tab) => {
          setActiveCategory(tab);
          setSearchFilter("");
        }}
      />
    </div>
  );
}
