import type { DisplayUser } from '../user/types'

export type DmChannelType = 'DIRECT' | 'GROUP'

export type DmChannelResponse = {
  id: number
  type: DmChannelType
  name: string | null
  iconUrl: string | null
  createdAt: string
}

// 백엔드가 참가자 목록을 내려주지 않아 DIRECT 채널의 상대방은 최근 메시지에서 프론트가 직접 추론한다
export type DmChannel = DmChannelResponse & {
  peer: DisplayUser | null
}

export type DmMessageResponse = {
  id: number
  dmChannelId: number
  senderId: number
  senderExternalId: string
  content: string
  parentMessageId: number | null
  isEdited: boolean
  createdAt: string
}

export type DmMessage = DmMessageResponse & { author: DisplayUser }

export type DmSocketEvent =
  | { type: 'MESSAGE_CREATED'; data: DmMessageResponse }
  | { type: 'MESSAGE_EDITED'; data: DmMessageResponse }
  | { type: 'MESSAGE_DELETED'; data: number }

export type CreateGroupDmRequest = {
  name: string
  participantIds: number[]
}
