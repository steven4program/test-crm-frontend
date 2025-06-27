export interface User {
  id: string
  username: string
  role: "admin" | "viewer"
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}