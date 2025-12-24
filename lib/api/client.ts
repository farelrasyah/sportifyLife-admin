import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/lib/stores/auth-store'
import { APP_CONFIG } from '@/lib/config/constants'
import type { ApiResponse, ApiError } from '@/types/api'

const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const response = await axios.post<ApiResponse<{ token: string }>>(
            `${APP_CONFIG.apiBaseUrl}/auth/refresh`,
            { refreshToken }
          )

          const { token } = response.data.data!
          useAuthStore.getState().refresh(token)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }

          return api.request(originalRequest)
        } catch (refreshError) {
          useAuthStore.getState().logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      } else {
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    // Transform error to ApiError format
    const apiError: ApiError = {
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      details: error.response?.data?.error?.details,
    }

    return Promise.reject(apiError)
  }
)

export default api

// Helper functions for common HTTP methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.get<ApiResponse<T>>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post<ApiResponse<T>>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put<ApiResponse<T>>(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch<ApiResponse<T>>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.delete<ApiResponse<T>>(url, config),
}
