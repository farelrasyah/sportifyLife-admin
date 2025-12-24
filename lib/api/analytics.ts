import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { AnalyticsOverview, ChartData } from '@/types'

export interface AnalyticsFilters {
  startDate?: string
  endDate?: string
}

export const analyticsApi = {
  getOverview: async (filters?: AnalyticsFilters) => {
    const params = new URLSearchParams()
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<AnalyticsOverview>(
      `${API_ENDPOINTS.ANALYTICS_OVERVIEW}?${params.toString()}`
    )
    return response.data
  },

  getCharts: async (filters?: AnalyticsFilters) => {
    const params = new URLSearchParams()
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<ChartData>(
      `${API_ENDPOINTS.ANALYTICS_CHARTS}?${params.toString()}`
    )
    return response.data
  },
}
