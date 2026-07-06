import { apiClient } from '../../../shared/api/client'
import type { User, UserStatus } from '../types'

export async function fetchMe(): Promise<User> {
  return apiClient.get('/api/v1/users/me')
}

export async function updateMyStatus(status: UserStatus): Promise<User> {
  return apiClient.patch('/api/v1/users/me/status', { status })
}
