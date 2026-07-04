import type { User } from '../user/types'

export type Message = {
  id: string
  channelId: string
  author: User
  content: string
  createdAt: string
}
