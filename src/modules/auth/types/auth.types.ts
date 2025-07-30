/**
 * Authentication Types
 * Centralized type definitions for authentication module
 */

export interface AuthUser {
  id: number
  name: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
  role?: string
  permissions?: string[]
}

export interface LoginPayload {
  email?: string
  username?: string
  password: string
  rememberMe?: boolean
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
  confirmPassword?: string
  acceptTerms?: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

export interface AuthResponse {
  token: string
  user: AuthUser
  expiresIn?: number
}

export interface LoginApiResponse {
  id: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  lastActivity: number | null
}

export interface AuthConfig {
  tokenKey: string
  userKey: string
  refreshTokenKey: string
  baseURL: string
  endpoints: {
    login: string
    register: string
    logout: string
    profile: string
    refresh: string
    forgotPassword: string
    resetPassword: string
  }
}

// Error types
export interface AuthError {
  code: string
  message: string
  details?: Record<string, any>
}

// Permission types
export type Permission = string
export type Role = string

export interface UserPermissions {
  roles: Role[]
  permissions: Permission[]
}
