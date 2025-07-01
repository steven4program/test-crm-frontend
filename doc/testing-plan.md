# Testing Implementation Plan - CRM Frontend

## Overview

This document outlines the comprehensive testing strategy for the React 18 + TypeScript + Vite CRM frontend application. The testing approach is divided into stages, with Stage 1 focusing on establishing a solid unit testing foundation.

## Stage 1: Unit Testing Foundation

### Technology Stack

- **Test Runner**: Vitest (Vite-native, fast, TypeScript support)
- **Component Testing**: React Testing Library
- **Assertions**: Jest DOM matchers
- **API Mocking**: MSW (Mock Service Worker)
- **Coverage**: Built-in Vitest coverage with c8

### Dependencies

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "msw": "^2.0.0",
    "jsdom": "^23.0.0"
  }
}
```

### Test Structure

```
src/
├── services/
│   ├── __tests__/
│   │   ├── api.test.ts
│   │   ├── auth.test.ts
│   │   ├── customers.test.ts
│   │   └── users.test.ts
│   ├── api.ts
│   ├── auth.ts
│   ├── customers.ts
│   └── users.ts
├── contexts/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── AuthProvider.test.tsx
│   │   │   └── useAuth.test.ts
│   │   ├── AuthProvider.tsx
│   │   └── useAuth.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── handlers.ts
        └── server.ts
```

## Priority Testing Areas

### 1. Services Layer (High Priority)

#### api.ts
- **ApiService class initialization**
- **HTTP methods (GET, POST, PUT, DELETE)**
- **Error handling and ApiError class**
- **Authorization header injection**
- **Response parsing and error transformation**

#### auth.ts
- **Login functionality**
- **Logout functionality**
- **Token verification**
- **Error handling for authentication failures**

#### customers.ts & users.ts
- **CRUD operations**
- **Data transformation**
- **Error handling**
- **Query parameters handling**

### 2. Context and Hooks (Medium Priority)

#### AuthProvider.tsx
- **Initial state management**
- **Token persistence and retrieval**
- **Background token verification**
- **Login/logout state updates**

#### useAuth.ts
- **Hook return values**
- **Context consumption**
- **Error states**

## Testing Patterns

### Service Testing Pattern

```typescript
// Example: api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { apiService, ApiError } from '../api'
import { server } from '../../test/mocks/server'

describe('ApiService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should make GET requests successfully', async () => {
    // Test implementation
  })

  it('should handle API errors correctly', async () => {
    // Test error scenarios
  })
})
```

### Component Testing Pattern

```typescript
// Example: AuthProvider.test.tsx
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../AuthProvider'
import { useAuth } from '../useAuth'

const TestComponent = () => {
  const { user, login, logout } = useAuth()
  return <div>{user ? 'Logged in' : 'Not logged in'}</div>
}

describe('AuthProvider', () => {
  it('should provide authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    // Test assertions
  })
})
```

## Mock Strategy

### MSW Handlers

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: { id: 1, username: 'admin', role: 'admin' },
        token: 'mock-jwt-token'
      }
    })
  }),
  // Additional handlers...
]
```

## Coverage Goals

- **Services Layer**: 90%+ coverage
- **Context/Hooks**: 85%+ coverage
- **Critical Paths**: 100% coverage (auth flow, API error handling)
- **Overall Project**: 80%+ coverage

## Test Commands

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Best Practices

### 1. Test Naming Convention
- Use descriptive test names: `should handle API errors correctly`
- Group related tests with `describe` blocks
- Use `it` for individual test cases

### 2. Test Organization
- One test file per source file
- Place tests in `__tests__` directories
- Use consistent folder structure

### 3. Mocking Strategy
- Mock external dependencies (API calls)
- Use MSW for HTTP request mocking
- Mock localStorage and sessionStorage

### 4. Assertions
- Use specific assertions (`toEqual`, `toContain`, etc.)
- Test both success and error scenarios
- Verify side effects (localStorage updates, API calls)

### 5. Test Data
- Use factories for test data generation
- Keep test data minimal and focused
- Use constants for repeated values

## Future Stages

### Stage 2: Component Testing
- Form components and validation
- User interactions and events
- Accessibility testing
- Routing component tests

### Stage 3: Integration Testing
- Authentication flow integration
- API integration tests
- Role-based access control
- Error boundary testing

### Stage 4: E2E Testing
- Critical user journeys
- Cross-browser compatibility
- Performance testing
- Visual regression testing

## Continuous Integration

### GitHub Actions Integration
```yaml
- name: Run Tests
  run: |
    npm test -- --coverage
    npm run build
```

### Coverage Reporting
- Integrate with code coverage services
- Set coverage thresholds in CI
- Generate coverage reports

## Success Metrics

- [ ] All services have comprehensive unit tests
- [ ] Test coverage > 80% overall, > 90% for services
- [ ] Authentication flow fully tested
- [ ] Error handling scenarios covered
- [ ] Tests run in CI/CD pipeline
- [ ] Test documentation complete
- [ ] Team can write tests following established patterns

## Getting Started

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. View coverage: `npm run test:coverage`
4. Use test UI: `npm run test:ui`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)