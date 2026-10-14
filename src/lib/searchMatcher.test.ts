import { describe, it, expect } from "vitest";
import {
  searchAndRankServices,
  calculateRelevanceScore,
  tokenizeText,
  SYNONYM_DICTIONARY,
} from "./searchMatcher";
import { LayananItem } from "./api";

const mockServices: LayananItem[] = [
  {
    id_layanan: 1,
    id_kategori: 1,
    nama_layanan: "Pelayanan Statistik Terpadu (PST)",
    url: "https://pst.bps.go.id",
    deskripsi_layanan: "Konsultasi data dan rekomendasi kegiatan statistik",
    keyword: "konsultasi, data, rekomendasi, pst",
  },
  {
    id_layanan: 2,
    id_kategori: 2,
    nama_layanan: "Simpeg Kepegawaian BPS",
    url: "https://simpeg.bps.go.id",
    deskripsi_layanan: "Sistem informasi pengelolaan data pegawai dan administrasi SDM",
    keyword: "sdm, asn, pns",
  },
  {
    id_layanan: 3,
    id_kategori: 3,
    nama_layanan: "Nadin Tata Naskah Dinas",
    url: "https://nadin.bps.go.id",
    deskripsi_layanan: "Aplikasi pengelolaan persuratan kedinasan elektronik",
    keyword: "surat, persuratan, naskah",
  },
  {
    id_layanan: 4,
    id_kategori: 4,
    nama_layanan: "Wilkerstat Spasial BPS",
    url: "https://wilkerstat.bps.go.id",
    deskripsi_layanan: "Pengelolaan peta wilayah kerja statistik dan batas SLS",
    keyword: "peta, spasial, wilayah",
  },
  {
    id_layanan: 5,
    id_kategori: 5,
    nama_layanan: "Konsultasi Online Solsel",
    url: "https://solsel.bps.go.id/konsultasi",
    deskripsi_layanan: "Ruang konsultasi langsung dengan petugas pelayanan",
    keyword: "chat, tanya",
  },
];

describe("searchMatcher - Intelligent BPS Search Engine", () => {
  it("1. memprioritaskan kecocokan pada nama layanan di atas kecocokan pada deskripsi", () => {
    // Kueri 'konsultasi' ada di nama layanan ID 5 ('Konsultasi Online Solsel'),
    // dan ada di deskripsi layanan ID 1 ('Pelayanan Statistik Terpadu (PST)').
    const results = searchAndRankServices(mockServices, "konsultasi");

    expect(results.length).toBeGreaterThan(0);
    // Layanan yang namanya mengandung 'konsultasi' harus menempati posisi nomor 1
    expect(results[0].id_layanan).toBe(5);
    expect(results[0].nama_layanan).toBe("Konsultasi Online Solsel");

    // Layanan yang hanya menyebutkan 'konsultasi' di deskripsi tetap muncul di urutan berikutnya
    expect(results.map((r) => r.id_layanan)).toContain(1);
  });

  it("2. menemukan layanan melalui sinonim kata kunci (contoh: 'gaji' -> Simpeg)", () => {
    // Tidak ada kata 'gaji' di judul maupun deskripsi, tapi 'gaji' adalah sinonim kepegawaian/simpeg
    const results = searchAndRankServices(mockServices, "gaji");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nama_layanan).toBe("Simpeg Kepegawaian BPS");
  });

  it("3. menemukan layanan melalui sinonim persuratan (contoh: 'surat' -> Nadin)", () => {
    const results = searchAndRankServices(mockServices, "surat");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nama_layanan).toBe("Nadin Tata Naskah Dinas");
  });

  it("4. menemukan layanan melalui sinonim pemetaan (contoh: 'peta' -> Wilkerstat)", () => {
    const results = searchAndRankServices(mockServices, "peta");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nama_layanan).toBe("Wilkerstat Spasial BPS");
  });

  it("5. adaptif terhadap data baru di masa depan berdasarkan token penting", () => {
    const newService: LayananItem = {
      id_layanan: 99,
      id_kategori: 1,
      nama_layanan: "SI-KENCANA Kendaraan Dinas",
      url: "https://kencana.bps.go.id",
      deskripsi_layanan: "Peminjaman mobil operasional dan voucher bensin kantor",
      keyword: "mobil, bensin, inventaris",
    };

    const combinedList = [...mockServices, newService];

    // Cari dengan kata penting di deskripsi data baru
    const searchMobil = searchAndRankServices(combinedList, "mobil");
    expect(searchMobil[0].id_layanan).toBe(99);

    // Cari dengan nama data baru
    const searchKencana = searchAndRankServices(combinedList, "kencana");
    expect(searchKencana[0].id_layanan).toBe(99);
  });

  it("6. mengabaikan stop words umum bahasa Indonesia dan fokus pada kata kunci inti", () => {
    // 'aplikasi untuk mengurus gaji pegawai' -> harus fokus pada 'gaji' dan 'pegawai'
    const results = searchAndRankServices(mockServices, "aplikasi untuk melihat gaji pegawai");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nama_layanan).toBe("Simpeg Kepegawaian BPS");
  });

  it("7. mengembalikan daftar utuh jika query kosong", () => {
    const results = searchAndRankServices(mockServices, "");
    expect(results.length).toBe(mockServices.length);
  });
});
