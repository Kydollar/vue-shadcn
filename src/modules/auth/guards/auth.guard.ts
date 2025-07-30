/**
 * Authentication Guard
 * Router guard for protecting authenticated routes
 */

import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'
import { unref } from 'vue'

import pinia from '@/plugins/pinia'

import { AUTH_ROUTES } from '../constants'
import { useAuthStore } from '../stores'
import { UrlUtils } from '../utils'

export function authGuard(router: Router): void {
  const authStore = useAuthStore(pinia)
  const { isAuthenticated } = storeToRefs(authStore)

  router.beforeEach((to, _from, next) => {
    const requiresAuth = to.meta.auth === true
    const requiresGuest = to.meta.guest === true
    const isAuth = unref(isAuthenticated)

    // Check session validity
    authStore.checkSession()

    // If route requires authentication and user is not authenticated
    if (requiresAuth && !isAuth) {
      // Store the intended destination
      const redirectUrl = to.fullPath

      // Redirect to login with return URL
      next({
        path: AUTH_ROUTES.LOGIN,
        query: { redirect: redirectUrl },
      })
      return
    }

    // If route requires guest (not authenticated) and user is authenticated
    if (requiresGuest && isAuth) {
      // Check if there's a redirect URL from login
      const redirectUrl = UrlUtils.getRedirectUrl()

      if (redirectUrl) {
        UrlUtils.removeRedirectUrl()
        next(redirectUrl)
      }
      else {
        // Default redirect to dashboard or home
        next('/dashboard')
      }
      return
    }

    // Update user activity if authenticated
    if (isAuth) {
      authStore.updateActivity()
    }

    next()
  })
}

/**
 * Permission Guard
 * Router guard for checking user permissions
 */
export function permissionGuard(router: Router): void {
  const authStore = useAuthStore(pinia)

  router.beforeEach((to, _from, next) => {
    const requiredPermissions = to.meta.permissions as string[] | undefined
    const requiredRole = to.meta.role as string | undefined

    // Skip if no permission requirements
    if (!requiredPermissions && !requiredRole) {
      next()
      return
    }

    // Check if user is authenticated
    if (!unref(authStore.isAuthenticated)) {
      next({
        path: AUTH_ROUTES.LOGIN,
        query: { redirect: to.fullPath },
      })
      return
    }

    // Check role if required
    if (requiredRole && !authStore.hasRole(requiredRole)) {
      next('/403')
      return
    }

    // Check permissions if required
    if (requiredPermissions) {
      const hasPermission = requiredPermissions.some(permission =>
        authStore.hasPermission(permission),
      )

      if (!hasPermission) {
        next('/403')
        return
      }
    }

    next()
  })
}

/**
 * Session Guard
 * Router guard for handling session timeouts
 */
export function sessionGuard(router: Router): void {
  const authStore = useAuthStore(pinia)

  router.beforeEach((to, _from, next) => {
    // Skip for guest routes
    if (to.meta.guest === true) {
      next()
      return
    }

    // Check session validity for authenticated users
    if (unref(authStore.isAuthenticated)) {
      const isValidSession = authStore.checkSession()

      if (!isValidSession) {
        // Session expired, redirect to login
        next({
          path: AUTH_ROUTES.LOGIN,
          query: {
            redirect: to.fullPath,
            expired: 'true',
          },
        })
        return
      }
    }

    next()
  })
}
