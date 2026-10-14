"use client";

import { useState } from "react";
import {
  X,
  MailCheck,
  ShieldAlert,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  HelpCircle,
} from "lucide-react";

interface ResendVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export default function ResendVerificationModal({
  isOpen,
  onClose,
  defaultEmail = "",
}: ResendVerificationModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleOpenResendPage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    window.open(`/api/auth/resend-verification${query}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <MailCheck className="w-5 h-5 text-[#005AA9] dark:text-[#38a0f0]" />
            <span>Panduan & Kirim Ulang Email Verifikasi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Info */}
        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Clock className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold">Masa Berlaku Tautan Verifikasi: 24 Jam</p>
              <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/90">
                Tautan verifikasi email yang dikirim saat pendaftaran kedinasan berlaku selama 24 jam. Jika kedaluwarsa, akun belum dapat digunakan hingga tautan baru dikirimkan.
              </p>
            </div>
          </div>

          <p>
            Jika Anda belum menerima email aktivasi atau masa berlaku tautan verifikasi telah habis, silakan gunakan formulir verifikasi resmi untuk meminta tautan baru:
          </p>

          <form onSubmit={handleOpenResendPage} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Email Kedinasan Pegawai
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@bps.go.id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9]/30"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#005AA9] hover:bg-[#004280] text-white shadow-xs cursor-pointer transition active:scale-95"
              >
                <span>Buka Formulir Kirim Ulang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {submitted && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Halaman kirim ulang dibuka di tab baru. Periksa folder Inbox/Spam email Anda.</span>
            </div>
          )}
        </div>

        {/* Footer Admin Note */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Perlu bantuan aktivasi manual?</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">Hubungi Tim IPDS / Admin BPS</span>
        </div>
      </div>
    </div>
  );
}
