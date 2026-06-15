import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet } from '@/lib/redis'
import type { Lab } from '@/types/lab'

const CACHE_KEY = 'labs:all'
const CACHE_TTL = 300 // 5 minutes

export async function GET() {
  try {
    const cached = await cacheGet<{ labs: Lab[] }>(CACHE_KEY)
    if (cached) {
      return NextResponse.json(cached)
    }

    const rows = await prisma.lab.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    })

    const labs = rows.map((row) => ({
      ...row,
      equipment: row.equipment as string[],
    })) as Lab[]

    const data = { labs }
    await cacheSet(CACHE_KEY, data, CACHE_TTL)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/labs]', error)
    return NextResponse.json({ error: 'Failed to fetch labs' }, { status: 500 })
  }
}
