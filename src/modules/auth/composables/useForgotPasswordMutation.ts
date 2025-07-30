/**
 * Forgot Password Mutation Composable
 * Handles forgot password request with TanStack Vue Query
 */

import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { ForgotPasswordPayload } from '../types'

import { authService } from '../services/auth.service'

export function useForgotPasswordMutation() {
  return useMutation<void, AxiosError, ForgotPasswordPayload>({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: async (payload) => {
      await authService.forgotPassword(payload)
    },
    onError(error: AxiosError) {
      console.error('[Auth] Forgot password failed:', error.response?.data || error.message)
    },
  })
}
