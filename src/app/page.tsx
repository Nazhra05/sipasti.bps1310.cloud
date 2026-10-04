"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { AlertTriangle, ArrowUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchAndFilter from "@/components/SearchAndFilter";
import LinkGrid from "@/components/LinkGrid";
import VpnGuideModal from "@/components/VpnGuideModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import Toast from "@/components/Toast";
import { fetchKategori, fetchLayanan, KategoriItem } from "@/lib/api";
import { enrichLayanan, EnrichedLayanan, AccessType } from "@/lib/accessibilityMapper";

export default function Home() {
  const [categories, setCategories] = useState<KategoriItem[]>([]);
  const [layananList, setLayananList] = useState<EnrichedLayanan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<AccessType | "all">("all");

  const [apiError, setApiError] = useState<string | null>(null);

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

      setCategories(catData);

      if (layData.length === 0 && catData.length === 0) {
        setApiError("Gagal mengambil data dari server backend. Menggunakan fallback lokal.");
      }

      // Buat map ID Kategori ke Nama Kategori
      const catMap = new Map<number, string>();
      catData.forEach((c) => catMap.set(c.id_kategori, c.nama_kategori));

      // Enrich data dengan layer presentasi UI aksesibilitas (Publik / VPN)
      const enriched = layData.map((item) => enrichLayanan(item, catMap));
      setLayananList(enriched);
    } catch (err) {
      console.error("Gagal memuat data dari API:", err);
      setApiError("Terjadi kendala koneksi ke server backend API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast Helper
  const showToast = (url: string, name: string) => {
    setToastMessage(`Tautan "${name}" berhasil disalin!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
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
        {/* Network / API Error Alert Banner */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={loadData}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-200 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 transition cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

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
          onCopyLink={showToast}
          onRefresh={loadData}
        />
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
