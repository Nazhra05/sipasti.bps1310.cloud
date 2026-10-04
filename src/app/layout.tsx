import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Portal Tautan Internal - BPS Kabupaten Solok Selatan",
  description:
    "Dashboard repositori tautan sistem dan aplikasi kerja pegawai Badan Pusat Statistik Kabupaten Solok Selatan",
  icons: {
    icon: [
      { url: "/BPS Logo.png", type: "image/png" },
    ],
    shortcut: "/BPS Logo.png",
    apple: "/BPS Logo.png",
  },
};

import ClientProviders from "@/components/ClientProviders";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? undefined;

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/BPS Logo.png" type="image/png" />
        <link rel="shortcut icon" href="/BPS Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/BPS Logo.png" />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-slate-100 dark:selection:text-slate-900">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
