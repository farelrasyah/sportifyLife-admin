import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

// Cookie helpers
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  refresh: (token: string) => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user, token, refreshToken) =>
        set((state) => {
          // Set cookie for middleware
          setCookie('sportify-auth-storage', 'authenticated')
          return {
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          }
        }),
      logout: () =>
        set((state) => {
          // Remove cookie
          deleteCookie('sportify-auth-storage')
          return {
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          }
        }),
      refresh: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'sportify-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
