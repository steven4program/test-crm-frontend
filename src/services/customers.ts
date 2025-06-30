import { apiService } from './api'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  notes?: string
  status?: 'active' | 'inactive' | 'prospect'
  createdAt?: string
  updatedAt?: string
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
  page?: number
  limit?: number
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
    
    // The API returns: { customers: { data: [...], pagination: {...} }, page: number }
    const response = await apiService.get<{
      data: Customer[]
      pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }>(endpoint)
    
    return {
      customers: response.data,
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit
    }
  }

  // Get single customer by ID
  async getCustomer(customerId: string): Promise<Customer> {
    const response = await apiService.get<Customer>(`/customers/${customerId}`)
    return response
  }

  // Create new customer
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    const response = await apiService.post<Customer>('/customers', customerData)
    return response
  }

  // Update existing customer
  async updateCustomer(customerId: string, customerData: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiService.put<Customer>(`/customers/${customerId}`, customerData)
    return response
  }

  // Delete customer
  async deleteCustomer(customerId: string): Promise<void> {
    await apiService.delete<void>(`/customers/${customerId}`)
  }

}

export const customersService = new CustomersService()