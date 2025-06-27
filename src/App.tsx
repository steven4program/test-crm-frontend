import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/auth"
import LoginPage from "./pages/login"
import DashboardPage from "./pages/DashboardPage"
import UserManagementPage from "./pages/UserManagementPage"
import CustomerFormPage from "./pages/CustomerFormPage"
import Layout from "./components/layout"
import { PrivateRoute, AdminRoute } from "./components/routing"

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
        <Route path="customers/new" element={<CustomerFormPage />} />
        <Route path="customers/:id/edit" element={<CustomerFormPage />} />
      </Route>
    </Routes>
  )
}

export default App
