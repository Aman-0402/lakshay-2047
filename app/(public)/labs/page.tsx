import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet } from '@/lib/redis'
import LabsView from '@/components/labs/LabsView'
import type { Lab } from '@/types/lab'

export const metadata: Metadata = {
  title: 'Labs — Lakshay 2047',
  description:
    'Explore 14 world-class labs across AI/ML, Robotics, Design, Hardware, Media, XR, Cybersecurity, and Biotech at Parul University\'s Centre of Future Skills.',
}

async function getLabs(): Promise<Lab[]> {
  const cached = await cacheGet<{ labs: Lab[] }>('labs:all')
  if (cached) return cached.labs

  const rows = await prisma.lab.findMany({
    where: { isActive: true },
    orderBy: { category: 'asc' },
  })

  const labs = rows.map((row) => ({
    ...row,
    equipment: row.equipment as string[],
  })) as Lab[]

  await cacheSet('labs:all', { labs }, 300)
  return labs
}

export default async function LabsPage() {
  const labs = await getLabs()

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">
            Parul University · Centre of Future Skills
          </p>
          <h1 className="font-heading font-bold text-4xl text-white mb-4">
            Our Labs
          </h1>
          <p className="text-text-muted max-w-xl">
            14 specialised labs spanning every frontier of modern technology.
            Filter by discipline or browse all.
          </p>
        </div>

        <LabsView labs={labs} />
      </div>
    </main>
  )
}
