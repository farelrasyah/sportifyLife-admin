import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { Exercise, ExerciseFilters, ExerciseStats } from '@/types'
import type { PaginatedResponse } from '@/types/api'

export const exercisesApi = {
  getExercises: async (filters?: ExerciseFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.bodyPart) params.append('bodyPart', filters.bodyPart)
    if (filters?.equipment) params.append('equipment', filters.equipment)
    if (filters?.target) params.append('target', filters.target)
    if (filters?.difficulty) params.append('difficulty', filters.difficulty)

    const response = await apiClient.get<PaginatedResponse<Exercise>>(
      `${API_ENDPOINTS.EXERCISES}?${params.toString()}`
    )
    return response.data
  },

  getExercise: async (id: string) => {
    const response = await apiClient.get<Exercise>(
      API_ENDPOINTS.EXERCISE_DETAIL(id)
    )
    return response.data
  },

  seedExercises: async (options?: { force?: boolean; limit?: number }) => {
    const response = await apiClient.post(API_ENDPOINTS.EXERCISE_SEED, options)
    return response.data
  },

  getExerciseStats: async () => {
    const response = await apiClient.get<ExerciseStats>(
      API_ENDPOINTS.EXERCISE_STATS
    )
    return response.data
  },
}
