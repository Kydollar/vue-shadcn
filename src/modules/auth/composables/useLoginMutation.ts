/**
 * Login Mutation Composable
 * Handles user login with TanStack Vue Query
 */

import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { AuthResponse, LoginPayload } from '../types'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores'

export function useLoginMutation() {
  const authStore = useAuthStore()

  return useMutation<
    AuthResponse,
    AxiosError,
    LoginPayload & { rememberMe?: boolean }
  >({
    mutationKey: ['auth', 'login'],
    mutationFn: async ({ rememberMe, ...loginData }) => {
      return await authService.login(loginData)
    },
    onSuccess(data, variables) {
      const rememberMe = variables.rememberMe ?? false
      authStore.setAuth(data.token, data.user, rememberMe)
    },
    onError(error: AxiosError) {
      console.error('[Auth] Login failed:', error.response?.data || error.message)
      authStore.clearAuth()
    },
  })
}
