/**
 * Profile Query Composable
 * Handles fetching user profile with TanStack Vue Query
 */

import type { AxiosError } from 'axios'

import { useQuery } from '@tanstack/vue-query'
import { computed, watch } from 'vue'

import type { AuthUser } from '../types'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores'

export function useProfileQuery() {
  const authStore = useAuthStore()

  const query = useQuery<AuthUser, AxiosError>({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      return await authService.getProfile()
    },
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })

  // Watch for successful data fetch
  watch(
    () => query.data.value,
    (data) => {
      if (data) {
        authStore.updateUser(data)
      }
    },
    { immediate: true },
  )

  // Watch for errors
  watch(
    () => query.error.value,
    (error) => {
      if (error) {
        console.error('[Auth] Profile fetch failed:', error.response?.data || error.message)

        // If unauthorized, clear auth
        if (error.response?.status === 401) {
          authStore.clearAuth()
        }
      }
    },
  )

  return query
}
