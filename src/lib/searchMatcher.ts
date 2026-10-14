/**
 * searchMatcher.ts
 * Mesin pencarian cerdas in-memory untuk direktori layanan BPS Solok Selatan (RANCAK).
 *
 * Fitur:
 * 1. Prioritas Utama pada Nama/Judul Layanan: kecocokan pada nama berbobot tertinggi.
 * 2. Pencarian Menyeluruh Deskripsi & Kata Kunci: tetap mencakup deskripsi, keyword, dan kategori.
 * 3. Kamus Sinonim & Istilah Kedinasan BPS: mendukung sinonim konsep (misal: "gaji" -> SIMPEG, "surat" -> NADIN, "peta" -> Wilkerstat).
 * 4. Adaptif untuk Data Baru: mengekstrak dan membedah token penting secara dinamis,
 *    sehingga penambahan data baru di masa mendatang langsung terindeks dan terbobot optimal.
 */

import { LayananItem } from "./api";

// ─────────────────────────────────────────────────────────────────────────────
// KAMUS SINONIM & ISTILAH KEDINASAN BPS
// ─────────────────────────────────────────────────────────────────────────────

export const SYNONYM_DICTIONARY: Record<string, string[]> = {
  // Kepegawaian, SDM & Kesejahteraan
  gaji: ["simpeg", "penghasilan", "tukin", "remunerasi", "kepegawaian"],
  slip: ["gaji", "simpeg", "penghasilan"],
  tukin: ["tunjangan", "kinerja", "simpeg", "remunerasi"],
  tunjangan: ["tukin", "gaji", "simpeg", "remunerasi"],
  presensi: ["absen", "kehadiran", "simpeg", "fingerprint"],
  absen: ["presensi", "kehadiran", "simpeg"],
  cuti: ["simpeg", "kepegawaian", "izin"],
  skp: ["kinerja", "e-kinerja", "evaluasi", "simpeg", "capaian"],
  kinerja: ["skp", "e-kinerja", "evaluasi", "simpeg", "capaian"],
  pegawai: ["kepegawaian", "sdm", "aparatur", "asn", "pns", "pppk", "simpeg"],
  asn: ["pegawai", "pns", "kepegawaian", "simpeg"],
  pns: ["pegawai", "asn", "kepegawaian", "simpeg"],
  diklat: ["pelatihan", "pembelajaran", "training", "edukasi", "sdm"],
  pelatihan: ["diklat", "training", "pembelajaran", "sdm"],

  // Tata Usaha, Persuratan & Administrasi
  surat: ["nadin", "tata naskah", "persuratan", "srikandi", "memo", "undangan", "disposisi"],
  naskah: ["nadin", "surat", "tata naskah dinas"],
  persuratan: ["nadin", "surat", "tata naskah"],
  disposisi: ["surat", "nadin", "arahan"],
  arsip: ["dokumen", "srikandi", "surat", "berkas"],
  spd: ["sppd", "perjalanan dinas", "transport"],
  sppd: ["spd", "perjalanan dinas", "administrasi"],
  perjalanan: ["spd", "sppd", "dinas"],
  anggaran: ["keuangan", "dipa", "revisi", "sakti", "span"],
  keuangan: ["anggaran", "dipa", "pembayaran", "bendahara", "sakti"],
  sakti: ["keuangan", "anggaran", "dipa"],

  // Pelayanan Data, Statistik & Publikasi
  data: ["statistik", "indikator", "tabel", "angka", "pst", "portal"],
  statistik: ["data", "indikator", "angka", "publikasi", "sensus", "survei", "pst"],
  publikasi: ["buku", "laporan", "rilis", "brs", "dokumen", "pst", "portal"],
  buku: ["publikasi", "laporan", "katalog", "pustaka"],
  rilis: ["brs", "berita resmi", "publikasi"],
  brs: ["berita resmi statistik", "rilis", "publikasi"],
  konsultasi: ["pst", "pelayanan", "rekomendasi", "layanan statistik", "tanya"],
  pelayanan: ["pst", "layanan", "konsultasi", "pengaduan", "rekomendasi"],
  unduh: ["download", "data", "tabel", "publikasi", "pst"],
  download: ["unduh", "data", "tabel", "publikasi", "pst"],
  tabel: ["data", "statistik", "indikator", "angka"],
  metadata: ["sirusa", "romantik", "standardisasi"],
  rekomendasi: ["romantik", "kegiatan statistik", "survei"],
  romantik: ["rekomendasi", "kegiatan statistik", "survei"],

  // Sensus & Survei Lapangan
  sensus: ["cacah", "penduduk", "pertanian", "ekonomi", "survei", "listing"],
  survei: ["sensus", "pencacahan", "kuesioner", "sampel", "lapangan", "fasih"],
  cacah: ["sensus", "survei", "pencacah", "lapangan"],
  kuesioner: ["fasih", "capi", "papi", "survei", "entri"],
  mitra: ["petugas", "pencacah", "sobat", "lapangan", "rekrutmen"],
  petugas: ["mitra", "pencacah", "lapangan", "sobat"],
  sobat: ["mitra", "petugas", "rekrutmen", "seleksi"],

  // Peta, Spasial & Wilayah
  peta: ["wilkerstat", "spasial", "geospasial", "gis", "wilayah", "sls", "desa"],
  spasial: ["peta", "wilkerstat", "gis", "geografis"],
  geospasial: ["wilkerstat", "peta", "spasial"],
  wilkerstat: ["peta", "spasial", "sls", "wilayah"],
  wilayah: ["sls", "desa", "kecamatan", "kabupaten", "wilkerstat", "kode wilayah"],
  sls: ["satuan lingkungan setempat", "rt", "rw", "jorong", "dusun", "wilkerstat"],

  // Indikator Spesifik
  inflasi: ["ihk", "harga", "pasar", "ekonomi", "brs", "data"],
  kemiskinan: ["garis kemiskinan", "sosial", "data", "podes"],
  pengangguran: ["ketenagakerjaan", "sakernas", "tenaga kerja", "tpt"],
  pdrb: ["pertumbuhan ekonomi", "neraca", "pdb", "pendapatan regional"],
  ekonomi: ["pdrb", "pertumbuhan", "neraca", "inflasi"],
  ipm: ["indeks pembangunan manusia", "kesehatan", "pendidikan", "sosial"],

  // Jaringan, TI & Komunikasi
  email: ["mail", "surat elektronik", "inbox", "webmail"],
  webmail: ["email", "surat elektronik", "bps mail"],
  rapat: ["zoom", "meeting", "video conference", "vicon"],
  zoom: ["rapat", "vicon", "meeting"],
  vicon: ["video conference", "zoom", "rapat"],
  vpn: ["forticlient", "intranet", "jaringan internal", "remote"],
  forticlient: ["vpn", "jaringan internal", "intranet"],
  jaringan: ["vpn", "lan", "wifi", "internet"],
};

