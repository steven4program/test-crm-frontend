import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import AuthProvider from '../contexts/auth/AuthProvider'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
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
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test utilities
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key])
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] || null
  }
}

// Mock user data for tests
export const mockAdminUser = {
  id: 1,
  username: 'admin',
  email: 'admin@test.com',
  role: 'admin' as const,
  name: 'Administrator'
}

export const mockRegularUser = {
  id: 2,
  username: 'user',
  email: 'user@test.com',
  role: 'viewer' as const,
  name: 'Regular User'
}

export const mockCustomer = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  status: 'active' as const,
  createdAt: '2024-01-01T00:00:00.000Z'
}