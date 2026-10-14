"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface FooterProps {
  onOpenPrivacyPolicy?: () => void;
  onOpenVpnGuide?: () => void;
  className?: string;
}

export default function Footer({
  onOpenPrivacyPolicy,
  onOpenVpnGuide,
  className = "",
}: FooterProps) {
  return (
    <footer
      id="footer"
      className={`w-full bg-white dark:bg-[#0c1424] border-t border-slate-200/60 dark:border-slate-800/60 py-12 sm:py-16 mt-20 sm:mt-28 transition-colors text-slate-600 dark:text-slate-400 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 pb-8 sm:pb-10">
          {/* Column 1: RANCAK */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-[#005AA9] via-[#6DBE45] to-[#F37021] bg-clip-text text-transparent inline-block">
              RANCAK
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              Ruang Akses dan Navigasi Cepat
              <br />
              Aplikasi dan Koleksi
            </p>
            <div className="pt-1">
              <a
                href="https://solokselatankab.bps.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-[#005AA9] dark:hover:text-white transition-colors group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005AA9] dark:group-hover:text-white transition-colors shrink-0" />
                <span>Website BPS Solok Selatan</span>
              </a>
            </div>
          </div>

          {/* Column 2: Kontak & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Kontak &amp; Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://wa.me/62821800001310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-white transition-colors block"
                >
                  WhatsApp PST
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282288338444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-white transition-colors block"
                >
                  WhatsApp Admin
                </a>
              </li>
              <li>
                <a
                  href="mailto:bps1310@bps.go.id"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-white transition-colors block"
                >
                  Email BPS Solok Selatan
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Informasi */}
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Informasi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenVpnGuide}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Panduan VPN
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
