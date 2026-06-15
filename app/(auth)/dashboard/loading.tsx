export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header skeleton */}
        <div className="mb-10 space-y-2">
          <div className="h-3 w-24 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-8 w-48 rounded-lg bg-surface-2 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Profile card skeleton */}
          <div className="rounded-xl border border-border bg-surface-2 p-6 space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-surface animate-pulse" />
              <div className="h-5 w-32 rounded-full bg-surface animate-pulse" />
              <div className="h-4 w-20 rounded-full bg-surface animate-pulse" />
            </div>
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 rounded-full bg-surface animate-pulse" />
              ))}
            </div>
          </div>

          {/* Bookings skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-36 rounded-lg bg-surface-2 animate-pulse mb-6" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface-2 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-48 rounded-full bg-surface animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-surface animate-pulse" />
                </div>
                <div className="h-3 w-64 rounded-full bg-surface animate-pulse" />
                <div className="h-3 w-40 rounded-full bg-surface animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
