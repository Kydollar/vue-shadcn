/**
 * Logout Mutation Composable
 * Optimized logout with robust error handling and immediate response
 */

import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'
import { nextTick } from 'vue'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores'

/**
 * Enhanced logout mutation with immediate state clearing and robust error handling
 * Features:
 * - Immediate auth clearing for better UX
 * - Parallel API call for server cleanup
 * - Automatic redirect via auth state watcher
 * - Comprehensive error handling
 */
export function useLogoutMutation() {
  const authStore = useAuthStore()

  return useMutation<void, AxiosError>({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => {
      // Clear auth state immediately for instant UX response
      // This triggers the redirect watcher immediately
      const token = authStore.token
      authStore.clearAuth()

      // Ensure DOM update before API call
      await nextTick()

      try {
        // Call logout API in background for server cleanup
        if (token) {
          await authService.logout()
        }
      }
      catch (error) {
        // API failure doesn't affect logout - auth already cleared
        console.warn('[Auth] Logout API failed but auth cleared locally:', error)
      }
    },
    onSuccess() {
      if (import.meta.env.DEV) {
        // Development feedback for successful logout
        console.warn('[Auth] 🚪 Logout completed successfully')
      }
    },
    onError(error: AxiosError) {
      // This should rarely happen since we handle API errors in mutationFn
      console.error('[Auth] ❌ Unexpected logout error:', error)

      // Ensure auth is cleared even in unexpected scenarios
      authStore.clearAuth()
    },
    meta: {
      action: 'logout',
      timestamp: Date.now(),
      strategy: 'immediate-clear',
    },
  })
}
