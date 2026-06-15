import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Users, Crown, Calendar } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import JoinTeamButton from '@/components/teams/JoinTeamButton'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const team = await prisma.team.findUnique({ where: { id }, select: { name: true } })
  return {
    title: team ? `${team.name} — Lakshay 2047` : 'Team — Lakshay 2047',
  }
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, image: true, email: true, department: true } },
        },
        orderBy: { isLeader: 'desc' },
      },
    },
  })

  if (!team) notFound()

  const isMember = team.members.some((m) => m.userId === session.user.id)
  const isFull = team.members.length >= team.maxMembers
  const skills = team.skills as string[]

  function formatDate(d: Date) {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back */}
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back to Teams
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Main content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    team.isOpen
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'bg-surface text-text-muted border border-border'
                  }`}
                >
                  {team.isOpen ? 'Open' : 'Closed'}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-subtle">
                  <Users size={11} />
                  {team.members.length}/{team.maxMembers} members
                </span>
              </div>
              <h1 className="font-heading font-bold text-3xl text-white mb-3">
                {team.name}
              </h1>
              <p className="text-text-muted leading-relaxed">{team.description}</p>
            </div>

            {/* Project Idea */}
            {team.projectIdea && (
              <section>
                <h2 className="font-heading font-semibold text-white text-lg mb-3">
                  Project Idea
                </h2>
                <div className="rounded-xl border border-border bg-surface-2 p-5">
                  <p className="text-text-muted leading-relaxed">{team.projectIdea}</p>
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="font-heading font-semibold text-white text-lg mb-3">
                  Skills Needed
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Members */}
            <section>
              <h2 className="font-heading font-semibold text-white text-lg mb-4">
                Members ({team.members.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-4"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface border border-border shrink-0">
                      {m.user.image ? (
                        <Image
                          src={m.user.image}
                          alt={m.user.name ?? 'Member'}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-text-muted bg-primary/10">
                          {(m.user.name ?? m.user.email ?? '?')[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-white truncate">
                          {m.user.name ?? 'Unknown'}
                        </p>
                        {m.isLeader && (
                          <Crown size={12} className="text-amber-400 shrink-0" />
                        )}
                      </div>
                      {m.user.department && (
                        <p className="text-xs text-text-subtle truncate">{m.user.department}</p>
                      )}
                      <p className="text-xs text-text-subtle flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        Joined {formatDate(m.joinedAt)}
                      </p>
                    </div>

                    {m.isLeader && (
                      <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                        Leader
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Join island */}
          <aside className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-xl border border-border bg-surface-2 p-5">
              <h3 className="font-heading font-semibold text-white mb-1">
                Join this Team
              </h3>
              <p className="text-xs text-text-subtle mb-4">
                Created {formatDate(team.createdAt)}
              </p>

              <div className="flex justify-between text-xs text-text-muted mb-4">
                <span>Spots remaining</span>
                <span className="text-white font-semibold">
                  {Math.max(0, team.maxMembers - team.members.length)} / {team.maxMembers}
                </span>
              </div>

              {/* Capacity bar */}
              <div className="h-1.5 rounded-full bg-surface mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, (team.members.length / team.maxMembers) * 100)}%`,
                  }}
                />
              </div>

              <JoinTeamButton
                teamId={team.id}
                isMember={isMember}
                isFull={isFull}
                isOpen={team.isOpen}
                isLoggedIn={!!session?.user?.id}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
