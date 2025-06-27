"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/auth"

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default PrivateRoute