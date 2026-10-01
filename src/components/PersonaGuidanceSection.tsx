"use client";

import { GraduationCap, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export default function PersonaGuidanceSection() {
  const handleActionClick = (targetId: string) => {
    const el = document.getElementById(targetId) || document.getElementById("direktori-layanan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#F8FAFC] border-t border-slate-200 py-12 md:py-16" data-purpose="persona-guidance">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Label, Judul, dan Deskripsi Pengantar */}
        <div className="text-center max-w-3xl mx-auto mb-12" data-purpose="section-header">
          <span className="inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase mb-2">
            BANTUAN PENELUSURAN CEPAT
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Panduan: Menemukan Layanan yang Tepat
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
            Pilih profil kebutuhan Anda untuk langsung diarahkan ke kanal data statistik Solok Selatan yang paling relevan.
          </p>
        </div>

        {/* Grid Kartu Persona Kebutuhan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch" data-purpose="persona-card-grid">
          {/* Card 1 - Mahasiswa & Peneliti */}
          <article
            className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-6 lg:p-7"
            data-purpose="persona-card"
          >
            {/* Ikon Profil */}
            <div aria-hidden="true" className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            {/* Target Pengguna */}
            <div className="text-[11px] font-bold tracking-wider text-blue-600 uppercase mb-2">
              MAHASISWA • PENELITI
            </div>
            {/* Kutipan / Pernyataan Kebutuhan */}
            <h3 className="text-base font-semibold text-slate-900 mb-3 leading-snug">
              “Saya butuh data resmi untuk skripsi, jurnal, atau riset kebijakan.”
            </h3>
            {/* Deskripsi Panduan */}
            <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
              Akses koleksi data mikro BPS, tabel dinamis multi-tahun, dan konsultasikan kebutuhan variabel melalui layanan terpadu resmi.
            </p>
            {/* Informasi Tag Layanan */}
            <div className="space-y-2 mb-6" data-purpose="service-tags">
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <span className="font-medium text-slate-700">Silastik (PST Online)</span>
                <span className="text-slate-500 text-[11px]">Konsultasi Virtual</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <span className="font-medium text-slate-700">AllStats Portal</span>
                <span className="text-slate-500 text-[11px]">Unduh Excel &amp; Seri</span>
              </div>
            </div>
            {/* Tombol Aksi */}
            <a
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("direktori-layanan");
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
              href="#direktori-layanan"
            >
              <span>Buka Layanan Riset</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </article>

          {/* Card 2 - Pemerintah Daerah & Jurnalis */}
          <article
            className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-6 lg:p-7"
            data-purpose="persona-card"
          >
            {/* Ikon Profil */}
            <div aria-hidden="true" className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            {/* Target Pengguna */}
            <div className="text-[11px] font-bold tracking-wider text-amber-600 uppercase mb-2">
              PEMERINTAH DAERAH • JURNALIS
            </div>
            {/* Kutipan / Pernyataan Kebutuhan */}
            <h3 className="text-base font-semibold text-slate-900 mb-3 leading-snug">
              “Saya ingin mengecek angka inflasi atau pertumbuhan ekonomi daerah terkini.”
            </h3>
            {/* Deskripsi Panduan */}
            <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
              Gunakan dashboard analitik PDRB, rilis Berita Resmi Statistik (BRS) bulanan, serta tabel agregat inflasi dan IPH mingguan Solok Selatan.
            </p>
            {/* Informasi Tag Layanan */}
            <div className="space-y-2 mb-6" data-purpose="service-tags">
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <span className="font-medium text-slate-700">Dashboard Neraca PDRB</span>
                <span className="text-slate-500 text-[11px]">Visualisasi 17 Sektor</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <span className="font-medium text-slate-700">Rilis BRS BPS SolSel</span>
                <span className="text-slate-500 text-[11px]">Unduh Naskah PDF</span>
              </div>
            </div>
            {/* Tombol Aksi */}
            <a
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("direktori-layanan");
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
              href="#direktori-layanan"
            >
              <span>Buka Klaster Neraca</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </article>

          {/* Card 3 - Organisasi Perangkat Daerah (OPD) */}
          <article
            className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-6 lg:p-7"
            data-purpose="persona-card"
          >
            {/* Ikon Profil */}
            <div aria-hidden="true" className="w-11 h-11 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
            </div>
            {/* Target Pengguna */}
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase mb-2">
              ORGANISASI PERANGKAT DAERAH (OPD)
            </div>
            {/* Kutipan / Pernyataan Kebutuhan */}
            <h3 className="text-base font-semibold text-slate-900 mb-3 leading-snug">
              “Saya ingin mengajukan rekomendasi kegiatan statistik dinas (OPD).”
            </h3>
            {/* Deskripsi Panduan */}
            <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
              Sesuai amanat Satu Data Indonesia, setiap survei sektoral dinas wajib mendapatkan surat rekomendasi BPS melalui aplikasi Romantik Online.
            </p>
            {/* Informasi Tag Layanan */}
            <div className="space-y-2 mb-6" data-purpose="service-tags">
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <span className="font-medium text-slate-700">Romantik Online</span>
                <span className="text-slate-500 text-[11px]">Pengajuan Rekomendasi</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <span className="font-medium text-slate-700">Metadata Baku BPS</span>
                <span className="text-slate-500 text-[11px]">Standar Indikator SDI</span>
              </div>
            </div>
            {/* Tombol Aksi */}
            <a
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("direktori-layanan");
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
              href="#direktori-layanan"
            >
              <span>Buka Sistem Romantik</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
