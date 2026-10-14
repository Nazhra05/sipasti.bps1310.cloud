"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

interface LoadingScreenProps {
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  className = "",
  fullScreen = true,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !textRef.current) return;

    const ctx = gsap.context(() => {
      try {
        const split = new SplitText(textRef.current, {
          type: "chars",
          charsClass: "inline-block",
        });

        // 3-color brand theme: Biru (#005AA9), Hijau (#6DBE45), Orange (#F37021)
        // RANCAK: R-A (Biru), N-C (Hijau), A-K (Orange)
        const brandColors = [
          "#005AA9", // R - Biru
          "#005AA9", // A - Biru
          "#6DBE45", // N - Hijau
          "#6DBE45", // C - Hijau
          "#F37021", // A - Orange
          "#F37021", // K - Orange
        ];

        split.chars.forEach((char, index) => {
          gsap.set(char, {
            color: brandColors[index % brandColors.length],
          });
        });

        // Typographic Reveal Looping Animation via SplitText
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.25,
        });

        // Initial state
        tl.set(split.chars, {
          opacity: 0,
          y: 32,
          scale: 0.85,
          filter: "blur(4px)",
        })
          // Typographic Reveal in (staggered)
          .to(split.chars, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.55,
            stagger: 0.08,
            ease: "back.out(1.8)",
          })
          // Subtle breath / highlight at peak reveal
          .to(
            split.chars,
            {
              scale: 1.05,
              duration: 0.35,
              stagger: 0.04,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            },
            "+=0.2"
          )
          // Hold full reveal
          .to({}, { duration: 0.6 })
          // Typographic Reveal out (staggered exit)
          .to(split.chars, {
            opacity: 0,
            y: -26,
            scale: 0.9,
            filter: "blur(3px)",
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.in",
          });
      } catch (err) {
        console.warn("LoadingScreen SplitText warning:", err);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const baseContainerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0c1424] transition-colors"
    : "flex items-center justify-center p-8";

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Memuat RANCAK"
      className={`${baseContainerClasses} ${className}`}
    >
      <h1
        ref={textRef}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight select-none"
      >
        RANCAK
      </h1>
    </div>
  );
}
