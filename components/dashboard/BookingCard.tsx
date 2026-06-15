'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/Badge'
import { CATEGORY_COLORS } from '@/lib/constants'
import type { SerializedBookingWithLab } from '@/types/booking'

interface BookingCardProps {
  booking: SerializedBookingWithLab
  onStatusChange?: (id: string, status: SerializedBookingWithLab['status']) => void
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false)
  const [localStatus, setLocalStatus] = useState(booking.status)
  const color = CATEGORY_COLORS[booking.lab.category]
  const canCancel = localStatus === 'PENDING' || localStatus === 'CONFIRMED'

  async function handleCancel() {
    setCancelling(true)
    // Optimistic update
    setLocalStatus('CANCELLED')
    onStatusChange?.(booking.id, 'CANCELLED')

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      if (!res.ok) {
        // Revert on failure
        setLocalStatus(booking.status)
        onStatusChange?.(booking.id, booking.status)
      }
    } catch {
      setLocalStatus(booking.status)
      onStatusChange?.(booking.id, booking.status)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-surface-2 overflow-hidden transition-opacity',
        localStatus === 'CANCELLED' && 'opacity-60'
      )}
      style={{ borderColor: localStatus === 'CANCELLED' ? undefined : `${color}30` }}
    >
      {/* Color accent top bar */}
      <div className="h-0.5" style={{ backgroundColor: color }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/labs/${booking.lab.slug}`}
              className="font-heading font-semibold text-white hover:text-accent transition-colors line-clamp-1"
            >
              {booking.lab.name}
            </Link>
            <p className="text-xs text-text-muted mt-0.5">{booking.lab.location}</p>
          </div>
          <StatusBadge status={localStatus} className="shrink-0" />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {booking.startTime} – {booking.endTime}
          </span>
        </div>

        {booking.purpose && (
          <p className="text-xs text-text-muted mt-3 line-clamp-2 border-t border-border pt-3">
            {booking.purpose}
          </p>
        )}

        {canCancel && (
          <div className="flex justify-end mt-3">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {cancelling && <Loader2 size={11} className="animate-spin" />}
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
