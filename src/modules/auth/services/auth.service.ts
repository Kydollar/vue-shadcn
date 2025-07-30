/**
 * Authentication API Service
 * Centralized API calls for authentication operations
 */

import { useAxios } from '@/composables/use-axios'

import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginApiResponse,
  LoginPayload,
  ResetPasswordPayload,
  SignUpPayload,
} from '../types'

import { mapLoginApiResponseToAuthResponse } from '../utils'

/**
 * Authentication service class
 */
export class AuthService {
  private axios = useAxios().axiosInstance

  /**
   * Login user
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await this.axios.post<LoginApiResponse>('auth/login', payload)
    return mapLoginApiResponseToAuthResponse(response.data)
  }

  /**
   * Register new user
   */
  async register(payload: SignUpPayload): Promise<AuthResponse> {
    const response = await this.axios.post<LoginApiResponse>('auth/register', payload)
    return mapLoginApiResponseToAuthResponse(response.data)
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthUser> {
    const response = await this.axios.get<AuthUser>('auth/me')
    return response.data
  }

  /**
   * Update user profile
   */
  async updateProfile(payload: Partial<AuthUser>): Promise<AuthUser> {
    const response = await this.axios.put<AuthUser>('auth/profile', payload)
    return response.data
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.axios.post('auth/logout')
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.axios.post<LoginApiResponse>('auth/refresh', {
      refreshToken,
    })
    return mapLoginApiResponseToAuthResponse(response.data)
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await this.axios.post('auth/forgot-password', payload)
  }

  /**
   * Reset password with token
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await this.axios.post('auth/reset-password', payload)
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await this.axios.post('auth/change-password', payload)
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    await this.axios.post('auth/verify-email', { token })
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    await this.axios.post('auth/resend-verification', { email })
  }

  /**
   * Check if email exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await this.axios.get(`auth/check-email/${email}`)
      return response.data.exists
    }
    catch {
      return false
    }
  }

  /**
   * Check if username exists
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const response = await this.axios.get(`auth/check-username/${username}`)
      return response.data.exists
    }
    catch {
      return false
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
