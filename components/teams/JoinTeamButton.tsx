'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JoinTeamButtonProps {
  teamId: string
  isMember: boolean
  isFull: boolean
  isOpen: boolean
  isLoggedIn: boolean
}

export default function JoinTeamButton({
  teamId,
  isMember,
  isFull,
  isOpen,
  isLoggedIn,
}: JoinTeamButtonProps) {
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canJoin = isOpen && !isMember && !isFull && isLoggedIn

  async function handleJoin() {
    if (!canJoin) return
    setJoining(true)
    setError(null)

    try {
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        setJoined(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to join team')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  if (isMember || joined) {
    return (
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-center">
        <p className="text-accent font-semibold text-sm">
          {joined ? '🎉 Joined successfully!' : 'You are a member of this team'}
        </p>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="rounded-xl border border-border bg-surface px-5 py-4 text-center">
        <p className="text-text-muted text-sm">This team is no longer accepting members.</p>
      </div>
    )
  }

  if (isFull) {
    return (
      <div className="rounded-xl border border-border bg-surface px-5 py-4 text-center">
        <p className="text-text-muted text-sm">Team is at full capacity.</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-border bg-surface px-5 py-4 text-center">
        <p className="text-text-muted text-sm mb-2">Sign in to join this team</p>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Sign In
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleJoin}
        disabled={joining}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold',
          'bg-primary text-white hover:bg-primary/90 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {joining && <Loader2 size={15} className="animate-spin" />}
        {joining ? 'Joining…' : 'Join Team'}
      </button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  )
}
