import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'

export const metadata: Metadata = {
  title: 'Lakshay 2047 — Centre of Future Skills',
  description:
    'Discover 14 world-class labs at Parul University\'s Centre of Future Skills. Book lab slots, explore disciplines, and connect with your team.',
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* ── Labs Preview ─────────────────────────────────── */}
      <section id="labs-preview" className="py-24 bg-bg">
        {/* Phase 2: LabsPreview component goes here */}
      </section>

      {/* ── Insights ─────────────────────────────────────── */}
      <section id="insights" className="py-24 bg-surface">
        {/* Phase 2: InsightsSection component goes here */}
      </section>

      {/* ── Partners ─────────────────────────────────────── */}
      <section id="partners" className="py-24 bg-bg">
        {/* Phase 2: PartnersSection component goes here */}
      </section>
    </main>
  )
}
