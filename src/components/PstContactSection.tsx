"use client";

import { MapPin, MessageSquare, ShieldCheck, Mail, Phone, ExternalLink, CheckCircle } from "lucide-react";

export default function PstContactSection() {
  return (
    <section id="kontak-pst" aria-labelledby="section-pst-title" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full" data-purpose="pst-contact-section">
      {/* Tag Kategori Seksi */}
      <div className="mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          KONTAK &amp; KONSULTASI PST
        </span>
      </div>

      {/* Header & Subtitle Kontak */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" id="section-pst-title">
            Layanan Konsultasi Statistik &amp; Lokasi Kantor
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Butuh pendampingan data khusus, metadata statistik sektoral, atau konsultasi metodologi? Kunjungi Pelayanan Statistik Terpadu (PST) BPS Solok Selatan atau hubungi kami secara daring.
          </p>
        </div>

        {/* Badge Status Operasional PST */}
        <div className="flex-shrink-0 self-start lg:self-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Loket PST Buka Hari Ini
          </span>
        </div>
      </div>

      {/* Grid 3 Kartu Kontak & Pelayanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu 1: Kantor Fisik PST */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200" data-purpose="contact-card-office">
          <div>
            {/* Ikon Kantor */}
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Kantor PST Solok Selatan</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Gedung BPS Kabupaten Solok Selatan, Jl. Raya Padang Aro, Kawasan Golden Sunset, Solok Selatan, Sumatera Barat 27778.
            </p>

            {/* Jam Operasional */}
            <div className="space-y-1.5 py-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Senin - Kamis:</span>
                <span className="font-bold text-slate-900">08.00 - 15.30 WIB</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Jumat:</span>
                <span className="font-bold text-slate-900">08.00 - 16.00 WIB</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Sabtu - Minggu / Libur:</span>
                <span className="text-rose-600 font-medium">Tutup</span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Peta */}
          <a
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:bg-slate-100 transition-colors"
            href="https://maps.google.com/?q=BPS+Kabupaten+Solok+Selatan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="w-4 h-4 text-slate-500" />
            Petunjuk Arah Google Maps
          </a>
        </div>

        {/* Kartu 2: Saluran Chat & Daring */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200" data-purpose="contact-card-online">
          <div>
            {/* Ikon Layanan Daring */}
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Konsultasi Daring &amp; Chat</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Dapatkan bantuan langsung dari statistisi ahli untuk konfirmasi angka indikator, peminjaman publikasi digital, dan permohonan data mikro.
            </p>

            {/* Rincian Kontak Chat & Email */}
            <div className="space-y-3 py-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  WhatsApp HaloPST:
                </span>
                <span className="font-bold text-slate-900">+62 811-660-1311</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Email Resmi:
                </span>
                <span className="font-bold text-slate-900">bps1310@bps.go.id</span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi WhatsApp */}
          <a
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-xs"
            href="https://wa.me/628116601311"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="w-4 h-4" />
            Hubungi PST via WhatsApp
          </a>
        </div>

        {/* Kartu 3: Maklumat & Layanan Aduan Sektoral */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200" data-purpose="contact-card-integrity">
          <div>
            {/* Ikon Integritas */}
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Maklumat &amp; Rekomendasi Sektoral</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              BPS berkomitmen memberikan pelayanan prima tanpa pungutan biaya liar (Zona Integritas WBK/WBBM) dan pembinaan statistik sektoral bagi OPD.
            </p>

            {/* Daftar Poin Integritas */}
            <div className="space-y-2 py-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Bebas Pungutan Biaya (100%)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Kanal Pengaduan SP4N-LAPOR &amp; Whistleblowing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pembinaan Metadata Desa Cantik SolSel</span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Pengaduan */}
          <a
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#043277] text-white text-xs font-semibold hover:bg-slate-800 active:bg-black transition-colors shadow-xs"
            href="https://www.lapor.go.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Layanan SP4N LAPOR</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
