# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Instruction
You are a Senior Front-End Developer and an Expert in ReactJS, JavaScript, TypeScript, HTML, CSS and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn). You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

- Follow the user’s requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Confirm, then write code!
- Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines .
- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Leave NO todo’s, placeholders or missing pieces.
- Ensure code is complete! Verify thoroughly finalised.
- Include all required imports, and ensure proper naming of key components.
- Be concise Minimize any other prose.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.

### Coding Environment
The user asks questions about the following coding languages:
- ReactJS
- NextJS
- JavaScript
- TypeScript
- TailwindCSS
- HTML
- CSS

### Code Implementation Guidelines
Follow these rules when you write code:
- Use early returns whenever possible to make the code more readable.
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags.
- Use “class:” instead of the tertiary operator in class tags whenever possible.
- Use descriptive variable and function/const names. Also, event functions should be named with a “handle” prefix, like “handleClick” for onClick and “handleKeyDown” for onKeyDown.
- Implement accessibility features on elements. For example, a tag should have a tabindex=“0”, aria-label, on:click, and on:keydown, and similar attributes.
- Use consts instead of functions, for example, “const toggle = () =>”. Also, define a type if possible.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Project Architecture

This is a React 18 + TypeScript + Vite CRM frontend application with the following structure:

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system (extends shadcn/ui config)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **State Management**: React Context (AuthContext)

### Key Architecture Patterns

**API Integration**:
- RESTful API integration with `/api/v1` prefix
- Centralized API service layer in `/src/services/`
- Base API configuration with environment variable support
- Authentication token management and automatic inclusion in requests
- Comprehensive error handling and type safety

**Authentication Flow**:
- `AuthContext` provides authentication state and methods across the app
- Real API authentication with JWT token management
- Role-based access control (admin/viewer roles)
- Protected routes using `PrivateRoute` and `AdminRoute` components
- Token verification and automatic logout on token expiry

**Application Structure**:
- Main app wrapped with `BrowserRouter` and `AuthProvider` in `main.tsx`
- `Layout` component provides navigation and user info display
- Pages are in `/src/pages/` directory (Dashboard, Login, UserManagement, CustomerForm)
- Reusable components in `/src/components/` directory
- Service layer in `/src/services/` for API communication

**Service Layer Architecture**:
- `api.ts`: Base API service with request/response handling
- `auth.ts`: Authentication service (login, logout, token management)
- `users.ts`: User management operations (CRUD, role management)
- `customers.ts`: Customer management operations (CRUD, search, export)

**Styling System**:
- Tailwind CSS with custom CSS variables for theming
- Design tokens defined in CSS custom properties (--primary, --secondary, etc.)
- Responsive design with mobile-first approach

### API Configuration
- Environment variable: `VITE_API_BASE_URL`
  - Local development: `http://localhost:3000`
  - Production: `https://test-crm-api.zeabur.app` (Zeabur deployment)
- API prefix: `/api/v1`
- Authentication: Bearer token in Authorization header
- Error handling: Centralized with custom ApiError class
- Request/response: JSON format with standardized response structure

### Authentication Details
- API-based authentication with JWT tokens
- User data fetched from `/api/v1/auth/login` endpoint
- Token stored in localStorage with automatic verification on app load
- Role-based UI rendering (admin sees additional navigation items)
- Automatic logout on token expiry or API errors

### Development Notes
- TypeScript strict mode enabled with unused variable checks
- ESLint configured for React and TypeScript with typescript-eslint v8
- Vite dev server configured for port 3000 with host exposure
- CSS custom properties used for theming consistency
- Tailwind CSS configured with custom design tokens (no external dependencies)

### API Endpoints Structure
**Authentication**: `/api/v1/auth/*`
- `POST /login` - User authentication
- `POST /logout` - User logout
- `POST /refresh` - Token refresh
- `GET /me` - Get current user info

**Users**: `/api/v1/users/*` (Admin only)
- `GET /users` - List users with filtering
- `POST /users` - Create new user
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Customers**: `/api/v1/customers/*`
- `GET /customers` - List customers with filtering/pagination
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer details
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer
- `GET /customers/stats` - Get customer statistics

### Common Issues and Solutions
- **ESLint errors**: Run `npm run lint` to check for issues
- **Build errors**: Run `npm run build` to test TypeScript compilation and Vite build
- **Unused variables**: Use parameterless catch blocks `catch {` instead of `catch (err) {` when error not used
- **React Fast Refresh**: Warning about AuthContext exporting both components and hooks is acceptable
- **API Connection**: Check `VITE_API_BASE_URL` in `.env` file and ensure backend server is running
- **Authentication Issues**: Clear localStorage and try logging in again if experiencing auth problems