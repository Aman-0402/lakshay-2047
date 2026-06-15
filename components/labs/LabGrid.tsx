'use client'

import { AnimatePresence, motion } from 'framer-motion'
import LabCard from './LabCard'
import type { Lab, LabCategory } from '@/types/lab'

interface LabGridProps {
  labs: Lab[]
  activeFilter: LabCategory | null
}

export default function LabGrid({ labs, activeFilter }: LabGridProps) {
  const filtered = activeFilter
    ? labs.filter((l) => l.category === activeFilter)
    : labs

  return (
    <div className="flex flex-wrap gap-6 justify-start">
      <AnimatePresence mode="popLayout">
        {filtered.map((lab) => (
          <motion.div
            key={lab.id}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <LabCard lab={lab} />
          </motion.div>
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-muted text-sm py-12 w-full text-center"
        >
          No labs in this category yet.
        </motion.p>
      )}
    </div>
  )
}
