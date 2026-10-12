"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  // 7 Icon Kategori
  TrendingUp,
  Factory,
  PieChart,
  Users,
  Cpu,
  Building2,
  Share2,
  // 8 Icon Repositori Pribadi
  Star,
  Globe,
  FileSpreadsheet,
  HardDrive,
  Smartphone,
  Image as ImageIcon,
  Bookmark,
  FolderHeart,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon `search_spark` dari referensi Google Antigravity (Material Symbols)
function SearchSparkIcon({ className = "w-6 h-6 sm:w-7 sm:h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 -960 960 960"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M736.56-570.62q-0.97,0-7.74-5.73q-14.52-55.98-55.5-96.96t-97.05-55.55q-1.83-0.91-5.65-7.6q0-1.91 5.73-7.64q55.98-14.9 96.96-55.7t55.55-97.24q0.91-1.83 7.6-5.65q1.91,0 7.64,5.73q15.86,56.37 56.3,97.21t96.5,55.52q1.93,0 5.79,7.75q0,0.97-5.8,7.66q-56.3,14.52-97.09,55.5t-55.5,97.05q0,1.83-7.74,5.65Zm54.06,433.08L531.31-396.85q-32.46,26.38-71.76,40.58t-81.62,14.19q-100.7,0-171.24-70.51t-70.53-171t70.53-171.06t171.24-70.58q27.08,0 52.92,5.62t49.92,16.85l-24.85,38.54q-18.38-8-38.01-11.81t-38.86-3.81q-81.83,0-139.36,57.25T182.15-583.71t57.5,138.94t138.82,57.31q77.99,0 134.06-52.92t61.77-130.23h44.77q-2.23,38.77-16.11,74.87t-39.04,66.28L823.84-171.15l-33.23,33.61Z" />
    </svg>
  );
}

// 16 Ikon murni (7 Kategori + 8 Repositori Pribadi + 1 Search Spark dari referensi)
const ICON_COMPONENTS = [
  // 7 Icon Kategori
  { id: "distribusi", render: () => <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "produksi", render: () => <Factory className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "neraca", render: () => <PieChart className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "sosial", render: () => <Users className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "ti", render: () => <Cpu className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "umum", render: () => <Building2 className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "diseminasi", render: () => <Share2 className="w-6 h-6 sm:w-7 sm:h-7" /> },

  // 1 search_spark dari referensi Google Antigravity
  { id: "search_spark", render: () => <SearchSparkIcon /> },

  // 8 Icon Repositori Pribadi
  { id: "repo_favorit", render: () => <Star className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_website", render: () => <Globe className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_data", render: () => <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_drive", render: () => <HardDrive className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_mobile", render: () => <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_foto", render: () => <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_referensi", render: () => <Bookmark className="w-6 h-6 sm:w-7 sm:h-7" /> },
  { id: "repo_folder_heart", render: () => <FolderHeart className="w-6 h-6 sm:w-7 sm:h-7" /> },
];

export default function BouncerIcons() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current || !listRef.current) {
      return;
    }

    const section = sectionRef.current;
    const list = listRef.current;
    const items = list.querySelectorAll<HTMLElement>("[data-bouncer]");
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Rekam posisi X pusat tiap icon
      const centers: number[] = [];
      const listRect = list.getBoundingClientRect();
      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        centers.push(itemRect.left - listRect.left + itemRect.width / 2);
      });

      // 2. High-performance quickSetter Y transformasi
      const quickSetters = Array.from(items).map((el) =>
        gsap.quickSetter(el, "y", "px")
      );

      const state = { phase: 0 };
      const wavelength = window.innerWidth || 1200;

      // 3. Formula gelombang sinus kontinu ringan (amplitudo lembut 18px)
      const updateWave = () => {
        const currentPhase = state.phase;
        for (let idx = 0; idx < items.length; idx++) {
          const angle = ((centers[idx] + currentPhase) / wavelength) * Math.PI * 2;
          const yOffset = Math.sin(angle) * 18;
          quickSetters[idx](yOffset);
        }
      };

      // Set posisi awal
      items.forEach((el, idx) => {
        const angle = (centers[idx] / wavelength) * Math.PI * 2;
        gsap.set(el, { x: 0, y: Math.sin(angle) * 18, opacity: 1, force3D: true });
      });

      // 4. Tween fase kontinu lebih lambat & sangat ringan (durasi 16 detik)
      const waveAnimation = gsap.to(state, {
        phase: wavelength,
        duration: 16,
        ease: "none",
        repeat: -1,
        onUpdate: updateWave,
      });

      // 5. ScrollTrigger: Pause saat offscreen, Play saat onscreen (efisiensi beban CPU/GPU)
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => waveAnimation.play(),
        onLeave: () => waveAnimation.pause(),
        onEnterBack: () => waveAnimation.play(),
        onLeaveBack: () => waveAnimation.pause(),
      });

      // 6. Horizontal Parallax Drift halus & ringan saat scroll
      gsap.to(list, {
        x: -120,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-agent-first-section
      aria-hidden="true"
      className="relative w-full py-16 sm:py-24 lg:py-28 overflow-x-clip pointer-events-none select-none"
    >
      {/* Row Bouncer Icons (Warna teks navbar: text-slate-700 dark:text-slate-200, Jarak luas seperti referensi) */}
      <ul
        ref={listRef}
        data-bouncer-list
        className="flex flex-nowrap items-center justify-center gap-10 sm:gap-14 md:gap-18 lg:gap-20 will-change-transform py-3 px-6"
      >
        {ICON_COMPONENTS.map((item) => (
          <li
            key={item.id}
            data-bouncer
            className="shrink-0 list-none will-change-transform text-slate-700 dark:text-slate-200 flex items-center justify-center"
          >
            {item.render()}
          </li>
        ))}
      </ul>
    </section>
  );
}
