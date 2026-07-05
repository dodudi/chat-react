import type { DisplayUser } from '../user/types'

export type MessageType = 'DEFAULT' | 'REPLY' | 'SYSTEM'

export type MessageResponse = {
  id: number
  channelId: number
  senderId: number
  senderExternalId: string
  content: string
  type: MessageType
  parentMessageId: number | null
  isEdited: boolean
  deletedAt: string | null
  createdAt: string
}

export type Message = MessageResponse & {
  author: DisplayUser
}

export type ChannelSocketEvent =
  | { type: 'MESSAGE_CREATED'; data: MessageResponse }
  | { type: 'MESSAGE_EDITED'; data: MessageResponse }
  | { type: 'MESSAGE_DELETED'; data: number }
