import { apiClient } from '../../../shared/api/client'
import type { MessageResponse } from '../types'

type FetchMessagesParams = {
  before?: number
  limit?: number
}

export async function fetchMessages(channelId: number, params: FetchMessagesParams = {}): Promise<MessageResponse[]> {
  return apiClient.get(`/api/v1/channels/${channelId}/messages`, { params })
}

export async function sendMessage(channelId: number, content: string): Promise<MessageResponse> {
  return apiClient.post(`/api/v1/channels/${channelId}/messages`, { content, type: 'DEFAULT' })
}
