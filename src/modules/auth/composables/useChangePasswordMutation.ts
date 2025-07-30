/**
 * Change Password Mutation Composable
 * Handles password change with TanStack Vue Query
 */

import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { ChangePasswordPayload } from '../types'

import { authService } from '../services/auth.service'

export function useChangePasswordMutation() {
  return useMutation<void, AxiosError, ChangePasswordPayload>({
    mutationKey: ['auth', 'change-password'],
    mutationFn: async (payload) => {
      await authService.changePassword(payload)
    },
    onError(error: AxiosError) {
      console.error('[Auth] Change password failed:', error.response?.data || error.message)
    },
  })
}
