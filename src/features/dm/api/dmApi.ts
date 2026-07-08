import { apiClient } from '../../../shared/api/client'
import type { CreateGroupDmRequest, DmChannelResponse, DmMessageResponse } from '../types'

type FetchDmMessagesParams = {
  before?: number
  limit?: number
}

export async function fetchDmChannels(): Promise<DmChannelResponse[]> {
  return apiClient.get('/api/v1/dm/channels')
}

export async function createDirectDm(targetUserId: number): Promise<DmChannelResponse> {
  return apiClient.post('/api/v1/dm/channels/direct', { targetUserId })
}

export async function createGroupDm(request: CreateGroupDmRequest): Promise<DmChannelResponse> {
  return apiClient.post('/api/v1/dm/channels/group', request)
}

export async function leaveDmChannel(channelId: number): Promise<void> {
  return apiClient.delete(`/api/v1/dm/channels/${channelId}/leave`)
}

export async function fetchDmMessages(
  channelId: number,
  params: FetchDmMessagesParams = {},
): Promise<DmMessageResponse[]> {
  return apiClient.get(`/api/v1/dm/channels/${channelId}/messages`, { params })
}

export async function sendDmMessage(channelId: number, content: string): Promise<DmMessageResponse> {
  return apiClient.post(`/api/v1/dm/channels/${channelId}/messages`, { content })
}
