export default function ClientesLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Page header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-7 w-32 bg-brand-gray-mid/40 rounded" />
        <div className="h-10 w-40 bg-brand-gray-mid/40 rounded-full" />
      </div>

      {/* Search skeleton */}
      <div className="h-9 w-full max-w-sm bg-brand-gray-mid/40 rounded-full" />

      {/* Table skeleton */}
      <div className="rounded-2xl border border-brand-gray-mid/30 bg-white overflow-hidden">
        <div className="h-12 border-b border-brand-gray-mid/20 bg-brand-gray-soft/50" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 border-b border-brand-gray-mid/20 last:border-0" />
        ))}
      </div>
    </div>
  );
}
