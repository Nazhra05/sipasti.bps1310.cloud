import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";
import { heroLogo } from "@/data";

export default function Footer() {
  return (
    <footer id="footer" className="bg-white border-t border-slate-200 mt-8 pt-12 pb-8 text-slate-600 text-xs" data-purpose="institutional-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Footer 4 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Kolom 1: Profil Portal SIPASTI */}
          <div className="space-y-3" data-purpose="footer-branding">
            <div className="flex items-center gap-2.5">
              <Image
                src={heroLogo}
                alt="SIPASTI Logo"
                width={160}
                height={50}
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight">SIPASTI</span>
                <span className="block text-[10px] text-slate-400 -mt-1 font-medium tracking-wide">PORTAL STATISTIK TERINTEGRASI</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Sistem Informasi Pelayanan Statistik Terintegrasi resmi BPS Kabupaten Solok Selatan. Menyajikan data terstandar, mutakhir, dan terbuka untuk publik dan perencana pembangunan.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Standar SDI (Satu Data Indonesia)
              </span>
            </div>
          </div>

          {/* Kolom 2: Detail PST BPS Solok Selatan */}
          <div className="space-y-2.5" data-purpose="footer-pst-details">
            <h4 className="font-bold text-slate-900 text-sm">Pelayanan Statistik Terpadu (PST)</h4>
            <ul className="space-y-2.5 text-slate-600 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>Jl. Raya Padang Aro, Golden Sunset, Kabupaten Solok Selatan, Sumatera Barat 27778</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Senin - Jumat: 08.00 - 15.30 WIB</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Hotline: +62 811-660-1311</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a className="hover:text-blue-600 transition-colors" href="mailto:bps1311@bps.go.id">
                  bps1310@bps.go.id
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Navigasi Cepat Portal */}
          <div className="space-y-2.5" data-purpose="footer-quick-links">
            <h4 className="font-bold text-slate-900 text-sm">Navigasi Cepat Portal</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a className="hover:text-blue-600 transition-colors" href="#hero">Katalog Indikator Makro</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#websites">Statistik Distribusi &amp; Harga</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#websites">Pertanian, Kebun &amp; Industri</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#direktori-layanan">Kependudukan &amp; Kesejahteraan</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#direktori-layanan">Rekomendasi Statistik &amp; Metadata</a></li>
            </ul>
          </div>

          {/* Kolom 4: Tautan Eksternal Resmi BPS */}
          <div className="space-y-2.5" data-purpose="footer-external-links">
            <h4 className="font-bold text-slate-900 text-sm">Tautan Resmi BPS</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors" href="https://ppid.bps.go.id/?mfd=1310" rel="noopener noreferrer" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  PPID BPS Solok Selatan
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors" href="https://solokselatankab.bps.go.id/id" rel="noopener noreferrer" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Website BPS Solok Selatan
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors" href="https://www.bps.go.id" rel="noopener noreferrer" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Badan Pusat Statistik RI
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors" href="https://allstats.bps.go.id" rel="noopener noreferrer" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  AllStats BPS
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Hak Cipta & Kebijakan */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a className="hover:text-slate-800 transition-colors" href="#">Pemberitahuan Data &amp; Hak Akses</a>
            <a className="hover:text-slate-800 transition-colors" href="#">Ketentuan Layanan</a>
            <a className="hover:text-slate-800 transition-colors" href="#">Metadata Baku</a>
          </div>
        </div>
      </div>
    </footer>
  );
}