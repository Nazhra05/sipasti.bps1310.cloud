import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-8 pb-12 sm:pt-11 sm:pb-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111c2e] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center animate-in fade-in duration-300 slide-in-from-top-1">
          {/* SIPASTI Horizontal Lockup Logo (Compensating for ~23% transparent image padding with interactive hover) */}
          <div className="flex items-center justify-center -mb-3 sm:-mb-4 md:-mb-5 transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src="/SIPASTI Logo.png"
              alt="SIPASTI - Sistem Informasi Portal Aplikasi Statistik Terintegrasi"
              width={380}
              height={136}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain dark:brightness-110 drop-shadow-2xs select-none"
              priority
            />
          </div>

          {/* Main Title - Sits snugly and tightly under visible logo artwork */}
          <h1 className="mt-0 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight max-w-4xl mx-auto">
            Sistem Informasi Portal Aplikasi Statistik Terintegrasi
          </h1>

          {/* Subtitle / Context */}
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto font-normal">
            Direktori resmi aplikasi operasional, sistem sensus, administrasi, dan layanan statistik BPS Kabupaten Solok Selatan dengan panduan status akses jaringan yang transparan.
          </p>
        </div>
      </div>
    </section>
  );
}
