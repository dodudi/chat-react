import { apiClient } from '../../../shared/api/client'
import type { FriendRequest, Friendship } from '../types'

export async function fetchFriends(): Promise<Friendship[]> {
  return apiClient.get('/api/v1/friends')
}

export async function sendFriendRequest(receiverId: number): Promise<FriendRequest> {
  return apiClient.post('/api/v1/friends/requests', { receiverId })
}

export async function fetchReceivedFriendRequests(): Promise<FriendRequest[]> {
  return apiClient.get('/api/v1/friends/requests/received')
}

export async function fetchSentFriendRequests(): Promise<FriendRequest[]> {
  return apiClient.get('/api/v1/friends/requests/sent')
}

export async function acceptFriendRequest(requestId: number): Promise<FriendRequest> {
  return apiClient.post(`/api/v1/friends/requests/${requestId}/accept`)
}

export async function rejectFriendRequest(requestId: number): Promise<FriendRequest> {
  return apiClient.post(`/api/v1/friends/requests/${requestId}/reject`)
}

export async function cancelFriendRequest(requestId: number): Promise<void> {
  return apiClient.delete(`/api/v1/friends/requests/${requestId}`)
}
