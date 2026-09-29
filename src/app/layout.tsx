import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIPASTI — Sistem Portal Statistik Terintegrasi BPS Solok Selatan",
  description:
    "Portal terpadu untuk mengakses website, dashboard, dan layanan statistik BPS Kabupaten Solok Selatan.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/bps-logo.png", type: "image/png" },
    ],
    apple: "/bps-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}