"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Mail,
  AtSign,
  Settings,
  ExternalLink,
  LogOut,
  FolderHeart,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { UserInfo } from "@/context/AuthContext";

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  onLogout: () => void;
  onOpenRepository?: () => void;
  isInsideRepository?: boolean;
  onNavigateTab?: (tab: string) => void;
}

export default function AccountDetailModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenRepository,
  isInsideRepository = false,
  onNavigateTab,
}: AccountDetailModalProps) {
  const router = useRouter();

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

  const handleRepositoryClick = () => {
    onClose();
    if (isInsideRepository) {
      router.push("/");
    } else if (onOpenRepository) {
      onOpenRepository();
    } else {
      router.push("/repositori");
    }
  };

  const handlePortalServicesClick = () => {
    onClose();
    if (onNavigateTab) {
      onNavigateTab("portal_services");
    } else {
      router.push("/repositori?tab=portal_services");
    }
  };

  const handleSettingsClick = () => {
    onClose();
    if (onNavigateTab) {
      onNavigateTab("settings");
    } else {
      router.push("/repositori?tab=settings");
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-[#151f32] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-[#005AA9] dark:bg-[#003870] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/15">
              <ShieldCheck className="w-5 h-5 text-[#6DBE45]" />
            </div>
            <div>
              <h3 id="account-modal-title" className="text-sm font-bold text-white">
                Detail Akun Pegawai
              </h3>
              <p className="text-[11px] text-blue-100/80">
                Sistem Portal Intranet BPS Solok Selatan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Container foto dan username */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#005AA9] dark:bg-[#004280] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {(user.name || user.username || "P").charAt(0).toUpperCase()}
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

          {/* Quick Actions: Kelola Layanan & Repositori Pribadi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handlePortalServicesClick}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 transition group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#005AA9]/10 text-[#005AA9] dark:bg-sky-500/20 dark:text-sky-300">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Kelola Layanan
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005AA9] dark:group-hover:text-sky-300 transition" />
            </button>

            <button
              type="button"
              onClick={handleRepositoryClick}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 transition group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    isInsideRepository
                      ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300"
                  }`}
                >
                  {isInsideRepository ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <FolderHeart className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isInsideRepository ? "Kembali ke Portal" : "Repositori Pribadi"}
                </span>
              </div>
              {!isInsideRepository && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005AA9] dark:group-hover:text-sky-300 transition" />
              )}
            </button>
          </div>

          {/* Informasi Akun */}
          <div className="space-y-2.5 pt-1">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Informasi Akun
            </h5>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {/* Nama Lengkap */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Nama Lengkap:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.name || "-"}
                </span>
              </div>

              {/* Nama Pengguna */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <AtSign className="w-4 h-4 text-slate-400" />
                  <span>Nama Pengguna:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.username || "-"}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email:</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.email || `${user.username}@bps.go.id`}
                </span>
              </div>
            </div>
          </div>

          {/* Pengaturan (Native Next.js) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSettingsClick}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 transition group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-200/70 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Pengaturan
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Kelola profil, keamanan, dan preferensi akun
                  </span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition" />
            </button>
          </div>

          {/* SSO to Dashboard Admin (Only for Admin users) */}
          {isAdmin && (
            <div className="pt-1">
              <a
                href="/api/auth/sso?target=index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-400/30 dark:border-amber-500/30 transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                      Buka Dashboard Admin
                    </span>
                    <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                      Kelola konfigurasi sistem khusus Administrator
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer: Logout (kiri) dan Tutup (kanan) */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
