import type { Metadata } from 'next'
import Image from 'next/image'
import { ExternalLink, Building2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Partners — Lakshay 2047',
  description: 'Industry and academic partners powering the Centre of Future Skills.',
}

export default async function PartnersPage() {
  let partners: Awaited<ReturnType<typeof prisma.partner.findMany>> = []

  try {
    partners = await prisma.partner.findMany({
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    })
  } catch {
    // table may not exist yet — show empty state
  }

  const featured = partners.filter((p) => p.featured)
  const rest = partners.filter((p) => !p.featured)

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="py-16 text-center">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
            Ecosystem
          </p>
          <h1 className="font-heading font-bold text-4xl text-white mb-4">Partners</h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Industry leaders and academic institutions who power the Centre of Future Skills.
          </p>
        </div>

        {partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-border bg-surface-2 mb-16">
            <Building2 size={32} className="text-text-subtle mb-4" />
            <p className="text-white font-semibold mb-1">Partner announcements coming soon</p>
            <p className="text-text-subtle text-sm">Check back soon.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section className="mb-16">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-8 text-center">
                  Strategic Partners
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {featured.map((p) => (
                    <PartnerCard key={p.id} partner={p} large />
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="mb-16">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-8 text-center">
                  Partners
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {rest.map((p) => (
                    <PartnerCard key={p.id} partner={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA */}
        <div className="rounded-xl border border-border bg-surface-2 p-8 text-center">
          <h2 className="font-heading font-semibold text-white mb-2">Become a Partner</h2>
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
            Collaborate with Parul University&apos;s Centre of Future Skills to shape the next generation of talent.
          </p>
          <a
            href="mailto:cfs@paruluniversity.ac.in"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </main>
  )
}

function PartnerCard({
  partner,
  large = false,
}: {
  partner: { id: string; name: string; logo: string; website: string | null }
  large?: boolean
}) {
  const inner = (
    <div
      className={`group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface-2 hover:border-primary/30 transition-all ${large ? 'p-6' : 'p-4'}`}
    >
      <div
        className={`relative flex items-center justify-center ${large ? 'w-24 h-16' : 'w-16 h-10'}`}
      >
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
          sizes={large ? '96px' : '64px'}
        />
      </div>
      {large && (
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{partner.name}</p>
          {partner.website && (
            <span className="flex items-center justify-center gap-1 text-xs text-text-subtle mt-0.5 group-hover:text-accent transition-colors">
              <ExternalLink size={10} /> Visit
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return inner
}
