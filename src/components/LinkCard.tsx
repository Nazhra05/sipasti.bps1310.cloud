"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Copy, Check, Globe, Shield, Info, ArrowUpRight, Lock } from "lucide-react";
import { EnrichedLayanan } from "@/lib/accessibilityMapper";
import { useAuth } from "@/context/AuthContext";
import LinkLogo from "./LinkLogo";

interface LinkCardProps {
  layanan: EnrichedLayanan;
  onCopyLink: (url: string, name: string) => void;
}

export default function LinkCard({ layanan, onCopyLink }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(layanan.url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = layanan.url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onCopyLink(layanan.url, layanan.nama_layanan);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
      onCopyLink(layanan.url, layanan.nama_layanan);
    }
  };

  const isInternal = layanan.access_type === "internal";
  // internal card links require verified auth; unauthenticated internal links use buttons (no href preview)
  const isProtected = isInternal && !isAuthenticated;

  const handleInternalRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const targetUrl = encodeURIComponent(layanan.url);
      const targetName = encodeURIComponent(layanan.nama_layanan);
      router.push(`/login?redirect=${targetUrl}&name=${targetName}`);
    } catch (err) {
      console.error("Gagal pengalihan router:", err);
      window.location.href = "/login";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700/80 p-5 shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#005AA9]/40 dark:hover:border-[#00A6B4]/50 transition-all duration-200">
      <div>
        {/* Top Badges: Category & Accessibility Status + Wajib VPN Label */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors">
            {layanan.category_name}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Label Status VPN (Butuh VPN vs Tanpa VPN) - Accent Orange #FFA500 */}
            {layanan.requires_vpn ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FFA500]/15 dark:bg-[#FFA500]/20 text-[#8c5200] dark:text-[#ffbe4d] border border-[#FFA500]/40 dark:border-[#FFA500]/50"
                title="Memerlukan koneksi VPN BPS untuk mengakses"
              >
                <Shield className="w-3 h-3 text-[#FFA500]" />
                <span>Butuh VPN</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                title="Dapat diakses langsung tanpa VPN"
              >
                <Globe className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span>Tanpa VPN</span>
              </span>
            )}

            {/* Accessibility Status Badge: Publik (Green #6DBE45) vs Internal (Teal #00A6B4) */}
            {isInternal ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-colors ${
                  isAuthenticated
                    ? "bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 text-[#2f6318] dark:text-[#8ee064] border-[#6DBE45]/40 dark:border-[#6DBE45]/50"
                    : "bg-[#00A6B4]/15 dark:bg-[#00A6B4]/20 text-[#006069] dark:text-[#38d4e2] border border-[#00A6B4]/40 dark:border-[#00A6B4]/50"
                }`}
                title={isAuthenticated ? "Aplikasi Internal (Terverifikasi)" : "Aplikasi internal operasional BPS (Perlu Login)"}
              >
                <Lock className={`w-3.5 h-3.5 ${isAuthenticated ? "text-[#3b781e] dark:text-[#6DBE45]" : "text-[#00828e] dark:text-[#00A6B4]"}`} />
                <span>{isAuthenticated ? "Internal (Terverifikasi)" : "Internal"}</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 text-[#2f6318] dark:text-[#8ee064] border border-[#6DBE45]/40 dark:border-[#6DBE45]/50"
                title="Aplikasi dapat diakses publik tanpa VPN"
              >
                <Globe className="w-3.5 h-3.5 text-[#3b781e] dark:text-[#6DBE45]" />
                <span>Publik</span>
              </span>
            )}
          </div>
        </div>

        {/* Header with App Logo & Title */}
        <div className="flex items-start gap-3.5 mb-2.5">
          {isProtected ? (
            /* Button mode for unauthenticated internal link: NO href attribute to prevent browser URL move link preview */
            <button
              onClick={handleInternalRedirect}
              title={`Buka ${layanan.nama_layanan} (Memerlukan Login Portal)`}
              className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 group-hover:scale-105 group-hover:border-[#005AA9] dark:group-hover:border-[#00A6B4] transition-all duration-200 shadow-2xs cursor-pointer"
            >
              <LinkLogo logo={layanan.logo} label={layanan.nama_layanan} size="lg" />
            </button>
          ) : (
            <a
              href={layanan.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Buka ${layanan.nama_layanan} di tab baru`}
              className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 group-hover:scale-105 group-hover:border-[#005AA9] dark:group-hover:border-[#00A6B4] transition-all duration-200 shadow-2xs"
            >
              <LinkLogo logo={layanan.logo} label={layanan.nama_layanan} size="lg" />
            </a>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-[#005AA9] dark:group-hover:text-[#00A6B4] transition-colors duration-150">
              {isProtected ? (
                /* Button mode for unauthenticated internal link: NO href attribute to prevent browser URL move link preview */
                <button
                  onClick={handleInternalRedirect}
                  className="hover:underline flex items-center gap-1 text-left w-full cursor-pointer"
                >
                  <span>{layanan.nama_layanan}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0 text-[#005AA9] dark:text-[#00A6B4]" />
                </button>
              ) : (
                <a
                  href={layanan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>{layanan.nama_layanan}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0 text-[#005AA9] dark:text-[#00A6B4]" />
                </a>
              )}
            </h3>

            {/* PEEK URL SUBTITLE: Hanya tampil untuk Publik, TIDAK ADA PEEK untuk Internal */}
            {!isInternal && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                {layanan.url.replace(/^https?:\/\//, "")}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5 line-clamp-2">
          {layanan.deskripsi_layanan || "Layanan dan sistem kerja resmi BPS Kabupaten Solok Selatan."}
        </p>

        {/* Technical Note Box with Obvious Contrast */}
        <div
          className={`flex items-start gap-2 p-2.5 rounded-xl text-[11px] leading-relaxed mb-4 border transition-colors ${
            layanan.requires_vpn
              ? "bg-[#FFA500]/10 dark:bg-[#FFA500]/15 text-[#804b00] dark:text-[#ffbe4d] border-[#FFA500]/30 dark:border-[#FFA500]/40 font-medium"
              : isInternal
              ? "bg-[#00A6B4]/10 dark:bg-[#00A6B4]/15 text-[#00555c] dark:text-[#38d4e2] border-[#00A6B4]/30 dark:border-[#00A6B4]/40 font-medium"
              : "bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/60 font-medium"
          }`}
        >
          <Info
            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
              layanan.requires_vpn
                ? "text-[#b36b00] dark:text-[#FFA500]"
                : isInternal
                ? "text-[#00828e] dark:text-[#00A6B4]"
                : "text-slate-500 dark:text-slate-400"
            }`}
          />
          <span>{layanan.technical_note}</span>
        </div>
      </div>

      {/* Card Footer Actions - Solid Navy #005AA9 Button with Micro-motion */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        {isProtected ? (
          /* Button mode for unauthenticated internal link: NO href attribute to prevent browser URL move link preview */
          <button
            onClick={handleInternalRedirect}
            className="group/btn w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] text-white transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
            title="Klik untuk login terlebih dahulu"
          >
            <span>Buka Aplikasi</span>
            <Lock className="w-3.5 h-3.5 text-[#FFA500] group-hover/btn:rotate-6 transition-transform duration-150" />
          </button>
        ) : (
          <a
            href={layanan.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/btn ${
              isInternal ? "w-full" : "flex-1"
            } inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] text-white transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]`}
          >
            <span>Buka Aplikasi</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-150" />
          </a>
        )}

        {/* Tombol Salin: Hanya untuk Publik, TIDAK ADA SALIN untuk Internal */}
        {!isInternal && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center p-2 min-h-[38px] min-w-[38px] rounded-lg text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer shadow-2xs"
            title="Salin tautan"
            aria-label="Salin tautan"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#6DBE45] animate-in zoom-in-50 duration-150" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
