'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import TeamCard from './TeamCard'
import CreateTeamForm from './CreateTeamForm'
import type { SerializedTeam } from '@/types/team'

interface TeamGridProps {
  teams: SerializedTeam[]
  currentUserId: string | null
}

export default function TeamGrid({ teams: initial, currentUserId }: TeamGridProps) {
  const [teams, setTeams] = useState(initial)
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  const allSkills = useMemo(() => {
    const set = new Set<string>()
    initial.forEach((t) => t.skills.forEach((s) => set.add(s)))
    return Array.from(set).sort()
  }, [initial])

  const filtered = activeSkill
    ? teams.filter((t) => t.skills.includes(activeSkill))
    : teams

  function handleTeamCreated(team: SerializedTeam) {
    setTeams((prev) => [team, ...prev])
  }

  return (
    <div>
      {/* Toolbar: skill filter + create button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Skill filter strip */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveSkill(null)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              activeSkill === null
                ? 'bg-primary text-white'
                : 'bg-surface-2 text-text-muted border border-border hover:border-primary/40 hover:text-primary'
            )}
          >
            All
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                activeSkill === skill
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-text-muted border border-border hover:border-primary/40 hover:text-primary'
              )}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Create team dialog */}
        <CreateTeamForm onCreated={handleTeamCreated} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users size={32} className="text-text-subtle mb-3" />
          <p className="text-text-muted text-sm">
            {activeSkill
              ? `No open teams for "${activeSkill}"`
              : 'No open teams yet. Be first!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((team) => (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                <TeamCard
                  team={team}
                  currentUserId={currentUserId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
