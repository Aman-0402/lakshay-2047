'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { X, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SerializedTeam } from '@/types/team'

const schema = z.object({
  name: z.string().min(3, 'Min 3 chars').max(60, 'Max 60 chars'),
  description: z.string().min(10, 'Min 10 chars').max(500, 'Max 500 chars'),
  projectIdea: z.string().max(300, 'Max 300 chars').optional(),
  maxMembers: z.number().int().min(2, 'Min 2').max(10, 'Max 10'),
})

type FormValues = z.infer<typeof schema>

interface CreateTeamFormProps {
  onCreated?: (team: SerializedTeam) => void
}

export default function CreateTeamForm({ onCreated }: CreateTeamFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [skillError, setSkillError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { maxMembers: 5 },
  })

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag) return
    if (skills.includes(tag)) {
      setTagInput('')
      return
    }
    if (skills.length >= 10) {
      setSkillError('Max 10 skills')
      return
    }
    setSkills((prev) => [...prev, tag])
    setTagInput('')
    setSkillError(null)
  }

  function removeTag(tag: string) {
    setSkills((prev) => prev.filter((t) => t !== tag))
  }

  function handleClose() {
    setOpen(false)
    reset()
    setSkills([])
    setTagInput('')
    setSkillError(null)
    setServerError(null)
  }

  async function onSubmit(values: FormValues) {
    if (skills.length === 0) {
      setSkillError('Add at least one skill')
      return
    }
    setServerError(null)

    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...values, skills }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      if (res.status === 401) {
        setServerError('Sign in to create a team')
      } else {
        setServerError(data.error ?? 'Failed to create team')
      }
      return
    }

    const team: SerializedTeam = await res.json()
    handleClose()
    onCreated?.(team)
    router.push(`/teams/${team.id}`)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={15} />
          Create Team
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface-2 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-heading font-bold text-white text-xl">
              Create Team
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close dialog" className="text-text-subtle hover:text-white transition-colors">
                <X size={18} aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Team Name */}
            <div>
              <label className="block text-xs font-semibold text-text-subtle mb-1.5 uppercase tracking-wide">
                Team Name *
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Quantum Coders"
                className={cn(
                  'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white placeholder:text-text-subtle',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                  errors.name ? 'border-red-500/50' : 'border-border'
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-text-subtle mb-1.5 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="What is your team working on?"
                className={cn(
                  'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white placeholder:text-text-subtle resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                  errors.description ? 'border-red-500/50' : 'border-border'
                )}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Skills tag input */}
            <div>
              <label className="block text-xs font-semibold text-text-subtle mb-1.5 uppercase tracking-wide">
                Skills Needed *
              </label>
              <div
                className={cn(
                  'flex flex-wrap gap-1.5 min-h-[40px] rounded-lg border bg-surface px-3 py-2',
                  'focus-within:ring-2 focus-within:ring-primary/50',
                  skillError ? 'border-red-500/50' : 'border-border'
                )}
              >
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/15 text-primary border border-primary/20"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeTag(skill)}
                      className="hover:text-white transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder={skills.length === 0 ? 'Type and press Enter…' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder:text-text-subtle focus:outline-none"
                />
              </div>
              {skillError && (
                <p className="mt-1 text-xs text-red-400">{skillError}</p>
              )}
              <p className="mt-1 text-xs text-text-subtle">
                Press Enter or comma to add. {skills.length}/10 added.
              </p>
            </div>

            {/* Project Idea */}
            <div>
              <label className="block text-xs font-semibold text-text-subtle mb-1.5 uppercase tracking-wide">
                Project Idea{' '}
                <span className="text-text-subtle font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                {...register('projectIdea')}
                rows={2}
                placeholder="Briefly describe the project idea…"
                className={cn(
                  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white placeholder:text-text-subtle resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50'
                )}
              />
              {errors.projectIdea && (
                <p className="mt-1 text-xs text-red-400">{errors.projectIdea.message}</p>
              )}
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-xs font-semibold text-text-subtle mb-1.5 uppercase tracking-wide">
                Max Members
              </label>
              <select
                {...register('maxMembers', { valueAsNumber: true })}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n} className="bg-surface">
                    {n} members
                  </option>
                ))}
              </select>
            </div>

            {serverError && (
              <p className="text-sm text-red-400 text-center">{serverError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg border border-border py-2 text-sm text-text-muted hover:text-white hover:border-border/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                Create Team
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
