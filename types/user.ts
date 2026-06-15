export type UserRole = 'STUDENT' | 'FACULTY' | 'LAB_ADMIN' | 'SUPER_ADMIN'

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  rollNumber: string | null
  department: string | null
  year: number | null
}
