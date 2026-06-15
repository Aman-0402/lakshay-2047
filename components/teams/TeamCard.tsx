'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Loader2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SerializedTeam } from '@/types/team'

interface TeamCardProps {
  team: SerializedTeam
  currentUserId: string | null
  onJoin?: (teamId: string) => void
}

export default function TeamCard({ team, currentUserId, onJoin }: TeamCardProps) {
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMember = currentUserId
    ? team.members.some((m) => m.userId === currentUserId)
    : false
  const isFull = team.members.length >= team.maxMembers
  const canJoin = team.isOpen && !isMember && !isFull && !!currentUserId

  async function handleJoin(e: React.MouseEvent) {
    e.preventDefault()
    if (!canJoin) return
    setJoining(true)
    setError(null)

    try {
      const res = await fetch(`/api/teams/${team.id}/join`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        setJoined(true)
        onJoin?.(team.id)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to join')
      }
    } catch {
      setError('Network error')
    } finally {
      setJoining(false)
    }
  }

  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        'group block rounded-xl border border-border bg-surface-2 p-5',
        'hover:border-primary/40 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-heading font-semibold text-white group-hover:text-primary transition-colors line-clamp-1 flex-1">
          {team.name}
        </h3>
        {!team.isOpen && (
          <span className="shrink-0 flex items-center gap-1 text-xs text-text-muted">
            <Lock size={11} />
            Closed
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-muted line-clamp-2 mb-4">{team.description}</p>

      {/* Skill chips */}
      {team.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {team.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
            >
              {skill}
            </span>
          ))}
          {team.skills.length > 5 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface text-text-subtle border border-border">
              +{team.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Footer: avatars + member count + join */}
      <div className="flex items-center justify-between gap-3">
        {/* Stacked avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="w-7 h-7 rounded-full border-2 border-surface-2 overflow-hidden bg-surface shrink-0"
                title={m.user.name ?? 'Member'}
              >
                {m.user.image ? (
                  <Image
                    src={m.user.image}
                    alt={m.user.name ?? 'Member'}
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-text-muted bg-primary/10">
                    {(m.user.name ?? '?')[0].toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {team.members.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-surface-2 bg-surface flex items-center justify-center text-xs text-text-muted shrink-0">
                +{team.members.length - 4}
              </div>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-text-subtle">
            <Users size={11} />
            {team.members.length}/{team.maxMembers}
          </span>
        </div>

        {/* Join button */}
        {(joined || (isMember && !joined)) ? (
          <span className="text-xs text-accent font-medium">
            {joined ? 'Joined!' : 'Member'}
          </span>
        ) : isFull ? (
          <span className="text-xs text-text-muted">Full</span>
        ) : canJoin ? (
          <button
            onClick={handleJoin}
            disabled={joining}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
              'bg-primary/15 text-primary border border-primary/30',
              'hover:bg-primary hover:text-white transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {joining && <Loader2 size={11} className="animate-spin" />}
            Join Team
          </button>
        ) : !currentUserId ? (
          <span className="text-xs text-text-muted">Sign in to join</span>
        ) : null}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </Link>
  )
}
