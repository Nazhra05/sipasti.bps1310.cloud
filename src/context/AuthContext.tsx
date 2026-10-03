"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "@/lib/api";

export interface UserInfo {
  id_admin?: number;
  username: string;
  name: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (identity: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "bps_solsel_auth_verified";
const USER_STORAGE_KEY = "bps_solsel_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check client side stored login session (localStorage and cookies)
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const hasCookie = document.cookie.includes("bps_solsel_auth_verified=true");

      if ((storedAuth === "true" || hasCookie) && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Gagal membaca status otentikasi:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identity: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanIdentity = identity.trim();
    const cleanPass = password.trim();

    if (!cleanIdentity || !cleanPass) {
      return { success: false, message: "Identity (email/username) dan Kata Sandi wajib diisi." };
    }

    try {
      // Call PHP Login API endpoint via proxy route
      const res = await loginApi(cleanIdentity, cleanPass);

      if (res.status && res.data) {
        const loggedUser: UserInfo = {
          id_admin: res.data.id_admin,
          username: res.data.username,
          name: res.data.username || "Pegawai BPS",
          email: res.data.email,
          role: res.data.role || "Pegawai",
        };

        // Persist session via localStorage & 30-day cookie
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
        document.cookie = `${AUTH_STORAGE_KEY}=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        document.cookie = `${USER_STORAGE_KEY}=${encodeURIComponent(JSON.stringify(loggedUser))}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

        setIsAuthenticated(true);
        setUser(loggedUser);
        return { success: true, message: res.message };
      } else {
        return {
          success: false,
          message: res.message || "Gagal masuk. Periksa kembali username/email dan kata sandi Anda.",
        };
      }
    } catch (err) {
      console.error("Kesalahan otentikasi login:", err);
      return { success: false, message: "Terjadi kesalahan jaringan atau server saat login." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" }).catch(() => null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      document.cookie = `${AUTH_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${USER_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (err) {
      console.error("Gagal menghapus sesi login:", err);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  }
  return context;
}
