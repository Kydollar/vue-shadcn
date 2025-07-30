/**
 * Register Mutation Composable
 * Handles user registration with TanStack Vue Query
 */

import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { AuthResponse, SignUpPayload } from '../types'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores'

export function useRegisterMutation() {
  const authStore = useAuthStore()

  return useMutation<
    AuthResponse,
    AxiosError,
    SignUpPayload & { rememberMe?: boolean }
  >({
    mutationKey: ['auth', 'register'],
    mutationFn: async ({ rememberMe, ...registerData }) => {
      return await authService.register(registerData)
    },
    onSuccess(data, variables) {
      const rememberMe = variables.rememberMe ?? false
      authStore.setAuth(data.token, data.user, rememberMe)
    },
    onError(error: AxiosError) {
      console.error('[Auth] Registration failed:', error.response?.data || error.message)
    },
  })
}
