export default function FinanceiroLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-brand-gray-mid/40 rounded" />
        <div className="h-3 w-64 bg-brand-gray-mid/40 rounded" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3">
        <div className="h-9 w-40 bg-brand-gray-mid/40 rounded-full" />
        <div className="h-9 w-28 bg-brand-gray-mid/40 rounded-full" />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-brand-gray-mid/30 bg-white p-5 h-28" />
        ))}
      </div>

      {/* Chart/table skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-brand-gray-mid/30 bg-white h-64" />
        <div className="rounded-2xl border border-brand-gray-mid/30 bg-white h-64" />
      </div>
    </div>
  );
}
