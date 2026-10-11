import { UserRepositoryData } from "@/types/userRepo";

/**
 * Mengambil seluruh data repositori pribadi user yang sedang login.
 */
export async function fetchUserRepository(): Promise<{
  success: boolean;
  data?: UserRepositoryData;
  message?: string;
}> {
  try {
    const res = await fetch("/api/user-repo?action=get_all", {
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || "Gagal memuat repositori pribadi.",
      };
    }

    const json = await res.json();
    return {
      success: json.success ?? true,
      data: json.data,
      message: json.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan jaringan saat mengambil repositori.",
    };
  }
}

/**
 * Toggle status favorit layanan portal BPS.
 */
export async function toggleFavoriteService(id_layanan: number): Promise<{
  success: boolean;
  is_favorite?: boolean;
  message?: string;
}> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_favorite",
        id_layanan,
      }),
    });

    const json = await res.json().catch(() => ({}));
    return {
      success: json.success ?? false,
      is_favorite: json.is_favorite,
      message: json.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memperbarui status favorit.",
    };
  }
}

/**
 * Menambahkan link website baru.
 */
export async function addWebsiteLink(
  nama_website: string,
  url_website: string,
  deskripsi: string = ""
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_link",
        nama_website,
        url_website,
        deskripsi,
      }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menyimpan link website." };
  }
}

/**
 * Menghapus link website.
 */
export async function deleteWebsiteLink(id_link: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_link", id_link }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menghapus link." };
  }
}

/**
 * Menambahkan data link / dokumen.
 */
export async function addDataLink(
  nama_dokumen: string,
  url_dokumen: string,
  jenis_dokumen: string = "Spreadsheet",
  deskripsi: string = ""
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_data_link",
        nama_dokumen,
        url_dokumen,
        jenis_dokumen,
        deskripsi,
      }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menyimpan data link." };
  }
}

/**
 * Menghapus data link / dokumen.
 */
export async function deleteDataLink(id_data_link: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_data_link", id_data_link }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menghapus link data." };
  }
}

/**
 * Menambahkan link drive.
 */
export async function addDriveLink(
  nama_drive: string,
  url_drive: string,
  jenis_drive: string = "Google Drive",
  deskripsi: string = ""
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_drive_link",
        nama_drive,
        url_drive,
        jenis_drive,
        deskripsi,
      }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menyimpan link drive." };
  }
}

/**
 * Menghapus link drive.
 */
export async function deleteDriveLink(id_drive: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_drive_link", id_drive }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menghapus link drive." };
  }
}

/**
 * Menambahkan aplikasi mobile.
 */
export async function addMobileApp(
  nama_aplikasi: string,
  url_aplikasi: string,
  platform: string = "Android (APK)",
  deskripsi: string = ""
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_mobile_app",
        nama_aplikasi,
        url_aplikasi,
        platform,
        deskripsi,
      }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menyimpan aplikasi mobile." };
  }
}

/**
 * Menghapus aplikasi mobile.
 */
export async function deleteMobileApp(id_mobile: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_mobile_app", id_mobile }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menghapus aplikasi mobile." };
  }
}

/**
 * Menambahkan link foto dokumentasi.
 */
export async function addPhotoLink(
  judul_foto: string,
  url_foto: string,
  deskripsi: string = ""
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_photo_link",
        judul_foto,
        url_foto,
        deskripsi,
      }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menyimpan link foto." };
  }
}

/**
 * Menghapus link foto.
 */
export async function deletePhotoLink(id_photo: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_photo_link", id_photo }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menghapus link foto." };
  }
}

/**
 * Menambahkan link lainnya / referensi.
 */
export async function addOtherLink(
  nama_link: string,
  url_link: string,
  label_kategori: string = "Referensi",
  deskripsi: string = ""
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_other_link",
        nama_link,
        url_link,
        label_kategori,
        deskripsi,
      }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menyimpan referensi." };
  }
}

/**
 * Menghapus link lainnya.
 */
export async function deleteOtherLink(id_other: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/user-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_other_link", id_other }),
    });
    return await res.json().catch(() => ({ success: false }));
  } catch {
    return { success: false, message: "Gagal menghapus referensi." };
  }
}
