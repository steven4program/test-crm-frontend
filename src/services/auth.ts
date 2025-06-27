import { apiService, type ApiResponse } from './api'
import type { User } from '../contexts/auth'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresIn?: number
}

export interface ApiLoginResponse {
  user: User
  access_token: string
}

export interface RegisterRequest {
  username: string
  password: string
  role?: 'admin' | 'viewer'
}

export interface RefreshTokenResponse {
  token: string
  expiresIn: number
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // The backend returns the response directly without ApiResponse wrapper
    const response = await apiService.post<ApiLoginResponse>(
      '/auth/login',
      credentials
    )
    
    if (!response.user || !response.access_token) {
      throw new Error('Login failed - invalid response format')
    }
    
    // Transform the API response to match our expected format
    return {
      user: response.user,
      token: response.access_token,
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on server, we still want to clear local storage
      console.warn('Logout failed on server:', error)
    }
  }

  // Register new user (admin only)
  async register(userData: RegisterRequest): Promise<User> {
    const response = await apiService.post<ApiResponse<User>>(
      '/auth/register',
      userData
    )
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed')
    }
    
    return response.data
  }

  // Refresh authentication token
  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await apiService.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh'
    )
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Token refresh failed')
    }
    
    return response.data
  }

  // Verify current token
  async verifyToken(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/me')
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Token verification failed')
    }
    
    return response.data
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>('/auth/change-password', {
      oldPassword,
      newPassword
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Password change failed')
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>('/auth/forgot-password', {
      email
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Password reset request failed')
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>('/auth/reset-password', {
      token,
      newPassword
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Password reset failed')
    }
  }
}

export const authService = new AuthService()