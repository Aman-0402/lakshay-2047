export type LabCategory =
  | 'AI_ML'
  | 'ROBOTICS'
  | 'DESIGN'
  | 'HARDWARE'
  | 'MEDIA'
  | 'EXTENDED_REALITY'
  | 'CYBERSECURITY'
  | 'BIOTECH'

export interface Lab {
  id: string
  name: string
  slug: string
  description: string
  category: LabCategory
  capacity: number
  location: string
  equipment: string[]
  image: string | null
  model3dUrl: string | null
  isActive: boolean
  openTime: string
  closeTime: string
  slotDuration: number
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

export interface LabAvailability {
  date: string
  slots: TimeSlot[]
}

export interface LabWithAvailability {
  lab: Lab
  availability: LabAvailability[]
}
