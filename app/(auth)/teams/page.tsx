import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TeamGrid from '@/components/teams/TeamGrid'
import type { SerializedTeam } from '@/types/team'

export const metadata: Metadata = {
  title: 'Team Finder — Lakshay 2047',
  description: 'Find or create a project team at Parul University Centre of Future Skills.',
}

export default async function TeamsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const rows = await prisma.team.findMany({
    where: { isOpen: true },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const teams: SerializedTeam[] = rows.map((t) => ({
    ...t,
    skills: t.skills as string[],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    members: t.members.map((m) => ({
      ...m,
      joinedAt: m.joinedAt.toISOString(),
    })),
  }))

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            Collaboration Hub
          </p>
          <h1 className="font-heading font-bold text-3xl text-white mb-2">
            Team Finder
          </h1>
          <p className="text-text-muted text-sm max-w-xl">
            Join an existing team or create your own. Collaborate on projects across all 14 labs.
          </p>
        </div>

        <TeamGrid teams={teams} currentUserId={session.user.id} />
      </div>
    </main>
  )
}
