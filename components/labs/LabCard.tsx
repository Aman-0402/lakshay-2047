'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Users, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/constants'
import type { Lab } from '@/types/lab'

interface LabCardProps {
  lab: Lab
}

export default function LabCard({ lab }: LabCardProps) {
  const [flipped, setFlipped] = useState(false)
  const color = CATEGORY_COLORS[lab.category]
  const categoryLabel = CATEGORY_LABELS[lab.category]
  const topEquipment = lab.equipment.slice(0, 4)

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: '320px', height: '220px', perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── Front ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden bg-surface-2 border border-border"
          style={{ backfaceVisibility: 'hidden', borderRadius: 'var(--radius-lg)' }}
        >
          {/* Image */}
          <div className="relative w-full h-32 bg-surface overflow-hidden">
            {lab.image ? (
              <Image
                src={lab.image}
                alt={lab.name}
                fill
                className="object-cover"
                sizes="320px"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${color}22, ${color}55)`,
                }}
              />
            )}
            {/* Category badge */}
            <span
              className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Info */}
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="font-heading font-semibold text-sm text-white leading-tight line-clamp-2 flex-1 mr-2">
              {lab.name}
            </p>
            <span
              className={cn(
                'flex items-center gap-1 text-xs px-2 py-1 rounded-full shrink-0',
                'bg-surface border border-border text-text-muted'
              )}
            >
              <Users size={11} />
              {lab.capacity}
            </span>
          </div>
        </div>

        {/* ── Back ──────────────────────────────────────────── */}
        <div
          className="absolute inset-0 overflow-hidden bg-surface-2 border border-border flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 'var(--radius-lg)',
            borderTopColor: color,
            borderTopWidth: '2px',
          }}
        >
          <div className="px-4 pt-4 pb-2 flex-1">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color }}
            >
              Equipment
            </p>
            <ul className="space-y-1">
              {topEquipment.map((item) => (
                <li key={item} className="text-xs text-text-muted flex items-start gap-1.5">
                  <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-xs text-text-subtle">
                <MapPin size={10} /> {lab.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-subtle">
                <Users size={10} /> Capacity: {lab.capacity}
              </span>
            </div>
            <Link
              href={`/book/${lab.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white shrink-0 transition-opacity hover:opacity-80"
              style={{ backgroundColor: color }}
            >
              Book Now <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
