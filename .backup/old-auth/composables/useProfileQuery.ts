// composables/auth/useProfileQuery.ts
import type { AxiosError } from 'axios'

import { useQuery } from '@tanstack/vue-query'
import { watch } from 'vue'

import type { AuthUser } from '@/services/api/auth.api'

import { getProfile } from '@/services/api/auth.api'
import { useAuthStore } from '@/stores/auth'

export function useProfileQuery() {
  const auth = useAuthStore()

  const queryResult = useQuery<AuthUser, AxiosError>({
    queryKey: ['auth-profile'],
    queryFn: async () => {
      const profile = await getProfile()
      auth.user = profile // Update user data in Pinia store
      return profile
    },
    // Query ini hanya akan berjalan jika pengguna sudah login
    enabled: auth.isLogin,
    retry: false, // Biasanya tidak perlu retry untuk kegagalan otentikasi
  })

  // Memantau error pada query profil untuk efek samping (misalnya, logout otomatis)
  watch(queryResult.error, (newError) => {
    if (newError) {
      console.error('Failed to fetch profile:', newError.response?.data || newError.message)
      // Jika error 401 (Unauthorized) atau 403 (Forbidden), asumsikan token tidak valid
      // dan bersihkan status otentikasi.
      if (newError.response?.status === 401 || newError.response?.status === 403) {
        auth.clearAuth()
        // Optional: Navigasi ke halaman login jika diperlukan
        // router.push('/auth/login');
      }
    }
  })

  return queryResult
}
