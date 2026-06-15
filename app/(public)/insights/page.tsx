import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Insights — Lakshay 2047',
  description: 'Articles, research, and stories from the Centre of Future Skills.',
}

function formatDate(d: Date | null) {
  if (!d) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function InsightsPage() {
  let insights: Array<{
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string | null
    publishedAt: Date | null
  }> = []

  try {
    insights = await prisma.insight.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
  } catch {
    // table may not exist yet — show empty state
  }

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="py-16 text-center">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
            Knowledge Base
          </p>
          <h1 className="font-heading font-bold text-4xl text-white mb-4">Insights</h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Articles, research, and stories from the Centre of Future Skills community.
          </p>
        </div>

        {/* Content */}
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-border bg-surface-2">
            <BookOpen size={32} className="text-text-subtle mb-4" />
            <p className="text-white font-semibold mb-1">No insights published yet</p>
            <p className="text-text-subtle text-sm">Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight) => (
              <Link
                key={insight.id}
                href={`/insights/${insight.slug}`}
                className="group block rounded-xl border border-border bg-surface-2 p-6 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {insight.publishedAt && (
                      <p className="text-xs text-text-subtle mb-2">
                        {formatDate(insight.publishedAt)}
                      </p>
                    )}
                    <h2 className="font-heading font-semibold text-white text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {insight.title}
                    </h2>
                    <p className="text-text-muted text-sm line-clamp-2">{insight.excerpt}</p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-text-subtle group-hover:text-primary group-hover:translate-x-1 transition-all mt-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
