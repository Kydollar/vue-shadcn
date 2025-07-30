/**
 * Authentication Store
 * Centralized state management for authentication
 */

import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

import type { AuthState, AuthUser } from '../types'

import { SessionUtils, TokenUtils, UserUtils } from '../utils'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(UserUtils.getUser())
  const token = ref<string | null>(TokenUtils.getToken())
  const isLoading = ref(false)
  const lastActivity = ref<number | null>(SessionUtils.getLastActivity())

  // Computed
  const isAuthenticated = computed(() => {
    if (!token.value)
      return false

    // Check if token is expired
    try {
      return !TokenUtils.isTokenExpired(token.value)
    }
    catch {
      return false
    }
  })

  const hasUser = computed(() => !!user.value)

  const userDisplayName = computed(() => {
    return user.value ? UserUtils.getDisplayName(user.value) : ''
  })

  const userInitials = computed(() => {
    return user.value ? UserUtils.getInitials(user.value) : ''
  })

  // Actions
  function setAuth(authToken: string, authUser: AuthUser, remember: boolean = false): void {
    if (!authToken || !authUser) {
      console.warn('[Auth Store] Invalid token or user provided to setAuth')
      return
    }

    // Update state
    token.value = authToken
    user.value = authUser

    // Persist to storage
    TokenUtils.setToken(authToken, remember)
    UserUtils.setUser(authUser, remember)

    // Update activity
    updateActivity()

    // Development logging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[Auth Store] Authentication set successfully')
    }
  }

  function clearAuth(): void {
    // Clear state
    token.value = null
    user.value = null
    lastActivity.value = null

    // Clear storage
    SessionUtils.clearAuthData()

    // Development logging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[Auth Store] Authentication cleared')
    }
  }

  function updateUser(updatedUser: Partial<AuthUser>): void {
    if (!user.value)
      return

    const newUser = { ...user.value, ...updatedUser }
    user.value = newUser

    // Update storage
    const remember = !!localStorage.getItem('auth_remember_me')
    UserUtils.setUser(newUser, remember)
  }

  function updateActivity(): void {
    const now = Date.now()
    lastActivity.value = now
    SessionUtils.updateLastActivity()
  }

  function setLoading(loading: boolean): void {
    isLoading.value = loading
  }

  function hasPermission(permission: string): boolean {
    return user.value ? UserUtils.hasPermission(user.value, permission) : false
  }

  function hasRole(role: string): boolean {
    return user.value ? UserUtils.hasRole(user.value, role) : false
  }

  function checkSession(): boolean {
    if (!token.value) {
      clearAuth()
      return false
    }

    // Check token expiration
    if (TokenUtils.isTokenExpired(token.value)) {
      clearAuth()
      return false
    }

    return true
  }

  function getAuthState(): AuthState {
    return {
      user: user.value,
      token: token.value,
      isAuthenticated: isAuthenticated.value,
      isLoading: isLoading.value,
      lastActivity: lastActivity.value,
    }
  }

  // Initialize store
  function initialize(): void {
    // Check existing session validity
    if (token.value && !checkSession()) {
      clearAuth()
    }

    // Update activity if authenticated
    if (isAuthenticated.value) {
      updateActivity()
    }
  }

  // Initialize on store creation
  initialize()

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    lastActivity: readonly(lastActivity),

    // Computed
    isAuthenticated,
    hasUser,
    userDisplayName,
    userInitials,

    // Actions
    setAuth,
    clearAuth,
    updateUser,
    updateActivity,
    setLoading,
    hasPermission,
    hasRole,
    checkSession,
    getAuthState,
    initialize,
  }
})
