import type { LabCategory } from './lab'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: string
  userId: string
  labId: string
  date: Date
  startTime: string
  endTime: string
  purpose: string
  status: BookingStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

/** Server → Client transport form (dates as ISO strings) */
export interface SerializedBookingWithLab {
  id: string
  userId: string
  labId: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  status: BookingStatus
  notes: string | null
  createdAt: string
  updatedAt: string
  lab: {
    id: string
    name: string
    slug: string
    category: LabCategory
    location: string
  }
}
