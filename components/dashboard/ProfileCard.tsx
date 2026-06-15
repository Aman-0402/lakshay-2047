import Image from 'next/image'
import { User, Mail, Building2, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { UserProfile, UserRole } from '@/types/user'

const ROLE_CONFIG: Record<UserRole, { label: string; classes: string }> = {
  STUDENT: { label: 'Student', classes: 'bg-primary/15 text-primary' },
  FACULTY: { label: 'Faculty', classes: 'bg-accent/15 text-accent' },
  LAB_ADMIN: { label: 'Lab Admin', classes: 'bg-xr/15 text-xr' },
  SUPER_ADMIN: { label: 'Super Admin', classes: 'bg-cybersecurity/15 text-cybersecurity' },
}

interface ProfileCardProps {
  user: UserProfile
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const roleConf = ROLE_CONFIG[user.role as UserRole] ?? ROLE_CONFIG.STUDENT

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-6">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface border-2 border-primary/30 mb-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'User'}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={32} className="text-text-subtle" />
            </div>
          )}
        </div>
        <h2 className="font-heading font-semibold text-white text-lg leading-tight">
          {user.name ?? 'Anonymous'}
        </h2>
        <span
          className={cn(
            'mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
            roleConf.classes
          )}
        >
          {roleConf.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <Row icon={<Mail size={13} />} label="Email" value={user.email} />
        {user.department && (
          <Row icon={<Building2 size={13} />} label="Department" value={user.department} />
        )}
        {user.rollNumber && (
          <Row icon={<Hash size={13} />} label="Roll No." value={user.rollNumber} />
        )}
        {user.year && (
          <Row icon={<span className="text-xs font-bold">Y</span>} label="Year" value={`Year ${user.year}`} />
        )}
      </div>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 text-text-subtle shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-text-subtle">{label}</p>
        <p className="text-text truncate">{value}</p>
      </div>
    </div>
  )
}
