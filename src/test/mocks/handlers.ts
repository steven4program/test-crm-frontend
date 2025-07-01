import { http, HttpResponse } from 'msw'

const API_BASE_URL = 'http://localhost:3000/api/v1'

// Type definitions for request bodies
interface LoginRequest {
  username: string
  password: string
}

interface RegisterRequest {
  username: string
  password: string
  role: 'admin' | 'viewer'
  email?: string
  name?: string
}

interface CreateUserRequest {
  username: string
  password: string
  role: 'admin' | 'viewer'
  email?: string
  name?: string
}

interface UpdateUserRequest {
  username?: string
  email?: string
  role?: 'admin' | 'viewer'
  name?: string
  isActive?: boolean
}

interface CreateCustomerRequest {
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  notes?: string
  status?: 'active' | 'inactive' | 'prospect'
}

interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  status?: 'active' | 'inactive' | 'prospect'
}

interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface ForgotPasswordRequest {
  email: string
}

interface UserStatusRequest {
  isActive: boolean
}

interface UserPasswordResetRequest {
  newPassword: string
}

export const handlers = [
  // Authentication endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as LoginRequest
    
    if (body.username === 'admin' && body.password === 'Admin@123') {
      return HttpResponse.json({
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
          name: 'Administrator'
        },
        access_token: 'mock-jwt-token-admin'
      })
    }
    
    if (body.username === 'user' && body.password === 'User@123') {
      return HttpResponse.json({
        user: {
          id: 2,
          username: 'user',
          email: 'user@test.com',
          role: 'viewer',
          name: 'Regular User'
        },
        access_token: 'mock-jwt-token-user'
      })
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ success: true, message: 'Logged out successfully' })
  }),

  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    if (token === 'mock-jwt-token-admin') {
      return HttpResponse.json({
        success: true,
        data: {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
          name: 'Administrator'
        }
      })
    }
    
    if (token === 'mock-jwt-token-user') {
      return HttpResponse.json({
        success: true,
        data: {
          id: 2,
          username: 'user',
          email: 'user@test.com',
          role: 'viewer',
          name: 'Regular User'
        }
      })
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    )
  }),

  // Additional auth endpoints
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as RegisterRequest
    
    return HttpResponse.json({
      success: true,
      data: {
        id: 3,
        username: body.username,
        email: body.email || `${body.username}@test.com`,
        role: body.role,
        name: body.name || body.username,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  }),

  http.post(`${API_BASE_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        access_token: 'mock-refreshed-token'
      }
    })
  }),

  http.post(`${API_BASE_URL}/auth/change-password`, async ({ request }) => {
    const body = await request.json() as ChangePasswordRequest
    
    // Validate that required fields are present
    if (!body.oldPassword || !body.newPassword) {
      return HttpResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Password changed successfully'
    })
  }),

  http.post(`${API_BASE_URL}/auth/forgot-password`, async ({ request }) => {
    const body = await request.json() as ForgotPasswordRequest
    
    // Validate email format
    if (!body.email || !body.email.includes('@')) {
      return HttpResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Password reset email sent'
    })
  }),

  http.post(`${API_BASE_URL}/auth/reset-password`, async ({ request }) => {
    const body = await request.json() as ResetPasswordRequest
    
    // Validate that required fields are present
    if (!body.token || !body.newPassword) {
      return HttpResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Password reset successfully'
    })
  }),

  // Users endpoints
  http.get(`${API_BASE_URL}/users`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('admin')) {
      return HttpResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }
    
    return HttpResponse.json({
      data: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
          name: 'Administrator',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          username: 'user',
          email: 'user@test.com',
          role: 'viewer',
          name: 'Regular User',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ],
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    })
  }),

  http.get(`${API_BASE_URL}/users/:id`, ({ params }) => {
    const { id } = params
    
    if (id === '1') {
      return HttpResponse.json({
        success: true,
        data: {
          id: 1,
          username: 'admin',
          email: 'admin@test.com',
          role: 'admin',
          name: 'Administrator',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      })
    }
    
    if (id === '2') {
      return HttpResponse.json({
        success: true,
        data: {
          id: 2,
          username: 'user',
          email: 'user@test.com',
          role: 'viewer',
          name: 'Regular User',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      })
    }
    
    return HttpResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    )
  }),

  http.post(`${API_BASE_URL}/users`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.includes('admin')) {
      return HttpResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const body = await request.json() as CreateUserRequest
    
    return HttpResponse.json({
      success: true,
      data: {
        id: 3,
        ...body,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  }),

  http.put(`${API_BASE_URL}/users/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as UpdateUserRequest
    
    if (id === '999') {
      return HttpResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        id: parseInt(id as string),
        ...body,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  http.delete(`${API_BASE_URL}/users/:id`, ({ params }) => {
    const { id } = params
    
    if (id === '999') {
      return HttpResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  }),

  http.patch(`${API_BASE_URL}/users/:id/status`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as UserStatusRequest
    
    return HttpResponse.json({
      success: true,
      data: {
        id: parseInt(id as string),
        isActive: body.isActive,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  http.post(`${API_BASE_URL}/users/:id/reset-password`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as UserPasswordResetRequest
    
    if (id === '999') {
      return HttpResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    // Validate that password is provided
    if (!body.newPassword) {
      return HttpResponse.json(
        { success: false, message: 'New password is required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Password reset successfully'
    })
  }),

  http.get(`${API_BASE_URL}/users/:id/activity`, ({ params, request }) => {
    const { id } = params
    const url = new URL(request.url)
    const limit = url.searchParams.get('limit') || '50'
    
    if (id === '999') {
      return HttpResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        activities: [
          {
            id: 1,
            type: 'login',
            timestamp: new Date().toISOString(),
            description: 'User logged in'
          }
        ],
        total: 1,
        limit: parseInt(limit)
      }
    })
  }),

  // Customers endpoints - specific routes first
  http.get(`${API_BASE_URL}/customers/stats`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        total: 2,
        active: 1,
        inactive: 1,
        newThisMonth: 1
      }
    })
  }),

  http.get(`${API_BASE_URL}/customers`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Acme Corp',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          company: 'Tech Solutions',
          status: 'inactive',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ],
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    })
  }),

  http.get(`${API_BASE_URL}/customers/:id`, ({ params }) => {
    const { id } = params
    
    if (id === '1') {
      return HttpResponse.json({
        success: true,
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Acme Corp',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      })
    }
    
    if (id === '2') {
      return HttpResponse.json({
        success: true,
        data: {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          company: 'Tech Solutions',
          status: 'inactive',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      })
    }
    
    return HttpResponse.json(
      { success: false, message: 'Customer not found' },
      { status: 404 }
    )
  }),

  http.post(`${API_BASE_URL}/customers`, async ({ request }) => {
    const body = await request.json() as CreateCustomerRequest
    
    return HttpResponse.json({
      id: 3,
      ...body,
      createdAt: new Date().toISOString()
    }, { status: 201 })
  }),

  http.put(`${API_BASE_URL}/customers/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as UpdateCustomerRequest
    
    if (id === '999') {
      return HttpResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        id: parseInt(id as string),
        ...body,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  http.patch(`${API_BASE_URL}/customers/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as Partial<UpdateCustomerRequest>
    
    return HttpResponse.json({
      success: true,
      data: {
        id: parseInt(id as string),
        ...body,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  http.delete(`${API_BASE_URL}/customers/:id`, ({ params }) => {
    const { id } = params
    
    if (id === '999') {
      return HttpResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    })
  }),

  // Error simulation endpoints
  http.get(`${API_BASE_URL}/error/500`, () => {
    return HttpResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }),

  http.get(`${API_BASE_URL}/error/network`, () => {
    return HttpResponse.error()
  }),

  // Catch-all for any remaining unhandled endpoints
  http.get(`${API_BASE_URL}/nonexistent-endpoint`, () => {
    return HttpResponse.json(
      { success: false, message: 'Endpoint not found' },
      { status: 404 }
    )
  })
]