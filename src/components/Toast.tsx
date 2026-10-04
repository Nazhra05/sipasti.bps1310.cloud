"use client";

import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-xl border border-slate-700/60 dark:border-slate-200/60 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 backdrop-blur-md">
      <CheckCircle2 className="w-4 h-4 text-[#6DBE45] shrink-0" />
      <span>{message}</span>
    </div>
  );
}
