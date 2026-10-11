"use client";

import { useEffect } from "react";
import {
  X,
  ShieldCheck,
  User,
  Mail,
  Key,
  Shield,
  Lock,
  ExternalLink,
  LogOut,
  FolderHeart,
  CheckCircle2,
} from "lucide-react";
import { UserInfo } from "@/context/AuthContext";

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  onLogout: () => void;
  onOpenRepository?: () => void;
}

export default function AccountDetailModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenRepository,
}: AccountDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#151f32] rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#005AA9] dark:bg-[#003870] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/15">
              <ShieldCheck className="w-5 h-5 text-[#6DBE45]" />
            </div>
            <div>
              <h3 id="account-modal-title" className="text-sm font-bold text-white">
                Detail Status Akun Pegawai
              </h3>
              <p className="text-[11px] text-blue-100/80">
                Sistem Portal Intranet BPS Solok Selatan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#005AA9] dark:bg-[#004280] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {(user.name || user.username || "B").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {user.name || "Pegawai BPS"}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isAdmin
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                      : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-700"
                  }`}
                >
                  {user.role || "Pegawai"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                @{user.username}
              </p>
            </div>
          </div>

          {/* Account Details Information Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Informasi Kredensial & Identitas
            </h5>
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Nama Lengkap:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.name || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email Dinas:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.email || `${user.username}@bps.go.id`}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Key className="w-4 h-4 text-slate-400" />
                  <span>ID Pengguna:</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  #{user.id_admin || "1"}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Access Status Banner */}
          <div className="p-4 rounded-2xl bg-[#6DBE45]/10 dark:bg-[#6DBE45]/15 border border-[#6DBE45]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2f6318] dark:text-[#8ee064]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Status Sesi: Terverifikasi & Aktif</span>
            </div>
            <div className="space-y-1 text-[11px] text-[#2f6318]/90 dark:text-[#8ee064]/90 leading-relaxed">
              <p>• Seluruh tautan layanan internal kedinasan dapat diakses langsung.</p>
              <p>• Sesi diamankan dengan token kriptografis HMAC-SHA256 HttpOnly.</p>
              <p>• Ruang repositori pribadi dan favorit layanan tersimpan secara terisolasi.</p>
            </div>
          </div>

          {/* Role specific actions */}
          {isAdmin && (
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                <Shield className="w-4 h-4 text-[#005AA9] shrink-0" />
                <div>
                  <p className="font-bold">Akses Hak Istimewa Admin</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Kelola tautan portal, taksonomi kategori, dan repositori di panel admin.
                  </p>
                </div>
              </div>
              <a
                href="http://localhost/Dashboard_Admin/public/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] transition shrink-0"
              >
                <span>Panel Admin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenRepository && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRepository();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800 transition cursor-pointer"
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>Repositori Saya</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
