import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/types/booking'

// ── Generic Badge ────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variant === 'default' && 'bg-primary/15 text-primary',
        variant === 'outline' && 'border border-border text-text-muted',
        className
      )}
    >
      {children}
    </span>
  )
}

// ── Status Badge ─────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; classes: string }
> = {
  PENDING: {
    label: 'Pending',
    classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  },
  CONFIRMED: {
    label: 'Confirmed',
    classes: 'bg-green-500/15 text-green-400 border border-green-500/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    classes: 'bg-red-500/10 text-red-400/70 border border-red-500/15',
  },
  COMPLETED: {
    label: 'Completed',
    classes: 'bg-surface-2 text-text-muted border border-border',
  },
}

interface StatusBadgeProps {
  status: BookingStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, classes } = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        classes,
        className
      )}
    >
      {label}
    </span>
  )
}
