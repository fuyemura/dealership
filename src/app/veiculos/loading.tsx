export default function VeiculosLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Page header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-brand-gray-mid/40 rounded" />
          <div className="h-3 w-24 bg-brand-gray-mid/40 rounded" />
        </div>
        <div className="h-10 w-44 bg-brand-gray-mid/40 rounded-full" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3">
        <div className="h-9 flex-1 max-w-xs bg-brand-gray-mid/40 rounded-full" />
        <div className="h-9 w-28 bg-brand-gray-mid/40 rounded-full" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-brand-gray-mid/30 bg-white h-52" />
        ))}
      </div>
    </div>
  );
}
