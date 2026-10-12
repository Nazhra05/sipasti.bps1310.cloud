import {
  BookOpen,
  Bookmark,
  FileText,
  FileSpreadsheet,
  Folder,
  FolderArchive,
  FolderKanban,
  Database,
  BarChart3,
  PieChart,
  TrendingUp,
  Scroll,
  FileCheck,
  Globe,
  Cloud,
  HardDrive,
  Share2,
  Briefcase,
  Layers,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  Video,
  Calendar,
  GraduationCap,
  Code,
  Cpu,
  Tag,
  Star,
  Smartphone,
  LucideIcon,
} from "lucide-react";

export interface RepoIconOption {
  id: string;
  name: string;
  category: "Dokumen & Arsip" | "Data & Statistik" | "Penyimpanan & Cloud" | "Kantor & Kegiatan" | "Media & Teknologi";
  icon: LucideIcon;
}

export const AVAILABLE_REPO_ICONS: RepoIconOption[] = [
  // Dokumen & Arsip
  { id: "BookOpen", name: "Buku & Panduan", category: "Dokumen & Arsip", icon: BookOpen },
  { id: "Bookmark", name: "Bookmark & Referensi", category: "Dokumen & Arsip", icon: Bookmark },
  { id: "FileText", name: "Dokumen & Naskah", category: "Dokumen & Arsip", icon: FileText },
  { id: "FileSpreadsheet", name: "Tabel & Spreadsheet", category: "Dokumen & Arsip", icon: FileSpreadsheet },
  { id: "Folder", name: "Folder Umum", category: "Dokumen & Arsip", icon: Folder },
  { id: "FolderArchive", name: "Arsip & Riwayat", category: "Dokumen & Arsip", icon: FolderArchive },
  { id: "FolderKanban", name: "Kegiatan & Alur Kerja", category: "Dokumen & Arsip", icon: FolderKanban },
  { id: "Scroll", name: "Surat & Kebijakan", category: "Dokumen & Arsip", icon: Scroll },
  { id: "FileCheck", name: "Persetujuan & Disposisi", category: "Dokumen & Arsip", icon: FileCheck },

  // Data & Statistik
  { id: "BarChart3", name: "Statistik & Grafik", category: "Data & Statistik", icon: BarChart3 },
  { id: "PieChart", name: "Proporsi & Distribusi", category: "Data & Statistik", icon: PieChart },
  { id: "TrendingUp", name: "Indikator Kinerja", category: "Data & Statistik", icon: TrendingUp },
  { id: "Database", name: "Master Data & Database", category: "Data & Statistik", icon: Database },

  // Penyimpanan & Cloud
  { id: "Globe", name: "Website & Portal", category: "Penyimpanan & Cloud", icon: Globe },
  { id: "Cloud", name: "Cloud Storage", category: "Penyimpanan & Cloud", icon: Cloud },
  { id: "HardDrive", name: "Drive & Media", category: "Penyimpanan & Cloud", icon: HardDrive },
  { id: "Share2", name: "Tautan Bersama", category: "Penyimpanan & Cloud", icon: Share2 },

  // Kantor & Kegiatan
  { id: "Briefcase", name: "Tata Usaha & Kantor", category: "Kantor & Kegiatan", icon: Briefcase },
  { id: "Layers", name: "Kategori Campuran", category: "Kantor & Kegiatan", icon: Layers },
  { id: "ShieldCheck", name: "Keamanan & Rahasia", category: "Kantor & Kegiatan", icon: ShieldCheck },
  { id: "Sparkles", name: "Koleksi Prioritas", category: "Kantor & Kegiatan", icon: Sparkles },
  { id: "Calendar", name: "Jadwal & Agenda", category: "Kantor & Kegiatan", icon: Calendar },
  { id: "GraduationCap", name: "Pelatihan & Riset", category: "Kantor & Kegiatan", icon: GraduationCap },

  // Media & Teknologi
  { id: "Image", name: "Foto & Galeri", category: "Media & Teknologi", icon: ImageIcon },
  { id: "Video", name: "Video Dokumentasi", category: "Media & Teknologi", icon: Video },
  { id: "Code", name: "Skrip & Formula", category: "Media & Teknologi", icon: Code },
  { id: "Cpu", name: "Teknologi Informasi", category: "Media & Teknologi", icon: Cpu },
  { id: "Tag", name: "Label & Taksonomi", category: "Media & Teknologi", icon: Tag },
];

export const ICON_MAP: Record<string, LucideIcon> = {
  Star,
  Globe,
  FileSpreadsheet,
  HardDrive,
  Smartphone,
  Image: ImageIcon,
  Bookmark,
  BookOpen,
  FileText,
  Folder,
  FolderArchive,
  FolderKanban,
  Scroll,
  FileCheck,
  BarChart3,
  PieChart,
  TrendingUp,
  Database,
  Cloud,
  Share2,
  Briefcase,
  Layers,
  ShieldCheck,
  Sparkles,
  Calendar,
  GraduationCap,
  Code,
  Cpu,
  Tag,
};

export function getRepoIcon(iconName?: string): LucideIcon {
  if (!iconName) return Folder;
  return ICON_MAP[iconName] || Folder;
}
