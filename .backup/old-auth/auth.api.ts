// services/api/auth.api.ts

import { useAxios } from '@/composables/use-axios'

// --- Interfaces ---
export interface LoginPayload {
  email?: string
  username?: string
  password: string
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
}
export interface AuthUser {
  id: number
  name: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
}

export interface LoginApiSuccessResponse {
  id: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// --- Helper Functions ---

function mapLoginApiResponseToAuthResponse(apiData: LoginApiSuccessResponse): AuthResponse {
  const { accessToken, refreshToken, ...userProps } = apiData // Pisahkan token dan properti user
  const name = (userProps.firstName && userProps.lastName)
    ? `${userProps.firstName} ${userProps.lastName}`
    : userProps.username

  const user: AuthUser = {
    ...userProps, // Masukkan semua properti user dari API
    name, // Tambahkan properti `name` yang sudah dimapping
  }

  return {
    token: accessToken,
    user,
  }
}

// --- API Functions ---

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { axiosInstance } = useAxios()
  const res = await axiosInstance.post<LoginApiSuccessResponse>('auth/login', payload)
  return mapLoginApiResponseToAuthResponse(res.data)
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const { axiosInstance } = useAxios()
  const res = await axiosInstance.post<LoginApiSuccessResponse>('auth/register', payload)
  return mapLoginApiResponseToAuthResponse(res.data)
}

export async function getProfile(): Promise<AuthUser> {
  const { axiosInstance } = useAxios()
  const res = await axiosInstance.get<AuthUser>('auth/me')
  return res.data // Asumsi API mengembalikan AuthUser lengkap
}

export async function logout(): Promise<void> {
  const { axiosInstance } = useAxios()
  await axiosInstance.post('auth/logout')
}
