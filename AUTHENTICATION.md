# Authentication System

## Overview

The authentication system uses NextAuth.js with Bolt Database integration for secure user management. It provides credentials-based authentication with role-based access control.

## Features

1. **User Login/Logout** - Secure authentication with email and password
2. **User Registration** - New user account creation
3. **Role-Based Access Control** - ADMIN, MANAGER, and STAFF roles
4. **Session Management** - JWT-based session handling
5. **Password Reset** - Email-based password recovery
6. **Multi-Factor Authentication** - Optional TOTP-based 2FA
7. **Protected Routes** - Middleware for route protection

## Implementation Details

### NextAuth Configuration

The authentication is configured in `src/lib/auth.ts` with:
- Credentials provider for email/password authentication
- JWT strategy for session management
- Custom callbacks for role handling
- Protected pages configuration

### Bolt Database Integration

User authentication is handled through the BoltAuth service in `src/lib/boltAuth.ts`:
- Password hashing with bcrypt
- User creation and authentication methods
- Role-based access control
- Row Level Security context management

### Protected Routes

Route protection is implemented through:
1. Middleware in `src/lib/middleware.ts` - Redirects unauthenticated users
2. ProtectedRoute component in `src/components/auth/ProtectedRoute.tsx` - Component-level protection
3. API route authentication - Each API endpoint validates session

### Role-Based Access Control

Roles are defined as:
- **ADMIN** - Full access to all features
- **MANAGER** - Access to most features except user management
- **STAFF** - Limited access to POS and inventory features

## API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Authenticate user
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out user

### User Management
- `GET /api/users` - Get all users (ADMIN only)
- `POST /api/users` - Create new user (ADMIN only)
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user (self or ADMIN)
- `DELETE /api/users/{id}` - Delete user (ADMIN only)

## Pages

### Authentication Pages
- `/auth/login` - Login page
- `/auth/register` - User registration
- `/auth/reset-password` - Password reset
- `/auth/mfa` - Multi-factor authentication setup
- `/auth/profile` - User profile management

### Protected Pages
- `/dashboard` - Main dashboard (all roles)
- `/pos` - Point of Sale (STAFF, MANAGER, ADMIN)
- `/inventory` - Inventory management (MANAGER, ADMIN)
- `/sales` - Sales reports (MANAGER, ADMIN)
- `/users` - User management (ADMIN only)
- `/settings` - System settings (ADMIN only)

## Security Features

1. **Password Security** - bcrypt hashing with salt
2. **Session Security** - JWT with secure configuration
3. **Row Level Security** - Database-level access control
4. **Rate Limiting** - API rate limiting (to be implemented)
5. **Input Validation** - Zod validation for all inputs
6. **CSRF Protection** - Built-in NextAuth protection

## Setup Instructions

1. Configure environment variables in `.env`:
   ```
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

2. Create initial admin user through the registration page or database seed

3. Configure Row Level Security policies in PostgreSQL (handled automatically with Docker setup)

## Extending Authentication

To add new authentication providers:
1. Add provider to `src/lib/auth.ts`
2. Update login page to include new provider options
3. Implement provider-specific user creation in `src/lib/boltAuth.ts`

To add new roles:
1. Add role to UserRole enum in `prisma/schema.prisma`
2. Update role validation logic in API routes
3. Update ProtectedRoute component
4. Update UI to show/hide features based on role