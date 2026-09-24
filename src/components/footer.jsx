import Image from "next/image";
import Link from "next/link";
import { navbarLogo } from "@/data";

/**
 * Footer component — replicates the footer of
 * https://solokselatankab.bps.go.id/id (BPS Kabupaten Solok Selatan)
 *
 * Usage:
 *   import Footer from "@/components/Footer";
 *   ...
 *   <Footer />
 */
export default function Footer() {
  const tentangKami = [
    { label: "Profil BPS", href: "https://ppid.bps.go.id/app/konten/1310/Profil-BPS.html" },
    { label: "PPID", href: "https://ppid.bps.go.id/?mfd=1310" },
    { label: "Kebijakan Diseminasi", href: "https://ppid.bps.go.id/app/konten/0000/Layanan-BPS.html?_gl=1*1h15u8m*_ga*NTQyOTkyMjE4LjE3ODkxOTc5NjY.*_ga_XXTTVXWHDB*czE3OTAyMjI0MzEkbzExJGcxJHQxNzkwMjIzMDc0JGo0MCRsMCRoMA..#pills-3" },
  ];

  const tautanLainnya = [
    { label: "ASEAN Stats", href: "https://www.aseanstats.org/" },
    { label: "Reformasi Birokrasi", href: "https://rb.bps.go.id/" },
    { label: "Layanan Pengadaan Secara Elektronik", href: "https://lpse.bps.go.id/" },
    { label: "Politeknik Statistika STIS", href: "https://www.stis.ac.id/" },
    { label: "Pusdiklat BPS", href: "https://pusdiklat.bps.go.id/" },
    { label: "JDIH BPS", href: "https://jdih.bps.go.id/" },
  ];

  return (
    <footer id="footer" className="bg-[#043277] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo + address + contact */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 shrink-0">
                      <Image
                        src={navbarLogo}
                        alt="BPS Logo"
                        width={300}
                        height={120}
                        className="h-10 w-auto object-contain"
                      />
                      <div
                        className="hidden flex-col leading-tight text-white italic font-bold sm:flex"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        <span className="text-sm md:text-base">BADAN PUSAT STATISTIK</span>
                        <span className="text-sm md:text-base">
                          KABUPATEN SOLOK SELATAN
                        </span>
                      </div>
                    </Link>

            <p className="mt-4 text-sm leading-relaxed text-blue-100">
              Badan Pusat Statistik Kabupaten Solok Selatan
              <br />
              (Statistics Solok Selatan Regency)
              <br />
              Jl. Koto Tinggi Padang Aro Sangir Solok Selatan 27778
            </p>

            <p className="mt-3 text-sm text-blue-100">
              WA:{" "}
              <a
                href="https://wa.me/6282180001310"
                className="hover:text-white hover:underline"
              >
                0821-8000-1310
              </a>
            </p>

            <p className="mt-1 text-sm text-blue-100">
              Mailbox:{" "}
              <a
                href="mailto:bps1310@bps.go.id"
                className="hover:text-white hover:underline"
              >
                bps1310@bps.go.id
              </a>
            </p>

            {/* Secondary footer logo/cover */}
            <div className="mt-6">
              <Image
                src="/BerAKHLAK.png"
                alt="Logo footer BPS"
                width={220}
                height={70}
              />
            </div>
          </div>

          {/* Tentang Kami */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Tentang Kami
            </h3>
            <ul className="mt-4 space-y-2">
              {tentangKami.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-100 hover:text-white hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tautan Lainnya */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Tautan Lainnya
            </h3>
            <ul className="mt-4 space-y-2">
              {tautanLainnya.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-100 hover:text-white hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar: manual / terms / link list + copyright */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
            <a
              href="https://manual-website-bps.readthedocs.io/id/latest/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              Manual
            </a>
            <a
              href="https://solokselatankab.bps.go.id/id/term-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              S&K
            </a>
            <a
              href="https://solokselatankab.bps.go.id/id/tautan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              Daftar Tautan
            </a>
          </div>

          <p className="text-sm text-blue-200">
            Hak Cipta © 2026 Badan Pusat Statistik
          </p>
        </div>
      </div>
    </footer>
  );
}