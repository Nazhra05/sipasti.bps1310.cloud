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

const USER_STORAGE_KEY = "bps_solsel_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Verify session state against the server-side signed token (/api/auth/me)
    const verifySessionWithServer = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setIsAuthenticated(true);
            setUser({
              id_admin: data.user.id_admin,
              username: data.user.username,
              name: data.user.name || data.user.username,
              email: data.user.email,
              role: data.user.role || "Pegawai",
            });
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
            return;
          }
        }
        // If server says not authenticated or token is invalid, ensure client is unauthenticated
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem("bps_solsel_auth_verified");
        }
      } catch (err) {
        // If network error, fall back to unauthenticated for safety
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifySessionWithServer();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (identity: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanIdentity = identity.trim();
    const cleanPass = password.trim();

    if (!cleanIdentity || !cleanPass) {
      return { success: false, message: "Identity (email/username) dan Kata Sandi wajib diisi." };
    }

    try {
      // Call PHP Login API endpoint via proxy route (which issues cryptographically signed HTTP-Only session cookie)
      const res = await loginApi(cleanIdentity, cleanPass);

      if (res.status && res.data) {
        const loggedUser: UserInfo = {
          id_admin: res.data.id_admin,
          username: res.data.username,
          name: res.data.username || "Pegawai BPS",
          email: res.data.email,
          role: res.data.role || "Pegawai",
        };

        // Cache user info for UI rendering
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
        localStorage.removeItem("bps_solsel_auth_verified");

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
      return { success: false, message: "Gagal masuk. Periksa koneksi internet Anda dan coba lagi." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" }).catch(() => null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem("bps_solsel_auth_verified");
      document.cookie = `bps_solsel_auth_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
