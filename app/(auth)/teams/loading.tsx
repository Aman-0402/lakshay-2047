export default function TeamsLoading() {
  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header skeleton */}
        <div className="mb-10 space-y-2">
          <div className="h-3 w-28 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-8 w-40 rounded-lg bg-surface-2 animate-pulse" />
          <div className="h-4 w-72 rounded-full bg-surface-2 animate-pulse" />
        </div>

        {/* Filter strip skeleton */}
        <div className="flex items-center gap-2 mb-8">
          {[60, 80, 72, 90, 64].map((w, i) => (
            <div
              key={i}
              className="h-7 rounded-full bg-surface-2 animate-pulse shrink-0"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface-2 p-5 space-y-3"
            >
              <div className="h-5 w-3/4 rounded-full bg-surface animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded-full bg-surface animate-pulse" />
                <div className="h-3 w-5/6 rounded-full bg-surface animate-pulse" />
              </div>
              <div className="flex gap-1.5 pt-1">
                {[50, 60, 44].map((w, j) => (
                  <div
                    key={j}
                    className="h-5 rounded-full bg-surface animate-pulse"
                    style={{ width: w }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-7 h-7 rounded-full bg-surface animate-pulse border-2 border-surface-2" />
                  ))}
                </div>
                <div className="h-6 w-20 rounded-lg bg-surface animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
