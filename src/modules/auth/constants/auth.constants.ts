/**
 * Authentication Constants
 * All authentication related constants and configuration
 */

import type { AuthConfig } from '../types'

// Storage keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  REFRESH_TOKEN: 'auth_refresh_token',
  REMEMBER_ME: 'auth_remember_me',
} as const

// Session management
export const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: '/auth/sign-in',
  REGISTER: '/auth/sign-up',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGOUT: '/auth/logout',
  PROFILE: '/profile',
} as const

// API endpoints
export const AUTH_ENDPOINTS = {
  login: 'auth/login',
  register: 'auth/register',
  logout: 'auth/logout',
  profile: 'auth/me',
  refresh: 'auth/refresh',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  changePassword: 'auth/change-password',
} as const

// Default auth configuration
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  tokenKey: AUTH_STORAGE_KEYS.TOKEN,
  userKey: AUTH_STORAGE_KEYS.USER,
  refreshTokenKey: AUTH_STORAGE_KEYS.REFRESH_TOKEN,
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  endpoints: AUTH_ENDPOINTS,
}

// Error codes
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const

// Auth events
export const AUTH_EVENTS = {
  LOGIN_SUCCESS: 'auth:login-success',
  LOGIN_FAILED: 'auth:login-failed',
  LOGOUT: 'auth:logout',
  TOKEN_EXPIRED: 'auth:token-expired',
  SESSION_TIMEOUT: 'auth:session-timeout',
  UNAUTHORIZED: 'auth:unauthorized',
} as const

// Default permissions
export const DEFAULT_PERMISSIONS = {
  PUBLIC: 'public',
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/u,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/u,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_REGEX: /^\w+$/u,
} as const
