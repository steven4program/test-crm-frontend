# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**Authentication Flow**:
- `AuthContext` provides authentication state and methods across the app
- Mock authentication system with localStorage persistence
- Role-based access control (admin/viewer roles)
- Protected routes using `PrivateRoute` and `AdminRoute` components

**Application Structure**:
- Main app wrapped with `BrowserRouter` and `AuthProvider` in `main.tsx`
- `Layout` component provides navigation and user info display
- Pages are in `/src/pages/` directory (Dashboard, Login, UserManagement, CustomerForm)
- Reusable components in `/src/components/` directory

**Styling System**:
- Tailwind CSS with custom CSS variables for theming
- Design tokens defined in CSS custom properties (--primary, --secondary, etc.)
- Responsive design with mobile-first approach

### Authentication Details
- Mock users: `admin/password` and `viewer/password`
- JWT-like token simulation for session management
- User data persisted in localStorage
- Role-based UI rendering (admin sees additional navigation items)

### Development Notes
- TypeScript strict mode enabled with unused variable checks
- ESLint configured for React and TypeScript with typescript-eslint v8
- Vite dev server configured for port 3000 with host exposure
- CSS custom properties used for theming consistency
- Tailwind CSS configured with custom design tokens (no external dependencies)

### Common Issues and Solutions
- **ESLint errors**: Run `npm run lint` to check for issues
- **Build errors**: Run `npm run build` to test TypeScript compilation and Vite build
- **Unused variables**: Use parameterless catch blocks `catch {` instead of `catch (err) {` when error not used
- **React Fast Refresh**: Warning about AuthContext exporting both components and hooks is acceptable