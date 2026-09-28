"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <h2 className="mt-4 text-xl font-bold text-slate-800">
        Terjadi Kesalahan
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Halaman tidak dapat dimuat saat ini. Silakan coba lagi atau kembali nanti.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-[#043277] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#043277]/85"
      >
        Coba Lagi
      </button>
    </div>
  );
}
