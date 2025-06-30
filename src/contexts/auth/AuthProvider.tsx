"use client"

import type React from "react"
import { useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { AuthContext } from "./AuthContext"
import { authService } from "../../services/auth"

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        try {
          // Parse and immediately set stored user data for fast UI
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          
          // Verify token in background - don't block UI
          authService.verifyToken().catch((error) => {
            // Only clear on actual authentication errors (401/403), not network errors
            if (error?.status === 401 || error?.status === 403) {
              setUser(null)
              setToken(null)
              localStorage.removeItem("token")
              localStorage.removeItem("user")
            }
          })
        } catch {
          // Invalid stored data format, clear it
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ username, password })
      
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed")
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.warn("Logout API call failed:", error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
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

export default AuthProvider