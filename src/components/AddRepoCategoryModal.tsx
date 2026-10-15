"use client";

import { useState } from "react";
import { X, Plus, Info, Check } from "lucide-react";
import { AVAILABLE_REPO_ICONS, getRepoIcon } from "@/lib/repoIcons";
import { CustomRepoCategory } from "@/types/userRepo";

interface AddRepoCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: CustomRepoCategory) => void;
}

export default function AddRepoCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
}: AddRepoCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIconName, setSelectedIconName] = useState<string>("Folder");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("Semua");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    "Semua",
    "Dokumen & Arsip",
    "Data & Statistik",
    "Penyimpanan & Cloud",
    "Kantor & Kegiatan",
    "Media & Teknologi",
  ];

  const filteredIcons = AVAILABLE_REPO_ICONS.filter((item) => {
    if (activeCategoryFilter === "Semua") return true;
    return item.category === activeCategoryFilter;
  });

  const SelectedIcon = getRepoIcon(selectedIconName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Nama jenis repositori wajib diisi.");
      return;
    }

    const randomSuffix =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().slice(0, 8)
        : Date.now().toString(36);

    const newCategory: CustomRepoCategory = {
      id: `custom_${Date.now()}_${randomSuffix}`,
      name: trimmedName,
      iconName: selectedIconName,
      description: description.trim(),
      created_at: new Date().toISOString(),
    };

    onAddCategory(newCategory);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#005AA9]/10 dark:bg-sky-500/20 text-[#005AA9] dark:text-sky-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Tambah Jenis Repositori Baru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Buat kategori baru untuk mengorganisasi tautan & berkas kerja Anda
              </p>
            </div>
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
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 shrink-0">
            <Info className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Nama Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Jenis Repositori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Format Notulen, Regulasi BPS, Bahan Paparan..."
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Keterangan / Deskripsi Singkat <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Kumpulan draf dan format notulen rapat dinas bulanan"
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
            />
          </div>

          {/* Pilihan Icon */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih Icon Kategori
              </label>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-[11px] text-slate-400">Terpilih:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#005AA9] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-900">
                  <SelectedIcon className="w-3.5 h-3.5" />
                  <span>{AVAILABLE_REPO_ICONS.find((i) => i.id === selectedIconName)?.name || selectedIconName}</span>
                </span>
              </div>
            </div>

            {/* Filter Kategori Icon */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-2.5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                    activeCategoryFilter === cat
                      ? "bg-[#005AA9] text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid Icon */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
              {filteredIcons.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedIconName === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIconName(item.id)}
                    title={item.name}
                    className={`relative p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-white dark:bg-sky-950 border-[#005AA9] dark:border-sky-400 text-[#005AA9] dark:text-sky-300 shadow-sm ring-2 ring-[#005AA9]/30"
                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-105"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full text-center">
                      {item.name.split(" ")[0]}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#005AA9] dark:bg-sky-400 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Jenis Repositori</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
