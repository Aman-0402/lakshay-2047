import type { LabCategory } from '@/types/lab'

export const CATEGORY_LABELS: Record<LabCategory, string> = {
  AI_ML: 'AI / ML',
  ROBOTICS: 'Robotics',
  DESIGN: 'Design',
  HARDWARE: 'Hardware',
  MEDIA: 'Media',
  EXTENDED_REALITY: 'XR',
  CYBERSECURITY: 'Cybersecurity',
  BIOTECH: 'Biotech',
}

export const CATEGORY_COLORS: Record<LabCategory, string> = {
  AI_ML: '#6C63FF',
  ROBOTICS: '#00D4FF',
  DESIGN: '#FF6B6B',
  HARDWARE: '#FFB347',
  MEDIA: '#4ECDC4',
  EXTENDED_REALITY: '#A855F7',
  CYBERSECURITY: '#22C55E',
  BIOTECH: '#F97316',
}

export const CATEGORY_ORDER: LabCategory[] = [
  'AI_ML',
  'ROBOTICS',
  'DESIGN',
  'HARDWARE',
  'MEDIA',
  'EXTENDED_REALITY',
  'CYBERSECURITY',
  'BIOTECH',
]
