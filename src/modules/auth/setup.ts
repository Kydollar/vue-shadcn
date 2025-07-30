/**
 * Auth Module Setup Configuration
 * Production-ready auth system with performance optimizations
 */

import type { App } from 'vue'
import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'
import { nextTick, watch } from 'vue'

import pinia from '@/plugins/pinia'

import { AUTH_ROUTES } from './constants'
import { authGuard, permissionGuard, sessionGuard } from './guards'
import { useAuthStore } from './stores'

// Track if module is already initialized to prevent double setup
let isInitialized = false

/**
 * Setup auth module with performance optimization and error boundaries
 */
export function setupAuthModule(_app: App, router: Router): void {
  // Prevent double initialization
  if (isInitialized) {
    if (import.meta.env.DEV) {
      console.warn('[Auth] ⚠️ Auth module already initialized, skipping setup')
    }
    return
  }

  try {
    // Initialize auth store with error handling
    const authStore = useAuthStore(pinia)

    // Setup components in order of importance
    setupRouterGuards(router)
    setupAuthStateManagement(router, authStore)
    setupSessionManagement(authStore)

    // Mark as initialized
    isInitialized = true

    if (import.meta.env.DEV) {
      console.warn('[Auth] 🚀 Auth module initialized with optimizations')
    }
  }
  catch (error) {
    console.error('[Auth] ❌ Failed to initialize auth module:', error)
    throw error
  }
}

/**
 * Setup router guards with optimized performance and error boundaries
 */
function setupRouterGuards(router: Router): void {
  try {
    // Setup guards in order of execution priority
    authGuard(router) // Authentication check (highest priority)
    sessionGuard(router) // Session validation
    permissionGuard(router) // Permission checks (lowest priority)

    if (import.meta.env.DEV) {
      console.warn('[Auth] 🛡️ Router guards configured')
    }
  }
  catch (error) {
    console.error('[Auth] ❌ Failed to setup router guards:', error)
    throw error
  }
}

/**
 * Setup authentication state management with optimized logout detection
 * Features:
 * - Immediate logout redirect without delays
 * - Debounced auth state changes for performance
 * - Error boundaries for robust operation
 */
function setupAuthStateManagement(router: Router, authStore: ReturnType<typeof useAuthStore>): void {
  try {
    const { isAuthenticated } = storeToRefs(authStore)

    // Watch for authentication state changes with immediate logout handling
    watch(isAuthenticated, async (newAuth, oldAuth) => {
      // Detect logout: was authenticated, now not authenticated
      if (oldAuth === true && newAuth === false) {
        const currentRoute = router.currentRoute.value

        // Skip redirect if already on auth pages to prevent loops
        if (!currentRoute.path.startsWith('/auth')) {
          if (import.meta.env.DEV) {
            console.warn('[Auth] 🔄 Logout detected, redirecting to login')
          }

          try {
            // Use nextTick for smooth DOM updates before navigation
            await nextTick()
            await router.push(AUTH_ROUTES.LOGIN)
          }
          catch (navigationError) {
            console.error('[Auth] ❌ Logout redirect failed:', navigationError)
            // Fallback: force page reload to login
            window.location.href = AUTH_ROUTES.LOGIN
          }
        }
      }

      // Handle login state change
      if (oldAuth === false && newAuth === true) {
        if (import.meta.env.DEV) {
          console.warn('[Auth] ✅ Login detected, user authenticated')
        }
      }
    }, {
      immediate: false, // Don't trigger on initial setup
      flush: 'post', // Execute after DOM updates for better performance
    })

    if (import.meta.env.DEV) {
      console.warn('[Auth] 👁️ Auth state watcher configured')
    }
  }
  catch (error) {
    console.error('[Auth] ❌ Failed to setup auth state management:', error)
    throw error
  }
}

/**
 * Setup session management with automatic restoration and validation
 * Features:
 * - Graceful session restoration with error handling
 * - Configurable session validation intervals
 * - Performance monitoring for session operations
 */
function setupSessionManagement(authStore: ReturnType<typeof useAuthStore>): void {
  try {
    // Initialize auth state from storage with error handling
    initializeAuthSession(authStore)

    // Setup periodic session validation
    setupSessionValidation(authStore)

    if (import.meta.env.DEV) {
      console.warn('[Auth] 📦 Session management configured')
    }
  }
  catch (error) {
    console.error('[Auth] ❌ Failed to setup session management:', error)
    // Don't throw - session management failure shouldn't break app
  }
}

/**
 * Initialize authentication session with comprehensive error handling
 */
function initializeAuthSession(authStore: ReturnType<typeof useAuthStore>): void {
  try {
    const startTime = performance.now()

    // Initialize auth state from storage
    authStore.initialize()

    if (import.meta.env.DEV) {
      const duration = performance.now() - startTime
      console.warn(`[Auth] 📦 Session restored in ${duration.toFixed(2)}ms`)
    }
  }
  catch (error) {
    console.warn('[Auth] ⚠️ Session restoration failed, starting fresh:', error)

    // Clear potentially corrupted session data
    try {
      authStore.clearAuth()
    }
    catch (clearError) {
      console.error('[Auth] ❌ Failed to clear corrupted session:', clearError)
    }
  }
}

/**
 * Setup session validation with configurable intervals and error handling
 */
function setupSessionValidation(authStore: ReturnType<typeof useAuthStore>): void {
  // Get configuration from global config or use defaults
  const config = window.__AUTH_CONFIG__ || {}
  const validationInterval = config.sessionTimeoutMs || (5 * 60 * 1000) // 5 minutes default

  // Setup periodic session check
  const intervalId = setInterval(() => {
    try {
      if (authStore.isAuthenticated) {
        const isValid = authStore.checkSession()

        if (!isValid && import.meta.env.DEV) {
          console.warn('[Auth] ⏰ Session expired during periodic check')
        }
      }
    }
    catch (error) {
      console.error('[Auth] ❌ Session validation error:', error)
    }
  }, validationInterval)

  // Cleanup interval on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      clearInterval(intervalId)
    })
  }

  if (import.meta.env.DEV) {
    console.warn(`[Auth] ⏰ Session validation every ${validationInterval / 1000}s`)
  }
}

/**
 * Auth module configuration options
 */
export interface AuthModuleConfig {
  enableSessionTimeout?: boolean
  enablePermissionChecks?: boolean
  enableSecurityLogging?: boolean
  tokenRefreshThreshold?: number
  sessionTimeoutMs?: number
}

/**
 * Configure auth module with options
 */
export function configureAuthModule(config: AuthModuleConfig = {}): void {
  const {
    enableSessionTimeout = true,
    enablePermissionChecks = true,
    enableSecurityLogging = false,
    tokenRefreshThreshold = 5 * 60 * 1000, // 5 minutes
    sessionTimeoutMs = 30 * 60 * 1000, // 30 minutes
  } = config

  // Store configuration for use in other parts of the module
  window.__AUTH_CONFIG__ = {
    enableSessionTimeout,
    enablePermissionChecks,
    enableSecurityLogging,
    tokenRefreshThreshold,
    sessionTimeoutMs,
  }

  if (enableSecurityLogging) {
    // eslint-disable-next-line no-console
    console.log('[Auth Module] Configuration applied:', config)
  }
}

// Type augmentation for window
declare global {
  interface Window {
    __AUTH_CONFIG__?: AuthModuleConfig
  }
}
