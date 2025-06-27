"use client"

import type React from "react"
import { useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { AuthContext } from "./context"

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        // Clear invalid stored data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    // Mock API call - replace with actual API integration
    const response = await mockLogin(username, password)

    if (response.success) {
      const { user: userData, token: userToken } = response.data
      setUser(userData)
      setToken(userToken)
      localStorage.setItem("token", userToken)
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      throw new Error(response.message || "Login failed")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Mock login function - replace with actual API call
const mockLogin = async (username: string, password: string): Promise<
  | { success: true; data: { user: User; token: string } }
  | { success: false; message: string }
> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock users for demo
  const mockUsers = {
    admin: { id: "1", username: "admin", role: "admin" as const },
    viewer: { id: "2", username: "viewer", role: "viewer" as const },
  }

  if (username in mockUsers && password === "password") {
    return {
      success: true,
      data: {
        user: mockUsers[username as keyof typeof mockUsers],
        token: `mock-jwt-token-${username}-${Date.now()}`,
      },
    }
  }

  return {
    success: false,
    message: "Invalid username or password",
  }
}
