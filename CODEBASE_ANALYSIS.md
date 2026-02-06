# Codebase Analysis - Sphinx Reisen Travel Agency

## 📋 Overview

**Sphinx Reisen** is a modern, full-stack travel agency website built with Next.js 15, TypeScript, and MongoDB. The application provides a bilingual (English/German) platform for showcasing tours, managing bookings, and handling customer reviews with a secure admin panel.

---

## 🏗️ Architecture & Technology Stack

### Core Framework

- **Next.js 15.1.0** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.3.3** - Type safety

### Database & Backend

- **MongoDB** - NoSQL database (via Mongoose 8.0.0)
- **Mongoose ODM** - Database modeling and queries
- **JWT Authentication** - Using `jose` library for token management
- **bcryptjs** - Password hashing

### Internationalization

- **next-intl 3.25.1** - i18n solution
- **Supported Languages**: English (en), German (de)
- **Locale-based routing**: `/en/*` and `/de/*`

### UI & Styling

- **CSS Modules** - Component-scoped styling (converted from Tailwind/shadcn)
- **Google Fonts**: Oswald, Lato, Montserrat
- **React Icons** - Icon library
- **Lucide React** - Additional icons
- **Font Awesome 6.5.0** - Via CDN

### Form Handling & Validation

- **react-hook-form 7.54.2** - Form management
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Image Optimization

- **sharp 0.33.2** - Image processing
- **Next.js Image Component** - Optimized image delivery

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution
- **@next/bundle-analyzer** - Bundle analysis

---

## 📁 Project Structure

