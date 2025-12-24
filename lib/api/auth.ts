import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { User } from '@/types'
import type { ApiResponse } from '@/types/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    )
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT)
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.REFRESH,
      { refreshToken }
    )
    return response.data
  },

  me: async () => {
    const response = await apiClient.get<User>(API_ENDPOINTS.ME)
    return response.data
  },
}
