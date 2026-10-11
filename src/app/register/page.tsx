"use client";

import { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import VpnGuideModal from "@/components/VpnGuideModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { registerApi } from "@/lib/api";

function RegisterContent() {
  const router = useRouter();

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ username: string; message: string } | null>(null);

  // Modals
  const [isVpnModalOpen, setIsVpnModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Prevent double-click race condition
  const isProcessingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isProcessingRef.current) return;

    setErrorMessage(null);

    // Client-side validations
    if (!firstName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMessage("Seluruh kolom bertanda bintang (*) wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui ketentuan kedinasan BPS Solok Selatan.");
      return;
    }

    isProcessingRef.current = true;
    setIsSubmitting(true);

    try {
      const res = await registerApi({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });

      if (res.status) {
        setIsSuccess(true);
        setSuccessInfo({
          username: username.trim(),
          message: res.message || "Pendaftaran akun berhasil dikirim.",
        });
      } else {
        setErrorMessage(res.message || "Gagal melakukan pendaftaran. Silakan periksa kembali data Anda.");
      }
    } catch {
      setErrorMessage("Terjadi gangguan koneksi ke server. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
      isProcessingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header Navigation */}
      <Navbar onOpenVpnGuide={() => setIsVpnModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-lg space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-[#00A6B4] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Portal</span>
            </Link>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
              BPS Solok Selatan
            </span>
          </div>

          {/* Registration Card Surface */}
          <div className="rounded-3xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {isSuccess && successInfo ? (
              /* SUCCESS CONFIRMATION VIEW */
              <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 text-[#2f6318] dark:text-[#8ee064] flex items-center justify-center border border-[#6DBE45]/40 shadow-xs">
                  <UserCheck className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 text-[#2f6318] dark:text-[#8ee064] border border-[#6DBE45]/40">
                    <span className="w-2 h-2 rounded-full bg-[#6DBE45] animate-pulse" />
                    Pendaftaran Berhasil Dikirim
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Halo, {firstName} {lastName}!
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    {successInfo.message}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-xs text-sky-900 dark:text-sky-200 text-left space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#005AA9] dark:text-sky-400 shrink-0" />
                    <span>Langkah Persetujuan Keamanan Kedinasan</span>
                  </div>
                  <p className="text-[11px] text-sky-800/90 dark:text-sky-300/90 leading-relaxed">
                    Akun pegawai berstatus <strong>Pending</strong> demi keamanan informasi kedinasan. Administrator BPS Solok Selatan akan memverifikasi dan mengaktifkan akun Anda sebelum dapat digunakan untuk membuka tautan internal.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] transition shadow-md cursor-pointer"
                  >
                    <span>Masuk ke Halaman Login</span>
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
                  >
                    Ke Beranda
                  </Link>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM VIEW */
              <div className="space-y-6">
                {/* Header Branding */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center mb-1">
                    <Image
                      src="/BPS Logo.png"
                      alt="Logo BPS"
                      width={48}
                      height={37}
                      className="h-10 w-auto object-contain"
                    />
                  </div>

                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Pendaftaran Akun Pegawai
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Buat akun baru untuk mengakses repositori berkas mandiri dan katalog layanan internal BPS Solok Selatan.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama Depan & Nama Belakang Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Nama Depan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Contoh: Budi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Nama Belakang
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Contoh: Santoso"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Username Pegawai <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Contoh: budi.santoso"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email Kedinasan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="budi.santoso@bps.go.id"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Kata Sandi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          disabled={isSubmitting}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 karakter"
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Konfirmasi Sandi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          disabled={isSubmitting}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi sandi"
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title={showConfirmPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Agree to Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#005AA9] focus:ring-[#005AA9] dark:bg-slate-800 dark:border-slate-700 shrink-0"
                      />
                      <span className="leading-relaxed">
                        Saya menyetujui ketentuan penggunaan dan kebijakan privasi kedinasan BPS Solok Selatan.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] transition-all shadow-md active:scale-[0.98] ${
                      isSubmitting
                        ? "opacity-60 pointer-events-none cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mendaftarkan Akun...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-[#FFA500]" />
                        <span>Daftar Akun Pegawai</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sudah memiliki akun terverifikasi?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info Box */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00A6B4] shrink-0" />
              <span>Satu Akun untuk Seluruh Ruang Kerja Digital</span>
            </div>
            <p className="leading-relaxed">
              Akun pegawai yang telah disetujui dapat digunakan untuk mengelola repositori berkas pribadi, menandai aplikasi favorit, dan mengakses seluruh tautan internal BPS Solok Selatan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#004380] dark:border-[#002b59] bg-[#005AA9] dark:bg-[#003870] py-4 transition-colors text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-blue-100/90">
          <p>© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-white underline cursor-pointer transition-colors"
            >
              Kebijakan Privasi
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => setIsVpnModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Panduan VPN
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VpnGuideModal isOpen={isVpnModalOpen} onClose={() => setIsVpnModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0b1120]">
          <div className="w-8 h-8 border-4 border-[#005AA9] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
