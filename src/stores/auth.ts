// stores/auth.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AuthUser } from '@/services/api/auth.api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(sessionStorage.getItem('token'))
  const isLogin = computed(() => !!token.value)

  function setAuth(_token: string, _user: AuthUser) {
    if (!_token) {
      console.warn('setAuth called with null/undefined token!')
      return // Early exit if token is invalid
    }
    token.value = _token
    sessionStorage.setItem('token', _token)

    if (!_user) {
      console.warn('setAuth called with null/undefined user!')
      return // Early exit if user is invalid
    }
    user.value = _user

    // Remove verbose console.logs for production, keep for development if useful
    // console.log('[Auth Store] Token after setAuth:', token.value);
    // console.log('[Auth Store] User after setAuth:', user.value);
  }

  function clearAuth() {
    token.value = null
    user.value = null
    sessionStorage.removeItem('token')
    // console.log('[Auth Store] Auth cleared. Token:', token.value, 'User:', user.value);
  }

  return {
    user,
    token,
    isLogin,
    setAuth,
    clearAuth,
  }
})
