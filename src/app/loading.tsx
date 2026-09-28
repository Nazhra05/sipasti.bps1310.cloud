export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#043277]" />
      <p className="mt-4 text-sm text-slate-500">Memuat halaman…</p>
    </div>
  );
}
