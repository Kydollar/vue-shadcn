// composables/auth/useLoginMutation.ts
import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { AuthResponse, LoginPayload } from '@/services/api/auth.api'

import { login } from '@/services/api/auth.api'
import { useAuthStore } from '@/stores/auth'

export function useLoginMutation() {
  const auth = useAuthStore()

  return useMutation<AuthResponse, AxiosError, LoginPayload>({
    mutationKey: ['auth-login'],
    mutationFn: login,
    onSuccess(data: AuthResponse) {
      // Data sudah dijamin memiliki token dan user berdasarkan AuthResponse type
      // dan validasi lebih lanjut bisa dilakukan di `setAuth`
      auth.setAuth(data.token, data.user)
      // Optional: Pemicu notifikasi sukses global (misalnya toast)
      // useToast().success('Login successful!');
    },
    onError(error: AxiosError) {
      console.error('Login mutation failed:', error.response?.data || error.message)
      // Optional: Pemicu notifikasi error global untuk pengguna
      // useToast().error('Login failed. Please check your credentials.');
    },
  })
}
