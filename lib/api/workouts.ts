import { apiClient } from './client'
import { API_ENDPOINTS } from '@/lib/config/constants'
import type { PaginatedResponse } from '@/types/api'

export interface Workout {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  description: string
  exercises: WorkoutExercise[]
  createdAt: string
  updatedAt: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  exerciseName?: string
  order: number
  sets: number
  reps?: string
  durationSeconds?: number
  restSeconds: number
}

export interface WorkoutFilters {
  page?: number
  limit?: number
  search?: string
  level?: string
  category?: string
}

export interface CreateWorkoutDTO {
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  exercises: Array<{
    exerciseId: string
    order: number
    sets: number
    reps?: string
    durationSeconds?: number
    restSeconds: number
  }>
}

export const workoutsApi = {
  getWorkouts: async (filters?: WorkoutFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.level) params.append('level', filters.level)
    if (filters?.category) params.append('category', filters.category)

    const response = await apiClient.get(
      `${API_ENDPOINTS.WORKOUTS}?${params.toString()}`
    )
    return response.data
  },

  getWorkout: async (id: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.WORKOUT_DETAIL(id)
    )
    return response.data
  },

  createWorkout: async (data: CreateWorkoutDTO) => {
    const response = await apiClient.post(
      API_ENDPOINTS.WORKOUT_CREATE,
      data
    )
    return response.data
  },

  updateWorkout: async (id: string, data: Partial<CreateWorkoutDTO>) => {
    const response = await apiClient.put(
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
