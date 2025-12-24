import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { Workout, WorkoutFilters } from '@/types'
import type { PaginatedResponse } from '@/types/api'

export interface CreateWorkoutDTO {
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  exercises: Array<{
    exerciseId: string
    sets: number
    reps: string
    rest: number
    notes?: string
    order: number
  }>
  category?: string
  tags?: string[]
  imageUrl?: string
}

export const workoutsApi = {
  getWorkouts: async (filters?: WorkoutFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.difficulty) params.append('difficulty', filters.difficulty)
    if (filters?.category) params.append('category', filters.category)

    const response = await apiClient.get<PaginatedResponse<Workout>>(
      `${API_ENDPOINTS.WORKOUTS}?${params.toString()}`
    )
    return response.data
  },

  getWorkout: async (id: string) => {
    const response = await apiClient.get<Workout>(
      API_ENDPOINTS.WORKOUT_DETAIL(id)
    )
    return response.data
  },

  createWorkout: async (data: CreateWorkoutDTO) => {
    const response = await apiClient.post<Workout>(
      API_ENDPOINTS.WORKOUT_CREATE,
      data
    )
    return response.data
  },

  updateWorkout: async (id: string, data: Partial<CreateWorkoutDTO>) => {
    const response = await apiClient.put<Workout>(
      API_ENDPOINTS.WORKOUT_UPDATE(id),
      data
    )
    return response.data
  },

  deleteWorkout: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.WORKOUT_DELETE(id))
    return response.data
  },
}
