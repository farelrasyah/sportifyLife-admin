import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { PaginatedResponse } from '@/types/api'

export interface Exercise {
  id: string
  name: string
  exerciseType: string
  bodyParts: string[]
  equipments: string[]
  targetMuscles: string[]
  secondaryMuscles?: string[]
  imageUrl: string
  videoUrl?: string
  overview?: string
  instructions?: Array<{ stepNumber: number; text: string }>
  tips?: Array<{ text: string }>
  variations?: Array<{ text: string }>
  createdAt: string
  updatedAt: string
}

export interface ExerciseFilters {
  page?: number
  limit?: number
  search?: string
  bodyPart?: string
  equipment?: string
  target?: string
}

export interface ExerciseStats {
  totalExercises: number
  bodyParts: Record<string, number>
  equipment: Record<string, number>
  targetMuscles: Record<string, number>
}

export const exercisesApi = {
  getExercises: async (filters?: ExerciseFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.bodyPart) params.append('bodyPart', filters.bodyPart)
    if (filters?.equipment) params.append('equipment', filters.equipment)
    if (filters?.target) params.append('target', filters.target)

    const response = await apiClient.get(
      `${API_ENDPOINTS.EXERCISES}?${params.toString()}`
    )
    return response.data
  },

  getExercise: async (id: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.EXERCISE_DETAIL(id)
    )
    return response.data
  },

  seedExercises: async (limit?: number) => {
    const params = limit ? `?limit=${limit}` : ''
    const response = await apiClient.post(
      `${API_ENDPOINTS.EXERCISE_SEED}${params}`
    )
    return response.data
  },

  getExerciseStats: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.EXERCISE_STATS
    )
    return response.data
  },
}
