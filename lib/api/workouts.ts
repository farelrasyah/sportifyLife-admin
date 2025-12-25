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
    sets?: number
    reps?: string | number
    durationSeconds?: number
    restSeconds?: number
  }>
}

export const sanitizeCreateWorkoutPayload = (data: CreateWorkoutDTO): any => {
  const sanitized = {
    name: data.name,
    description: data.description,
    level: data.level.toLowerCase(),
    category: data.category.toLowerCase(),
    exercises: data.exercises.map(exercise => {
      const sanitizedExercise: any = {
        exerciseId: exercise.exerciseId,
        order: Number(exercise.order),
      }

      // Only include optional fields if they are defined and valid
      if (exercise.sets !== undefined && exercise.sets !== null && exercise.sets >= 1) {
        sanitizedExercise.sets = Number(exercise.sets)
      }

      if (exercise.reps !== undefined && exercise.reps !== null) {
        // If reps is string, try to parse it (e.g., '10-12' -> 10)
        const repsValue = typeof exercise.reps === 'string' 
          ? parseInt(exercise.reps.split('-')[0]) || parseInt(exercise.reps) 
          : Number(exercise.reps)
        if (repsValue >= 1) {
          sanitizedExercise.reps = repsValue
        }
      }

      if (exercise.durationSeconds !== undefined && exercise.durationSeconds !== null && exercise.durationSeconds >= 1) {
        sanitizedExercise.durationSeconds = Number(exercise.durationSeconds)
      }

      if (exercise.restSeconds !== undefined && exercise.restSeconds !== null && exercise.restSeconds >= 0) {
        sanitizedExercise.restSeconds = Number(exercise.restSeconds)
      }

      return sanitizedExercise
    })
  }

  return sanitized
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
    const sanitizedData = sanitizeCreateWorkoutPayload(data)
    console.log('📤 Sanitized payload being sent to API:', JSON.stringify(sanitizedData, null, 2))
    const response = await apiClient.post(
      API_ENDPOINTS.WORKOUT_CREATE,
      sanitizedData
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
