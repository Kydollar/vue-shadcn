/**
 * Authentication Store
 * Optimized state management with performance monitoring
 */

import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

import type { AuthState, AuthUser } from '../types'

import { SessionUtils, TokenUtils, UserUtils } from '../utils'

export const useAuthStore = defineStore('auth', () => {
  // State with lazy initialization for better performance
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const lastActivity = ref<number | null>(null)

  // Initialize state from storage on first access
  let isStateInitialized = false

  function ensureStateInitialized(): void {
    if (!isStateInitialized) {
      const startTime = performance.now()

      user.value = UserUtils.getUser()
      token.value = TokenUtils.getToken()
      lastActivity.value = SessionUtils.getLastActivity()

      isStateInitialized = true

      if (import.meta.env.DEV) {
        const duration = performance.now() - startTime
        console.warn(`[Auth Store] State initialized in ${duration.toFixed(2)}ms`)
      }
    }
  }

  // Computed with optimized caching
  const isAuthenticated = computed(() => {
    ensureStateInitialized()

    if (!token.value) {
      return false
    }

    // Optimized token validation with caching
    try {
      return !TokenUtils.isTokenExpired(token.value)
    }
    catch (error) {
      console.warn('[Auth Store] Token validation failed:', error)
      return false
    }
  })

  const hasUser = computed(() => {
    ensureStateInitialized()
    return !!user.value
  })

  const userDisplayName = computed(() => {
    ensureStateInitialized()
    return user.value ? UserUtils.getDisplayName(user.value) : ''
  })

  const userInitials = computed(() => {
    ensureStateInitialized()
    return user.value ? UserUtils.getInitials(user.value) : ''
  })

  // Actions with comprehensive error handling and performance optimization
  function setAuth(authToken: string, authUser: AuthUser, remember: boolean = false): void {
    if (!authToken || !authUser) {
      console.warn('[Auth Store] Invalid token or user provided to setAuth')
      return
    }

    try {
      const startTime = performance.now()

      // Update state
      token.value = authToken
      user.value = authUser

      // Persist to storage with error handling
      try {
        TokenUtils.setToken(authToken, remember)
        UserUtils.setUser(authUser, remember)
      }
      catch (storageError) {
        console.error('[Auth Store] Failed to persist auth data:', storageError)
        // Continue even if storage fails
      }

      // Update activity tracking
      updateActivity()

      if (import.meta.env.DEV) {
        const duration = performance.now() - startTime
        console.warn(`[Auth Store] Auth set in ${duration.toFixed(2)}ms`)
      }
    }
    catch (error) {
      console.error('[Auth Store] Failed to set authentication:', error)
      throw error
    }
  }

  function clearAuth(): void {
    try {
      const startTime = performance.now()

      // Clear state immediately for instant UX
      token.value = null
      user.value = null
      lastActivity.value = null

      // Clear storage with error handling
      try {
        SessionUtils.clearAuthData()
      }
      catch (storageError) {
        console.warn('[Auth Store] Failed to clear storage, continuing:', storageError)
        // Continue even if storage clearing fails
      }

      if (import.meta.env.DEV) {
        const duration = performance.now() - startTime
        console.warn(`[Auth Store] Auth cleared in ${duration.toFixed(2)}ms`)
      }
    }
    catch (error) {
      console.error('[Auth Store] Failed to clear authentication:', error)
      // Force clear state even if error occurs
      token.value = null
      user.value = null
      lastActivity.value = null
    }
  }

  function updateUser(updatedUser: Partial<AuthUser>): void {
    ensureStateInitialized()

    if (!user.value) {
      console.warn('[Auth Store] No user to update')
      return
    }

    try {
      const newUser = { ...user.value, ...updatedUser }
      user.value = newUser

      // Update storage with error handling
      try {
        const remember = !!localStorage.getItem('auth_remember_me')
        UserUtils.setUser(newUser, remember)
      }
      catch (storageError) {
        console.warn('[Auth Store] Failed to persist user update:', storageError)
      }
    }
    catch (error) {
      console.error('[Auth Store] Failed to update user:', error)
    }
  }

  function updateActivity(): void {
    try {
      const now = Date.now()
      lastActivity.value = now
      SessionUtils.updateLastActivity()
    }
    catch (error) {
      console.warn('[Auth Store] Failed to update activity:', error)
    }
  }

  function setLoading(loading: boolean): void {
    isLoading.value = loading
  }

  function hasPermission(permission: string): boolean {
    ensureStateInitialized()
    try {
      return user.value ? UserUtils.hasPermission(user.value, permission) : false
    }
    catch (error) {
      console.warn('[Auth Store] Permission check failed:', error)
      return false
    }
  }

  function hasRole(role: string): boolean {
    ensureStateInitialized()
    try {
      return user.value ? UserUtils.hasRole(user.value, role) : false
    }
    catch (error) {
      console.warn('[Auth Store] Role check failed:', error)
      return false
    }
  }

  function checkSession(): boolean {
    ensureStateInitialized()

    try {
      if (!token.value) {
        clearAuth()
        return false
      }

      // Check token expiration with enhanced validation
      if (TokenUtils.isTokenExpired(token.value)) {
        if (import.meta.env.DEV) {
          console.warn('[Auth Store] Session expired, clearing auth')
        }
        clearAuth()
        return false
      }

      return true
    }
    catch (error) {
      console.error('[Auth Store] Session check failed:', error)
      clearAuth()
      return false
    }
  }

  function getAuthState(): AuthState {
    ensureStateInitialized()

    return {
      user: user.value,
      token: token.value,
      isAuthenticated: isAuthenticated.value,
      isLoading: isLoading.value,
      lastActivity: lastActivity.value,
    }
  }

  // Enhanced initialization with comprehensive error handling
  function initialize(): void {
    try {
      const startTime = performance.now()

      // Force state initialization
      ensureStateInitialized()

      // Validate existing session
      if (token.value && !checkSession()) {
        clearAuth()
      }

      // Update activity if authenticated
      if (isAuthenticated.value) {
        updateActivity()
      }

      if (import.meta.env.DEV) {
        const duration = performance.now() - startTime
        console.warn(`[Auth Store] Initialize completed in ${duration.toFixed(2)}ms`)
      }
    }
    catch (error) {
      console.error('[Auth Store] Initialization failed:', error)
      // Clear potentially corrupted state
      clearAuth()
    }
  }

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
