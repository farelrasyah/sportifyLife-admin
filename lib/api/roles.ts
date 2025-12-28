import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { Role, Permission } from './users'

export interface CreateRolePayload {
  name: string
  description?: string
  permissionNames: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permissionNames?: string[]
}

export interface CreatePermissionPayload {
  name: string
  resource: string
  action: string
  description?: string
}

export interface UpdatePermissionPayload {
  name?: string
  resource?: string
  action?: string
  description?: string
}

export interface GroupedPermissions {
  [resource: string]: Permission[]
}

export const rolesApi = {
  // ========== ROLES MANAGEMENT ==========
  
  // Get all roles with their permissions
  getRoles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ROLES)
    return response.data
  },

  // Get role details by ID
  getRole: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.ROLE_DETAIL(id))
    return response.data
  },

  // Create new custom role
  createRole: async (data: CreateRolePayload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROLE_CREATE,
      data
    )
    return response.data
  },

  // Update existing role
  updateRole: async (id: string, data: UpdateRolePayload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ROLE_UPDATE(id),
      data
    )
    return response.data
  },

  // Delete custom role
  deleteRole: async (id: string) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ROLE_DELETE(id)
    )
    return response.data
  },

  // ========== PERMISSIONS MANAGEMENT ==========

  // Get all available permissions
  getAllPermissions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS_ALL)
    return response.data
  },

  // Get permissions grouped by resource
  getGroupedPermissions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS_GROUPED)
    return response.data
  },

  // Create new permission
  createPermission: async (data: CreatePermissionPayload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PERMISSION_CREATE,
      data
    )
    return response.data
  },

  // Update permission
  updatePermission: async (id: string, data: UpdatePermissionPayload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.PERMISSION_UPDATE(id),
      data
    )
    return response.data
  },

  // Delete permission
  deletePermission: async (id: string) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PERMISSION_DELETE(id)
    )
    return response.data
  },
}
