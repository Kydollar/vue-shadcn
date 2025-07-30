/**
 * Authentication Utilities
 * Helper functions for authentication operations
 */

import type { AuthResponse, AuthUser, LoginApiResponse } from '../types'

import { AUTH_STORAGE_KEYS, VALIDATION_RULES } from '../constants'

/**
 * Maps API login response to internal auth response format
 */
export function mapLoginApiResponseToAuthResponse(apiData: LoginApiResponse): AuthResponse {
  const { accessToken, refreshToken, expiresIn, ...userProps } = apiData

  const name = (userProps.firstName && userProps.lastName)
    ? `${userProps.firstName} ${userProps.lastName}`.trim()
    : userProps.username

  const user: AuthUser = {
    ...userProps,
    name,
  }

  return {
    token: accessToken,
    user,
    expiresIn,
  }
}

/**
 * Token management utilities
 */
export const TokenUtils = {
  /**
   * Get token from storage
   */
  getToken(): string | null {
    return sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
      || localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
  },

  /**
   * Set token in storage
   */
  setToken(token: string, remember: boolean = false): void {
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, 'true')
    }
    else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token)
    }
  },

  /**
   * Remove token from storage
   */
  removeToken(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME)
  },

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.getToken()
  },

  /**
   * Parse JWT token payload
   */
  parseTokenPayload(token: string): Record<string, any> | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(''),
      )
      return JSON.parse(jsonPayload)
    }
    catch {
      return null
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.parseTokenPayload(token)
    if (!payload || !payload.exp)
      return true

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  },

  /**
   * Get token expiration time
   */
  getTokenExpiration(token: string): Date | null {
    const payload = this.parseTokenPayload(token)
    if (!payload || !payload.exp)
      return null

    return new Date(payload.exp * 1000)
  },
}

/**
 * User management utilities
 */
export const UserUtils = {
  /**
   * Get user from storage
   */
  getUser(): AuthUser | null {
    try {
      const userStr = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER)
        || localStorage.getItem(AUTH_STORAGE_KEYS.USER)
      return userStr ? JSON.parse(userStr) : null
    }
    catch {
      return null
    }
  },

  /**
   * Set user in storage
   */
  setUser(user: AuthUser, remember: boolean = false): void {
    const userStr = JSON.stringify(user)
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, userStr)
    }
    else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, userStr)
    }
  },

  /**
   * Remove user from storage
   */
  removeUser(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
  },

  /**
   * Get user display name
   */
  getDisplayName(user: AuthUser): string {
    return user.name || user.username || user.email
  },

  /**
   * Get user initials
   */
  getInitials(user: AuthUser): string {
    const name = this.getDisplayName(user)
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  },

  /**
   * Check if user has permission
   */
  hasPermission(user: AuthUser, permission: string): boolean {
    return user.permissions?.includes(permission) ?? false
  },

  /**
   * Check if user has role
   */
  hasRole(user: AuthUser, role: string): boolean {
    return user.role === role
  },
}

/**
 * Validation utilities
 */
export const ValidationUtils = {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    return VALIDATION_RULES.EMAIL.test(email)
  },

  /**
   * Validate password strength
   */
  isValidPassword(password: string): boolean {
    return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH
      && VALIDATION_RULES.PASSWORD_REGEX.test(password)
  },

  /**
   * Validate username format
   */
  isValidUsername(username: string): boolean {
    return username.length >= VALIDATION_RULES.USERNAME_MIN_LENGTH
      && username.length <= VALIDATION_RULES.USERNAME_MAX_LENGTH
      && VALIDATION_RULES.USERNAME_REGEX.test(username)
  },

  /**
   * Get password strength score
   */
  getPasswordStrength(password: string): {
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters long')
    }
    else {
      score += 1
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password should contain lowercase letters')
    }
    else {
      score += 1
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password should contain uppercase letters')
    }
    else {
      score += 1
    }

    if (!/\d/.test(password)) {
      feedback.push('Password should contain numbers')
    }
    else {
      score += 1
    }

    if (!/[@$!%*?&]/.test(password)) {
      feedback.push('Password should contain special characters')
    }
    else {
      score += 1
    }

    return { score, feedback }
  },
}

/**
 * Session management utilities
 */
export const SessionUtils = {
  /**
   * Clear all auth data
   */
  clearAuthData(): void {
    TokenUtils.removeToken()
    UserUtils.removeUser()
    sessionStorage.removeItem('lastActivity')
    localStorage.removeItem('lastActivity')
  },

  /**
   * Update last activity timestamp
   */
  updateLastActivity(): void {
    const timestamp = Date.now()
    sessionStorage.setItem('lastActivity', timestamp.toString())
  },

  /**
   * Get last activity timestamp
   */
  getLastActivity(): number | null {
    const timestamp = sessionStorage.getItem('lastActivity')
    return timestamp ? Number.parseInt(timestamp, 10) : null
  },

  /**
   * Check if session is expired due to inactivity
   */
  isSessionExpired(timeoutMs: number): boolean {
    const lastActivity = this.getLastActivity()
    if (!lastActivity)
      return true

    return Date.now() - lastActivity > timeoutMs
  },
}

/**
 * URL utilities for redirects
 */
export const UrlUtils = {
  /**
   * Get redirect URL from query params
   */
  getRedirectUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('redirect') || urlParams.get('returnUrl')
  },

  /**
   * Set redirect URL in query params
   */
  setRedirectUrl(url: string): string {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('redirect', url)
    return currentUrl.toString()
  },

  /**
   * Remove redirect URL from query params
   */
  removeRedirectUrl(): void {
    const url = new URL(window.location.href)
    url.searchParams.delete('redirect')
    url.searchParams.delete('returnUrl')
    window.history.replaceState({}, '', url.toString())
  },
}
