import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-[#043277]">404</p>
      <h2 className="mt-3 text-xl font-bold text-slate-800">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-[#043277] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#043277]/85"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
