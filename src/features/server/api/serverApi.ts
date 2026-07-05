import { apiClient } from '../../../shared/api/client'
import type { CreateServerRequest, Server, ServerMember, UpdateServerRequest } from '../types'

export async function fetchMyServers(): Promise<Server[]> {
  return apiClient.get('/api/v1/servers/me')
}

export async function fetchServerMembers(serverId: number): Promise<ServerMember[]> {
  return apiClient.get(`/api/v1/servers/${serverId}/members`)
}

export async function createServer(request: CreateServerRequest): Promise<Server> {
  return apiClient.post('/api/v1/servers', request)
}

export async function joinServerByInviteCode(code: string): Promise<ServerMember> {
  return apiClient.post('/api/v1/servers/join', null, { params: { code } })
}

export async function fetchPublicServers(): Promise<Server[]> {
  return apiClient.get('/api/v1/servers/public')
}

export async function joinPublicServer(serverId: number): Promise<ServerMember> {
  return apiClient.post(`/api/v1/servers/${serverId}/join`)
}

export async function updateServer(serverId: number, request: UpdateServerRequest): Promise<Server> {
  return apiClient.patch(`/api/v1/servers/${serverId}`, request)
}
