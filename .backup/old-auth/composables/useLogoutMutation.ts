/* eslint-disable no-console */
// composables/auth/useLogoutMutation.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

// We no longer need to import the 'logout' API function
// import { logout as apiLogout } from '@/services/api/auth.api'
import { useAuthStore } from '@/stores/auth'

export function useLogoutMutation() {
  const auth = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({ // Using generic 'Error' for simplicity if no AxiosError is expected
    mutationKey: ['auth-logout'],
    // If no backend endpoint, simply resolve a promise immediately
    mutationFn: () => Promise.resolve(), // Simulate an instant successful operation, change if you have a real API call (apiLogout),
    onSuccess: async () => {
      // Clear client-side authentication state
      auth.clearAuth()
      console.log('Client-side auth cleared.')

      // Invalidate all relevant queries to ensure fresh data on next login
      await queryClient.invalidateQueries({ queryKey: ['auth-profile'] })
      await queryClient.invalidateQueries({ queryKey: ['auth-login'] })
      // Consider invalidating ALL queries if your app relies heavily on
      // user-specific data that should be gone after logout.
      // await queryClient.invalidateQueries() // Use with caution!

      // Redirect to login page or home page
      router.replace('/auth/sign-in')
      console.log('Logout successful and redirected to login page.')
    },
    onError: (error) => {
      // In this scenario, onError would typically only be hit if Promise.reject() was used
      // in mutationFn, or if there's a problem with the Pinia store.
      console.error('An unexpected error occurred during client-side logout:', error.message)
      // Still ensure client-side state is cleared and redirect, as a fail-safe
      auth.clearAuth()
      router.replace('/auth/sign-in')
    },
  })
}
