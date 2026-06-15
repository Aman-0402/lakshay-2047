import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_ROLES = ['SUPER_ADMIN', 'LAB_ADMIN'] as const

const patchSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
})

async function getBookingOrFail(id: string) {
  return prisma.booking.findUnique({ where: { id } })
}

function canModify(
  userId: string,
  userRole: string,
  bookingUserId: string
): boolean {
  if (ADMIN_ROLES.includes(userRole as (typeof ADMIN_ROLES)[number])) return true
  return userId === bookingUserId
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const booking = await getBookingOrFail(id)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (!canModify(session.user.id, session.user.role ?? '', booking.userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  })

  return NextResponse.json({ booking: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const booking = await getBookingOrFail(id)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (!canModify(session.user.id, session.user.role ?? '', booking.userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  })

  return NextResponse.json({ booking: updated })
}
