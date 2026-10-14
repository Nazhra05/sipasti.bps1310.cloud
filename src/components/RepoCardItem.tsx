"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Eye,
  X,
  HardDrive,
  ImageIcon,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import { getPreviewInfo } from "@/lib/thumbnailHelper";

interface RepoCardItemProps {
  id: string | number;
  title: string;
  url: string;
  desc?: string;
  badge?: string;
  badgeColor?: string;
  icon?: LucideIcon;
  onDelete?: () => void;
  onCopy?: () => void;
  isCopied?: boolean;
}

export default function RepoCardItem({
  title,
  url,
  desc,
  badge = "Tautan",
  badgeColor = "text-[#005AA9] bg-[#005AA9]/10 dark:text-sky-300 dark:bg-sky-500/15",
  icon: IconComp,
  onDelete,
  onCopy,
  isCopied,
}: RepoCardItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPeekOpen, setIsPeekOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-detect thumbnail for Google Drive / direct image links
  const previewInfo = getPreviewInfo(url);
  const [thumbSrc, setThumbSrc] = useState(previewInfo.thumbnailUrl || "");
  const [peekSrc, setPeekSrc] = useState(previewInfo.peekUrl || "");

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setThumbSrc(previewInfo.thumbnailUrl || "");
    setPeekSrc(previewInfo.peekUrl || "");
  }, [url]);

  const showThumbnail = previewInfo.hasPreview && !imageError;

  const handleDeleteClick = () => {
    if (window.confirm(`Hapus koleksi "${title}" dari repositori pribadi?`)) {
      setIsDeleting(true);
      if (onDelete) onDelete();
    }
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200/90 dark:border-slate-800 hover:border-[#005AA9]/40 dark:hover:border-sky-500/40 shadow-xs hover:shadow-md transition-all duration-200">
        <div>
          {/* Top Row: Badge & Delete Button */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${badgeColor}`}
            >
              {IconComp && <IconComp className="w-3 h-3" />}
              <span>{badge}</span>
            </span>

            {onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title="Hapus dari repositori"
                className="opacity-60 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Visual Thumbnail Banner (if Google Drive or image link) */}
          {previewInfo.hasPreview && (
            <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-center">
              {!imageError ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6 opacity-40" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbSrc}
                    alt={title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      if (previewInfo.fallbackThumbnailUrl && thumbSrc !== previewInfo.fallbackThumbnailUrl) {
                        setThumbSrc(previewInfo.fallbackThumbnailUrl);
                      } else {
                        setImageError(true);
                      }
                    }}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Peek Hover Overlay Button */}
                  <div
                    onClick={() => setIsPeekOpen(true)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-200 flex items-center justify-center cursor-pointer"
                    title="Klik untuk membuka Peek View"
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-bold shadow-md hover:scale-105 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-[#005AA9] dark:text-sky-400" />
                      <span>Peek View</span>
                    </span>
                  </div>

                  {/* GDrive Tag */}
                  {previewInfo.isGoogleDrive && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1 pointer-events-none">
                      <HardDrive className="w-2.5 h-2.5 text-blue-300" />
                      <span>GDrive</span>
                    </span>
                  )}
                </>
              ) : (
                /* Fallback if Google Drive file has restricted sharing */
                <div className="p-3 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <HardDrive className="w-7 h-7 mb-1 opacity-50" />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Google Drive (Tautan Privat)
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Klik &quot;Buka&quot; untuk melihat di Google Drive
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Title & Description */}
          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#005AA9] dark:group-hover:text-sky-400 transition-colors">
            {title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {desc || "Tidak ada deskripsi tambahan."}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            {/* Peek Button (if thumbnail is available and working) */}
            {showThumbnail && (
              <button
                type="button"
                onClick={() => setIsPeekOpen(true)}
                className="inline-flex items-center gap-1 text-[#005AA9] dark:text-sky-400 hover:text-[#004280] dark:hover:text-sky-300 font-semibold cursor-pointer active:scale-95 transition-all"
                title="Lihat pratinjau foto (Peek View)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Peek</span>
              </button>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer active:scale-95 transition-all duration-150"
              title="Salin tautan ke papan klip"
            >
              {isCopied ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md animate-in zoom-in-75 duration-150">
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Tersalin!</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </span>
              )}
            </button>
          </div>

          {/* External Link Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
            title="Buka tautan asli di tab baru"
          >
            <span>Buka</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          PEEK VIEW MODAL (LIGHTBOX INTERAKTIF)
         ───────────────────────────────────────────────────────────────────────── */}
      {isPeekOpen && previewInfo.peekUrl && (
        <div
          onClick={() => setIsPeekOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau ${title}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white dark:bg-[#151f32] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#005AA9] text-white">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div className="p-2 rounded-xl bg-white/15 shrink-0">
                  <Eye className="w-4 h-4 text-sky-200" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                      {badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100/80 truncate">
                    Pratinjau Visual &bull; {previewInfo.isGoogleDrive ? "Google Drive Foto" : "Berkas Gambar"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPeekOpen(false)}
                aria-label="Tutup pratinjau"
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High-Res Image View */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center bg-slate-950/20 dark:bg-slate-950/50">
              <div className="relative max-h-[60vh] w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={peekSrc}
                  alt={title}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (previewInfo.fallbackPeekUrl && peekSrc !== previewInfo.fallbackPeekUrl) {
                      setPeekSrc(previewInfo.fallbackPeekUrl);
                    }
                  }}
                  className="max-h-[58vh] max-w-full object-contain rounded-xl shadow-md"
                />
              </div>

              {previewInfo.isGoogleDrive && (
                <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#005AA9] dark:text-sky-400 shrink-0" />
                  <span>
                    Pratinjau foto Google Drive dioptimalkan otomatis untuk intranet BPS Solok Selatan.
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer: Description & Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2 max-w-md">
                {desc || "Tidak ada keterangan tambahan untuk berkas ini."}
              </p>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {onCopy && (
                  <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tautan</span>
                      </>
                    )}
                  </button>
                )}

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#005AA9] hover:bg-[#004280] text-white shadow-xs transition cursor-pointer"
                >
                  <span>Buka di Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
