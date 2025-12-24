export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',

  // Exercises
  EXERCISES: '/admin/exercises',
  EXERCISE_DETAIL: (id: string) => `/admin/exercises/${id}`,
  EXERCISE_SEED: '/admin/exercises/seed',
  EXERCISE_STATS: '/admin/exercises/stats',

  // Workouts
  WORKOUTS: '/admin/workouts',
  WORKOUT_DETAIL: (id: string) => `/admin/workouts/${id}`,
  WORKOUT_CREATE: '/admin/workouts',
  WORKOUT_UPDATE: (id: string) => `/admin/workouts/${id}`,
  WORKOUT_DELETE: (id: string) => `/admin/workouts/${id}`,

  // Users
  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  USER_UPDATE: (id: string) => `/admin/users/${id}`,
  USER_STATS: (id: string) => `/admin/users/${id}/stats`,

  // Analytics
  ANALYTICS_OVERVIEW: '/admin/analytics/overview',
  ANALYTICS_CHARTS: '/admin/analytics/charts',

  // Notifications
  NOTIFICATIONS: '/admin/notifications',
  NOTIFICATION_READ: (id: string) => `/admin/notifications/${id}/read`,
  NOTIFICATION_READ_ALL: '/admin/notifications/read-all',

  // Audit Logs
  AUDIT_LOGS: '/admin/audit-logs',
} as const

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'SportifyLife Admin',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 25, 50, 100],
}

export const BODY_PARTS = [
  'back',
  'cardio',
  'chest',
  'lower arms',
  'lower legs',
  'neck',
  'shoulders',
  'upper arms',
  'upper legs',
  'waist',
] as const

export const EQUIPMENT = [
  'assisted',
  'band',
  'barbell',
  'body weight',
  'bosu ball',
  'cable',
  'dumbbell',
  'elliptical machine',
  'ez barbell',
  'hammer',
  'kettlebell',
  'leverage machine',
  'medicine ball',
  'olympic barbell',
  'resistance band',
  'roller',
  'rope',
  'skierg machine',
  'sled machine',
  'smith machine',
  'stability ball',
  'stationary bike',
  'stepmill machine',
  'tire',
  'trap bar',
  'upper body ergometer',
  'weighted',
  'wheel roller',
] as const

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

export const USER_ROLES = ['admin', 'moderator', 'user'] as const

export const USER_STATUSES = ['active', 'inactive', 'banned'] as const
