"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import VpnGuideModal from "@/components/VpnGuideModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import ResendVerificationModal from "@/components/ResendVerificationModal";
import { useAuth } from "@/context/AuthContext";
import { toSafeExternalUrl } from "@/lib/safeUrl";
import { fetchLayanan } from "@/lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParamName = searchParams.get("name") || "";
  const redirectParamId = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const [pendingTarget, setPendingTarget] = useState<{ id?: number; name?: string; url?: string } | null>(null);
  const [targetName, setTargetName] = useState<string>(redirectParamName);

  const { isAuthenticated, user, login, logout, isLoading: isAuthLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVpnModalOpen, setIsVpnModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);

  // Synchronous submit lock reference to prevent rapid double-click race conditions
  const isProcessingRef = useRef(false);

  // Security & Target Hydration:
  // 1. Read pending internal app target (id, name) from sessionStorage (no URL leaked).
  // 2. If legacy redirect query param is present, scrub it immediately.
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("bps_pending_app_target");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") {
            setPendingTarget(parsed);
            if (parsed.name && !redirectParamName) {
              setTargetName(parsed.name);
            }
          }
        }
      } catch (err) {
        console.warn("Gagal membaca target pending:", err);
      }
    }

    if (redirectParamId && !isNaN(redirectParamId)) {
      setPendingTarget((prev) => ({
        ...prev,
        id: redirectParamId,
        name: redirectParamName || prev?.name,
      }));
    }

    const rawRedirect = searchParams.get("redirect");
    if (rawRedirect) {
      const safeUrl = toSafeExternalUrl(rawRedirect);
      if (safeUrl) {
        try {
          const appData = {
            name: redirectParamName || "Aplikasi Kedinasan Internal",
            url: safeUrl,
          };
          sessionStorage.setItem("bps_pending_app_target", JSON.stringify(appData));
          setPendingTarget(appData);
        } catch {}
      }

      // Scrub the restricted URL parameter from the browser address bar immediately
      const url = new URL(window.location.href);
      url.searchParams.delete("redirect");
      const cleanPath = url.pathname + (url.search ? url.search : "");
      window.history.replaceState(null, "", cleanPath);
    }
  }, [searchParams, redirectParamName, redirectParamId]);

  const safeDisplayName = (() => {
    const candidate = targetName || redirectParamName || pendingTarget?.name || "";
    if (!candidate || candidate.startsWith("http://") || candidate.startsWith("https://") || candidate.includes("/")) {
      return "Aplikasi Kedinasan Internal";
    }
    return candidate;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate rapid submissions (synchronous ref + state guard)
    if (isSubmitting || isProcessingRef.current) return;
    isProcessingRef.current = true;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(username, password);

      if (res.success) {
        setSuccessMessage("Verifikasi berhasil! Mengalihkan...");

        // Authoritatively resolve target application URL now that session is valid
        let targetUrl: string | null = null;
        let targetId = pendingTarget?.id || redirectParamId;

        if (typeof window !== "undefined") {
          try {
            const rawPending = sessionStorage.getItem("bps_pending_app_target");
            if (rawPending) {
              const parsed = JSON.parse(rawPending);
              if (parsed?.id) targetId = Number(parsed.id);
              if (parsed?.url) targetUrl = toSafeExternalUrl(parsed.url);
              sessionStorage.removeItem("bps_pending_app_target");
            }
          } catch (storageErr) {
            console.warn("Gagal membaca target pending:", storageErr);
          }
        }

        // If target ID exists, fetch newly authenticated layanan list to get real URL
        if (targetId && !targetUrl) {
          try {
            const freshLayanan = await fetchLayanan();
            const targetApp = freshLayanan.find((item) => item.id_layanan === targetId);
            if (targetApp?.url) {
              targetUrl = toSafeExternalUrl(targetApp.url);
            }
          } catch (fetchErr) {
            console.warn("Gagal mengambil tautan aplikasi setelah login:", fetchErr);
          }
        }

        setTimeout(() => {
          if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
            router.push("/");
          } else {
            router.push("/");
          }
        }, 800);
      } else {
        setErrorMessage(res.message || "Gagal melakukan verifikasi akun.");
        setIsSubmitting(false);
        isProcessingRef.current = false;
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan sistem saat menghubungi server.");
      setIsSubmitting(false);
      isProcessingRef.current = false;
    }
  };

  const handleLogout = () => {
    logout();
    setSuccessMessage("Anda telah keluar dari sesi.");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar onOpenVpnGuide={() => setIsVpnModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* Top Back Navigation Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#005AA9] dark:hover:text-[#00A6B4] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Repositori</span>
            </Link>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
              BPS Solok Selatan
            </span>
          </div>

          {/* Context Notice Banner - Accent Orange #FFA500 */}
          {Boolean(redirectParamName || pendingTarget?.name) && !isAuthenticated && (
            <div className="p-4 rounded-2xl bg-[#FFA500]/10 dark:bg-[#FFA500]/15 border border-[#FFA500]/40 text-[#804b00] dark:text-[#ffbe4d] text-xs leading-relaxed flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
              <Lock className="w-4 h-4 shrink-0 text-[#FFA500] mt-0.5" />
              <div>
                <p className="font-bold">Akses Aplikasi Internal Memerlukan Login</p>
                <p className="mt-0.5 text-[#804b00]/90 dark:text-[#ffbe4d]/90">
                  Untuk membuka tautan aplikasi{" "}
                  <strong className="underline decoration-[#FFA500] font-semibold text-[#663c00] dark:text-white">
                    {safeDisplayName}
                  </strong>
                  , silakan lakukan otentikasi login portal terlebih dahulu.
                </p>
              </div>
            </div>
          )}

          {/* Login Card Container (Clean Solid Surface - No Gradients) */}
          <div className="rounded-3xl bg-white dark:bg-[#151f32] border border-slate-300 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {isAuthenticated ? (
              /* ALREADY AUTHENTICATED VIEW */
              <div className="space-y-6 text-center py-2">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 text-[#2f6318] dark:text-[#8ee064] flex items-center justify-center border border-[#6DBE45]/40 shadow-xs">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 text-[#2f6318] dark:text-[#8ee064] border border-[#6DBE45]/40">
                    <span className="w-2 h-2 rounded-full bg-[#6DBE45] animate-pulse" />
                    Status: Terverifikasi
                  </span>
                  <h2 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
                    {user?.name || "Pegawai BPS Solok Selatan"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {user?.email || user?.username || "Akun Terverifikasi"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 text-left space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#6DBE45] shrink-0" />
                    <span>Seluruh Tautan Internal Terbuka</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Sesi Anda aktif di browser ini. Seluruh tautan aplikasi kedinasan internal dapat diakses langsung dari beranda.
                  </p>
                </div>

                {Boolean(pendingTarget?.id || pendingTarget?.url) && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        let finalUrl = pendingTarget?.url;
                        if (!finalUrl && pendingTarget?.id) {
                          const list = await fetchLayanan();
                          const found = list.find((item) => item.id_layanan === pendingTarget.id);
                          finalUrl = found?.url;
                        }
                        if (finalUrl) {
                          const safeUrl = toSafeExternalUrl(finalUrl);
                          if (safeUrl) {
                            window.open(safeUrl, "_blank", "noopener,noreferrer");
                          }
                        }
                        sessionStorage.removeItem("bps_pending_app_target");
                        setPendingTarget(null);
                      } catch (err) {
                        console.warn("Gagal membuka tautan aplikasi:", err);
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] transition shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    <span>Lanjutkan ke {safeDisplayName}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
                  >
                    Ke Beranda
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            ) : (
              /* LOGIN FORM VIEW */
              <div className="space-y-6">
                {/* Header Logo & Title */}
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
                    Login Sipasti
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Verifikasi identitas akun pegawai untuk membuka akses tautan internal BPS Solok Selatan.
                  </p>
                </div>

                {/* Notifications Alert */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex flex-col gap-2 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                    {(errorMessage.toLowerCase().includes("verifikasi") ||
                      errorMessage.toLowerCase().includes("pending") ||
                      errorMessage.toLowerCase().includes("aktif")) && (
                      <div className="pt-2 border-t border-red-200/60 dark:border-red-800/60 flex items-center justify-between text-[11px]">
                        <span>Token kedaluwarsa atau belum menerima email?</span>
                        <button
                          type="button"
                          onClick={() => setIsResendModalOpen(true)}
                          className="font-bold underline cursor-pointer text-[#005AA9] dark:text-[#38a0f0]"
                        >
                          Kirim Ulang Token
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-[#6DBE45]/15 dark:bg-[#6DBE45]/20 border border-[#6DBE45]/40 text-[#2f6318] dark:text-[#8ee064] text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#6DBE45]" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username / Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Username / Email
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
                        placeholder="Masukkan Username atau Email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Kata Sandi (Password)
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isSubmitting}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6B4]/25 focus:border-[#00A6B4] transition-all shadow-2xs disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options Row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-[#005AA9] focus:ring-[#005AA9] dark:bg-slate-800 dark:border-slate-700"
                      />
                      <span>Ingat saya di perangkat ini</span>
                    </label>
                  </div>

                  {/* Submit Button with Rapid Double-Submit Lock */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                    className={`w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-[#005AA9] hover:bg-[#004280] dark:bg-[#005AA9] dark:hover:bg-[#0070d1] transition-all shadow-md active:scale-[0.98] ${
                      isSubmitting
                        ? "opacity-60 pointer-events-none cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memverifikasi Akun...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#FFA500]" />
                        <span>Masuk & Verifikasi Akses</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Link to Register Page */}
                <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Belum memiliki akun pegawai?{" "}
                    <Link
                      href="/register"
                      className="font-bold text-[#005AA9] dark:text-[#38a0f0] hover:underline"
                    >
                      Daftar di sini
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Security Badge */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00A6B4] shrink-0" />
              <span>Sistem Informasi Portal Aplikasi Statistik Terintegrasi</span>
            </div>
            <p className="leading-relaxed">
              Verifikasi login hanya dilakukan 1x. Setelah berhasil terverifikasi, seluruh tautan aplikasi internal kedinasan dapat diakses secara langsung dari landing page portal.
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Solid Navy #005AA9 */}
      <footer className="w-full border-t border-[#004380] dark:border-[#002b59] bg-[#005AA9] dark:bg-[#003870] py-4 transition-colors text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-blue-100/90">
          <p>© {new Date().getFullYear()} BPS Kabupaten Solok Selatan. Hak Cipta Dilindungi.</p>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="hover:text-white underline cursor-pointer transition-colors"
          >
            Kebijakan Privasi
          </button>
        </div>
      </footer>

      {/* Modals */}
      <VpnGuideModal isOpen={isVpnModalOpen} onClose={() => setIsVpnModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <ResendVerificationModal
        isOpen={isResendModalOpen}
        onClose={() => setIsResendModalOpen(false)}
        defaultEmail={username.includes("@") ? username : ""}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0b1120]">
          <div className="w-8 h-8 border-4 border-[#005AA9] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
