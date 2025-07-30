// services/auth-api.ts (assuming this is part of use-axios)
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import axios from 'axios'

import { useAuthStore } from '@/modules/auth' // Updated import
import env from '@/utils/env'

export function useAxios() {
  const cleanBase = env.VITE_SERVER_API_URL.trim().replace(/\/+$/, '')
  const prefix = env.VITE_SERVER_API_PREFIX.trim().replace(/^\/?/, '/')

  const baseURL = `${cleanBase}${prefix}`

  if (!env.VITE_SERVER_API_PREFIX) {
    console.warn('[useAxios] ⚠️ No API prefix set — using base URL only:', env.VITE_SERVER_API_URL)
  }

  const axiosInstance = axios.create({
    baseURL,
    timeout: env.VITE_SERVER_API_TIMEOUT,
  })

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 5. Get the token directly from the Pinia store, which reads from sessionStorage
      //    This is generally safer as the store is the single source of truth for auth state.
      const authStore = useAuthStore() // Access the store inside the interceptor
      if (authStore.token) { // Use authStore.token which is reactive
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    },
  )

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error: AxiosError) => {
      // You can handle 401/403 errors globally here.
      // This is often a good place to clear auth and redirect.
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Use the auth store to clear credentials
        const authStore = useAuthStore()
        authStore.clearAuth()
        // Optionally, redirect to login page
        // import router from '@/router'; // Make sure your router instance is importable or passed
        // router.push('/auth/sign-in');
      }
      return Promise.reject(error)
    },
  )

  return {
    axiosInstance,
  }
}
