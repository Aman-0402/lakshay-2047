import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Users, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/constants'
import BookingSlotPicker from '@/components/labs/BookingSlotPicker'
import type { Lab } from '@/types/lab'

interface PageProps {
  params: Promise<{ labSlug: string }>
}

async function getLab(slug: string): Promise<Lab | null> {
  const row = await prisma.lab.findUnique({ where: { slug } })
  if (!row) return null
  return { ...row, equipment: row.equipment as string[] } as Lab
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { labSlug } = await params
  const lab = await getLab(labSlug)
  if (!lab) return { title: 'Lab Not Found — Lakshay 2047' }
  return {
    title: `Book ${lab.name} — Lakshay 2047`,
    description: `Book a session at ${lab.name}. ${lab.description}`,
  }
}

export default async function BookingPage({ params }: PageProps) {
  const { labSlug } = await params
  const lab = await getLab(labSlug)
  if (!lab) notFound()

  const color = CATEGORY_COLORS[lab.category]
  const categoryLabel = CATEGORY_LABELS[lab.category]

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-mono tracking-widest uppercase text-accent mb-6">
          Booking Flow
        </p>

        {/* Lab summary card */}
        <div className="rounded-xl border border-border bg-surface-2 overflow-hidden mb-10">
          <div className="relative h-40 overflow-hidden">
            {lab.image ? (
              <Image
                src={lab.image}
                alt={lab.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${color}33, #111118)`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-surface-2/50 to-transparent" />
            <span
              className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {categoryLabel}
            </span>
          </div>

          <div className="px-6 py-5">
            <h1 className="font-heading font-bold text-2xl text-white mb-2">
              {lab.name}
            </h1>
            <p className="text-sm text-text-muted mb-4 leading-relaxed line-clamp-2">
              {lab.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <MapPin size={13} /> {lab.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Users size={13} /> Capacity: {lab.capacity}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock size={13} /> {lab.openTime} – {lab.closeTime}
              </span>
            </div>
          </div>
        </div>

        {/* Slot picker */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-heading font-semibold text-white text-lg mb-6">
            Choose a Slot
          </h2>
          <BookingSlotPicker
            labSlug={lab.slug}
            labId={lab.id}
            labName={lab.name}
          />
        </div>
      </div>
    </main>
  )
}
