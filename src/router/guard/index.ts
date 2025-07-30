// src/router/guard/index.ts
import type { Router } from 'vue-router'

import nprogress from 'nprogress'

/**
 * Setup common router guards with performance optimization
 */
function setupCommonGuard(router: Router) {
  router.beforeEach((to, _from) => {
    // Start progress bar
    nprogress.start()

    // Performance monitoring in development
    if (import.meta.env.DEV) {
      const startTime = performance.now()
      // Store start time for performance tracking
      ;(to.meta as any).__navigationStart = startTime
    }

    return true
  })

  router.afterEach((to) => {
    // Complete progress bar
    nprogress.done()

    // Log navigation performance in development
    if (import.meta.env.DEV && (to.meta as any).__navigationStart) {
      const duration = performance.now() - (to.meta as any).__navigationStart
      if (duration > 100) { // Only log slow navigations
        console.warn(`[Router] 🐌 Slow navigation to ${to.path}: ${duration.toFixed(2)}ms`)
      }
    }
  })
}

/**
 * Setup global router guards (non-auth related)
 */
export function createRouterGuard(router: Router) {
  setupCommonGuard(router)

  // ✅ Auth guards are handled by setupAuthModule for better organization
}
