"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowUp, Grid, FolderHeart, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchAndFilter from "@/components/SearchAndFilter";
import LinkGrid from "@/components/LinkGrid";
import PersonalRepository from "@/components/PersonalRepository";
import VpnGuideModal from "@/components/VpnGuideModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import Toast from "@/components/Toast";
import OfflineNoticeBanner from "@/components/OfflineNoticeBanner";
import { fetchKategori, fetchLayanan, KategoriItem } from "@/lib/api";
import { enrichLayanan, EnrichedLayanan, AccessType } from "@/lib/accessibilityMapper";
import { savePortalCache, getPortalCache } from "@/lib/offlineFallback";
import { useAuth } from "@/context/AuthContext";
import { fetchUserRepository, toggleFavoriteService } from "@/lib/userRepoApi";
import { UserRepositoryData } from "@/types/userRepo";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<KategoriItem[]>([]);
  const [layananList, setLayananList] = useState<EnrichedLayanan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // View Switch: "portal" vs "repository"
  const [activeMainView, setActiveMainView] = useState<"portal" | "repository">("portal");
  const [repoData, setRepoData] = useState<UserRepositoryData | null>(null);
  const [isRepoLoading, setIsRepoLoading] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<AccessType | "all">("all");

  const [apiError, setApiError] = useState<string | null>(null);

  // Offline Data & Cache States
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  // Modal & Toast States
  const [isVpnModalOpen, setIsVpnModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Smooth Scroll Listener for Back-to-Top Button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load Data 1x dari API saat refresh / mount
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [catData, layData] = await Promise.all([
        fetchKategori(),
        fetchLayanan(),
      ]);

      if (catData.length > 0 || layData.length > 0) {
        // Berhasil mengambil data segar dari backend!
        const nowIso = new Date().toISOString();
        setCategories(catData);
        savePortalCache(catData, layData);
        setIsOfflineMode(false);
        setLastUpdatedTime(nowIso);

        const catMap = new Map<number, string>();
        catData.forEach((c) => catMap.set(c.id_kategori, c.nama_kategori));
        const enriched = layData.map((item) => enrichLayanan(item, catMap));
        setLayananList(enriched);
      } else {
        // Backend offline / kosong: gunakan cache lokal dengan notice transparan
        const cached = getPortalCache();
        setCategories(cached.categories);
        setIsOfflineMode(true);
        setLastUpdatedTime(cached.cachedAt);

        const catMap = new Map<number, string>();
        cached.categories.forEach((c) => catMap.set(c.id_kategori, c.nama_kategori));
        const enriched = cached.layanan.map((item) => enrichLayanan(item, catMap));
        setLayananList(enriched);
      }
    } catch (err) {
      console.error("Gagal memuat data dari API:", err);
      // Fallback ke cache lokal dengan notice transparan
      const cached = getPortalCache();
      setCategories(cached.categories);
      setIsOfflineMode(true);
      setLastUpdatedTime(cached.cachedAt);

      const catMap = new Map<number, string>();
      cached.categories.forEach((c) => catMap.set(c.id_kategori, c.nama_kategori));
      const enriched = cached.layanan.map((item) => enrichLayanan(item, catMap));
      setLayananList(enriched);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, isAuthenticated]);

  // Load Repositori Pegawai (Private Space)
  const loadRepoData = useCallback(async () => {
    if (!isAuthenticated) {
      setRepoData(null);
      return;
    }
    setIsRepoLoading(true);
    try {
      const res = await fetchUserRepository();
      if (res.success && res.data) {
        setRepoData(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat repositori pribadi:", err);
    } finally {
      setIsRepoLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRepoData();
    } else {
      setRepoData(null);
    }
  }, [isAuthenticated, loadRepoData]);

  // Toggle Favorite
  const handleToggleFavorite = async (id_layanan: number) => {
    if (!isAuthenticated) {
      router.push(`/login?id=${id_layanan}`);
      return;
    }
    try {
      const res = await toggleFavoriteService(id_layanan);
      if (res.success) {
        setToastMessage(res.message || "Status favorit diperbarui.");
        loadRepoData();
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch {
      setToastMessage("Gagal mengubah status favorit.");
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const favoriteIds = useMemo(() => repoData?.favorite_ids || [], [repoData]);

  const totalRepoItems = useMemo(() => {
    if (!repoData?.counts) return 0;
    const c = repoData.counts;
    return (
      (c.favorite || 0) +
      (c.website || 0) +
      (c.data || 0) +
      (c.mobile_app || 0) +
      (c.drive || 0) +
      (c.photo || 0) +
      (c.other || 0)
    );
  }, [repoData]);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyLink = (_url: string, name: string) => {
    showToast(`Tautan "${name}" berhasil disalin!`);
  };

  // IN-MEMORY LIVE SEARCH & FILTERING (Zero API requests per keystroke)
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return layananList.filter((item) => {
      // 1. Filter Kategori
      if (selectedCategoryId !== null && item.id_kategori !== selectedCategoryId) {
        return false;
      }

      // 2. Filter Status Aksesibilitas
      if (selectedAccess !== "all" && item.access_type !== selectedAccess) {
        return false;
      }

      // 3. Filter Live Search Query (Client-side In-Memory)
      if (!q) return true;

      const titleMatch = item.nama_layanan.toLowerCase().includes(q);
      const descMatch = (item.deskripsi_layanan || "").toLowerCase().includes(q);
      const catMatch = item.category_name.toLowerCase().includes(q);
      const keywordMatch = (item.keyword || "").toLowerCase().includes(q);
      const noteMatch = item.technical_note.toLowerCase().includes(q);
      const urlMatch = item.url.toLowerCase().includes(q);

      return titleMatch || descMatch || catMatch || keywordMatch || noteMatch || urlMatch;
    });
  }, [layananList, searchQuery, selectedCategoryId, selectedAccess]);

  // Statistik & Counter per Kategori
  const categoryCounts = useMemo(() => {
    const map = new Map<number, number>();
    layananList.forEach((item) => {
      map.set(item.id_kategori, (map.get(item.id_kategori) || 0) + 1);
    });
    return map;
  }, [layananList]);

  const publicCount = useMemo(
    () => layananList.filter((l) => l.access_type === "public").length,
    [layananList]
  );
  const internalCount = useMemo(
    () => layananList.filter((l) => l.access_type === "internal").length,
    [layananList]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navbar Header */}
      <Navbar onOpenVpnGuide={() => setIsVpnModalOpen(true)} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Prominent Offline Notice Banner with Last Updated Timestamp */}
        {isOfflineMode && (
          <OfflineNoticeBanner
            lastUpdated={lastUpdatedTime}
            onRefresh={loadData}
            isRefreshing={isLoading}
          />
        )}

        {/* View Switcher: Katalog Layanan BPS vs Ruang Kerja / Repositori Saya */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setActiveMainView("portal")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeMainView === "portal"
                  ? "bg-white dark:bg-slate-900 text-[#005AA9] dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Katalog Layanan BPS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainView("repository")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeMainView === "repository"
                  ? "bg-white dark:bg-slate-900 text-[#005AA9] dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FolderHeart className="w-4 h-4" />
              <span>Repositori & Favorit Saya</span>
              {totalRepoItems > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 font-bold">
                  {totalRepoItems}
                </span>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            {activeMainView === "portal" ? (
              <span>Pusat tautan dan sistem digital terpadu BPS Solok Selatan</span>
            ) : (
              <span>Ruang kerja mandiri, tautan favorit, dan repositori berkas Anda</span>
            )}
          </div>
        </div>

        {activeMainView === "portal" ? (
          <>
            {/* Search, Filter Akses, dan Tab 7 Kategori */}
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              selectedAccess={selectedAccess}
              onSelectAccess={setSelectedAccess}
              categoryCounts={categoryCounts}
              totalCount={layananList.length}
              publicCount={publicCount}
              internalCount={internalCount}
            />

            {/* Results Counter / Filter Bar Status */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <div>
                Menampilkan{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredList.length}
                </span>{" "}
                dari {layananList.length} aplikasi
                {searchQuery && (
                  <span>
                    {" "}
                    untuk kata kunci &ldquo;
                    <strong className="text-slate-900 dark:text-white">
                      {searchQuery}
                    </strong>
                    &rdquo;
                  </span>
                )}
              </div>
              {(searchQuery || selectedCategoryId !== null || selectedAccess !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryId(null);
                    setSelectedAccess("all");
                  }}
                  className="text-slate-900 dark:text-slate-100 hover:underline font-semibold cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              )}
            </div>

            {/* Grid Kartu Tautan */}
            <LinkGrid
              layananList={filteredList}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onResetSearch={() => setSearchQuery("")}
              onCopyLink={handleCopyLink}
              onRefresh={loadData}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        ) : (
          /* Repositori & Favorit Saya */
          !isAuthenticated ? (
            <div className="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-sm my-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-[#005AA9] dark:text-sky-300 flex items-center justify-center">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Akses Repositori & Favorit Pegawai
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Masuk dengan akun BPS Anda untuk mengelola tautan cepat, bookmark dokumen, repositori berkas pribadi, dan layanan favorit langsung dari halaman ini tanpa berpindah aplikasi.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#005AA9] hover:bg-[#004280] text-white shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
                >
                  Masuk ke Akun Pegawai
                </button>
              </div>
            </div>
          ) : (
            <PersonalRepository
              repoData={repoData}
              isLoading={isRepoLoading}
              onRefresh={loadRepoData}
              onShowToast={showToast}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#004380] dark:border-[#002b59] bg-[#005AA9] dark:bg-[#003870] py-6 mt-12 transition-colors text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-100/90">
          <p>© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-white underline cursor-pointer transition-colors"
            >
              Kebijakan Privasi
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => setIsVpnModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Panduan VPN
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Notifications */}
      <VpnGuideModal
        isOpen={isVpnModalOpen}
        onClose={() => setIsVpnModalOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <Toast message={toastMessage} />

      {/* Floating Smooth Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          title="Kembali ke atas halaman"
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-[#005AA9] hover:bg-[#004280] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-90 transition-all duration-200 cursor-pointer animate-in fade-in zoom-in-75"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
