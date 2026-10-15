"use client";

import { X, BookOpen, Search, ShieldCheck, FolderHeart, HelpCircle } from "lucide-react";

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
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-7"
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
          <div className="p-2.5 rounded-xl bg-[#005AA9]/10 dark:bg-sky-500/20 text-[#005AA9] dark:text-sky-300 border border-[#005AA9]/20">
            <BookOpen className="w-5 h-5 text-[#005AA9] dark:text-sky-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Panduan Penggunaan Aplikasi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Petunjuk pencarian layanan, pemahaman hak akses, dan pengelolaan repositori
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Bagian 1: Pencarian Layanan */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-start gap-2.5">
              <Search className="w-4 h-4 text-[#005AA9] dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  1. Mencari dan Menemukan Layanan
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Gunakan kolom pencarian di halaman utama untuk mencari nama aplikasi, singkatan, atau kata kunci bidang tugas. Anda juga dapat menyaring layanan berdasarkan 7 kelompok statistik resmi atau membuka menu Katalog Layanan untuk melihat seluruh daftar aplikasi.
                </p>
              </div>
            </div>
          </div>

          {/* Bagian 2: Memahami Label Akses */}
          <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-800/50">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  2. Memahami Label Akses Layanan
                </h4>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>
                    <strong>Akses Publik:</strong> Layanan terbuka yang dapat dibuka langsung tanpa perlu masuk ke akun portal.
                  </li>
                  <li>
                    <strong>Akses Internal:</strong> Layanan kedinasan khusus yang memerlukan login akun pegawai dan koneksi jaringan kantor atau VPN BPS aktif.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bagian 3: Repositori Pribadi & Tambah Layanan */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50">
            <div className="flex items-start gap-2.5">
              <FolderHeart className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  3. Repositori Pribadi dan Tambah Layanan
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Setelah masuk dengan akun dinas, buka menu <strong>Repositori</strong> untuk mengorganisasi tautan kerja Anda sendiri (Website, Dokumen, Spreadsheet, Google Drive, Folder, atau Foto). Anda juga dapat menambahkan layanan baru ke direktori portal agar dapat digunakan bersama.
                </p>
              </div>
            </div>
          </div>

          {/* Bagian 4: Bantuan Tambahan */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  4. Kendala Akses atau Tautan Berubah
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Jika menemukan tautan yang tidak dapat dibuka atau alamat sistem yang telah berganti, silakan hubungi tim pengelola melalui kontak WhatsApp PST atau WhatsApp Admin di bagian footer.
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
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
