export type Server = {
  id: number
  ownerId: number
  name: string
  description: string | null
  iconUrl: string | null
  inviteCode: string | null
  isPublic: boolean
  createdAt: string
}

export type ServerMember = {
  id: number
  userId: number
  externalId: string
  nickname: string | null
  joinedAt: string
}

export type CreateServerRequest = {
  name: string
  description?: string
  isPublic: boolean
}

export type UpdateServerRequest = {
  name: string
  description?: string
  isPublic: boolean
}
