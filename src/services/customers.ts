import { apiService, type ApiResponse } from './api'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  notes?: string
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  notes?: string
  status?: 'active' | 'inactive' | 'prospect'
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  status?: 'active' | 'inactive' | 'prospect'
}

export interface CustomerListResponse {
  customers: Customer[]
  total: number
  page: number
  limit: number
}

export interface CustomerFilters {
  status?: 'active' | 'inactive' | 'prospect'
  search?: string
  company?: string
  createdBy?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerStats {
  total: number
  active: number
  inactive: number
  prospects: number
  recentlyAdded: number
}

class CustomersService {
  // Get all customers with optional filtering and pagination
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomerListResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `/customers?${queryString}` : '/customers'
    
    const response = await apiService.get<ApiResponse<CustomerListResponse>>(endpoint)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch customers')
    }
    
    return response.data
  }

  // Get single customer by ID
  async getCustomer(customerId: string): Promise<Customer> {
    const response = await apiService.get<ApiResponse<Customer>>(`/customers/${customerId}`)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch customer')
    }
    
    return response.data
  }

  // Create new customer
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    const response = await apiService.post<ApiResponse<Customer>>('/customers', customerData)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create customer')
    }
    
    return response.data
  }

  // Update existing customer
  async updateCustomer(customerId: string, customerData: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiService.put<ApiResponse<Customer>>(`/customers/${customerId}`, customerData)
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update customer')
    }
    
    return response.data
  }

  // Delete customer
  async deleteCustomer(customerId: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<void>>(`/customers/${customerId}`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete customer')
    }
  }

  // Get customer statistics
  async getCustomerStats(): Promise<CustomerStats> {
    const response = await apiService.get<ApiResponse<CustomerStats>>('/customers/stats')
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch customer statistics')
    }
    
    return response.data
  }

  // Search customers by various criteria
  async searchCustomers(query: string, filters: Omit<CustomerFilters, 'search'> = {}): Promise<Customer[]> {
    const queryParams = new URLSearchParams({ search: query })
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
    
    const response = await apiService.get<ApiResponse<Customer[]>>(
      `/customers/search?${queryParams.toString()}`
    )
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to search customers')
    }
    
    return response.data
  }

  // Bulk operations
  async bulkUpdateStatus(customerIds: string[], status: Customer['status']): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>('/customers/bulk/status', {
      customerIds,
      status
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update customer statuses')
    }
  }

  async bulkDelete(customerIds: string[]): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>('/customers/bulk/delete', {
      customerIds
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete customers')
    }
  }

  // Export customers data
  async exportCustomers(format: 'csv' | 'xlsx' = 'csv', filters: CustomerFilters = {}): Promise<Blob> {
    const queryParams = new URLSearchParams({ format })
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
    
    const response = await fetch(`${apiService['baseUrl']}/customers/export?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to export customers')
    }
    
    return response.blob()
  }
}

export const customersService = new CustomersService()