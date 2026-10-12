"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import {
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Factory,
  PieChart,
  Users,
  Cpu,
  Building2,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LayananItem, KategoriItem } from "@/lib/api";
import { isInternalLayanan } from "@/lib/accessibilityMapper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export interface PeekLink {
  name: string;
  url: string;
  akses: "Publik" | "Internal";
}

export interface CategoryCardData {
  id: number;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  colorGradient: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
  fallbackLinks: PeekLink[];
}

export const SEVEN_CATEGORIES: CategoryCardData[] = [
  {
    id: 1,
    name: "Distribusi",
    desc: "Perdagangan, transportasi, pariwisata, perhotelan & sensus ekonomi.",
    icon: TrendingUp,
    colorGradient: "from-[#FFA500]/15 via-[#FFA500]/5 to-transparent",
    accentBorder: "border-[#FFA500]/40 dark:border-[#FFA500]/40",
    accentText: "text-[#FFA500] dark:text-[#ffbe4d]",
    badgeBg: "bg-[#FFA500]/10 text-[#804b00] dark:bg-[#FFA500]/20 dark:text-[#ffbe4d] border-[#FFA500]/30",
    fallbackLinks: [
      { name: "Sensus Ekonomi 2026 (SE2026)", url: "https://se2026.bps.go.id", akses: "Publik" },
      { name: "Portal Pelaporan Perusahaan (SIPP)", url: "https://sensus.bps.go.id", akses: "Publik" },
      { name: "Portal Ekspor Impor Daerah", url: "https://bps.go.id", akses: "Publik" },
    ],
  },
  {
    id: 2,
    name: "Produksi",
    desc: "Pertanian, peternakan, perikanan, industri manufaktur, pertambangan & energi.",
    icon: Factory,
    colorGradient: "from-[#6DBE45]/15 via-[#6DBE45]/5 to-transparent",
    accentBorder: "border-[#6DBE45]/40 dark:border-[#6DBE45]/40",
    accentText: "text-[#6DBE45] dark:text-[#8ee064]",
    badgeBg: "bg-[#6DBE45]/10 text-[#245210] dark:bg-[#6DBE45]/20 dark:text-[#8ee064] border-[#6DBE45]/30",
    fallbackLinks: [
      { name: "KSA - Kerangka Sampel Area", url: "https://ksa.bps.go.id", akses: "Publik" },
      { name: "FASIH (Pendataan Lapangan)", url: "https://fasih.bps.go.id", akses: "Internal" },
      { name: "Sensus Pertanian (ST2023)", url: "https://sensus.bps.go.id", akses: "Publik" },
    ],
  },
  {
    id: 3,
    name: "Neraca",
    desc: "PDRB lapangan usaha, PDRB pengeluaran, tabel input-output & ekonomi makro.",
    icon: PieChart,
    colorGradient: "from-[#005AA9]/15 via-[#005AA9]/5 to-transparent",
    accentBorder: "border-[#005AA9]/40 dark:border-[#005AA9]/50",
    accentText: "text-[#005AA9] dark:text-sky-300",
    badgeBg: "bg-[#005AA9]/10 text-[#00386b] dark:bg-[#005AA9]/20 dark:text-sky-300 border-[#005AA9]/30",
    fallbackLinks: [
      { name: "Data PDRB Solok Selatan", url: "https://solokselatankab.bps.go.id/subject/52/produk-domestik-regional-bruto--lapangan-usaha-.html", akses: "Publik" },
      { name: "SIMDASI Kompilasi Daerah", url: "https://simdasi.bps.go.id", akses: "Internal" },
      { name: "SIMNERCA Wilayah Regional", url: "https://simnerca.bps.go.id", akses: "Internal" },
    ],
  },
  {
    id: 4,
    name: "Sosial",
    desc: "Kependudukan, ketenagakerjaan, kemiskinan, pendidikan & Indeks Pembangunan Manusia.",
    icon: Users,
    colorGradient: "from-[#00A6B4]/15 via-[#00A6B4]/5 to-transparent",
    accentBorder: "border-[#00A6B4]/40 dark:border-[#00A6B4]/40",
    accentText: "text-[#00A6B4] dark:text-[#38d4e2]",
    badgeBg: "bg-[#00A6B4]/10 text-[#00555c] dark:bg-[#00A6B4]/20 dark:text-[#38d4e2] border-[#00A6B4]/30",
    fallbackLinks: [
      { name: "Data IPM & Kemiskinan", url: "https://solokselatankab.bps.go.id/subject/26/indeks-pembangunan-manusia.html", akses: "Publik" },
      { name: "E-Sensus Kependudukan", url: "https://sensus.bps.go.id", akses: "Publik" },
      { name: "Susenas & Sakernas Daerah", url: "https://solokselatankab.bps.go.id", akses: "Publik" },
    ],
  },
  {
    id: 5,
    name: "TI (Teknologi Informasi)",
    desc: "Sistem otomasi, integrasi data kedinasan, GIS spasial & portal intranet.",
    icon: Cpu,
    colorGradient: "from-[#005AA9]/15 via-blue-500/5 to-transparent",
    accentBorder: "border-[#005AA9]/40 dark:border-[#005AA9]/50",
    accentText: "text-[#005AA9] dark:text-sky-300",
    badgeBg: "bg-[#005AA9]/10 text-[#00386b] dark:bg-[#005AA9]/20 dark:text-sky-300 border-[#005AA9]/30",
    fallbackLinks: [
      { name: "ROMANTIK Online", url: "https://romantik.bps.go.id", akses: "Publik" },
      { name: "Wilkerstat Pemetaan Spasial", url: "https://wilkerstat.bps.go.id", akses: "Internal" },
      { name: "SIRUSA & WebAPI BPS", url: "https://sirusa.bps.go.id", akses: "Publik" },
    ],
  },
  {
    id: 6,
    name: "Umum",
    desc: "Administrasi kepegawaian, tata persuratan, keuangan, perlengkapan & PPID.",
    icon: Building2,
    colorGradient: "from-[#00A6B4]/15 via-[#00A6B4]/5 to-transparent",
    accentBorder: "border-[#00A6B4]/40 dark:border-[#00A6B4]/40",
    accentText: "text-[#00A6B4] dark:text-[#38d4e2]",
    badgeBg: "bg-[#00A6B4]/10 text-[#00555c] dark:bg-[#00A6B4]/20 dark:text-[#38d4e2] border-[#00A6B4]/30",
    fallbackLinks: [
      { name: "PPID Keterbukaan Informasi", url: "https://ppid.bps.go.id", akses: "Publik" },
      { name: "Backoffice Selindo (BOS)", url: "https://backofficeselindo.bps.go.id", akses: "Publik" },
      { name: "SOBAT BPS (Mitra Lapangan)", url: "https://mitra.bps.go.id", akses: "Internal" },
    ],
  },
  {
    id: 7,
    name: "Diseminasi",
    desc: "Pelayanan Statistik Terpadu (PST), rilis berita resmi, publikasi data & konsultasi.",
    icon: Share2,
    colorGradient: "from-[#6DBE45]/15 via-[#6DBE45]/5 to-transparent",
    accentBorder: "border-[#6DBE45]/40 dark:border-[#6DBE45]/40",
    accentText: "text-[#6DBE45] dark:text-[#8ee064]",
    badgeBg: "bg-[#6DBE45]/10 text-[#245210] dark:bg-[#6DBE45]/20 dark:text-[#8ee064] border-[#6DBE45]/30",
    fallbackLinks: [
      { name: "Website Resmi BPS Solok Selatan", url: "https://solokselatankab.bps.go.id", akses: "Publik" },
      { name: "PST Online Solok Selatan", url: "https://pst.bps.go.id", akses: "Publik" },
      { name: "Publikasi Daerah Dalam Angka", url: "https://solokselatankab.bps.go.id", akses: "Publik" },
    ],
  },
];

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

