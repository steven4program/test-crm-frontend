export interface User {
  id: string
  username: string
  role: "admin" | "viewer"
  email?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}