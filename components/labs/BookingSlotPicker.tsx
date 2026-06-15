'use client'

import { useState, useEffect, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LabAvailability, TimeSlot } from '@/types/lab'

interface BookingSlotPickerProps {
  labSlug: string
  labId: string
  labName: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function isToday(dateStr: string): boolean {
  return toDateString(new Date()) === dateStr
}

function generateAllSlots(
  openTime: string,
  closeTime: string,
  slotDuration: number
): Array<{ startTime: string; endTime: string }> {
  const slots: Array<{ startTime: string; endTime: string }> = []
  const [oh, om] = openTime.split(':').map(Number)
  const [ch, cm] = closeTime.split(':').map(Number)
  let cur = oh * 60 + om
  const close = ch * 60 + cm
  while (cur + slotDuration <= close) {
    const fmt = (m: number) =>
      `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`
    slots.push({ startTime: fmt(cur), endTime: fmt(cur + slotDuration) })
    cur += slotDuration
  }
  return slots
}

export default function BookingSlotPicker({
  labSlug,
  labId,
  labName,
}: BookingSlotPickerProps) {
  const [availability, setAvailability] = useState<LabAvailability[]>([])
  const [labMeta, setLabMeta] = useState<{
    openTime: string
    closeTime: string
    slotDuration: number
  } | null>(null)
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  // 14 day date strip
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return toDateString(d)
  })

  const [selectedDate, setSelectedDate] = useState<string>(days[0])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [purpose, setPurpose] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState('')

  const fetchAvailability = useCallback(async () => {
    setFetchStatus('loading')
    try {
      const res = await fetch(`/api/labs/${labSlug}`)
      if (!res.ok) throw new Error('Failed')
      const data = (await res.json()) as {
        lab: { openTime: string; closeTime: string; slotDuration: number }
        availability: LabAvailability[]
      }
      setAvailability(data.availability)
      setLabMeta({
        openTime: data.lab.openTime,
        closeTime: data.lab.closeTime,
        slotDuration: data.lab.slotDuration,
      })
      setFetchStatus('idle')
    } catch {
      setFetchStatus('error')
    }
  }, [labSlug])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  // Get slots for selected date — fallback to all-available if date is beyond API window
  const slotsForDate: TimeSlot[] = (() => {
    const apiDay = availability.find((a) => a.date === selectedDate)
    if (apiDay) return apiDay.slots
    if (!labMeta) return []
    // Days 8-14: no bookings exist yet → all available
    return generateAllSlots(
      labMeta.openTime,
      labMeta.closeTime,
      labMeta.slotDuration
    ).map((s) => ({ ...s, available: true }))
  })()

  function handleSlotClick(slot: TimeSlot) {
    if (!slot.available) return
    setSelectedSlot(slot)
    setPurpose('')
    setSubmitState('idle')
    setSubmitError('')
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot) return
    setSubmitState('loading')
    setSubmitError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          labId,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          purpose,
        }),
      })

      if (res.status === 401) {
        setSubmitError('Please sign in to book a slot.')
        setSubmitState('error')
        return
      }
      if (res.status === 409) {
        setSubmitError('This slot was just taken. Please pick another.')
        setSubmitState('error')
        fetchAvailability() // refresh
        return
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setSubmitError(data.error ?? 'Something went wrong.')
        setSubmitState('error')
        return
      }

      setSubmitState('success')
      fetchAvailability()
    } catch {
      setSubmitError('Network error. Please try again.')
      setSubmitState('error')
    }
  }

  function handleModalClose() {
    setModalOpen(false)
    setSelectedSlot(null)
    setSubmitState('idle')
  }

  return (
    <div className="space-y-6">
      {/* ── Date strip ─────────────────────────────────────── */}
      <div>
        <p className="text-xs uppercase tracking-widest text-text-subtle mb-3">
          Select Date
        </p>
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2 w-max">
            {days.map((day) => {
              const today = isToday(day)
              const active = day === selectedDate
              const d = new Date(`${day}T12:00:00`)
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'flex flex-col items-center px-3 py-2.5 rounded-lg border text-xs transition-all duration-150 min-w-[52px]',
                    active
                      ? 'bg-primary border-primary text-white'
                      : 'bg-surface-2 border-border text-text-muted hover:border-primary/50'
                  )}
                >
                  <span className="font-semibold uppercase" style={{ fontSize: '10px' }}>
                    {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                  </span>
                  <span className="text-base font-bold leading-tight">
                    {d.getDate()}
                  </span>
                  {today && (
                    <span className="text-accent" style={{ fontSize: '9px' }}>
                      Today
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Slots grid ─────────────────────────────────────── */}
      <div>
        <p className="text-xs uppercase tracking-widest text-text-subtle mb-3">
          Available Slots — {formatDisplayDate(selectedDate)}
        </p>

        {fetchStatus === 'loading' && (
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 size={14} className="animate-spin" /> Loading slots…
          </div>
        )}

        {fetchStatus === 'error' && (
          <p className="text-sm text-accent-warm">Failed to load slots. Refresh to retry.</p>
        )}

        {fetchStatus === 'idle' && (
          <div className="flex flex-wrap gap-2">
            {slotsForDate.map((slot) => (
              <button
                key={slot.startTime}
                disabled={!slot.available}
                onClick={() => handleSlotClick(slot)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                  slot.available
                    ? 'bg-green-500/10 border-green-500/40 text-green-400 hover:bg-green-500/20'
                    : 'bg-surface border-border text-text-subtle line-through cursor-not-allowed'
                )}
              >
                {slot.startTime} – {slot.endTime}
              </button>
            ))}
            {slotsForDate.length === 0 && (
              <p className="text-sm text-text-subtle">No slots found for this date.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Booking Modal ───────────────────────────────────── */}
      <Dialog.Root open={modalOpen} onOpenChange={handleModalClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl',
              'focus:outline-none'
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="font-heading font-semibold text-white text-lg">
                Confirm Booking
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-text-muted hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            {submitState === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 size={40} className="text-green-400" />
                <p className="font-semibold text-white">Booking Requested!</p>
                <p className="text-sm text-text-muted text-center">
                  Your booking for {labName} on {formatDisplayDate(selectedDate)} at{' '}
                  {selectedSlot?.startTime} has been submitted for approval.
                </p>
                <button
                  onClick={handleModalClose}
                  className="mt-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Read-only info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-surface-2 border border-border px-3 py-2">
                    <p className="text-xs text-text-subtle mb-0.5">Date</p>
                    <p className="text-sm text-white font-medium">
                      {formatDisplayDate(selectedDate)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-2 border border-border px-3 py-2">
                    <p className="text-xs text-text-subtle mb-0.5">Time</p>
                    <p className="text-sm text-white font-medium">
                      {selectedSlot?.startTime} – {selectedSlot?.endTime}
                    </p>
                  </div>
                </div>

                {/* Purpose textarea */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">
                    Purpose <span className="text-accent-warm">*</span>
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    minLength={10}
                    maxLength={500}
                    rows={3}
                    placeholder="Describe your project or intended use…"
                    className={cn(
                      'w-full rounded-lg bg-surface-2 border border-border text-sm text-white',
                      'px-3 py-2 placeholder:text-text-subtle',
                      'focus:outline-none focus:border-primary/60 resize-none'
                    )}
                  />
                  <p className="text-xs text-text-subtle mt-1 text-right">
                    {purpose.length}/500
                  </p>
                </div>

                {submitState === 'error' && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === 'loading' || purpose.length < 10}
                  className={cn(
                    'w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity',
                    'bg-primary disabled:opacity-50'
                  )}
                >
                  {submitState === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Submitting…
                    </span>
                  ) : (
                    'Request Booking'
                  )}
                </button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
