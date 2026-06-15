import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Lab, LabAvailability, TimeSlot } from '@/types/lab'

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

function parseTime(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function generateSlotTimes(
  openTime: string,
  closeTime: string,
  slotDuration: number
): Array<{ startTime: string; endTime: string }> {
  const slots: Array<{ startTime: string; endTime: string }> = []
  let current = parseTime(openTime)
  const close = parseTime(closeTime)
  while (current + slotDuration <= close) {
    slots.push({
      startTime: minutesToTime(current),
      endTime: minutesToTime(current + slotDuration),
    })
    current += slotDuration
  }
  return slots
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const row = await prisma.lab.findUnique({
      where: { slug },
      include: {
        bookings: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          select: { date: true, startTime: true, endTime: true },
        },
      },
    })

    if (!row) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 })
    }

    const lab: Lab = { ...row, equipment: row.equipment as string[] }

    // Build booking lookup: "YYYY-MM-DD|HH:MM" → true
    const bookedSet = new Set<string>()
    for (const b of row.bookings) {
      bookedSet.add(`${toDateString(b.date)}|${b.startTime}`)
    }

    // Compute availability for next 7 days
    const slotTimes = generateSlotTimes(lab.openTime, lab.closeTime, lab.slotDuration)
    const availability: LabAvailability[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = toDateString(day)
      const slots: TimeSlot[] = slotTimes.map((s) => ({
        ...s,
        available: !bookedSet.has(`${dateStr}|${s.startTime}`),
      }))
      availability.push({ date: dateStr, slots })
    }

    return NextResponse.json({ lab, availability })
  } catch (error) {
    console.error(`[GET /api/labs/${slug}]`, error)
    return NextResponse.json({ error: 'Failed to fetch lab' }, { status: 500 })
  }
}
