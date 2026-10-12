"use client";

import { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Navbar from "@/components/Navbar";
import SearchAndFilter from "@/components/SearchAndFilter";
import LinkGrid from "@/components/LinkGrid";
import VpnGuideModal from "@/components/VpnGuideModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import Toast from "@/components/Toast";
import OfflineNoticeBanner from "@/components/OfflineNoticeBanner";
import SmoothScrollLayout from "@/components/SmoothScrollLayout";

import { fetchKategori, fetchLayanan, KategoriItem } from "@/lib/api";
import { enrichLayanan, EnrichedLayanan, AccessType } from "@/lib/accessibilityMapper";
import { savePortalCache, getPortalCache } from "@/lib/offlineFallback";
import { useAuth } from "@/context/AuthContext";
import { fetchUserRepository, toggleFavoriteService } from "@/lib/userRepoApi";
import { UserRepositoryData } from "@/types/userRepo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

function KatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [categories, setCategories] = useState<KategoriItem[]>([]);
  const [layananList, setLayananList] = useState<EnrichedLayanan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [repoData, setRepoData] = useState<UserRepositoryData | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<AccessType | "all">("all");

  // Offline Data & Cache States
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  // Modal & Toast States
  const [isVpnModalOpen, setIsVpnModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const subheadingRef = useRef<HTMLParagraphElement>(null);

  // Sync initial query params from URL (e.g. /katalog?kategori=2 or /katalog?search=simpeg)
  useEffect(() => {
    const catQuery = searchParams.get("kategori");
    if (catQuery) {
      const parsedCat = parseInt(catQuery, 10);
      if (!isNaN(parsedCat)) {
        setSelectedCategoryId(parsedCat);
      }
    }
    const qQuery = searchParams.get("search");
    if (qQuery) {
      setSearchQuery(qQuery);
    }
  }, [searchParams]);

  // Typographic Reveal via SplitText hanya pada Subheading
  useEffect(() => {
    if (typeof window === "undefined" || !subheadingRef.current) return;

    const ctx = gsap.context(() => {
      try {
        const split = new SplitText(subheadingRef.current, {
          type: "words, chars",
        });
        gsap.set(split.chars, { opacity: 0, y: 10 });
        gsap.timeline({
          scrollTrigger: {
            trigger: subheadingRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }).to(split.chars, {
          opacity: 1,
          y: 0,
          stagger: 0.008,
          duration: 0.35,
          ease: "power2.out",
        });
      } catch (err) {
        console.warn("Katalog Subheading SplitText warning:", err);
      }
    });

    return () => ctx.revert();
  }, []);

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

  // Load Data dari API / Cache Lokal
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catData, layData] = await Promise.all([
        fetchKategori(),
        fetchLayanan(),
      ]);

      if (catData.length > 0 || layData.length > 0) {
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
  }, [loadData]);

  // Load Repositori Pegawai (Private Space)
  const loadRepoData = useCallback(async () => {
    if (!isAuthenticated) {
      setRepoData(null);
      return;
    }
    try {
      const res = await fetchUserRepository();
      if (res.success && res.data) {
        setRepoData(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat repositori pribadi:", err);
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

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyLink = (_url: string, name: string) => {
    showToast(`Tautan "${name}" berhasil disalin!`);
  };

  // Live Filtering
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return layananList.filter((item) => {
      if (selectedCategoryId !== null && item.id_kategori !== selectedCategoryId) {
        return false;
      }
      if (selectedAccess !== "all" && item.access_type !== selectedAccess) {
        return false;
      }
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c1424] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navbar Header */}
      <Navbar
        onOpenVpnGuide={() => setIsVpnModalOpen(true)}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SmoothScrollLayout>
        {/* Main Content Area */}
        <main id="katalog-layanan" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 space-y-10 sm:space-y-12">
          {/* Header Section Katalog */}
          <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-8 pb-10 sm:pb-16 lg:pb-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
              Semua Layanan,{" "}
              <span className="bg-gradient-to-r from-[#005AA9] via-[#00A6B4] to-[#6DBE45] bg-clip-text text-transparent">
                Satu Direktori
              </span>
            </h1>
            <p
              ref={subheadingRef}
              className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Temukan berbagai layanan dan referensi digital BPS yang terorganisasi dalam satu tempat.
            </p>
          </div>

          {/* Prominent Offline Notice Banner with Last Updated Timestamp */}
          {isOfflineMode && (
            <OfflineNoticeBanner
              lastUpdated={lastUpdatedTime}
              onRefresh={loadData}
              isRefreshing={isLoading}
            />
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
            onCopyLink={handleCopyLink}
            onRefresh={loadData}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </main>

        {/* Footer */}
        <footer id="footer" className="w-full bg-white dark:bg-[#0c1424] py-10 sm:py-14 mt-20 sm:mt-28 transition-colors text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="hover:text-slate-900 dark:hover:text-white underline cursor-pointer transition-colors"
              >
                Kebijakan Privasi
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={() => setIsVpnModalOpen(true)}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Panduan VPN
              </button>
            </div>
          </div>
        </footer>
      </SmoothScrollLayout>

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

export default function KatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0c1424]" />}>
      <KatalogContent />
    </Suspense>
  );
}