/**
 * Konfigurasi tightened untuk 7 kartu:
 * Memperpendek jarak horizontal (xMultiplier) dan sudut rotasi agar fanning 7 kartu tampak presisi dan harmonis.
 */
const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 100,
      velocityDivisor: 450,
      sensitivity: 150,
      xMultiplier: 65, // tightened for mobile
      yMultiplier: 10,
      rotationMultiplier: 4,
      scaleReduction: 0.05,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 140,
      velocityDivisor: 600,
      sensitivity: 190,
      xMultiplier: 90, // tightened for tablet
      yMultiplier: 16,
      rotationMultiplier: 5,
      scaleReduction: 0.07,
    };
  }
  return {
    distanceDivisor: 180,
    velocityDivisor: 750,
    sensitivity: 220,
    xMultiplier: 120, // tightened from 170 to fit 7 cards gracefully on desktop
    yMultiplier: 20,
    rotationMultiplier: 6,
    scaleReduction: 0.08,
  };
};

interface CategoryCarouselProps {
  categories?: KategoriItem[];
  layananList?: LayananItem[];
  onSelectCategory: (categoryId: number) => void;
}

export default function CategoryCarousel({
  categories = [],
  layananList = [],
  onSelectCategory,
}: CategoryCarouselProps) {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  // Ref untuk GSAP Video Expand Effect & SplitText Reveal
  const cardsContainerRef = React.useRef<HTMLDivElement>(null);
  const subheadingRef = React.useRef<HTMLParagraphElement>(null);

  const total = SEVEN_CATEGORIES.length; // 7 Cards

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP Video Expand Effect (diterapkan pada Cards Kategori) & SplitText Typographic Reveal
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 1. Video Expand Effect (Adaptasi Antigravity untuk Container Kartu Kategori)
      if (cardsContainerRef.current) {
        const isMobile = window.innerWidth <= 768;
        gsap.from(cardsContainerRef.current, {
          scale: isMobile ? 0.94 : 0.84,
          opacity: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top bottom",
            end: isMobile ? "top 80%" : "top center",
            scrub: 0.5,
            fastScrollEnd: true,
          },
        });
      }

      // 2. Typographic Reveal via SplitText hanya untuk Subheading Kategori
      if (subheadingRef.current) {
        try {
          const split = new SplitText(subheadingRef.current, {
            type: "words, chars",
          });
          gsap.set(split.chars, { opacity: 0, y: 10 });
          gsap.timeline({
            scrollTrigger: {
              trigger: subheadingRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }).to(split.chars, {
            opacity: 1,
            y: 0,
            stagger: 0.008,
            duration: 0.35,
            ease: "power2.out",
          });
        } catch (e) {
          console.warn("SplitText Category subheading error:", e);
        }
      }
    });

    return () => ctx.revert();
  }, []);

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth]
  );

  // Sinkronkan indeks kartu yang sedang di depan
  React.useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (latest) => {
      const normalized = Math.round(((latest % total) + total) % total);
      setCurrentIndex(normalized);
    });
    return () => unsubscribe();
  }, [scrollProgress, total]);

  const handleDragStart = () => {
    setIsDragging(true);
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 1,
      onComplete: () => {
        setTimeout(() => setIsDragging(false), 80);
      },
    });
  };

  // Navigasi manual (tombol kiri/kanan atau klik dot)
  const shiftToIndex = (index: number) => {
    const current = scrollProgress.get();
    const currentRounded = Math.round(current);
    let diff = (index - (currentRounded % total)) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    animate(scrollProgress, currentRounded + diff, {
      type: "spring",
      stiffness: 240,
      damping: 26,
      mass: 1,
    });
  };

  const handlePrev = () => {
    const target = Math.round(scrollProgress.get()) - 1;
    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 240,
      damping: 26,
    });
  };

  const handleNext = () => {
    const target = Math.round(scrollProgress.get()) + 1;
    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 240,
      damping: 26,
    });
  };

  // Siapkan data 7 kartu dengan 2-3 tautan riil dari database (jika ada)
  const preparedSlides = React.useMemo(() => {
    return SEVEN_CATEGORIES.map((cat) => {
      // Cari nama kategori dari props jika tersedia
      const matchedCat = categories.find((c) => c.id_kategori === cat.id);
      const categoryName = matchedCat?.nama_kategori || cat.name;
      const categoryDesc = matchedCat?.deskripsi || cat.desc;

      // Ambil 2-3 link riil dari layananList
      const matchedServices = layananList.filter(
        (item) => item.id_kategori === cat.id
      );

      let peekLinks: PeekLink[] = [];
      if (matchedServices.length > 0) {
        peekLinks = matchedServices.slice(0, 3).map((s) => ({
          name: s.nama_layanan,
          url: s.url,
          akses: isInternalLayanan(s) ? "Internal" : "Publik",
        }));
      } else {
        peekLinks = cat.fallbackLinks;
      }

      return {
        ...cat,
        name: categoryName,
        desc: categoryDesc,
        peekLinks,
        totalItems: matchedServices.length,
      };
    });
  }, [categories, layananList]);

  return (
    <section
      id="kategori-carousel"
      aria-label="Koleksi Kategori Layanan Statistik"
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-white dark:bg-[#0c1424] overflow-hidden select-none transition-colors"
    >
      {/* Background Decorative Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-sky-400/5 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-10 sm:mb-14 lg:mb-16 relative z-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Memudahkan pencarian link per kategori
        </h2>
        <p
          ref={subheadingRef}
          className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          Geser atau telusuri kartu untuk melihat cuplikan tautan penting di setiap kategori operasional BPS Kabupaten Solok Selatan
        </p>
      </div>

      {/* 3D Stacked Carousel Container (with GSAP Video Expand Effect scale scrub) */}
      <div
        ref={cardsContainerRef}
        className="relative w-full max-w-7xl mx-auto h-[410px] sm:h-[450px] lg:h-[470px] flex items-center justify-center px-4 will-change-transform"
      >
        {/* Transparent Drag Surface for Swipe Gestures */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
        />

        {/* 7 Stacked Cards */}
        {preparedSlides.map((slide, i) => (
          <CategoryCard
            key={slide.id}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            isDragging={isDragging}
            onSelectCategory={onSelectCategory}
            onBringToFront={() => shiftToIndex(i)}
          />
        ))}
      </div>

      {/* Carousel Navigation Bar (Left/Right Arrows + 7 Dots Indicator) */}
      <div className="flex items-center justify-center gap-4 mt-6 relative z-30 px-4">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Kategori sebelumnya"
          className="p-2 rounded-full bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 7 Dots Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {preparedSlides.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => shiftToIndex(idx)}
                aria-label={`Lihat kategori ${slide.name}`}
                title={slide.name}
                className={cn(
                  "transition-all duration-300 rounded-full cursor-pointer",
                  isActive
                    ? "w-7 sm:w-8 h-2 bg-[#005AA9] dark:bg-sky-400"
                    : "w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                )}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Kategori berikutnya"
          className="p-2 rounded-full bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  slide: CategoryCardData & { peekLinks: PeekLink[]; totalItems: number };
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  isDragging: boolean;
  onSelectCategory: (categoryId: number) => void;
  onBringToFront: () => void;
}

const CategoryCard = ({
  slide,
  index,
  total,
  progress,
  config,
  isDragging,
  onSelectCategory,
  onBringToFront,
}: CategoryCardProps) => {
  const IconComponent = slide.icon;

  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.6, 0, total / 2 - 0.6, total / 2],
    [0, 1, 1, 1, 0]
  );
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));

  // Periksa apakah kartu sedang berada di paling depan (fokus utama)
  const [isFront, setIsFront] = React.useState(false);
  React.useEffect(() => {
    const unsub = offset.on("change", (val) => {
      setIsFront(Math.abs(val) < 0.45);
    });
    return () => unsub();
  }, [offset]);

  const handleCardClick = () => {
    if (!isDragging && !isFront) {
      onBringToFront();
    }
  };

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCategory(slide.id);
    const catalogEl = document.getElementById("katalog-layanan");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      onClick={handleCardClick}
      className={cn(
        "absolute rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-shadow duration-300",
        "w-[270px] sm:w-[310px] lg:w-[335px] h-[370px] sm:h-[400px] lg:h-[415px]",
        "bg-white/95 dark:bg-[#111a2e]/95 backdrop-blur-xl border shadow-xl",
        isFront
          ? cn("shadow-2xl shadow-sky-500/10 dark:shadow-sky-500/5", slide.accentBorder)
          : "border-slate-200/80 dark:border-slate-800/80 cursor-pointer",
        isFront ? "pointer-events-auto" : "pointer-events-auto"
      )}
    >
      {/* Top Subtle Color Accent Gradient Background */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-32 rounded-t-3xl bg-gradient-to-b opacity-80 pointer-events-none",
          slide.colorGradient
        )}
      />

      {/* =========================================================
          BAGIAN ATAS: KIRI ATAS NAMA KATEGORI + BADGE
      ========================================================= */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Kiri Atas: Nama Kategori dengan Icon */}
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-100 dark:border-slate-700/60 shrink-0", slide.accentText)}>
              <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate tracking-tight">
              {slide.name}
            </h3>
          </div>

          {/* Badge Jumlah Layanan */}
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 border",
              slide.badgeBg
            )}
          >
            {slide.totalItems > 0 ? `${slide.totalItems} Layanan` : `${slide.peekLinks.length} Layanan`}
          </span>
        </div>

        {/* Deskripsi Kategori */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {slide.desc}
        </p>
      </div>

      {/* =========================================================
          BAGIAN TENGAH: 2/3 PEEK LINK DARI MASING-MASING KATEGORI
      ========================================================= */}
      <div className="relative z-10 my-auto py-2 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>Cuplikan Layanan</span>
          {slide.totalItems > 0 && (
            <span className="text-[10px] lowercase font-normal">
              {slide.totalItems} tautan
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {slide.peekLinks.slice(0, 3).map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (isDragging || !isFront) {
                  e.preventDefault();
                }
              }}
              title={`Buka ${link.name}`}
              className={cn(
                "group flex items-center justify-between p-2 rounded-xl text-xs transition-all",
                "bg-slate-50/90 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50",
                !isFront && "pointer-events-none"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    link.akses === "Internal"
                      ? "bg-[#00A6B4] dark:bg-[#38d4e2]"
                      : "bg-[#6DBE45] dark:bg-[#8ee064]"
                  )}
                />
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-[#005AA9] dark:group-hover:text-sky-300 transition-colors">
                  {link.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    "text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border",
                    link.akses === "Internal"
                      ? "bg-[#00A6B4]/15 text-[#00555c] dark:bg-[#00A6B4]/20 dark:text-[#38d4e2] border-[#00A6B4]/30 dark:border-[#00A6B4]/40"
                      : "bg-[#6DBE45]/15 text-[#245210] dark:bg-[#6DBE45]/20 dark:text-[#8ee064] border-[#6DBE45]/30 dark:border-[#6DBE45]/40"
                  )}
                >
                  {link.akses}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* =========================================================
          BAGIAN BAWAH: SPACE + LIHAT SEMUA DI KANAN BAWAH
      ========================================================= */}
      <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 italic hidden sm:inline">
          Koleksi Resmi BPS
        </span>

        {/* Tombol: Lihat semua di kanan bawah */}
        <button
          type="button"
          onClick={handleViewAllClick}
          aria-label={`Lihat semua layanan kategori ${slide.name}`}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer",
            isFront
              ? "bg-[#005AA9] hover:bg-[#004280] dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-sky-500/10 hover:gap-2"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          )}
        >
          <span>Lihat semua</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
