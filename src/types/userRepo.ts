/**
 * Tipe data untuk Repositori Pribadi Pegawai (User Repository)
 * Terdiri dari 7 kategori: Layanan Favorit, Website/Tautan, Data & Dokumen,
 * Aplikasi Mobile, Link Drive, Galeri Foto, dan Referensi Lainnya.
 */

export interface UserFavoriteItem {
  id_favorite: number;
  id_layanan: number;
  nama_layanan: string;
  deskripsi_layanan?: string;
  url: string;
  logo?: string;
  akses?: string;
  vpn?: string | number | boolean;
  nama_kategori?: string;
  favorited_at?: string;
}

export interface UserWebsiteLink {
  id_link: number;
  id_user?: number;
  nama_website: string;
  url_website: string;
  deskripsi?: string;
  created_at?: string;
}

export interface UserDataLink {
  id_data_link: number;
  id_user?: number;
  nama_dokumen: string;
  url_dokumen: string;
  jenis_dokumen: string;
  deskripsi?: string;
  created_at?: string;
}

export interface UserMobileApp {
  id_mobile: number;
  id_user?: number;
  nama_aplikasi: string;
  url_aplikasi: string;
  platform: string;
  deskripsi?: string;
  created_at?: string;
}

export interface UserDriveLink {
  id_drive: number;
  id_user?: number;
  nama_drive: string;
  url_drive: string;
  jenis_drive: string;
  deskripsi?: string;
  created_at?: string;
}

export interface UserPhotoLink {
  id_photo: number;
  id_user?: number;
  judul_foto: string;
  url_foto: string;
  deskripsi?: string;
  created_at?: string;
}

export interface UserOtherLink {
  id_other: number;
  id_user?: number;
  nama_link: string;
  url_link: string;
  label_kategori?: string;
  deskripsi?: string;
  created_at?: string;
}

export interface UserRepoCounts {
  favorite: number;
  website: number;
  data: number;
  mobile_app: number;
  drive: number;
  photo: number;
  other: number;
}

export interface UserRepositoryData {
  counts: UserRepoCounts;
  favorites: UserFavoriteItem[];
  favorite_ids: number[];
  links: UserWebsiteLink[];
  data_links: UserDataLink[];
  mobile_apps: UserMobileApp[];
  drive_links: UserDriveLink[];
  photo_links: UserPhotoLink[];
  other_links: UserOtherLink[];
}
