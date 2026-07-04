export type UserStatus = 'ONLINE' | 'IDLE' | 'DND' | 'OFFLINE'

export type User = {
  id: string
  username: string
  avatarUrl?: string
  status: UserStatus
}
