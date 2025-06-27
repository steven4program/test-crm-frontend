import { apiService, type ApiResponse } from './api'
import type { User } from '../contexts/types'

export interface CreateUserRequest {
  username: string
  password: string
  role: 'admin' | 'viewer'
  email?: string
}

export interface UpdateUserRequest {
  username?: string
  role?: 'admin' | 'viewer'
  email?: string
  isActive?: boolean
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export interface UserFilters {
  role?: 'admin' | 'viewer'
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

class UsersService {
  // Get all users with optional filtering
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `/users?${queryString}` : '/users'
    
    const response = await apiService.get<ApiResponse<UserListResponse>>(endpoint)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch users')
    }
    
    return response.data
  }

  // Get single user by ID
  async getUser(userId: string): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>(`/users/${userId}`)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user')
    }
    
    return response.data
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiService.post<ApiResponse<User>>('/users', userData)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create user')
    }
    
    return response.data
  }

  // Update existing user
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>(`/users/${userId}`, userData)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update user')
    }
    
    return response.data
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<void>>(`/users/${userId}`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete user')
    }
  }

  // Activate/deactivate user
  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    const response = await apiService.patch<ApiResponse<User>>(`/users/${userId}/status`, {
      isActive
    })
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update user status')
    }
    
    return response.data
  }

  // Reset user password (admin only)
  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>(`/users/${userId}/reset-password`, {
      newPassword
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset user password')
    }
  }

  // Get user activity/audit log
  async getUserActivity(userId: string, limit = 50): Promise<UserActivity[]> {
    const response = await apiService.get<ApiResponse<UserActivity[]>>(
      `/users/${userId}/activity?limit=${limit}`
    )
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user activity')
    }
    
    return response.data
  }
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export const usersService = new UsersService()