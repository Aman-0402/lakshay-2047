import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { bookingRateLimit } from '@/lib/ratelimit'
import type { SerializedBookingWithLab } from '@/types/booking'

const createBookingSchema = z.object({
  labId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters').max(500),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit
  if (bookingRateLimit) {
    const { success } = await bookingRateLimit.limit(session.user.id)
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded — max 5 bookings per hour' },
        { status: 429 }
      )
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { labId, date, startTime, endTime, purpose } = parsed.data
  const bookingDate = new Date(`${date}T00:00:00.000Z`)

  // Conflict detection — same lab, same date, same start slot, active booking
  const conflict = await prisma.booking.findFirst({
    where: {
      labId,
      date: bookingDate,
      startTime,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  })
  if (conflict) {
    return NextResponse.json(
      { error: 'This slot is already booked' },
      { status: 409 }
    )
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      labId,
      date: bookingDate,
      startTime,
      endTime,
      purpose,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ booking }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      lab: {
        select: { id: true, name: true, slug: true, category: true, location: true },
      },
    },
    orderBy: { date: 'desc' },
  })

  const bookings: SerializedBookingWithLab[] = rows.map((b) => ({
    ...b,
    category: b.lab.category,
    date: b.date.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    lab: {
      ...b.lab,
      category: b.lab.category,
    },
  }))

  return NextResponse.json({ bookings })
}
