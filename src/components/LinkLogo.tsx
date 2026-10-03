"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export const LOGO_BASE =
  process.env.NEXT_PUBLIC_UPLOADS_BASE_URL ||
  (process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, "")}/uploads`
    : "");

interface LinkLogoProps {
  logo?: string;
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function LinkLogo({ logo, label, size = "md" }: LinkLogoProps) {
  const [errored, setErrored] = useState(false);

  const dim =
    size === "lg"
      ? "h-8 w-8 text-xs"
      : size === "md"
      ? "h-6 w-6 text-[10px]"
      : "h-4 w-4 text-[9px]";

  // Fallback monogram if image 404 or missing - Clean Minimalist (No Gradient)
  if (!logo || errored) {
    const initials =
      label
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || label.slice(0, 2).toUpperCase() || "BP";

    return (
      <div
        className={`${dim} shrink-0 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 select-none`}
        title={label}
      >
        <span>{initials}</span>
      </div>
    );
  }

  const logoSrc = logo
    ? logo.startsWith("http://") || logo.startsWith("https://")
      ? logo
      : `${LOGO_BASE}/${logo.replace(/^\/+/, "")}`
    : "";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt={label}
      aria-hidden
      loading="lazy"
      className={`${dim} shrink-0 rounded-md object-contain`}
      onError={() => setErrored(true)}
    />
  );
}
