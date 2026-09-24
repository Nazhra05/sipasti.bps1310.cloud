import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

// Inter — the closest open-source equivalent to Apple's SF Pro.
// Apple actually uses ONE typeface (SF Pro) for everything, just at
// different weights for headings vs body text, so we do the same here
// with a single font instead of two separate families.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BPS",
  description: "BPS website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}