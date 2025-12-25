import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { PaginatedResponse } from '@/types/api'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name?: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  isVerified: boolean
  provider: string
  createdAt: string
  updatedAt: string
  profile?: UserProfile
  goal?: string
  goalHistory?: any[]
}

export interface UserProfile {
  age?: number
  weight?: number
  height?: number
  gender?: 'male' | 'female' | 'other'
  bmi?: number
  profileImageUrl?: string
}

export interface UserStats {
  totalWorkouts: number
  totalExercises: number
  currentStreak: number
  longestStreak: number
  weight?: number
  height?: number
  bmi?: number
  bmiCategory?: string
}

export interface UserFilters {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export const usersApi = {
  getUsers: async (filters?: UserFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.role) params.append('role', filters.role)
    if (filters?.status) params.append('status', filters.status)

    const response = await apiClient.get(
      `${API_ENDPOINTS.USERS}?${params.toString()}`
    )
    return response.data
  },

  getUser: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.USER_DETAIL(id))
    return response.data
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put(
      API_ENDPOINTS.USER_UPDATE(id),
      data
    )
    return response.data
  },

  getUserStats: async (id: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.USER_STATS(id)
    )
    return response.data
  },
}
