import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Users, Clock, ArrowRight, Cpu } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Lab } from '@/types/lab'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getLab(slug: string): Promise<Lab | null> {
  const row = await prisma.lab.findUnique({ where: { slug } })
  if (!row) return null
  return { ...row, equipment: row.equipment as string[] } as Lab
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const lab = await getLab(slug)
  if (!lab) return { title: 'Lab Not Found — Lakshay 2047' }
  return {
    title: `${lab.name} — Lakshay 2047`,
    description: lab.description,
    openGraph: {
      title: lab.name,
      description: lab.description,
      images: [
        {
          url: `/api/og?type=lab&slug=${lab.slug}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function LabDetailPage({ params }: PageProps) {
  const { slug } = await params
  const lab = await getLab(slug)

  if (!lab) notFound()

  const color = CATEGORY_COLORS[lab.category]
  const categoryLabel = CATEGORY_LABELS[lab.category]

  return (
    <main className="min-h-screen bg-bg pb-24">
      {/* Hero image banner */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        {lab.image ? (
          <Image
            src={lab.image}
            alt={lab.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${color}33 0%, #0A0A0F 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

        {/* Category badge over image */}
        <div className="absolute bottom-6 left-6 md:left-12">
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-4">
        {/* Name + CTA row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white leading-tight">
            {lab.name}
          </h1>
          <Link
            href={`/book/${lab.slug}`}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shrink-0 transition-opacity hover:opacity-85'
            )}
            style={{ backgroundColor: color }}
          >
            Book This Lab <ArrowRight size={15} />
          </Link>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-4 mb-10">
          <span className="flex items-center gap-2 text-sm text-text-muted">
            <Users size={15} className="text-text-subtle" />
            Capacity: <strong className="text-text">{lab.capacity} seats</strong>
          </span>
          <span className="flex items-center gap-2 text-sm text-text-muted">
            <MapPin size={15} className="text-text-subtle" />
            <strong className="text-text">{lab.location}</strong>
          </span>
          <span className="flex items-center gap-2 text-sm text-text-muted">
            <Clock size={15} className="text-text-subtle" />
            <strong className="text-text">{lab.openTime} – {lab.closeTime}</strong>
          </span>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="font-heading font-semibold text-lg text-white mb-3">
            About this Lab
          </h2>
          <p className="text-text-muted leading-relaxed">{lab.description}</p>
        </div>

        {/* Equipment grid */}
        <div className="mb-12">
          <h2 className="font-heading font-semibold text-lg text-white mb-5">
            Equipment & Facilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lab.equipment.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-2 border border-border"
              >
                <Cpu
                  size={15}
                  className="shrink-0"
                  style={{ color }}
                />
                <span className="text-sm text-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: `linear-gradient(135deg, ${color}18 0%, transparent 100%)`,
            border: `1px solid ${color}33`,
          }}
        >
          <div>
            <p className="font-heading font-semibold text-white">
              Ready to use the {lab.name}?
            </p>
            <p className="text-sm text-text-muted mt-1">
              Book a {lab.slotDuration}-minute slot and start building.
            </p>
          </div>
          <Link
            href={`/book/${lab.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shrink-0 transition-opacity hover:opacity-85"
            style={{ backgroundColor: color }}
          >
            Book This Lab <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  )
}