// Stopwords umum bahasa Indonesia yang memiliki bobot rendah
const STOP_WORDS = new Set([
  "dan",
  "atau",
  "yang",
  "di",
  "ke",
  "dari",
  "untuk",
  "pada",
  "dengan",
  "adalah",
  "ini",
  "itu",
  "sebagai",
  "tentang",
  "bisa",
  "agar",
  "supaya",
  "dalam",
  "serta",
  "bagi",
  "oleh",
  "secara",
  "suatu",
  "sebuah",
  "aplikasi",
  "sistem",
  "layanan",
  "portal",
  "web",
]);

// ─────────────────────────────────────────────────────────────────────────────
// HELPER TOKENISASI & EKSPANSI SINONIM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Memecah string menjadi token kata-kata bersih (huruf & angka).
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);
}

/**
 * Mengambil kata-kata penting (mengabaikan stop words jika ada kata penting lain).
 */
export function extractSignificantTokens(tokens: string[]): string[] {
  const significant = tokens.filter((t) => !STOP_WORDS.has(t));
  return significant.length > 0 ? significant : tokens;
}

/**
 * Mengembangkan query pencarian dengan sinonim terkait.
 */
export function getSynonymsForTokens(tokens: string[]): string[] {
  const synonyms = new Set<string>();

  for (const token of tokens) {
    const directSyns = SYNONYM_DICTIONARY[token];
    if (directSyns) {
      directSyns.forEach((s) => synonyms.add(s.toLowerCase()));
    }

    // Periksa apakah token cocok dengan key sinonim
    for (const [key, synList] of Object.entries(SYNONYM_DICTIONARY)) {
      if (key !== token && (key.startsWith(token) || token.startsWith(key))) {
        synList.forEach((s) => synonyms.add(s.toLowerCase()));
      }
    }
  }

  return Array.from(synonyms);
}

// ─────────────────────────────────────────────────────────────────────────────
// SISTEM SKORING PENCARIAN (RELEVANCE RANKING ENGINE)
// ─────────────────────────────────────────────────────────────────────────────

export interface ScoredService<T = LayananItem> {
  item: T;
  score: number;
}

/**
 * Menghitung skor relevansi layanan terhadap kata kunci pencarian.
 * Memberi bobot sangat tinggi pada nama layanan, namun tetap mencakup deskripsi,
 * keyword, kategori, dan sinonim kata kunci.
 */
