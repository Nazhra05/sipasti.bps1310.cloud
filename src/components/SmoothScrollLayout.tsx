"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface SmoothScrollLayoutProps {
  children: React.ReactNode;
}

export default function SmoothScrollLayout({ children }: SmoothScrollLayoutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let smoother: ScrollSmoother | null = null;
    const ctx = gsap.context(() => {
      try {
        smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current || "#smooth-wrapper",
          content: contentRef.current || "#smooth-content",
          smooth: 0.35, // Sangat ringan, instan dan halus tanpa beban gulir
          effects: true,
          smoothTouch: 0, // Native touch pada touchpad/ponsel agar bebas beban
        });

        // Simpan instance ke window untuk integrasi global jika diperlukan
        if (typeof window !== "undefined") {
          (window as unknown as { ScrollSmootherInstance?: ScrollSmoother }).ScrollSmootherInstance = smoother;
        }
      } catch (err) {
        console.warn("ScrollSmoother initialization warning:", err);
      }
    });

    return () => {
      ctx.revert();
      if (smoother) {
        smoother.kill();
      }
    };
  }, []);

  return (
    <div
      id="smooth-wrapper"
      ref={wrapperRef}
      className="w-full min-h-screen overflow-hidden"
    >
      <div
        id="smooth-content"
        ref={contentRef}
        className="w-full flex flex-col min-h-screen"
      >
        {children}
      </div>
    </div>
  );
}
