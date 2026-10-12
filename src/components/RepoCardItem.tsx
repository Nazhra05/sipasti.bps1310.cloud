"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, Trash2, LucideIcon } from "lucide-react";

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

  const handleDeleteClick = () => {
    if (window.confirm(`Hapus koleksi "${title}" dari repositori pribadi?`)) {
      setIsDeleting(true);
      if (onDelete) onDelete();
    }
  };

  return (
    <div className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200/90 dark:border-slate-800 hover:border-[#005AA9]/40 dark:hover:border-sky-500/40 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${badgeColor}`}>
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

        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#005AA9] dark:group-hover:text-sky-400 transition-colors">
          {title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
          {desc || "Tidak ada deskripsi tambahan."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer active:scale-95 transition-all duration-150"
        >
          {isCopied ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md animate-in zoom-in-75 duration-150">
              <Check className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Tersalin!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" />
              <span>Salin URL</span>
            </span>
          )}
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
        >
          <span>Kunjungi</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
