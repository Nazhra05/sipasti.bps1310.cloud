"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Moon, Sun, HelpCircle, User, UserCheck, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenVpnGuide: () => void;
}

export default function Navbar({ onOpenVpnGuide }: NavbarProps) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Check current state from documentElement
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);

    // Live clock in WIB (UTC+7)
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
      setDateStr(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.contains("dark");
    if (isDarkNow) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleAuthIconClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setShowMenu((prev) => !prev);
    }
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#003366] dark:bg-[#002244] border-b border-[#002244] dark:border-slate-800 shadow-sm transition-colors text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-center justify-center h-10 w-auto shrink-0 select-none">
              <Image
                src="/BPS Logo.png"
                alt="Logo BPS"
                width={48}
                height={37}
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-sm sm:text-base group-hover:text-blue-200 transition-colors">
                  BPS Solok Selatan
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/15 text-white border border-white/20">
                  Portal Internal
                </span>
              </div>
              <p className="text-xs text-blue-100/80 hidden xs:block">
                Repositori Tautan Aplikasi Kerja
              </p>
            </div>
          </Link>

          {/* Right Actions: Clock, VPN Info, Theme Toggle, Auth/Profile Icon */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Clock Widget */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 dark:bg-slate-800/80 border border-white/15 dark:border-slate-700 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-white tabular-nums">
                {timeStr || "Memuat..."}
              </span>
              <span className="text-white/30 dark:text-slate-600">|</span>
              <span className="text-blue-100 dark:text-slate-300 font-medium">{dateStr}</span>
            </div>

            {/* Info Akses VPN Button */}
            <button
              onClick={onOpenVpnGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold text-white bg-white/15 hover:bg-white/25 dark:bg-slate-800 dark:hover:bg-slate-700 border border-white/20 dark:border-slate-700 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Info VPN</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
              title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
              className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-white bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700 border border-white/15 dark:border-slate-700 transition cursor-pointer"
            >
              {mounted && isDark ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Auth / Profile Icon (Positioned strictly on the RIGHT side of the light/dark mode icon) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleAuthIconClick}
                aria-label={isAuthenticated ? "Menu Profil Terverifikasi" : "Halaman Login"}
                title={isAuthenticated ? `Terverifikasi: ${user?.name || "Pegawai BPS"}` : "Masuk ke Portal Internal"}
                className={`p-2 min-h-[36px] min-w-[36px] flex items-center justify-center gap-1.5 rounded-lg border transition cursor-pointer ${
                  isAuthenticated
                    ? "bg-emerald-600/30 hover:bg-emerald-600/40 border-emerald-400/50 text-emerald-300"
                    : "bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700 border-white/15 dark:border-slate-700 text-white"
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-300" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
                  </>
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </button>

              {/* User Menu Dropdown (when authenticated) */}
              {showMenu && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#151f32] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xl py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-200 dark:border-slate-700/80">
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{user?.name || "Pegawai BPS"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || user?.username || "Akun Terverifikasi"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Akses Internal Terverifikasi</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/login"
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Detail Status Akun</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
