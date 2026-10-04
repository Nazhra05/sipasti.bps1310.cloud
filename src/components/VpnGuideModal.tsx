"use client";

import { X, Shield, CheckCircle2, AlertTriangle } from "lucide-react";

interface VpnGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VpnGuideModal({ isOpen, onClose }: VpnGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup panduan"
          className="absolute top-5 right-5 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-2.5 rounded-xl bg-[#FFA500]/15 dark:bg-[#FFA500]/20 text-[#8c5200] dark:text-[#ffbe4d] border border-[#FFA500]/30">
            <Shield className="w-5 h-5 text-[#FFA500]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Panduan Akses VPN & Jaringan BPS
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instruksi teknis untuk aplikasi bertanda "Butuh VPN"
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-[#FFA500]/10 dark:bg-[#FFA500]/15 border border-[#FFA500]/30">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[#804b00] dark:text-[#ffbe4d]">
                Aplikasi internal seperti <strong>Backoffice Selindo (BOS)</strong> hanya dapat dibuka jika perangkat Anda terhubung ke <strong>VPN BPS</strong> atau jaringan kantor.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6DBE45]" />
              Langkah Menghubungkan VPN:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed text-slate-600 dark:text-slate-300 text-xs">
              <li>
                Buka aplikasi <strong>FortiClient VPN</strong> pada laptop/PC kerja Anda.
              </li>
              <li>
                Pilih profil koneksi <strong>BPS-Pusat</strong> atau <strong>VPN-BPS</strong>.
              </li>
              <li>
                Masukkan <strong>Username SSO BPS</strong> (tanpa <em>@bps.go.id</em>) dan kata sandi akun SSO Anda.
              </li>
              <li>
                Klik <strong>Connect</strong> hingga indikator status <em>Connected (100%)</em>.
              </li>
            </ol>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-amber-900 dark:text-amber-300">Catatan Akses:</strong>
                <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                  Aplikasi dengan label <em>Akses Intranet (Wajib VPN)</em> wajib menggunakan koneksi VPN BPS yang aktif untuk dapat diakses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] text-white transition cursor-pointer shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
