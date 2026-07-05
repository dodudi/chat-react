import { apiClient } from '../../../shared/api/client'
import type { Channel, CreateChannelRequest } from '../types'

export async function fetchChannels(serverId: number): Promise<Channel[]> {
  return apiClient.get(`/api/v1/servers/${serverId}/channels`)
}

export async function createChannel(serverId: number, request: CreateChannelRequest): Promise<Channel> {
  return apiClient.post(`/api/v1/servers/${serverId}/channels`, request)
}

export async function deleteChannel(channelId: number): Promise<void> {
  return apiClient.delete(`/api/v1/channels/${channelId}`)
}
