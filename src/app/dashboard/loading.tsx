export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-soft animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16" />

      <main className="flex-1 page-container py-8 sm:py-12 space-y-8">
        {/* Greeting skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-brand-gray-mid/40 rounded" />
            <div className="h-8 w-56 bg-brand-gray-mid/40 rounded" />
          </div>
          <div className="h-10 w-48 bg-brand-gray-mid/40 rounded-full" />
        </div>

        {/* Metric cards skeleton */}
        <section>
          <div className="h-3 w-32 bg-brand-gray-mid/40 rounded mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-brand-gray-mid/30 bg-white p-5 h-28" />
            ))}
          </div>
        </section>

        {/* Bottom sections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-brand-gray-mid/30 bg-white h-48" />
          <div className="rounded-2xl border border-brand-gray-mid/30 bg-white h-48" />
        </div>

        {/* Table skeleton */}
        <div className="rounded-2xl border border-brand-gray-mid/30 bg-white h-64" />
      </main>
    </div>
  );
}
