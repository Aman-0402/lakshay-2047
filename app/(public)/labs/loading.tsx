export default function LabsLoading() {
  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-3 w-48 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-9 w-32 rounded-lg bg-surface-2 animate-pulse" />
          <div className="h-4 w-80 rounded-full bg-surface-2 animate-pulse" />
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-surface-2 animate-pulse"
              style={{ width: `${60 + (i % 3) * 20}px` }}
            />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-surface-2 animate-pulse"
              style={{ width: '320px', height: '220px', borderRadius: 'var(--radius-lg)' }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
