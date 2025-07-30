/**
 * Reset Password Mutation Composable
 * Handles password reset with token with TanStack Vue Query
 */

import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { ResetPasswordPayload } from '../types'

import { authService } from '../services/auth.service'

export function useResetPasswordMutation() {
  return useMutation<void, AxiosError, ResetPasswordPayload>({
    mutationKey: ['auth', 'reset-password'],
    mutationFn: async (payload) => {
      await authService.resetPassword(payload)
    },
    onError(error: AxiosError) {
      console.error('[Auth] Reset password failed:', error.response?.data || error.message)
    },
  })
}
