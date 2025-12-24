import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { AuditLog, AuditLogFilters } from '@/types'
import type { PaginatedResponse } from '@/types/api'

export const auditLogsApi = {
  getAuditLogs: async (filters?: AuditLogFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.userId) params.append('userId', filters.userId)
    if (filters?.action) params.append('action', filters.action)
    if (filters?.resource) params.append('resource', filters.resource)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<PaginatedResponse<AuditLog>>(
      `${API_ENDPOINTS.AUDIT_LOGS}?${params.toString()}`
    )
    return response.data
  },
}
