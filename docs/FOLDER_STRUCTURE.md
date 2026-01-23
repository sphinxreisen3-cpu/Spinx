# Sphinx Reisen Next.js - Folder Structure

## Complete Directory Tree

```
travel-next-js/
│
├── app/                              # Next.js 15 App Router
│   ├── [locale]/                     # Internationalized routes
│   │   ├── (public)/                 # Public route group
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── about/               # About page
│   │   │   ├── tours/               # Tours listing & details
│   │   │   └── layout.tsx           # Public layout
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── login/               # Admin login
│   │   │   └── layout.tsx           # Auth layout
│   │   └── admin/                   # Admin panel
│   │       ├── tours/               # Tour management
│   │       ├── bookings/            # Booking management
│   │       ├── reviews/             # Review management
│   │       ├── layout.tsx           # Admin layout
│   │       └── page.tsx             # Dashboard
│   │
│   ├── api/                         # API Routes
│   │   ├── health/                  # Health check
│   │   ├── tours/                   # Tour endpoints
│   │   ├── bookings/                # Booking endpoints
│   │   ├── reviews/                 # Review endpoints
│   │   ├── upload/                  # File upload
│   │   └── auth/                    # Authentication
│   │
│   ├── globals.css                  # Global styles and CSS tokens
│   ├── layout.tsx                   # Root layout
│   ├── error.tsx                    # Error boundary
│   ├── not-found.tsx               # 404 page
│   └── loading.tsx                 # Loading UI
│
├── components/                      # React Components
│   ├── ui/                         # shadcn/ui base components
│   ├── layout/                     # Layout components (Header, Footer)
│   ├── home/                       # Homepage sections
│   ├── tours/                      # Tour components
│   ├── bookings/                   # Booking components
│   └── admin/                      # Admin components
│
├── lib/                            # Utilities & Services
│   ├── db/                        # Database layer
│   │   ├── mongoose.ts            # MongoDB connection
│   │   └── models/                # Mongoose models
│   ├── auth/                      # Authentication utilities
│   ├── utils/                     # Helper functions
│   │   ├── formatters.ts          # Date, currency formatting
│   │   ├── constants.ts           # App constants
│   │   ├── errors.ts              # Error classes
│   │   └── helpers.ts             # General helpers
│   ├── i18n/                      # Internationalization
│   └── utils.ts                   # Main utilities (cn function)
│
├── types/                          # TypeScript Definitions
│   ├── index.ts                   # Main exports
│   ├── tour.types.ts              # Tour types
│   ├── booking.types.ts           # Booking types
│   ├── review.types.ts            # Review types
│   └── api.types.ts               # API response types
│
├── config/                         # Configuration Files
│   ├── site.ts                    # Site metadata
│   ├── navigation.ts              # Navigation links
│   └── seo.ts                     # SEO utilities
│
├── messages/                       # i18n Translations
│   ├── en.json                    # English
│   └── de.json                    # German
│
├── docs/                           # Documentation
│   ├── architecture.md            # System architecture
│   ├── api-reference.md           # API documentation
│   ├── data-models.md             # Database models
│   └── FOLDER_STRUCTURE.md        # This file
│
├── public/                         # Static Assets
│   ├── images/                    # Images
│   │   ├── tours/                 # Tour images
│   │   ├── hero/                  # Hero slider images
│   │   ├── logo/                  # Logo files
│   │   └── icons/                 # Icon files
│   ├── fonts/                     # Self-hosted fonts
│   └── robots.txt                 # SEO robots file
│
├── middleware.ts                   # Next.js middleware (i18n, auth)
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── components.json                 # shadcn/ui configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Directory Purposes

### `/app` - Application Routes
Contains all pages and API routes using Next.js 15 App Router.

**Route Groups**:
- `(public)` - Public-facing pages with header/footer
- `(auth)` - Authentication pages with minimal layout
- `admin` - Protected admin panel with sidebar navigation

### `/components` - React Components
Reusable React components organized by feature.

**Organization**:
- `ui/` - Base UI components from shadcn/ui
- `layout/` - Layout components (Header, Footer, Sidebar)
- Feature folders - Components grouped by domain (home, tours, bookings, admin)

### `/lib` - Business Logic
Core utilities, services, and database layer.

**Key Files**:
- `db/mongoose.ts` - MongoDB connection with pooling
- `db/models/` - Mongoose schemas and models
- `auth/` - Authentication and JWT handling
- `utils/` - Helper functions and formatters

### `/types` - TypeScript Types
Centralized type definitions for type safety across the application.

### `/config` - Configuration
Application configuration files (site metadata, navigation, SEO).

### `/messages` - i18n Translations
JSON files for each supported locale (en, de).

### `/docs` - Documentation
Comprehensive documentation for developers and AI agents.

### `/public` - Static Assets
Publicly accessible files served directly by Next.js.

## File Naming Conventions

### Components
- **PascalCase**: `TourCard.tsx`, `BookingForm.tsx`
- Location-based naming: No prefixes, folder structure indicates purpose

### Routes
- **lowercase with hyphens**: `tour-detail`, `admin-panel`
- **Dynamic routes**: `[slug]`, `[id]`

### Utilities
- **camelCase**: `formatters.ts`, `helpers.ts`
- **descriptive**: Function indicates functionality

### Types
- **dot notation**: `tour.types.ts`, `api.types.ts`

## Import Paths

TypeScript path aliases configured in `tsconfig.json`:

```typescript
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatters';
import { Tour } from '@/types';
import { siteConfig } from '@/config/site';
```

## Key Features by Location

### Performance Optimizations
- **Server Components**: Default in `/app` directory
- **Image Optimization**: Next.js Image component with sharp
- **Code Splitting**: Automatic per-route splitting
- **Caching**: ISR and on-demand revalidation

### SEO Features
- **Metadata**: Dynamic metadata in page files
- **Sitemap**: Generated in `/app/sitemap.ts` (TODO)
- **Robots.txt**: Static file in `/public`
- **Structured Data**: Components in `/components/seo` (TODO)

### Internationalization
- **Middleware**: Route-based locale detection
- **Messages**: JSON translation files
- **next-intl**: Server-side translations

### Authentication
- **Middleware**: JWT verification on admin routes
- **API Protection**: Token validation in API routes
- **Password Hashing**: bcrypt in `/lib/auth`

## Adding New Features

### New Page
1. Create page file in appropriate route group
2. Add to navigation config if needed
3. Add translations to messages files

### New API Endpoint
1. Create route.ts in `/app/api/[name]`
2. Add types in `/types`
3. Document in `/docs/api-reference.md`

### New Component
1. Create component file in appropriate folder
2. Export from folder if needed
3. Add to shadcn if it's a base UI component

### New Model
1. Create model in `/lib/db/models`
2. Add types in `/types`
3. Document in `/docs/data-models.md`
4. Add validation schema

## Environment Setup

Required environment variables (see `.env.example`):
- Database connection (MongoDB)
- Authentication secrets
- API keys (if any)
- Feature flags

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Notes for AI Agents

1. **Consistency**: Follow existing patterns in similar files
2. **Types**: Always use TypeScript types, avoid `any`
3. **Documentation**: Update docs when adding features
4. **Error Handling**: Use custom error classes from `/lib/utils/errors.ts`
5. **Validation**: Use Zod schemas for input validation
6. **i18n**: Add translations for all user-facing text
