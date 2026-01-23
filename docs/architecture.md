# Architecture Overview

## System Design

Sphinx Reisen is a modern travel agency application built with Next.js 15 using the App Router architecture. The system follows a **layered architecture** pattern optimized for performance, maintainability, and AI agent comprehension.

### Core Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
2. **Type Safety**: Full TypeScript coverage for compile-time error detection
3. **Performance First**: Server Components, ISR, and optimistic caching strategies
4. **AI-Friendly**: Consistent naming, clear file structure, extensive inline documentation

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│          Presentation Layer (app/)              │
│  - Route Handlers (pages)                       │
│  - Server Components                            │
│  - Client Components (marked 'use client')      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│       Business Logic Layer (lib/services/)      │
│  - Tour Service                                 │
│  - Booking Service                              │
│  - Review Service                               │
│  - Auth Service                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Data Layer (lib/db/)                    │
│  - Mongoose Models                              │
│  - Database Connection                          │
│  - Data Validation                              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Database (MongoDB)                      │
│  - Tours Collection                             │
│  - Bookings Collection                          │
│  - Reviews Collection                           │
│  - Admin Collection                             │
└─────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Server Components First
- Default to Server Components for data fetching
- Use Client Components only when needed (interactivity, browser APIs)
- Minimize client-side JavaScript bundle

### 2. Server Actions
- Form submissions use Server Actions (no API routes needed)
- Automatic revalidation after mutations
- Type-safe data mutations

### 3. Route Groups
- `(public)` - Public-facing pages with header/footer
- `(auth)` - Authentication pages with minimal layout
- `admin` - Protected admin panel with sidebar

### 4. Internationalization
- URL-based locale routing (`/en/tours`, `/de/tours`)
- Server-side translation loading
- No client-side translation bundles

### 5. Database Connection Pooling
- Singleton MongoDB connection
- Connection caching across serverless invocations
- Automatic reconnection on failure

## Data Flow

### Public Tour Listing
```
User → /en/tours → Server Component → fetchTours() → MongoDB → Render
                                                       ↓
                                              Cache (10 min)
```

### Admin Tour Creation
```
Admin → Form → Server Action → Validate → Save to DB → Revalidate Cache → Redirect
```

### Booking Submission
```
User → Form → Server Action → Validate → Create Booking → Email (future) → Success Page
```

## Performance Optimizations

### 1. Caching Strategy
- **ISR (Incremental Static Regeneration)**: Tour listings (revalidate: 600s)
- **On-Demand Revalidation**: After admin updates
- **CDN Caching**: Static assets with far-future expiry

### 2. Image Optimization
- Next.js Image component with automatic optimization
- WebP/AVIF format conversion
- Responsive image sizes
- Lazy loading below fold

### 3. Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Minimal client-side JavaScript

### 4. Database Indexing
- Compound indexes on frequently queried fields
- Unique indexes for slug lookups
- Text indexes for search (future feature)

## Security Architecture

### Authentication Flow
```
1. Admin enters password
2. Verify against hashed password in DB
3. Generate JWT token with 7-day expiry
4. Store token in httpOnly cookie
5. Middleware validates token on admin routes
```

### Security Measures
- bcrypt password hashing (10 rounds)
- JWT tokens with jose library
- httpOnly cookies (no client-side access)
- CSRF protection via Server Actions
- Rate limiting on authentication endpoints
- Input validation with Zod schemas

## Error Handling

### Error Hierarchy
```
AppError (base)
├── ValidationError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
└── ConflictError (409)
```

### Error Boundaries
- Global error boundary in `app/error.tsx`
- Route-specific error boundaries
- API error responses with consistent format

## File Naming Conventions

### Components
- **Pascal Case**: `TourCard.tsx`, `BookingForm.tsx`
- **Prefixes**: None (file location indicates purpose)

### Utilities
- **Camel Case**: `formatters.ts`, `helpers.ts`
- **Descriptive**: Name indicates functionality

### Routes
- **Kebab Case**: `tour-detail`, `admin-panel`
- **Dynamic**: `[slug]`, `[id]`

### Types
- **Dot Notation**: `tour.types.ts`, `api.types.ts`

## State Management

### Server State
- Fetched in Server Components
- Passed as props to Client Components
- No global state library needed

### Client State
- React useState for local UI state
- No complex state management
- Forms use React Hook Form (future)

## Testing Strategy (Future)

### Unit Tests
- Utility functions
- Component logic
- Service layer functions

### Integration Tests
- API routes
- Server Actions
- Database operations

### E2E Tests
- Critical user flows
- Admin workflows
- Booking process

## Deployment Architecture

### Platform: Vercel / Railway
```
User Request
     ↓
CDN (Static Assets)
     ↓
Edge Network (Middleware)
     ↓
Serverless Functions (API Routes, Server Components)
     ↓
MongoDB Atlas (Database)
```

### Environment Configuration
- Development: Local MongoDB
- Staging: MongoDB Atlas (shared cluster)
- Production: MongoDB Atlas (dedicated cluster)

## Monitoring & Observability (Future)

- Error tracking: Sentry
- Performance monitoring: Vercel Analytics
- Database monitoring: MongoDB Atlas built-in
- Custom logging: Winston (structured logs)

## AI Agent Guidelines

### When Adding Features
1. Check existing patterns in similar files
2. Follow TypeScript types strictly
3. Add inline JSDoc comments for complex logic
4. Update this documentation
5. Keep naming consistent

### When Debugging
1. Check error boundaries for error messages
2. Review MongoDB indexes for slow queries
3. Check middleware for auth issues
4. Review API route handlers for validation

### When Refactoring
1. Use TypeScript to find all usages
2. Update tests if they exist
3. Check for breaking changes in API contracts
4. Update documentation
