'use client'

import { useState } from 'react'
import LabFilter from './LabFilter'
import LabGrid from './LabGrid'
import type { Lab, LabCategory } from '@/types/lab'

interface LabsViewProps {
  labs: Lab[]
}

export default function LabsView({ labs }: LabsViewProps) {
  const [activeFilter, setActiveFilter] = useState<LabCategory | null>(null)

  return (
    <div className="space-y-8">
      <LabFilter active={activeFilter} onFilterChange={setActiveFilter} />
      <LabGrid labs={labs} activeFilter={activeFilter} />
    </div>
  )
}
