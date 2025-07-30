/**
 * Auth Module Setup Configuration
 * Easy setup for the new modular auth system
 */

import type { App } from 'vue'
import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'
import { watch } from 'vue'

import pinia from '@/plugins/pinia'

import { AUTH_ROUTES } from './constants'
import { authGuard, permissionGuard, sessionGuard } from './guards'
import { useAuthStore } from './stores'

/**
 * Setup auth module with app and router
 */
export function setupAuthModule(_app: App, router: Router): void {
  // Setup router guards
  authGuard(router)
  permissionGuard(router)
  sessionGuard(router)

  // Setup logout redirect watcher
  setupLogoutWatcher(router)

  // You can add more setup logic here like:
  // - Auth interceptors
  // - Global error handlers
  // - Auth event listeners
}

/**
 * Setup watcher for logout redirect
 */
function setupLogoutWatcher(router: Router): void {
  const authStore = useAuthStore(pinia)
  const { isAuthenticated } = storeToRefs(authStore)

  // Watch for authentication state changes
  watch(isAuthenticated, (newIsAuth, oldIsAuth) => {
    // If user was authenticated but now is not (logout occurred)
    if (oldIsAuth === true && newIsAuth === false) {
      // Get current route
      const currentRoute = router.currentRoute.value

      // Only redirect if not already on auth pages
      if (!currentRoute.path.startsWith('/auth')) {
        router.push(AUTH_ROUTES.LOGIN)
      }
    }
  }, { immediate: false })
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