```
travel-next-js/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── (public)/             # Public pages (route group)
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── about/            # About page
│   │   │   ├── contact/          # Contact page
│   │   │   └── tours/            # Tours pages
│   │   │       ├── page.tsx      # Tours listing
│   │   │       └── [slug]/       # Tour detail page
│   │   ├── (auth)/               # Auth pages (route group)
│   │   │   └── login/            # Admin login
│   │   └── admin/                # Protected admin panel
│   │       ├── page.tsx          # Admin dashboard
│   │       ├── tours/            # Tour management
│   │       ├── bookings/         # Booking management
│   │       └── reviews/          # Review moderation
│   ├── api/                      # API routes
│   │   ├── tours/                # Tour CRUD operations
│   │   ├── bookings/             # Booking operations
│   │   ├── reviews/              # Review operations
│   │   ├── auth/                 # Authentication
│   │   ├── upload/               # Image upload
│   │   └── health/               # Health check
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
│
├── components/                   # React components
│   ├── admin/                    # Admin panel components
│   │   ├── ToursAdminPage.tsx
│   │   ├── BookingsAdminPage.tsx
│   │   ├── ReviewsAdminPage.tsx
│   │   ├── TourForm.tsx
│   │   ├── DataTable.tsx
│   │   └── ...
│   ├── home/                     # Homepage sections
│   │   ├── HeroSlider.tsx
│   │   ├── ToursSection.tsx
│   │   ├── SpecialDeals.tsx
│   │   ├── Testimonials.tsx
│   │   └── ...
│   ├── tours/                    # Tour-related components
│   │   ├── TourCard.tsx
│   │   ├── TourDetails.tsx
│   │   ├── TourBookingForm.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── CtaBanner.tsx
│   └── FloatingWhatsApp.tsx      # WhatsApp widget
│
├── lib/                          # Utilities and services
│   ├── db/                       # Database
│   │   ├── mongoose.ts           # Connection handler
│   │   └── models/               # Mongoose models
│   │       ├── tour.model.ts
│   │       ├── booking.model.ts
│   │       ├── review.model.ts
│   │       └── admin.model.ts
│   ├── auth/                     # Authentication utilities
│   │   └── index.ts              # JWT & password functions
│   ├── api/                      # API helpers
│   │   └── helpers.ts            # Request/response utilities
│   ├── validations/              # Zod schemas
│   │   ├── tour.schema.ts
│   │   ├── booking.schema.ts
│   │   ├── review.schema.ts
│   │   └── auth.schema.ts
│   └── utils/                    # Helper functions
│
├── types/                        # TypeScript definitions
│   ├── tour.types.ts
│   ├── booking.types.ts
│   ├── review.types.ts
│   └── api.types.ts
│
├── config/                       # Configuration files
│   ├── site.ts                   # Site configuration
│   ├── navigation.ts             # Navigation config
│   └── seo.ts                    # SEO configuration
│
├── messages/                     # Translation files
│   ├── en.json                   # English translations
│   └── de.json                   # German translations
│
├── styles/                       # CSS Modules
│   ├── components/               # Component styles
│   └── pages/                    # Page styles
│
├── public/                       # Static assets
│   └── images/                   # Images
│
├── docs/                         # Documentation
│   ├── API_REFERENCE.md
│   ├── DATABASE_SETUP.md
│   ├── BACKEND_QUICKSTART.md
│   └── RAILWAY_DEPLOYMENT.md
│
├── scripts/                      # Utility scripts
│   ├── test-db-connection.ts
│   └── copy-standalone-assets.js
│
├── middleware.ts                # Next.js middleware (i18n)
├── i18n.ts                       # next-intl configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🔑 Key Features

### 1. **Bilingual Support (i18n)**

- Full English/German translation
- Locale-based routing (`/en/*`, `/de/*`)
- All content fields support both languages (e.g., `title`, `title_de`)
- Automatic locale detection and switching

### 2. **Tour Management**

- Rich tour data model with extensive fields:
  - Basic info (title, price, category, description)
  - Extended content (transportation, location, details, etc.)
  - 6 location markers for maps
  - 4 image slots
  - Sale/discount support
  - Active/inactive status
- Public tour listing with filters (category, sale, search)
- Detailed tour pages with booking form
- Admin CRUD operations for tours

### 3. **Booking System**

- Customer booking form with:
  - Personal details (name, email, phone)
  - Travel party (adults, children, infants)
  - Travel date selection
  - Special requirements/notes
  - Pickup location
- Booking status management (pending/confirmed/cancelled)
- Multi-currency support (USD/EUR)
- Admin booking management interface

### 4. **Review System**

- Customer reviews with ratings (1-5 stars)
- Review moderation (approval system)
- One review per customer per tour
- Display approved reviews on tour pages

### 5. **Admin Panel**

- JWT-based authentication
- Protected admin routes
- Dashboard for managing:
  - Tours (CRUD operations)
  - Bookings (view, update status)
  - Reviews (moderate, approve/reject)
- Image upload functionality
- Data tables with pagination, search, and filtering

### 6. **Performance Optimizations**

- Server Components by default
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Standalone output for production
- Bundle analyzer support
- Code splitting and lazy loading

### 7. **SEO & Metadata**

- Dynamic sitemap generation
- Robots.txt configuration
- Metadata API for pages
- Open Graph support
- Structured data ready

---

## 🗄️ Database Schema

### **Tours Collection**

```typescript
{
  // Basic Info
  title: string (required, max 100)
  title_de?: string (max 100)
  price: number (required, min 0)
  travelType: '1 day' | '2 days' | '3 days' | '4 days' | '5 days' | '6 days' | '7 days' | '8 days' | '9 days' | '10 days' | '2 weeks' | '3 weeks' | '1 month' | 'more'
  category: string (required, max 50)
  description: string (required, max 2000)

  // Extended Content (all optional, bilingual)
  longDescription, transportation, location, details,
  description2, daysAndDurations, pickup, briefing,
  trip, program, foodAndBeverages, whatToTake,
  pickupLocation, vanLocation

  // Location Markers (6 locations, bilingual)
  location1-6: string (max 200)

  // Images (4 images)
  image1-4: string (URLs)

  // Status
  slug: string (required, unique, indexed)
  sortOrder: number (default 0)
  isActive: boolean (default true)
  onSale: boolean (default false)
  discount: number (0-100, default 0)

  // Timestamps
  createdAt, updatedAt
}
```

**Indexes:**

- `category + isActive`
- `onSale + isActive`
- Text search on `title, description, category`
- Unique index on `slug`

### **Bookings Collection**

```typescript
{
  name: string (required)
  phone: string (required)
  email: string (required, lowercase, indexed)
  adults: number (required, 1-20)
  children: number (default 0, 0-20)
  infants: number (default 0, 0-20)
  travelDate: Date (required)
  confirmTrip: string (required)
  tourTitle?: string
  message?: string (max 1000)
  notes?: string (max 1000)
  pickupLocation?: string (max 200)
  pickupLocationOutside?: string (max 200)
  requirements?: string (max 100)
  totalPrice: number (required)
  currency: 'USD' | 'EUR' (default 'USD')
  currencySymbol: '$' | '€' (default '$')
  status: 'pending' | 'confirmed' | 'cancelled' (default 'pending')
  createdAt, updatedAt
}
```

**Indexes:**

- `email`
- `status + createdAt` (descending)
- `travelDate`

### **Reviews Collection**

```typescript
{
  name: string (required, max 100)
  email: string (required, lowercase)
  reviewText: string (required, 10-1000 chars)
  rating: number (required, 1-5)
  tourId: ObjectId (required, ref: 'Tour')
  isApproved: boolean (default true)
  createdAt, updatedAt
}
```

**Indexes:**

- `tourId + isApproved`
- Unique: `email + tourId` (one review per customer per tour)

### **Admins Collection**

```typescript
{
  password: string (required, bcrypt hashed)
  createdAt, updatedAt
}
```

**Constraints:**

- Only one admin document allowed (enforced in pre-save hook)

---

## 🔌 API Routes

### **Public Endpoints**

| Method | Endpoint          | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| GET    | `/api/tours`      | Get all tours (with filters, pagination) |
| GET    | `/api/tours/[id]` | Get single tour by ID or slug            |
| POST   | `/api/bookings`   | Create new booking                       |
| GET    | `/api/reviews`    | Get approved reviews (with filters)      |
| POST   | `/api/reviews`    | Submit new review                        |
| GET    | `/api/health`     | Health check                             |

### **Protected Endpoints (Admin Only)**

| Method | Endpoint                    | Description                            |
| ------ | --------------------------- | -------------------------------------- |
| POST   | `/api/tours`                | Create new tour                        |
| PUT    | `/api/tours/[id]`           | Update tour                            |
| DELETE | `/api/tours/[id]`           | Delete tour                            |
| GET    | `/api/bookings`             | Get all bookings (admin view)          |
| PATCH  | `/api/bookings/[id]/status` | Update booking status                  |
| GET    | `/api/reviews`              | Get all reviews (including unapproved) |
| PATCH  | `/api/reviews/[id]`         | Update review (approve/reject)         |
| DELETE | `/api/reviews/[id]`         | Delete review                          |
| POST   | `/api/upload`               | Upload images                          |
| POST   | `/api/auth/verify`          | Admin login (returns JWT)              |
| POST   | `/api/auth/password`        | Set/update admin password              |

### **Authentication**

- JWT tokens via `jose` library
- Token in `Authorization: Bearer <token>` header or `admin_token` cookie
- Token expiration: 7 days
- Development mode: Auth checks disabled for easier testing

### **API Response Format**

```typescript
{
  success: boolean
  data?: T
  error?: string
  errors?: { field: string; message: string }[]
}
```

---

## 🛣️ Routing Structure

### **Public Routes**

- `/en` or `/de` - Homepage
- `/en/tours` or `/de/tours` - Tour listing
- `/en/tours/[slug]` - Tour detail page
- `/en/about` - About page
- `/en/contact` - Contact page

### **Admin Routes (Protected)**

- `/en/login` - Admin login
- `/en/admin` - Admin dashboard
- `/en/admin/tours` - Tour management
- `/en/admin/tours/new` - Create tour
- `/en/admin/tours/[id]/edit` - Edit tour
- `/en/admin/bookings` - Booking management
- `/en/admin/bookings/[id]` - Booking details
- `/en/admin/reviews` - Review moderation

### **Route Groups**

- `(public)` - Public pages with Header/Footer
- `(auth)` - Authentication pages (separate layout)

---

## 🔐 Authentication System

### **Admin Authentication Flow**

1. Admin enters password on `/en/login`
2. Password verified against hashed password in database
3. JWT token generated (7-day expiration)
4. Token stored in cookie (`admin_token`) and returned
5. Protected routes check token via middleware

### **Password Management**

- Single admin account (only one password document)
- Bcrypt hashing (10 rounds)
- First-time setup: Create password if none exists
- Password update: Verify old password before updating

### **Token Verification**

- Token verified on each protected API call
- Invalid/expired tokens return 401 Unauthorized
- Development mode: Auth checks can be bypassed

---

## ⚙️ Configuration

### **Environment Variables** (`.env.local`)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sphinx-reisen
MONGODB_DB_NAME=sphinx-reisen

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional
ENABLE_CACHING=true
MAX_FILE_SIZE=10485760
```

### **Next.js Configuration**

- **Output**: Standalone (for Railway/Docker deployment)
- **Image Optimization**: AVIF/WebP formats, 30-day cache
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Bundle Optimization**: Package imports optimized for lucide-react, date-fns
- **Server Actions**: 10MB body size limit

### **TypeScript Configuration**

- Strict mode enabled
- Path aliases: `@/*`, `@/components/*`, `@/lib/*`, etc.
- ES2022 target, ESNext modules
- Bundler module resolution

---

## 🎨 Styling Architecture

### **CSS Modules**

- Component-scoped styles
- Located in `styles/components/` and `styles/pages/`
- Converted from Tailwind/shadcn approach
- Global CSS tokens in `globals.css`

### **Fonts**

- **Oswald** - Display font (variable)
- **Lato** - Body font (weights: 300, 400, 700)
- **Montserrat** - Secondary font (lazy loaded)

### **Responsive Design**

- Mobile-first approach
- CSS Grid and Flexbox layouts
- Breakpoints handled via CSS Modules

---

## 📦 Key Dependencies

### **Production**

- `next` (15.1.0) - Framework
- `react` (18.2.0) - UI library
- `mongoose` (8.0.0) - MongoDB ODM
- `next-intl` (3.25.1) - i18n
- `zod` (3.23.8) - Validation
- `react-hook-form` (7.54.2) - Forms
- `jose` (5.2.0) - JWT
- `bcryptjs` (2.4.3) - Password hashing
- `sharp` (0.33.2) - Image processing

### **Development**

- `typescript` (5.3.3)
- `eslint` (8.56.0)
- `prettier` (3.2.4)
- `tsx` (4.7.0) - TypeScript execution

---

## 🚀 Deployment Configuration

### **Standalone Output**

- Next.js configured for standalone builds
- Optimized for Railway/Docker deployment
- Post-build script copies standalone assets

### **Production Optimizations**

- Console logs removed in production
- Image caching (30 days)
- Static asset caching (1 year)
- API routes: no-store cache headers
- Bundle analyzer available via `ANALYZE=true`

---

## 📝 Development Workflow

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server (standalone)
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run db:test      # Test database connection
```

### **Code Quality**

- ESLint with Next.js config
- Prettier for formatting
- TypeScript strict mode
- Path aliases for clean imports

---

## 🔍 Notable Patterns & Conventions

### **Error Handling**

- Centralized error handling via `withErrorHandler`
- Custom `AppError` class for structured errors
- MongoDB error handling (duplicate keys, validation, cast errors)

### **API Helpers**

- `validateBody` - Zod schema validation for request bodies
- `validateQuery` - Query parameter validation
- `verifyAdminAuth` - JWT token verification
- `successResponse` / `errorResponse` - Standardized responses

### **Database Connection**

- Cached connection (global mongoose cache)
- Connection pooling (max 10 connections)
- Auto-reconnection handling

### **Component Patterns**

- Server Components by default
- Client Components marked with `'use client'`
- Dynamic imports for code splitting
- CSS Modules for styling

---

## 🎯 Current State

### **Implemented Features**

✅ Bilingual support (EN/DE)
✅ Tour CRUD operations
✅ Booking system
✅ Review system with moderation
✅ Admin authentication
✅ Image upload
✅ Responsive design
✅ SEO optimization
✅ API documentation

### **Architecture Highlights**

- Modern Next.js 15 App Router
- Type-safe with TypeScript
- Scalable MongoDB schema
- Secure JWT authentication
- Performance optimized
- Production-ready configuration

---

## 📚 Documentation

- **API Reference**: `docs/API_REFERENCE.md`
- **Database Setup**: `docs/DATABASE_SETUP.md`
- **Quick Start**: `QUICKSTART.md`
- **Backend Guide**: `docs/BACKEND_QUICKSTART.md`
- **Deployment**: `docs/RAILWAY_DEPLOYMENT.md`

---

## 🔄 Data Flow Example

### **Tour Booking Flow**

1. User visits `/en/tours/[slug]`
2. Server fetches tour from MongoDB
3. User fills booking form (Client Component)
4. Form submits to `/api/bookings` (POST)
5. API validates with Zod schema
6. Booking saved to MongoDB
7. Success response returned
8. User sees confirmation message

### **Admin Tour Management Flow**

1. Admin logs in at `/en/login`
2. JWT token stored in cookie
3. Admin navigates to `/en/admin/tours`
4. Client fetches tours from `/api/tours` (with auth)
5. Admin creates/edits tour via form
6. API validates and saves to MongoDB
7. Tour updated/created
8. Admin sees updated list

---

This codebase represents a well-structured, production-ready travel agency platform with modern best practices, comprehensive features, and excellent developer experience.
