"use client";

import { useState } from "react";
import {
  Star,
  Globe,
  FileSpreadsheet,
  Smartphone,
  HardDrive,
  Image as ImageIcon,
  Bookmark,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  FolderHeart,
  X,
  Loader2,
  Info,
} from "lucide-react";
import { UserRepositoryData } from "@/types/userRepo";
import {
  addWebsiteLink,
  deleteWebsiteLink,
  addDataLink,
  deleteDataLink,
  addDriveLink,
  deleteDriveLink,
  addMobileApp,
  deleteMobileApp,
  addPhotoLink,
  deletePhotoLink,
  addOtherLink,
  deleteOtherLink,
  toggleFavoriteService,
} from "@/lib/userRepoApi";

type RepoTab = "favorites" | "websites" | "data" | "mobile" | "drive" | "photos" | "others";

interface PersonalRepositoryProps {
  repoData: UserRepositoryData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onShowToast: (message: string) => void;
}

export default function PersonalRepository({
  repoData,
  isLoading,
  onRefresh,
  onShowToast,
}: PersonalRepositoryProps) {
  const [activeTab, setActiveTab] = useState<RepoTab>("favorites");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<RepoTab>("websites");
  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formSubtype, setFormSubtype] = useState("Spreadsheet");
  const [formDesc, setFormDesc] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    onShowToast("Tautan berhasil disalin ke papan klip!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemoveFavorite = async (id_layanan: number) => {
    const res = await toggleFavoriteService(id_layanan);
    if (res.success) {
      onShowToast("Layanan dihapus dari daftar favorit.");
      onRefresh();
    }
  };

  const handleDelete = async (category: RepoTab, id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tautan koleksi ini?")) {
      return;
    }

    let ok = false;
    if (category === "websites") ok = (await deleteWebsiteLink(id)).success;
    else if (category === "data") ok = (await deleteDataLink(id)).success;
    else if (category === "drive") ok = (await deleteDriveLink(id)).success;
    else if (category === "mobile") ok = (await deleteMobileApp(id)).success;
    else if (category === "photos") ok = (await deletePhotoLink(id)).success;
    else if (category === "others") ok = (await deleteOtherLink(id)).success;

    if (ok) {
      onShowToast("Koleksi pribadi berhasil dihapus.");
      onRefresh();
    } else {
      onShowToast("Gagal menghapus item.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) {
      setFormError("Nama/Judul dan URL wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    let ok = false;
    let url = formUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      if (formCategory === "websites") {
        ok = (await addWebsiteLink(formName.trim(), url, formDesc.trim())).success;
      } else if (formCategory === "data") {
        ok = (await addDataLink(formName.trim(), url, formSubtype, formDesc.trim())).success;
      } else if (formCategory === "drive") {
        ok = (await addDriveLink(formName.trim(), url, formSubtype, formDesc.trim())).success;
      } else if (formCategory === "mobile") {
        ok = (await addMobileApp(formName.trim(), url, formSubtype, formDesc.trim())).success;
      } else if (formCategory === "photos") {
        ok = (await addPhotoLink(formName.trim(), url, formDesc.trim())).success;
      } else if (formCategory === "others") {
        ok = (await addOtherLink(formName.trim(), url, formSubtype, formDesc.trim())).success;
      }

      if (ok) {
        onShowToast("Koleksi pribadi berhasil ditambahkan!");
        setIsModalOpen(false);
        setFormName("");
        setFormUrl("");
        setFormDesc("");
        onRefresh();
      } else {
        setFormError("Gagal menyimpan data ke repositori.");
      }
    } catch {
      setFormError("Terjadi kesalahan sistem saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const counts = repoData?.counts || {
    favorite: 0,
    website: 0,
    data: 0,
    mobile_app: 0,
    drive: 0,
    photo: 0,
    other: 0,
  };

  const tabs: { id: RepoTab; label: string; icon: any; count: number }[] = [
    { id: "favorites", label: "Layanan Favorit", icon: Star, count: counts.favorite },
    { id: "websites", label: "Link Website", icon: Globe, count: counts.website },
    { id: "data", label: "Data & Dokumen", icon: FileSpreadsheet, count: counts.data },
    { id: "mobile", label: "Aplikasi Mobile", icon: Smartphone, count: counts.mobile_app },
    { id: "drive", label: "Link Drive", icon: HardDrive, count: counts.drive },
    { id: "photos", label: "Galeri Foto", icon: ImageIcon, count: counts.photo },
    { id: "others", label: "Referensi", icon: Bookmark, count: counts.other },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#005AA9]/10 dark:bg-[#005AA9]/20 text-[#005AA9] dark:text-[#38a0f0] border border-[#005AA9]/25">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Repositori Pribadi Pegawai
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ruang kerja pribadi Anda: simpan bookmark, tautan drive dinas, aplikasi, dan dokumen harian.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormCategory(activeTab === "favorites" ? "websites" : activeTab);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Koleksi</span>
        </button>
      </div>

      {/* Tabs Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#005AA9] text-white border-[#005AA9] shadow-xs"
                  : "bg-white dark:bg-[#151f32] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3.5 animate-shimmer"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <div className="h-4.5 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="h-4 w-14 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 1. Layanan Favorit */}
          {activeTab === "favorites" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.favorites.length === 0 ? (
                <div className="col-span-full p-10 text-center rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3.5">
                    <Star className="w-8 h-8 fill-amber-400/30" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Belum Ada Layanan Favorit
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-2 leading-relaxed">
                    Beri tanda bintang (★) pada kartu aplikasi di Katalog Layanan BPS untuk menyematkannya di sini.
                  </p>
                </div>
              ) : (
                repoData?.favorites.map((fav) => (
                  <div
                    key={fav.id_favorite}
                    className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 hover:border-[#FFA500]/50 shadow-xs transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {fav.nama_kategori || "Layanan BPS"}
                        </span>
                        <button
                          onClick={() => handleRemoveFavorite(fav.id_layanan)}
                          title="Hapus dari favorit"
                          className="p-1 rounded-md text-amber-500 hover:bg-amber-500/15 transition cursor-pointer"
                        >
                          <Star className="w-4 h-4 fill-amber-400" />
                        </button>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {fav.nama_layanan}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {fav.deskripsi_layanan || "Layanan operasional BPS Solok Selatan."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        onClick={() => handleCopy(fav.url, `fav-${fav.id_favorite}`)}
                        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold cursor-pointer active:scale-95 transition-all duration-150"
                      >
                        {copiedId === `fav-${fav.id_favorite}` ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md animate-in zoom-in-75 duration-150">
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Tersalin!</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </span>
                        )}
                      </button>

                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
                      >
                        <span>Kunjungi</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. Link Website */}
          {activeTab === "websites" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.links.length === 0 ? (
                <EmptyState label="Link Website" onAdd={() => setIsModalOpen(true)} />
              ) : (
                repoData?.links.map((link) => (
                  <RepoCard
                    key={link.id_link}
                    id={link.id_link}
                    title={link.nama_website}
                    url={link.url_website}
                    desc={link.deskripsi}
                    badge="Website"
                    onDelete={() => handleDelete("websites", link.id_link)}
                    onCopy={() => handleCopy(link.url_website, `link-${link.id_link}`)}
                    isCopied={copiedId === `link-${link.id_link}`}
                  />
                ))
              )}
            </div>
          )}

          {/* 3. Data & Dokumen */}
          {activeTab === "data" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.data_links.length === 0 ? (
                <EmptyState label="Data & Dokumen" onAdd={() => setIsModalOpen(true)} />
              ) : (
                repoData?.data_links.map((item) => (
                  <RepoCard
                    key={item.id_data_link}
                    id={item.id_data_link}
                    title={item.nama_dokumen}
                    url={item.url_dokumen}
                    desc={item.deskripsi}
                    badge={item.jenis_dokumen || "Dokumen"}
                    onDelete={() => handleDelete("data", item.id_data_link)}
                    onCopy={() => handleCopy(item.url_dokumen, `data-${item.id_data_link}`)}
                    isCopied={copiedId === `data-${item.id_data_link}`}
                  />
                ))
              )}
            </div>
          )}

          {/* 4. Aplikasi Mobile */}
          {activeTab === "mobile" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.mobile_apps.length === 0 ? (
                <EmptyState label="Aplikasi Mobile" onAdd={() => setIsModalOpen(true)} />
              ) : (
                repoData?.mobile_apps.map((item) => (
                  <RepoCard
                    key={item.id_mobile}
                    id={item.id_mobile}
                    title={item.nama_aplikasi}
                    url={item.url_aplikasi}
                    desc={item.deskripsi}
                    badge={item.platform || "Mobile"}
                    onDelete={() => handleDelete("mobile", item.id_mobile)}
                    onCopy={() => handleCopy(item.url_aplikasi, `mobile-${item.id_mobile}`)}
                    isCopied={copiedId === `mobile-${item.id_mobile}`}
                  />
                ))
              )}
            </div>
          )}

          {/* 5. Link Drive */}
          {activeTab === "drive" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.drive_links.length === 0 ? (
                <EmptyState label="Link Drive" onAdd={() => setIsModalOpen(true)} />
              ) : (
                repoData?.drive_links.map((item) => (
                  <RepoCard
                    key={item.id_drive}
                    id={item.id_drive}
                    title={item.nama_drive}
                    url={item.url_drive}
                    desc={item.deskripsi}
                    badge={item.jenis_drive || "Drive"}
                    onDelete={() => handleDelete("drive", item.id_drive)}
                    onCopy={() => handleCopy(item.url_drive, `drive-${item.id_drive}`)}
                    isCopied={copiedId === `drive-${item.id_drive}`}
                  />
                ))
              )}
            </div>
          )}

          {/* 6. Galeri Foto */}
          {activeTab === "photos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.photo_links.length === 0 ? (
                <EmptyState label="Link Foto" onAdd={() => setIsModalOpen(true)} />
              ) : (
                repoData?.photo_links.map((item) => (
                  <RepoCard
                    key={item.id_photo}
                    id={item.id_photo}
                    title={item.judul_foto}
                    url={item.url_foto}
                    desc={item.deskripsi}
                    badge="Foto / Galeri"
                    onDelete={() => handleDelete("photos", item.id_photo)}
                    onCopy={() => handleCopy(item.url_foto, `photo-${item.id_photo}`)}
                    isCopied={copiedId === `photo-${item.id_photo}`}
                  />
                ))
              )}
            </div>
          )}

          {/* 7. Referensi Lainnya */}
          {activeTab === "others" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repoData?.other_links.length === 0 ? (
                <EmptyState label="Referensi & Catatan" onAdd={() => setIsModalOpen(true)} />
              ) : (
                repoData?.other_links.map((item) => (
                  <RepoCard
                    key={item.id_other}
                    id={item.id_other}
                    title={item.nama_link}
                    url={item.url_link}
                    desc={item.deskripsi}
                    badge={item.label_kategori || "Referensi"}
                    onDelete={() => handleDelete("others", item.id_other)}
                    onCopy={() => handleCopy(item.url_link, `other-${item.id_other}`)}
                    isCopied={copiedId === `other-${item.id_other}`}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Modal Tambah Koleksi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Tambah Koleksi Pribadi
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Koleksi
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as RepoTab)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
                >
                  <option value="websites">Link Website</option>
                  <option value="data">Data & Dokumen</option>
                  <option value="drive">Link Drive</option>
                  <option value="mobile">Aplikasi Mobile</option>
                  <option value="photos">Galeri Foto</option>
                  <option value="others">Referensi Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama / Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Spreadsheet Anggaran 2026"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL / Tautan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://drive.google.com/..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
                />
              </div>

              {/* Subtipe dinamis */}
              {formCategory === "data" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Dokumen
                  </label>
                  <select
                    value={formSubtype}
                    onChange={(e) => setFormSubtype(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Spreadsheet">Spreadsheet / Excel</option>
                    <option value="Dokumen">Dokumen Word / Docs</option>
                    <option value="Presentasi">Slide Presentasi</option>
                    <option value="PDF">Buku / File PDF</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              )}

              {formCategory === "drive" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Platform Drive
                  </label>
                  <select
                    value={formSubtype}
                    onChange={(e) => setFormSubtype(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Google Drive">Google Drive</option>
                    <option value="OneDrive">OneDrive</option>
                    <option value="Cloud Storage">Cloud Storage Lainnya</option>
                  </select>
                </div>
              )}

              {formCategory === "mobile" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Platform Aplikasi
                  </label>
                  <select
                    value={formSubtype}
                    onChange={(e) => setFormSubtype(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Android (APK)">Android (APK)</option>
                    <option value="Play Store">Play Store</option>
                    <option value="Web App / iOS">Web App / iOS</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan / Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan kecil mengenai kegunaan tautan ini..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Koleksi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="col-span-full p-10 text-center rounded-3xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 text-[#005AA9] dark:text-[#38a0f0] flex items-center justify-center mb-3.5">
        <FolderHeart className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
        Belum Ada Koleksi {label}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">
        Tambahkan tautan {label.toLowerCase()} dinas atau referensi pribadi Anda agar tersimpan rapi dan mudah diakses kembali.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] active:scale-95 shadow-xs transition cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah {label} Baru</span>
      </button>
    </div>
  );
}

function RepoCard({
  id,
  title,
  url,
  desc,
  badge,
  onDelete,
  onCopy,
  isCopied,
}: {
  id: number;
  title: string;
  url: string;
  desc?: string;
  badge: string;
  onDelete: () => void;
  onCopy: () => void;
  isCopied: boolean;
}) {
  return (
    <div className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#005AA9]/40 dark:hover:border-[#00A6B4]/50 transition">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md">
            {badge}
          </span>
          <button
            onClick={onDelete}
            title="Hapus koleksi"
            className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
          {desc || "Tautan koleksi pribadi pegawai."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold cursor-pointer active:scale-95 transition-all duration-150"
        >
          {isCopied ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md animate-in zoom-in-75 duration-150">
              <Check className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Tersalin!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" />
              <span>Salin</span>
            </span>
          )}
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
        >
          <span>Buka Tautan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
