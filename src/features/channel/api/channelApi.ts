import { apiClient } from '../../../shared/api/client'
import type { Category, Channel, CreateCategoryRequest, CreateChannelRequest, UpdateCategoryRequest } from '../types'

export async function fetchChannels(serverId: number): Promise<Channel[]> {
  return apiClient.get(`/api/v1/servers/${serverId}/channels`)
}

export async function createChannel(serverId: number, request: CreateChannelRequest): Promise<Channel> {
  return apiClient.post(`/api/v1/servers/${serverId}/channels`, request)
}

export async function deleteChannel(channelId: number): Promise<void> {
  return apiClient.delete(`/api/v1/channels/${channelId}`)
}

export async function fetchCategories(serverId: number): Promise<Category[]> {
  return apiClient.get(`/api/v1/servers/${serverId}/categories`)
}

export async function createCategory(serverId: number, request: CreateCategoryRequest): Promise<Category> {
  return apiClient.post(`/api/v1/servers/${serverId}/categories`, request)
}

export async function updateCategory(categoryId: number, request: UpdateCategoryRequest): Promise<Category> {
  return apiClient.patch(`/api/v1/channels/categories/${categoryId}`, request)
}

export async function deleteCategory(categoryId: number): Promise<void> {
  return apiClient.delete(`/api/v1/channels/categories/${categoryId}`)
}
