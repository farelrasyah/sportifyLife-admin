import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { Notification } from '@/types'
import type { PaginatedResponse } from '@/types/api'

export interface NotificationFilters {
  page?: number
  limit?: number
  status?: 'read' | 'unread'
}

export const notificationsApi = {
  getNotifications: async (filters?: NotificationFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)

    const response = await apiClient.get<PaginatedResponse<Notification>>(
      `${API_ENDPOINTS.NOTIFICATIONS}?${params.toString()}`
    )
    return response.data
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION_READ(id))
    return response.data
  },

  markAllAsRead: async () => {
    const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION_READ_ALL)
    return response.data
  },
}
