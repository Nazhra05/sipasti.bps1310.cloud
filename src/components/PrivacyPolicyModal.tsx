"use client";

import { X, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151f32] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00A6B4]/15 dark:bg-[#00A6B4]/20 text-[#006069] dark:text-[#38d4e2] border border-[#00A6B4]/30">
              <ShieldCheck className="w-5 h-5 text-[#00A6B4]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kebijakan Privasi & Keamanan Informasi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                BPS Kabupaten Solok Selatan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup Kebijakan Privasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <Lock className="w-4 h-4 text-[#00A6B4]" />
              <h3>1. Pengumpulan & Penggunaan Data</h3>
            </div>
            <p>
              Portal Internal BPS Kabupaten Solok Selatan mengumpulkan informasi otentikasi akun yang minimal (seperti username dan peranan akun) semata-mata untuk memverifikasi hak akses pengguna ke aplikasi kedinasan internal.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <Eye className="w-4 h-4 text-[#00A6B4]" />
              <h3>2. Perlindungan Cookie & HTTP-Only</h3>
            </div>
            <p>
              Sistem ini memanfaatkan cookie dengan atribut <strong>HttpOnly</strong> dan <strong>SameSite=Lax</strong> untuk mengamankan sesi pengguna. Cookie ini tidak mengandung pelacak pihak ketiga (no third-party tracking) dan dikirim secara terenkripsi melalui protokol HTTPS.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <FileText className="w-4 h-4 text-[#00A6B4]" />
              <h3>3. Kerahasiaan & Hak Akses</h3>
            </div>
            <p>
              Seluruh data otentikasi tidak pernah dijual, dibagikan, atau digunakan untuk keperluan komersial. Akses aplikasi internal dibatasi berdasarkan otoritas VPN dan profil hak akses pengguna resmi Badan Pusat Statistik.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] transition shadow-xs cursor-pointer"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
