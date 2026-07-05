import { apiClient } from '../../../shared/api/client'
import type { User } from '../types'

export async function fetchMe(): Promise<User> {
  return apiClient.get('/api/v1/users/me')
}
