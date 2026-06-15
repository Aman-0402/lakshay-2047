'use client'

import { useState } from 'react'
import BookingCard from './BookingCard'
import type { SerializedBookingWithLab, BookingStatus } from '@/types/booking'

interface BookingListProps {
  bookings: SerializedBookingWithLab[]
}

function isUpcoming(booking: SerializedBookingWithLab): boolean {
  const bookingDate = new Date(booking.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return (
    bookingDate >= today &&
    booking.status !== 'CANCELLED' &&
    booking.status !== 'COMPLETED'
  )
}

export default function BookingList({ bookings: initial }: BookingListProps) {
  const [bookings, setBookings] = useState(initial)

  function handleStatusChange(id: string, status: BookingStatus) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
  }

  const upcoming = bookings.filter(isUpcoming)
  const past = bookings.filter((b) => !isUpcoming(b))

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-muted text-sm mb-2">No bookings yet.</p>
        <a href="/labs" className="text-xs text-accent hover:underline">
          Explore Labs →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-4">
            Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-4">
            Past & Cancelled ({past.length})
          </h3>
          <div className="space-y-3">
            {past.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
