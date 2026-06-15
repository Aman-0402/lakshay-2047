import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Lightbulb, Users, Globe } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ORDER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About — Lakshay 2047',
  description:
    "Learn about Parul University's Centre of Future Skills — 14 world-class innovation labs driving India's next generation of technologists.",
}

const PILLARS = [
  {
    icon: <Target size={20} />,
    title: 'Mission',
    body: 'Equip students with hands-on, industry-grade skills across emerging disciplines — bridging academia and real-world innovation.',
  },
  {
    icon: <Lightbulb size={20} />,
    title: 'Innovation',
    body: 'Every lab is purpose-built for its discipline: from bioreactors to motion-capture rigs, students work with professional-grade equipment.',
  },
  {
    icon: <Users size={20} />,
    title: 'Collaboration',
    body: "Cross-disciplinary teams define Lakshay 2047. AI researchers work beside designers, hardware engineers alongside media creators.",
  },
  {
    icon: <Globe size={20} />,
    title: 'Vision 2047',
    body: "Named after India's centenary of independence, Lakshay 2047 is a commitment to building the talent that will shape the next 25 years.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 text-center py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
          Parul University · Vadodara, Gujarat
        </p>
        <h1 className="font-heading font-bold text-5xl text-white leading-tight mb-6">
          Centre of{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Future Skills
          </span>
        </h1>
        <p className="text-text-muted text-lg leading-relaxed max-w-2xl mx-auto">
          Lakshay 2047 is Parul University's flagship innovation ecosystem — 14 specialised labs,
          one campus, and a singular goal: producing the technologists who will define India's next era.
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PILLARS.map(({ icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-surface-2 p-6 flex gap-4"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {icon}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white mb-2">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Labs by discipline */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-heading font-bold text-2xl text-white mb-2">
            14 Labs · 8 Disciplines
          </h2>
          <p className="text-text-muted text-sm mb-10">
            Each lab is a dedicated environment for its domain — not a shared general-purpose room.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORY_ORDER.map((cat) => {
              const color = CATEGORY_COLORS[cat]
              return (
                <div
                  key={cat}
                  className="rounded-lg border border-border bg-surface-2 px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-text-muted">{CATEGORY_LABELS[cat]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-heading font-bold text-2xl text-white mb-4">
          Explore the labs
        </h2>
        <p className="text-text-muted mb-8">
          Browse all 14 labs, check availability, and book your next session.
        </p>
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          View all labs <ArrowRight size={15} />
        </Link>
      </section>
    </main>
  )
}
