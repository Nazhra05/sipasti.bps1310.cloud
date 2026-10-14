"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VpnGuideModal from "@/components/VpnGuideModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import Toast from "@/components/Toast";
import CategoryCarousel from "@/components/CategoryCarousel";
import BouncerIcons from "@/components/BouncerIcons";
import WhyRancakSection from "@/components/WhyRancakSection";
import SmoothScrollLayout from "@/components/SmoothScrollLayout";
import Footer from "@/components/Footer";
import { fetchKategori, fetchLayanan, KategoriItem, LayananItem } from "@/lib/api";
import { savePortalCache, getPortalCache } from "@/lib/offlineFallback";

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<KategoriItem[]>([]);
  const [layananList, setLayananList] = useState<LayananItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    try {
      const [catData, layData] = await Promise.all([
        fetchKategori(),
        fetchLayanan(),
      ]);

      if (catData.length > 0 || layData.length > 0) {
        setCategories(catData);
        setLayananList(layData);
        savePortalCache(catData, layData);
        return;
      }
    } catch (err) {
      console.error("Gagal memuat data dari API:", err);
    }

    // Fallback ke cache lokal jika API tidak merespons
    const cached = getPortalCache();
    setCategories(cached.categories);
    setLayananList(cached.layanan);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNavigateToCatalog = (query?: string) => {
    const q = (query !== undefined ? query : searchQuery).trim();
    if (q) {
      router.push(`/katalog?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/katalog");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c1424] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navbar Header */}
      <Navbar
        onOpenVpnGuide={() => setIsVpnModalOpen(true)}
        categories={categories}
        selectedCategoryId={null}
        onSelectCategory={(id) => {
          if (id !== null) {
            router.push(`/katalog?kategori=${id}`);
          } else {
            router.push("/katalog");
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* GSAP ScrollSmoother Layout Container */}
      <SmoothScrollLayout>
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={layananList.length}
          layananList={layananList}
          onScrollToCatalog={(query) => handleNavigateToCatalog(query)}
        />

        {/* 3D Stacked Carousel 7 Kategori */}
        <CategoryCarousel
          categories={categories}
          layananList={layananList}
          onSelectCategory={(catId) => {
            router.push(`/katalog?kategori=${catId}`);
          }}
        />

        {/* Antigravity Bouncer Icons Section */}
        <BouncerIcons />

        {/* Why RANCAK Section */}
        <WhyRancakSection
          onScrollToHero={() => {
            try {
              const smoother = (window as unknown as { ScrollSmootherInstance?: { scrollTo: (target: string | number, smooth?: boolean) => void } }).ScrollSmootherInstance;
              if (smoother && typeof smoother.scrollTo === "function") {
                smoother.scrollTo("#hero", true);
                return;
              }
            } catch {
              // fallback
            }
            const heroEl = document.getElementById("hero");
            if (heroEl) {
              heroEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          onScrollToCatalog={() => {
            router.push("/katalog");
          }}
        />

        {/* Footer */}
        <Footer
          onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
          onOpenVpnGuide={() => setIsVpnModalOpen(true)}
        />
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
