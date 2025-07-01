import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../useAuth'
import AuthProvider from '../AuthProvider'
import type { ReactNode } from 'react'

// Wrapper component for testing hooks with context
const createWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('useAuth hook', () => {
  it('should return initial auth context values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.isLoading).toBe('boolean')
  })

  it('should throw error when used outside AuthProvider', () => {
    // Mock console.error to avoid noise in test output
    const originalError = console.error
    console.error = () => {}
    
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
    
    // Restore console.error
    console.error = originalError
  })

  it('should provide consistent context values', () => {
    const { result: result1 } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    const { result: result2 } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    // Both hooks should have the same structure
    expect(Object.keys(result1.current)).toEqual(Object.keys(result2.current))
    expect(typeof result1.current.login).toBe(typeof result2.current.login)
    expect(typeof result1.current.logout).toBe(typeof result2.current.logout)
  })

  it('should provide consistent function types across renders', () => {
    const { result, rerender } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    const initialLoginType = typeof result.current.login
    const initialLogoutType = typeof result.current.logout
    
    // Re-render and check if function types remain consistent
    rerender()
    
    expect(typeof result.current.login).toBe(initialLoginType)
    expect(typeof result.current.logout).toBe(initialLogoutType)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  it('should provide all required auth context properties', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    const requiredProperties = ['user', 'token', 'login', 'logout', 'isLoading']
    
    requiredProperties.forEach(property => {
      expect(result.current).toHaveProperty(property)
    })
  })

  it('should have correct types for context values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    // Type checks through runtime verification
    expect(result.current.user === null || typeof result.current.user === 'object').toBe(true)
    expect(result.current.token === null || typeof result.current.token === 'string').toBe(true)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.isLoading).toBe('boolean')
  })

  it('should return boolean for isLoading', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    expect(typeof result.current.isLoading).toBe('boolean')
    expect([true, false]).toContain(result.current.isLoading)
  })

  it('should handle context updates', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper
    })
    
    // Initial state should be loading or not loading
    const initialLoading = result.current.isLoading
    expect(typeof initialLoading).toBe('boolean')
    
    // User should initially be null
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })
})