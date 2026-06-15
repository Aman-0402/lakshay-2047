'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/constants'
import type { LabCategory } from '@/types/lab'

interface FilterItem {
  value: LabCategory | null
  label: string
  color: string | null
}

const FILTER_ITEMS: FilterItem[] = [
  { value: null, label: 'All Labs', color: null },
  ...CATEGORY_ORDER.map((cat) => ({
    value: cat,
    label: CATEGORY_LABELS[cat],
    color: CATEGORY_COLORS[cat],
  })),
]

interface LabFilterProps {
  active: LabCategory | null
  onFilterChange: (category: LabCategory | null) => void
}

export default function LabFilter({ active, onFilterChange }: LabFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex gap-2 w-max px-1">
        {FILTER_ITEMS.map((item) => {
          const isActive = active === item.value
          return (
            <button
              key={item.value ?? 'all'}
              onClick={() => onFilterChange(item.value)}
              className={cn(
                'relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap',
                isActive ? 'text-white' : 'text-text-muted hover:text-white'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: item.color ?? 'var(--color-primary)',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-full border border-border"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
