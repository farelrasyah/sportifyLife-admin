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
  isActive: boolean
  provider: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  profile?: UserProfile
  goal?: string
  goalHistory?: any[]
  roles?: Role[]
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

export interface CreateUserPayload {
  email: string
  firstName: string
  lastName: string
  password?: string
  role?: 'admin' | 'user'
  sendInvitation?: boolean
}

export interface UpdateUserPayload {
  email?: string
  firstName?: string
  lastName?: string
  role?: 'admin' | 'user'
  isActive?: boolean
}

export interface ResetPasswordPayload {
  newPassword: string
}

export interface AssignRolesPayload {
  roleNames: string[]
}

export interface Role {
  id: string
  name: string
  description?: string
  isSystem: boolean
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export const usersApi = {
  // Get list of users with filters
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

  // Get user by ID
  getUser: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.USER_DETAIL(id))
    return response.data
  },

  // Create new user
  createUser: async (data: CreateUserPayload) => {
    console.log('🔧 [API] createUser called with data:', {
      ...data,
      password: data.password ? '[HIDDEN]' : 'empty'
    })
    console.log('🌐 [API] Making POST request to:', API_ENDPOINTS.USER_CREATE)
    console.log('📊 [API] Request payload:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password ? '[HIDDEN]' : 'empty',
      role: data.role,
      sendInvitation: data.sendInvitation
    })

    const startTime = Date.now()
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.USER_CREATE,
        data
      )
      const endTime = Date.now()

      console.log('✅ [API] createUser request successful')
      console.log('⏱️ [API] Request duration:', endTime - startTime, 'ms')
      console.log('📥 [API] Response status:', response.status)
      console.log('📦 [API] Response data:', response.data)
      console.log('👤 [API] Created user ID:', response.data?.data?.id)

      return response.data
    } catch (error: any) {
      const endTime = Date.now()
      console.error('❌ [API] createUser request failed')
      console.error('⏱️ [API] Request duration before failure:', endTime - startTime, 'ms')
      console.error('🔍 [API] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      throw error
    }
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserPayload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.USER_UPDATE(id),
      data
    )
    return response.data
  },

  // Get user statistics
  getUserStats: async (id: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.USER_STATS(id)
    )
    return response.data
  },

  // Reset user password (Admin action)
  resetPassword: async (id: string, data: ResetPasswordPayload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.USER_RESET_PASSWORD(id),
      data
    )
    return response.data
  },

  // Suspend user account
  suspendUser: async (id: string) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.USER_SUSPEND(id)
    )
    return response.data
  },

  // Activate user account
  activateUser: async (id: string) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.USER_ACTIVATE(id)
    )
    return response.data
  },

  // Soft delete user (can be restored)
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.USER_DELETE(id)
    )
    return response.data
  },

  // Permanently delete user (irreversible)
  permanentDeleteUser: async (id: string) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.USER_DELETE_PERMANENT(id)
    )
    return response.data
  },

  // Restore soft-deleted user
  restoreUser: async (id: string) => {
    const response = await apiClient.post(
      API_ENDPOINTS.USER_RESTORE(id)
    )
    return response.data
  },

  // Get list of deleted users
  getDeletedUsers: async (filters?: UserFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)

    const response = await apiClient.get(
      `${API_ENDPOINTS.USERS_DELETED_LIST}?${params.toString()}`
    )
    return response.data
  },

  // Assign custom roles to user
  assignRoles: async (id: string, data: AssignRolesPayload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.USER_ASSIGN_ROLES(id),
      data
    )
    return response.data
  },
}
