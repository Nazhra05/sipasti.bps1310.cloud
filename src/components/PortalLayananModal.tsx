"use client";

import { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  Edit3,
  Globe,
  Lock,
  Shield,
  Layers,
  FileText,
  Link as LinkIcon,
  Check,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { LayananItem, KategoriItem } from "@/lib/api";
import {
  createPortalLayanan,
  updatePortalLayanan,
  PortalLayananPayload,
} from "@/lib/portalLayananApi";

interface PortalLayananModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LayananItem | null;
  kategoriList: KategoriItem[];
  currentCount?: number;
  userRole?: string;
  onDeleteCurrent?: (item: LayananItem) => void;
  onSuccess: () => void;
  onShowToast: (msg: string) => void;
}

const DEFAULT_CATEGORIES: KategoriItem[] = [
  { id_kategori: 1, nama_kategori: "Distribusi", deskripsi: "Layanan statistik distribusi" },
  { id_kategori: 2, nama_kategori: "Produksi", deskripsi: "Layanan statistik produksi" },
  { id_kategori: 3, nama_kategori: "Neraca Wilayah", deskripsi: "Layanan statistik nerwilis" },
  { id_kategori: 4, nama_kategori: "Statistik Sosial", deskripsi: "Layanan statistik sosial" },
  { id_kategori: 5, nama_kategori: "IPDS", deskripsi: "Integrasi Pengolahan & Diseminasi Statistik" },
  { id_kategori: 6, nama_kategori: "Umum", deskripsi: "Layanan umum & kepegawaian" },
  { id_kategori: 7, nama_kategori: "TI & Jaringan", deskripsi: "Layanan teknologi informasi" },
];

export default function PortalLayananModal({
  isOpen,
  onClose,
  initialData,
  kategoriList,
  currentCount = 0,
  userRole = "USER",
  onDeleteCurrent,
  onSuccess,
  onShowToast,
}: PortalLayananModalProps) {
  const isEditing = Boolean(initialData && initialData.id_layanan);

  const [namaLayanan, setNamaLayanan] = useState("");
  const [idKategori, setIdKategori] = useState<number>(1);
  const [akses, setAkses] = useState<"Public" | "Internal">("Public");
  const [vpn, setVpn] = useState<"Yes" | "No">("No");
  const [url, setUrl] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [logo, setLogo] = useState("logo_bps.jpg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const categories = kategoriList && kategoriList.length > 0 ? kategoriList : DEFAULT_CATEGORIES;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNamaLayanan(initialData.nama_layanan || "");
        setIdKategori(initialData.id_kategori || 1);
        setAkses(initialData.akses === "Internal" ? "Internal" : "Public");
        const vpnVal = String(initialData.vpn || "").toLowerCase();
        setVpn(vpnVal === "yes" || vpnVal === "1" ? "Yes" : "No");
        setUrl(initialData.url || "");
        setDeskripsi(initialData.deskripsi_layanan || "");
        setLogo(initialData.logo || "logo_bps.jpg");
      } else {
        setNamaLayanan("");
        setIdKategori(categories[0]?.id_kategori || 1);
        setAkses("Public");
        setVpn("No");
        setUrl("");
        setDeskripsi("");
        setLogo("logo_bps.jpg");
      }
      setErrorMsg("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialData, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedNama = namaLayanan.trim();
    const trimmedUrl = url.trim();
    const trimmedDeskripsi = deskripsi.trim();

    if (!trimmedNama) {
      setErrorMsg("Nama layanan wajib diisi.");
      return;
    }
    if (!trimmedUrl) {
      setErrorMsg("URL / tautan layanan wajib diisi.");
      return;
    }
    if (!trimmedDeskripsi) {
      setErrorMsg("Deskripsi layanan wajib diisi.");
      return;
    }

    let finalUrl = trimmedUrl;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    setIsSubmitting(true);

    const payload: PortalLayananPayload = {
      nama_layanan: trimmedNama,
      id_kategori: Number(idKategori),
      akses,
      vpn,
      url: finalUrl,
      deskripsi_layanan: trimmedDeskripsi,
      logo: logo.trim() || "logo_bps.jpg",
    };

    try {
      if (isEditing && initialData?.id_layanan) {
        const res = await updatePortalLayanan(initialData.id_layanan, payload);
        if (res.status) {
          onShowToast(`Layanan "${trimmedNama}" berhasil diperbarui!`);
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message || "Gagal memperbarui layanan portal.");
        }
      } else {
        const res = await createPortalLayanan(payload);
        if (res.status) {
          onShowToast(`Layanan "${trimmedNama}" berhasil ditambahkan ke katalog portal!`);
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message || "Gagal menambahkan layanan portal.");
        }
      }
    } catch {
      setErrorMsg("Gagal memproses layanan. Silakan coba beberapa saat lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-[#151f32] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-[#005AA9] dark:bg-[#003870] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15">
              {isEditing ? <Edit3 className="w-5 h-5 text-sky-200" /> : <PlusCircle className="w-5 h-5 text-[#6DBE45]" />}
            </div>
            <div>
              <h3 id="portal-modal-title" className="text-sm sm:text-base font-bold text-white">
                {isEditing ? "Edit Layanan Portal" : "Tambah Layanan Portal"}
              </h3>
              <p className="text-[11px] text-blue-100/80">
                Layanan akan otomatis masuk ke Direktori / Katalog Layanan BPS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">


          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Nama Layanan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Layanan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={namaLayanan}
                onChange={(e) => setNamaLayanan(e.target.value)}
                placeholder="Contoh: Sensus Pertanian 2026, Portal Satu Data..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
              />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Kategori Layanan <span className="text-red-500">*</span>
            </label>
            <select
              value={idKategori}
              onChange={(e) => setIdKategori(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
            >
              {categories.map((c) => (
                <option key={c.id_kategori} value={c.id_kategori}>
                  {c.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Grid: Akses & VPN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Akses */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tingkat Akses
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAkses("Public")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    akses === "Public"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publik</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAkses("Internal")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    akses === "Internal"
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-[#005AA9] dark:text-sky-300"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Internal</span>
                </button>
              </div>
            </div>

            {/* VPN Requirement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Memerlukan VPN BPS?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVpn("No")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    vpn === "No"
                      ? "bg-slate-100 dark:bg-slate-700 border-slate-400 text-slate-800 dark:text-slate-200"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span>Tidak</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVpn("Yes")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    vpn === "Yes"
                      ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Ya (VPN)</span>
                </button>
              </div>
            </div>
          </div>

          {/* URL Layanan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              URL / Tautan Layanan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://layanan.bps.go.id"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Deskripsi Singkat Layanan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsikan fungsi dan tujuan layanan ini secara ringkas..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9] resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-between gap-2.5 border-t border-slate-200 dark:border-slate-800">
            {isEditing && initialData && onDeleteCurrent ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteCurrent(initialData);
                  onClose();
                }}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Layanan</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEditing ? "Simpan Perubahan" : "Tambahkan ke Portal"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
