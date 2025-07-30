/**
 * Logout Mutation Composable
 * Handles user logout with TanStack Vue Query
 */

import type { AxiosError } from 'axios'
import type { Router } from 'vue-router'

import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

import { AUTH_ROUTES } from '../constants'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores'

export function useLogoutMutation(customRouter?: Router) {
  const authStore = useAuthStore()
  const router = customRouter || useRouter()

  return useMutation<void, AxiosError>({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => {
      await authService.logout()
    },
    onSuccess() {
      authStore.clearAuth()

      // Redirect to login page after successful logout
      try {
        router.push(AUTH_ROUTES.LOGIN)
      }
      catch (error) {
        // Fallback redirect using window.location
        console.warn('[Auth] Router push failed, using fallback redirect:', error)
        window.location.href = AUTH_ROUTES.LOGIN
      }
    },
    onError(error: AxiosError) {
      console.error('[Auth] Logout failed:', error.response?.data || error.message)
      // Still clear auth on error to ensure user is logged out locally
      authStore.clearAuth()

      // Redirect to login page even on error
      try {
        router.push(AUTH_ROUTES.LOGIN)
      }
      catch (routerError) {
        // Fallback redirect using window.location
        console.warn('[Auth] Router push failed, using fallback redirect:', routerError)
        window.location.href = AUTH_ROUTES.LOGIN
      }
    },
    onSettled() {
      // Ensure redirect happens regardless of success/error
      // This is a fallback in case onSuccess/onError don't execute
      setTimeout(() => {
        if (!authStore.isAuthenticated) {
          try {
            router.push(AUTH_ROUTES.LOGIN)
          }
          catch {
            // Final fallback redirect
            window.location.href = AUTH_ROUTES.LOGIN
          }
        }
      }, 100)
    },
  })
}
