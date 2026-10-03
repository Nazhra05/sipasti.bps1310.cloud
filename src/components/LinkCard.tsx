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
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700/80 p-5 shadow-xs hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200">
      <div>
        {/* Top Badges: Category & Accessibility Status + Wajib VPN Label */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
            {layanan.category_name}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Label Status VPN (Butuh VPN vs Tanpa VPN) */}
            {layanan.requires_vpn ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60"
                title="Memerlukan koneksi VPN BPS untuk mengakses"
              >
                <Shield className="w-3 h-3 text-amber-700 dark:text-amber-400" />
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

            {/* Accessibility Status Badge: Publik vs Internal */}
            {isInternal ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                  isAuthenticated
                    ? "bg-emerald-100/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60"
                    : "bg-blue-100/90 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60"
                }`}
                title={isAuthenticated ? "Aplikasi Internal (Terverifikasi)" : "Aplikasi internal operasional BPS (Perlu Login)"}
              >
                <Lock className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>{isAuthenticated ? "Internal (Terverifikasi)" : "Internal"}</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60"
                title="Aplikasi dapat diakses publik tanpa VPN"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
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
              className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 group-hover:border-slate-500 dark:group-hover:border-slate-400 transition-colors shadow-2xs cursor-pointer"
            >
              <LinkLogo logo={layanan.logo} label={layanan.nama_layanan} size="lg" />
            </button>
          ) : (
            <a
              href={layanan.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Buka ${layanan.nama_layanan} di tab baru`}
              className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 group-hover:border-slate-500 dark:group-hover:border-slate-400 transition-colors shadow-2xs"
            >
              <LinkLogo logo={layanan.logo} label={layanan.nama_layanan} size="lg" />
            </a>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-[#003366] dark:group-hover:text-blue-400 transition-colors">
              {isProtected ? (
                /* Button mode for unauthenticated internal link: NO href attribute to prevent browser URL move link preview */
                <button
                  onClick={handleInternalRedirect}
                  className="hover:underline flex items-center gap-1 text-left w-full cursor-pointer"
                >
                  <span>{layanan.nama_layanan}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-500" />
                </button>
              ) : (
                <a
                  href={layanan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>{layanan.nama_layanan}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-500" />
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
          className={`flex items-start gap-2 p-2.5 rounded-xl text-[11px] leading-relaxed mb-4 border ${
            layanan.requires_vpn
              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800/40 font-medium"
              : isInternal
              ? "bg-blue-50/70 dark:bg-blue-950/20 text-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800/40 font-medium"
              : "bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/60 font-medium"
          }`}
        >
          <Info
            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
              layanan.requires_vpn
                ? "text-amber-700 dark:text-amber-400"
                : isInternal
                ? "text-blue-700 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          />
          <span>{layanan.technical_note}</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        {isProtected ? (
          /* Button mode for unauthenticated internal link: NO href attribute to prevent browser URL move link preview */
          <button
            onClick={handleInternalRedirect}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold bg-[#003366] hover:bg-[#002244] text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            title="Klik untuk login terlebih dahulu"
          >
            <span>Buka Aplikasi</span>
            <Lock className="w-3.5 h-3.5 text-amber-300" />
          </button>
        ) : (
          <a
            href={layanan.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              isInternal ? "w-full" : "flex-1"
            } inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold bg-[#003366] hover:bg-[#002244] text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all cursor-pointer shadow-xs active:scale-[0.98]`}
          >
            <span>Buka Aplikasi</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Tombol Salin: Hanya untuk Publik, TIDAK ADA SALIN untuk Internal */}
        {!isInternal && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center p-2 min-h-[38px] min-w-[38px] rounded-lg text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-2xs"
            title="Salin tautan"
            aria-label="Salin tautan"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
