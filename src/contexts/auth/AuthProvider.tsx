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
          // Verify token is still valid
          const verifiedUser = await authService.verifyToken()
          setToken(storedToken)
          setUser(verifiedUser)
        } catch {
          // Token is invalid, clear stored data
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