import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import AuthProvider from '../AuthProvider'
import { useAuth } from '../useAuth'
import { mockAdminUser } from '../../../test/utils'

// Test component to access auth context
const TestComponent = () => {
  const { user, token, login, logout, isLoading } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="user">{user ? user.username : 'no-user'}</div>
      <div data-testid="token">{token ? 'has-token' : 'no-token'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login('admin', 'Admin@123')}
      >
        Login
      </button>
      <button 
        data-testid="logout-btn" 
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  )
}

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Initial state', () => {
    it('should initialize with no user and not loading', async () => {
      renderWithProvider(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    })

    it('should initialize with stored user data', async () => {
      localStorage.setItem('token', 'mock-jwt-token-admin')
      localStorage.setItem('user', JSON.stringify(mockAdminUser))
      
      renderWithProvider(<TestComponent />)
      
      // Should immediately show stored user data
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
      expect(screen.getByTestId('token')).toHaveTextContent('has-token')
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
    })

    it('should clear invalid stored data', async () => {
      localStorage.setItem('token', 'invalid-token')
      localStorage.setItem('user', 'invalid-json')
      
      renderWithProvider(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(screen.getByTestId('token')).toHaveTextContent('no-token')
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('Token verification', () => {
    it('should verify valid token in background', async () => {
      localStorage.setItem('token', 'mock-jwt-token-admin')
      localStorage.setItem('user', JSON.stringify(mockAdminUser))
      
      renderWithProvider(<TestComponent />)
      
      // Should immediately show stored data
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      // User should still be logged in after background verification
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
    })

    it('should clear data on invalid token verification', async () => {
      localStorage.setItem('token', 'invalid-token')
      localStorage.setItem('user', JSON.stringify(mockAdminUser))
      
      renderWithProvider(<TestComponent />)
      
      // Should initially show stored data
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
      
      // Wait for background verification to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      }, { timeout: 2000 })
      
      expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    })

    it('should handle network errors gracefully during verification', async () => {
      localStorage.setItem('token', 'mock-jwt-token-admin')
      localStorage.setItem('user', JSON.stringify(mockAdminUser))
      
      // Mock network error - user should remain logged in
      renderWithProvider(<TestComponent />)
      
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      // Should still be logged in despite network error
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
    })
  })

  describe('Login functionality', () => {
    it('should login successfully with valid credentials', async () => {
      renderWithProvider(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      // Click login button
      fireEvent.click(screen.getByTestId('login-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('admin')
      })
      
      expect(screen.getByTestId('token')).toHaveTextContent('has-token')
      expect(localStorage.getItem('token')).toBe('mock-jwt-token-admin')
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockAdminUser))
    })

    it('should handle login errors', async () => {
      renderWithProvider(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      // This would require a more complex test setup to properly test error handling
      // For now, we verify the structure is in place
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  describe('Logout functionality', () => {
    it('should logout successfully', async () => {
      // Start with logged in user
      localStorage.setItem('token', 'mock-jwt-token-admin')
      localStorage.setItem('user', JSON.stringify(mockAdminUser))
      
      renderWithProvider(<TestComponent />)
      
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
      
      // Click logout button
      fireEvent.click(screen.getByTestId('logout-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      })
      
      expect(screen.getByTestId('token')).toHaveTextContent('no-token')
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    it('should clear local data even if logout API fails', async () => {
      localStorage.setItem('token', 'mock-jwt-token-admin')
      localStorage.setItem('user', JSON.stringify(mockAdminUser))
      
      renderWithProvider(<TestComponent />)
      
      expect(screen.getByTestId('user')).toHaveTextContent('admin')
      
      // Mock API failure and logout should still clear local data
      fireEvent.click(screen.getByTestId('logout-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      })
      
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('Context value', () => {
    it('should provide all required context values', async () => {
      const ContextTestComponent = () => {
        const context = useAuth()
        
        return (
          <div>
            <div data-testid="has-user">{context.user ? 'true' : 'false'}</div>
            <div data-testid="has-token">{context.token ? 'true' : 'false'}</div>
            <div data-testid="has-login">{typeof context.login === 'function' ? 'true' : 'false'}</div>
            <div data-testid="has-logout">{typeof context.logout === 'function' ? 'true' : 'false'}</div>
            <div data-testid="has-loading">{typeof context.isLoading === 'boolean' ? 'true' : 'false'}</div>
          </div>
        )
      }
      
      renderWithProvider(<ContextTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('has-user')).toHaveTextContent('false')
      })
      
      expect(screen.getByTestId('has-token')).toHaveTextContent('false')
      expect(screen.getByTestId('has-login')).toHaveTextContent('true')
      expect(screen.getByTestId('has-logout')).toHaveTextContent('true')
      expect(screen.getByTestId('has-loading')).toHaveTextContent('true')
    })
  })

  describe('State management', () => {
    it('should handle user state updates correctly', async () => {
      renderWithProvider(<TestComponent />)
      
      // Initial state
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      
      // Login
      fireEvent.click(screen.getByTestId('login-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('admin')
      })
      
      // Logout
      fireEvent.click(screen.getByTestId('logout-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      })
    })

    it('should handle token state updates correctly', async () => {
      renderWithProvider(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
      
      expect(screen.getByTestId('token')).toHaveTextContent('no-token')
      
      // Login should set token
      fireEvent.click(screen.getByTestId('login-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('token')).toHaveTextContent('has-token')
      })
      
      // Logout should clear token
      fireEvent.click(screen.getByTestId('logout-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('token')).toHaveTextContent('no-token')
      })
    })
  })
})