export function calculateRelevanceScore(
  item: LayananItem,
  rawQuery: string
): number {
  const qClean = rawQuery.trim().toLowerCase();
  if (!qClean) return 0;

  const rawTokens = tokenizeText(qClean);
  if (rawTokens.length === 0) return 0;

  const significantTokens = extractSignificantTokens(rawTokens);
  const synonyms = getSynonymsForTokens(significantTokens);

  const name = (item.nama_layanan || "").toLowerCase();
  const desc = (item.deskripsi_layanan || "").toLowerCase();
  const kw = (item.keyword || "").toLowerCase();
  const cat = (item.nama_kategori || (item as any).category_name || "").toLowerCase();
  const note = ((item as any).technical_note || item.catatan || "").toLowerCase();

  const nameTokens = tokenizeText(name);
  const descTokens = tokenizeText(desc);
  const kwTokens = tokenizeText(kw);

  let score = 0;

  // ─────────────────────────────────────────────────────────────────────────
  // 1. KECOCOKAN LANGSUNG PADA NAMA LAYANAN (BOBOT UTAMA / TIER TERTINGGI)
  // Menjamin jika ada kecocokan di nama, layanan tersebut SELALU berada di atas
  // layanan yang hanya cocok di deskripsi.
  // ─────────────────────────────────────────────────────────────────────────
  if (name === qClean) {
    score += 4000; // Persis sama nama layanan
  } else if (name.startsWith(qClean)) {
    score += 2800; // Diawali query
  } else if (name.includes(qClean)) {
    score += 1800; // Mengandung query utuh
  } else {
    // Cek kecocokan token penting di nama layanan
    let matchedNameTokens = 0;
    for (const token of significantTokens) {
      if (nameTokens.includes(token)) {
        score += 600;
        matchedNameTokens++;
      } else if (name.includes(token)) {
        score += 350;
        matchedNameTokens++;
      }
    }
    if (matchedNameTokens > 0) {
      score += 500; // Bonus tier kecocokan nama
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. KECOCOKAN KATA KUNCI (KEYWORDS)
  // ─────────────────────────────────────────────────────────────────────────
  if (kw.includes(qClean)) {
    score += 250;
  }
  for (const token of significantTokens) {
    if (kwTokens.includes(token)) {
      score += 120;
    } else if (kw.includes(token)) {
      score += 70;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. KECOCOKAN DESKRIPSI LAYANAN
  // Tetap terindeks dan dapat dicari secara menyeluruh, namun bobot berada di
  // bawah nama layanan.
  // ─────────────────────────────────────────────────────────────────────────
  if (desc.includes(qClean)) {
    score += 90;
  }
  for (const token of significantTokens) {
    if (descTokens.includes(token)) {
      score += 45;
    } else if (desc.includes(token)) {
      score += 25;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. KECOCOKAN KATEGORI & CATATAN TEKNIS
  // ─────────────────────────────────────────────────────────────────────────
  if (cat.includes(qClean)) {
    score += 60;
  }
  if (note.includes(qClean)) {
    score += 30;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. KECOCOKAN VIA KAMUS SINONIM (SEMANTIC MATCHING)
  // ─────────────────────────────────────────────────────────────────────────
  let synonymHit = false;
  for (const syn of synonyms) {
    if (nameTokens.includes(syn)) {
      score += 850; // Sinonim pas pada token nama (misal "gaji" -> "simpeg")
      synonymHit = true;
    } else if (name.includes(syn)) {
      score += 450;
      synonymHit = true;
    }

    if (kwTokens.includes(syn)) {
      score += 120;
      synonymHit = true;
    }

    if (desc.includes(syn)) {
      score += 50;
      synonymHit = true;
    }
  }

  if (synonymHit) {
    score += 100; // Bonus penemu sinonim
  }

  return score;
}

/**
 * Mencari dan mengurutkan daftar layanan berdasarkan skor relevansi tertinggi.
 */
export function searchAndRankServices<T extends LayananItem>(
  items: T[],
  query: string
): T[] {
  if (!items || items.length === 0) return [];
  const qTrim = (query || "").trim();
  if (!qTrim) return items;

  const scored: ScoredService<T>[] = [];

  for (const item of items) {
    const score = calculateRelevanceScore(item, qTrim);
    if (score > 0) {
      scored.push({ item, score });
    }
  }

  // Urutkan berdasarkan skor tertinggi (descending)
  // Jika skor sama, urutkan alfabetis nama layanan
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (a.item.nama_layanan || "").localeCompare(b.item.nama_layanan || "");
  });

  return scored.map((s) => s.item);
}
