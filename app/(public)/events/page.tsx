import type { Metadata } from 'next'
import { Calendar, MapPin, CalendarX } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Events — Lakshay 2047',
  description: 'Upcoming events, workshops, and hackathons at the Centre of Future Skills.',
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default async function EventsPage() {
  const now = new Date()

  let upcoming: Awaited<ReturnType<typeof prisma.event.findMany>> = []
  let past: Awaited<ReturnType<typeof prisma.event.findMany>> = []

  try {
    ;[upcoming, past] = await Promise.all([
      prisma.event.findMany({
        where: { isPublic: true, date: { gte: now } },
        orderBy: { date: 'asc' },
      }),
      prisma.event.findMany({
        where: { isPublic: true, date: { lt: now } },
        orderBy: { date: 'desc' },
        take: 6,
      }),
    ])
  } catch {
    // table may not exist yet — show empty state
  }

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="py-16 text-center">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
            What&apos;s On
          </p>
          <h1 className="font-heading font-bold text-4xl text-white mb-4">Events</h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Workshops, hackathons, and open days at the Centre of Future Skills.
          </p>
        </div>

        {/* Upcoming */}
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-border bg-surface-2 mb-12">
            <CalendarX size={32} className="text-text-subtle mb-4" />
            <p className="text-white font-semibold mb-1">No upcoming events</p>
            <p className="text-text-subtle text-sm">Check back soon.</p>
          </div>
        ) : (
          <section className="mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-6">
              Upcoming
            </h2>
            <div className="space-y-4">
              {upcoming.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-accent/20 bg-surface-2 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 text-center rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 min-w-[56px]">
                      <p className="text-xs text-accent font-mono">
                        {event.date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
                      </p>
                      <p className="font-heading font-bold text-white text-xl leading-none">
                        {event.date.getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-white mb-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-text-muted text-sm line-clamp-2 mb-3">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-text-subtle">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(event.date)} · {formatTime(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-6">
              Past Events
            </h2>
            <div className="space-y-3">
              {past.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border bg-surface-2 p-5 opacity-70"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm line-clamp-1">{event.title}</h3>
                      <div className="flex gap-3 text-xs text-text-subtle mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {event.location}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-text-subtle bg-surface px-2 py-0.5 rounded-full border border-border">
                      Past
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
