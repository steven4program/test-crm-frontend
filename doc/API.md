# CRM Backend API Documentation

## Base URL
- **Local Development**: `http://localhost:3000/api/v1`
- **Production (Zeabur)**: `https://your-zeabur-app.zeabur.app/api/v1`

## Authentication
Uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Viewer**: Read-only access to customer data, no user management access

---

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response (Success):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

#### POST /auth/logout
Logout user (client-side token invalidation).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### User Management (Admin Only)

#### GET /users
Get all users (excluding passwords). Supports pagination.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (All Users):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "created_at": "2025-06-27T12:00:00.000Z",
    "updated_at": "2025-06-27T12:00:00.000Z"
  }
]
```

**Response (Paginated):**
```json
{
  "data": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "created_at": "2025-06-27T12:00:00.000Z",
      "updated_at": "2025-06-27T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /users/:id
Get user by ID.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "created_at": "2025-06-27T12:00:00.000Z",
  "updated_at": "2025-06-27T12:00:00.000Z"
}
```

#### POST /users
Create new user.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "username": "newuser",
  "password": "SecurePass123",
  "role": "viewer"
}
```

**Response:**
```json
{
  "id": 2,
  "username": "newuser",
  "role": "viewer",
  "created_at": "2025-06-27T12:00:00.000Z",
  "updated_at": "2025-06-27T12:00:00.000Z"
}
```

#### PUT /users/:id
Update user details.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "username": "updateduser",
  "role": "admin"
}
```

#### DELETE /users/:id
Delete user (cannot delete own account).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:** `204 No Content`

---

### Customer Management

#### GET /customers
Get all customers (Admin and Viewer access). Supports pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (All Customers):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "address": "123 Main St, City, State",
    "created_at": "2025-06-27T12:00:00.000Z",
    "updated_at": "2025-06-27T12:00:00.000Z"
  }
]
```

**Response (Paginated):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "Acme Corp",
      "address": "123 Main St, City, State",
      "created_at": "2025-06-27T12:00:00.000Z",
      "updated_at": "2025-06-27T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /customers/:id
Get customer by ID (Admin and Viewer access).

**Headers:**
```
Authorization: Bearer <token>
```

#### POST /customers
Create new customer (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1987654321",
  "company": "Tech Solutions",
  "address": "456 Oak Ave, City, State"
}
```

#### PUT /customers/:id
Update customer (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### DELETE /customers/:id
Delete customer (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:** `204 No Content`

---

### Health Check

#### GET /health
Check application health status including database connectivity.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-06-27T07:30:00.000Z"
}
```

#### GET /health/ready
Readiness probe for deployment health checks.

#### GET /health/live
Basic liveness probe.

---

### Root

#### GET /
Simple welcome endpoint.

**Response:**
```
Hello World!
```

---

## Error Responses

