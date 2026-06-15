import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, FlaskConical, Layers, Zap } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import { prisma } from '@/lib/prisma'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/constants'
import type { LabCategory } from '@/types/lab'

export const metadata: Metadata = {
  title: 'Lakshay 2047 — Centre of Future Skills',
  description:
    "Discover 14 world-class labs at Parul University's Centre of Future Skills. Book lab slots, explore disciplines, and connect with your team.",
}

const CATEGORY_DESC: Record<LabCategory, string> = {
  AI_ML: 'Machine learning, computer vision, and intelligent systems',
  ROBOTICS: 'Autonomous systems, embedded control, and mechatronics',
  DESIGN: 'UI/UX, product design, and creative prototyping',
  HARDWARE: 'PCB design, IoT, and hardware engineering',
  MEDIA: 'Video production, podcasting, and digital storytelling',
  EXTENDED_REALITY: 'VR, AR, and mixed reality development',
  CYBERSECURITY: 'Ethical hacking, network defence, and secure systems',
  BIOTECH: 'Bioinformatics, lab-on-chip, and biomedical engineering',
}

export default async function HomePage() {
  const [labs, teamCount] = await Promise.all([
    prisma.lab.findMany({
      where: { isActive: true },
      select: { category: true, capacity: true },
    }),
    prisma.team.count({ where: { isOpen: true } }),
  ])

  const totalCapacity = labs.reduce((s, l) => s + l.capacity, 0)
  const labsByCategory = CATEGORY_ORDER.reduce<Record<LabCategory, number>>(
    (acc, cat) => {
      acc[cat] = labs.filter((l) => l.category === cat).length
      return acc
    },
    {} as Record<LabCategory, number>
  )

  return (
    <main>
      <HeroSection />

      {/* ── Stats strip ───────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { icon: <FlaskConical size={18} />, value: labs.length, label: 'Innovation Labs' },
            { icon: <Layers size={18} />, value: 8, label: 'Disciplines' },
            { icon: <Users size={18} />, value: totalCapacity, label: 'Total Seats' },
            { icon: <Zap size={18} />, value: teamCount, label: 'Open Teams' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <span className="text-accent mb-1">{icon}</span>
              <span className="font-heading font-bold text-3xl text-white">{value}</span>
              <span className="text-xs text-text-subtle uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lab disciplines grid ──────────────────────────── */}
      <section className="py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
              14 labs · 8 disciplines
            </p>
            <h2 className="font-heading font-bold text-3xl text-white">
              Explore by Discipline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_ORDER.map((cat) => {
              const color = CATEGORY_COLORS[cat]
              const count = labsByCategory[cat]
              return (
                <Link
                  key={cat}
                  href="/labs"
                  className="group relative rounded-xl border border-border bg-surface-2 p-5 overflow-hidden hover:border-opacity-60 transition-all duration-200"
                  style={
                    { '--cat-color': color } as React.CSSProperties
                  }
                >
                  {/* Colour accent top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 group-hover:h-1"
                    style={{ backgroundColor: color }}
                  />
                  {/* Subtle bg glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${color}08 0%, transparent 70%)` }}
                  />

                  <div className="relative">
                    <div
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 text-white"
                      style={{ backgroundColor: `${color}22`, border: `1px solid ${color}33` }}
                    >
                      <FlaskConical size={16} style={{ color }} />
                    </div>
                    <h3 className="font-heading font-semibold text-white text-sm mb-1 group-hover:text-white transition-colors">
                      {CATEGORY_LABELS[cat]}
                    </h3>
                    <p className="text-xs text-text-subtle leading-relaxed line-clamp-2 mb-3">
                      {CATEGORY_DESC[cat]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono" style={{ color }}>
                        {count} {count === 1 ? 'lab' : 'labs'}
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-text-subtle group-hover:translate-x-1 transition-transform duration-200"
                        style={{ color }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm text-text-muted hover:border-primary/50 hover:text-white transition-all"
            >
              View all labs
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
            Get started
          </p>
          <h2 className="font-heading font-bold text-3xl text-white mb-4">
            Ready to build something?
          </h2>
          <p className="text-text-muted mb-10 max-w-lg mx-auto">
            Book a lab slot for your next session, or find teammates across disciplines for your project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors shadow-[0_0_24px_rgba(108,99,255,0.35)]"
            >
              <FlaskConical size={15} />
              Book a Lab
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-border text-text-muted hover:border-accent/50 hover:text-accent transition-all"
            >
              <Users size={15} />
              Find a Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
