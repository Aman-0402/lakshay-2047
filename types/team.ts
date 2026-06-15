export interface TeamMemberUser {
  id: string
  name: string | null
  image: string | null
}

export interface SerializedTeamMember {
  id: string
  teamId: string
  userId: string
  isLeader: boolean
  joinedAt: string
  user: TeamMemberUser
}

export interface SerializedTeam {
  id: string
  name: string
  description: string
  skills: string[]
  projectIdea: string | null
  isOpen: boolean
  maxMembers: number
  createdAt: string
  updatedAt: string
  members: SerializedTeamMember[]
}