All error responses follow a standardized format with enhanced metadata:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "timestamp": "2025-06-27T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "message": [
    "username should not be empty",
    "password should not be empty"
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "timestamp": "2025-06-27T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "GET",
  "message": ["Unauthorized"]
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "timestamp": "2025-06-27T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "GET",
  "message": ["Forbidden resource"]
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "timestamp": "2025-06-27T12:00:00.000Z",
  "path": "/api/v1/users/123",
  "method": "GET",
  "message": ["User with ID 123 not found"]
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "timestamp": "2025-06-27T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "message": ["Username already exists"]
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "timestamp": "2025-06-27T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "GET",
  "message": ["Too Many Requests"]
}
```

---

## Rate Limiting

API endpoints are protected by rate limiting to prevent abuse:

- **Short-term**: 10 requests per second
- **Medium-term**: 100 requests per minute  
- **Long-term**: 1000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support optional pagination via query parameters:

**Parameters:**
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, min: 1, max: 100)

**Without pagination**: Returns all records as an array
**With pagination**: Returns paginated response object

**Example:**
```
GET /api/v1/users?page=2&limit=5
GET /api/v1/customers?page=1&limit=20
```

---

## Data Validation

### User Creation/Update
- `username`: Min 3 characters, required
- `password`: Min 6 characters, required for creation
- `role`: Must be 'admin' or 'viewer', defaults to 'viewer'

### Customer Creation/Update
- `name`: Required, max 100 characters
- `email`: Valid email format, required
- `phone`: Required, max 20 characters
- `company`: Optional, max 100 characters
- `address`: Optional, max 255 characters

### Pagination Validation
- `page`: Integer, min 1
- `limit`: Integer, min 1, max 100

---

## Implementation Status

### ✅ Implemented (Phase 1, 2 & 3)
- Authentication (login/logout) with JWT tokens
- User management with role-based access control
- Customer management with role-based access control
- Role guards and authorization middleware
- Health monitoring with database connectivity checks
- CORS configuration for frontend integration
- Global validation with class-validator
- Database operations with raw SQL and connection pooling
- **Phase 3 Features:**
  - Comprehensive testing suite (46 unit tests, E2E tests)
  - API rate limiting (multi-tier protection)
  - Enhanced error logging with Winston
  - Structured logging with request tracking
  - Global exception handling with standardized responses
  - Pagination for Users and Customers endpoints
  - Security event monitoring
  - Production-ready monitoring and observability

### 🚀 Production Ready
- **Security**: Rate limiting, input validation, JWT authentication
- **Monitoring**: Structured logging, error tracking, health checks
- **Testing**: 42.56% code coverage with comprehensive test suite
- **Performance**: Connection pooling, pagination, efficient queries
- **Scalability**: Modular architecture, proper error handling

---

## Usage Examples

### JavaScript/TypeScript

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
});

const { access_token } = await loginResponse.json();

// Get customers with pagination (works for both admin and viewer)
const customersResponse = await fetch('http://localhost:3000/api/v1/customers?page=1&limit=10', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

// Get all customers (no pagination)
const allCustomersResponse = await fetch('http://localhost:3000/api/v1/customers', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

// Create user (admin only)
const userResponse = await fetch('http://localhost:3000/api/v1/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    username: 'newuser',
    password: 'SecurePass123',
    role: 'viewer'
  })
});

// Handle rate limiting
const makeRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      console.log('Rate limited, waiting before retry...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return makeRequest(url, options);
    }
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Get all customers
curl -X GET http://localhost:3000/api/v1/customers \
  -H "Authorization: Bearer <your-token>"

# Get customers with pagination
curl -X GET "http://localhost:3000/api/v1/customers?page=1&limit=5" \
  -H "Authorization: Bearer <your-token>"

# Get users with pagination (admin only)
curl -X GET "http://localhost:3000/api/v1/users?page=2&limit=10" \
  -H "Authorization: Bearer <admin-token>"

# Create customer (admin only)
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp"
  }'

# Health check
curl -X GET http://localhost:3000/api/v1/health

# Check rate limiting headers
curl -X GET http://localhost:3000/api/v1/customers \
  -H "Authorization: Bearer <your-token>" \
  -I  # Include headers in response
```

---

## Notes

### General
- All endpoints return JSON responses
- Timestamps are in ISO 8601 format
- Role-based access is strictly enforced
- Database uses MySQL with connection pooling
- Global validation pipes ensure request data integrity

### Security
- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens expire in 24 hours by default
- Users cannot delete their own account
- Rate limiting protects against abuse (10/sec, 100/min, 1000/hr)
- All requests are logged with security event monitoring

### Testing & Monitoring
- Comprehensive test suite with 42.56% code coverage
- Structured logging with Winston for production monitoring
- Global exception handling with standardized error responses
- Health checks include database connectivity validation

### Pagination
- Optional pagination on list endpoints
- Default: 10 items per page, maximum: 100 items per page
- Returns all records if no pagination parameters provided
- Includes rich metadata (total, pages, next/previous indicators)

### Performance
- Connection pooling for database efficiency
- Request/response logging with timing information
- Efficient pagination queries with proper indexing
- Production-ready with monitoring and observability features