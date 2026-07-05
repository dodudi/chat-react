export type ChannelType = 'TEXT' | 'VOICE' | 'ANNOUNCEMENT' | 'FORUM'

export type Channel = {
  id: number
  serverId: number
  categoryId: number | null
  name: string
  description: string | null
  type: ChannelType
  position: number
  isNsfw: boolean
  slowmodeSeconds: number
  createdAt: string
}

export type CreateChannelRequest = {
  name: string
  type: ChannelType
  description?: string
  categoryId?: number | null
  position: number
}
