// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'moderator' | 'user'
  status: 'active' | 'inactive' | 'banned'
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
  profile?: UserProfile
}

export interface UserProfile {
  age?: number
  weight?: number
  height?: number
  gender?: 'male' | 'female' | 'other'
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness'
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  preferences?: {
    workoutFrequency?: string
    dietType?: string
  }
}

export interface UserStats {
  totalWorkouts: number
  totalExercises: number
  currentStreak: number
  longestStreak: number
  lastWorkoutDate?: string
}

// Exercise Types
export interface Exercise {
  id: string
  name: string
  bodyPart: string
  equipment: string
  target: string
  secondaryMuscles?: string[]
  instructions: string[]
  gifUrl: string
  tips?: string[]
  variations?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
}

export interface ExerciseFilters {
  search?: string
  bodyPart?: string
  equipment?: string
  target?: string
  difficulty?: string
  page?: number
  limit?: number
}

export interface ExerciseStats {
  totalExercises: number
  lastSeeded?: string
  seedStatus: 'idle' | 'running' | 'completed' | 'failed'
  bodyParts: Record<string, number>
  equipment: Record<string, number>
}

// Workout Types
export interface Workout {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  exercises: WorkoutExercise[]
  category?: string
  tags?: string[]
  imageUrl?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface WorkoutExercise {
  exerciseId: string
  exercise?: Exercise
  name?: string
  sets: number
  reps: string
  rest: number
  notes?: string
  order: number
}

export interface WorkoutFilters {
  search?: string
  difficulty?: string
  category?: string
  page?: number
  limit?: number
}

// Notification Types
export interface Notification {
  id: string
  type: 'system' | 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  status: 'read' | 'unread'
  link?: string
  createdAt: string
  readAt?: string
}

// Audit Log Types
export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface AuditLogFilters {
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// Analytics Types
export interface AnalyticsOverview {
  totalUsers: number
  activeUsers: number
  totalExercises: number
  totalWorkouts: number
  userGrowth: {
    thisMonth: number
    lastMonth: number
    growth: number
  }
  workoutStats: {
    completed: number
    inProgress: number
    abandoned: number
  }
  exerciseStats: {
    mostPopular: Array<{ name: string; count: number }>
  }
}

export interface ChartData {
  userActivity: Array<{ date: string; activeUsers: number }>
  exerciseDistribution: Array<{ bodyPart: string; count: number }>
  workoutPopularity: Array<{ name: string; completions: number }>
}
