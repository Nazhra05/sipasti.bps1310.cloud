"use client";

import { useState, useEffect } from "react";
import { X, Plus, Info, Loader2 } from "lucide-react";
import { CustomRepoCategory } from "@/types/userRepo";
import {
  addWebsiteLink,
  addDataLink,
  addDriveLink,
  addMobileApp,
  addPhotoLink,
  addOtherLink,
} from "@/lib/userRepoApi";

interface AddRepoItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string; // "favorites" | "websites" | "data" | "drive" | "mobile" | "photos" | "others" | "custom_..."
  customCategories: CustomRepoCategory[];
  onSuccess: () => void;
  onShowToast: (message: string) => void;
}

export default function AddRepoItemModal({
  isOpen,
  onClose,
  activeCategory,
  customCategories,
  onSuccess,
  onShowToast,
}: AddRepoItemModalProps) {
  const [selectedTarget, setSelectedTarget] = useState<string>("websites");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [subtype, setSubtype] = useState("Dokumen");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial category based on activeCategory
  useEffect(() => {
    if (activeCategory === "favorites") {
      setSelectedTarget("websites");
    } else {
      setSelectedTarget(activeCategory);
    }
    setError(null);
  }, [activeCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    let trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) {
      setError("Nama item dan tautan (URL) wajib diisi.");
      return;
    }

    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      trimmedUrl = "https://" + trimmedUrl;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let ok = false;

      if (selectedTarget === "websites") {
        ok = (await addWebsiteLink(trimmedName, trimmedUrl, description.trim())).success;
      } else if (selectedTarget === "data") {
        ok = (await addDataLink(trimmedName, trimmedUrl, subtype || "Dokumen", description.trim())).success;
      } else if (selectedTarget === "drive") {
        ok = (await addDriveLink(trimmedName, trimmedUrl, subtype || "Google Drive", description.trim())).success;
      } else if (selectedTarget === "mobile") {
        ok = (await addMobileApp(trimmedName, trimmedUrl, subtype || "Android", description.trim())).success;
      } else if (selectedTarget === "photos") {
        ok = (await addPhotoLink(trimmedName, trimmedUrl, description.trim())).success;
      } else if (selectedTarget === "others") {
        ok = (await addOtherLink(trimmedName, trimmedUrl, "Referensi", description.trim())).success;
      } else {
        // Custom category
        const customCat = customCategories.find((c) => c.id === selectedTarget);
        const categoryLabel = customCat ? customCat.name : "Koleksi Khusus";
        ok = (await addOtherLink(trimmedName, trimmedUrl, categoryLabel, description.trim())).success;
      }

      if (ok) {
        onShowToast("Item koleksi berhasil disimpan!");
        setName("");
        setUrl("");
        setDescription("");
        onSuccess();
        onClose();
      } else {
        setError("Gagal menyimpan item ke repositori. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan sistem saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 cursor-default"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#005AA9]/10 dark:bg-sky-500/20 text-[#005AA9] dark:text-sky-300">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tambah Item Koleksi
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Kategori Repositori
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
            >
              <optgroup label="Kategori Standar">
                <option value="websites">Link Website</option>
                <option value="data">Data & Dokumen</option>
                <option value="drive">Link Drive</option>
                <option value="mobile">Aplikasi Mobile</option>
                <option value="photos">Galeri Foto</option>
                <option value="others">Referensi Lainnya</option>
              </optgroup>
              {customCategories.length > 0 && (
                <optgroup label="Jenis Repositori Khusus Anda">
                  {customCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Nama / Judul */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama / Judul Item <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Portal Satu Data, Laporan Bulanan, Folder Tim..."
              maxLength={100}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tautan / URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/... atau https://..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
            />
          </div>

          {/* Subtipe / Format (untuk data, drive, mobile) */}
          {selectedTarget === "data" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Format Berkas
              </label>
              <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
              >
                <option value="Spreadsheet">Spreadsheet / Excel</option>
                <option value="PDF">PDF Dokumen</option>
                <option value="Word">Word / Naskah</option>
                <option value="Presentation">Slide Presentasi</option>
                <option value="Infografis">Infografis / Visual</option>
                <option value="Lainnya">Format Lainnya</option>
              </select>
            </div>
          )}

          {selectedTarget === "drive" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Layanan Drive
              </label>
              <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
              >
                <option value="Google Drive">Google Drive</option>
                <option value="OneDrive">OneDrive / SharePoint</option>
                <option value="Dropbox">Dropbox</option>
                <option value="Nextcloud">Nextcloud / Storage Dinas</option>
                <option value="Lainnya">Penyimpanan Lainnya</option>
              </select>
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Deskripsi Singkat <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan tambahan mengenai item ini..."
              rows={2}
              maxLength={200}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Simpan ke Koleksi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
