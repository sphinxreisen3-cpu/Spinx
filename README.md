# Sphinx Reisen - Next.js Travel Agency

Modern, high-performance travel agency website built with Next.js 15, TypeScript, CSS Modules, and MongoDB.

## Features

- 🚀 **Blazing Fast Performance** - Next.js 15 with App Router, Server Components, and Server Actions
- 🌍 **Internationalization** - Full EN/DE support with next-intl
- 💎 **Modern UI** - CSS Modules (converted from Tailwind/shadcn)
- 🔒 **Secure Admin Panel** - JWT-based authentication with bcrypt
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Image Optimization** - Next.js Image component with sharp
- 🗄️ **MongoDB Database** - Mongoose ODM with TypeScript
- ♿ **Accessible** - WCAG compliant components
- 📊 **SEO Optimized** - Dynamic sitemap, metadata, and structured data

## Project Structure

```
travel-next-js/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── (public)/      # Public pages (home, tours, about)
│   │   ├── (auth)/        # Authentication pages
│   │   └── admin/         # Protected admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── home/             # Homepage sections
│   ├── tours/            # Tour components
│   ├── bookings/         # Booking components
│   └── admin/            # Admin components
├── lib/                   # Utilities and services
│   ├── db/               # Database connection and models
│   ├── auth/             # Authentication utilities
│   ├── utils/            # Helper functions
│   └── i18n/             # Internationalization config
├── types/                 # TypeScript type definitions
├── config/                # Application configuration
├── messages/              # Translation files (en.json, de.json)
├── public/                # Static assets
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm 10+
- MongoDB (local or cloud)
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd travel-next-js
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

4. Start development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - Secret for JWT tokens
- `NEXT_PUBLIC_APP_URL` - Public URL of the application

## API Routes

### Public Routes

- `GET /api/tours` - Get all active tours
- `GET /api/tours/[id]` - Get single tour
- `POST /api/bookings` - Create booking
- `GET /api/reviews` - Get approved reviews
- `POST /api/reviews` - Submit review

### Protected Routes (Admin Only)

- `POST /api/tours` - Create tour
- `PUT /api/tours/[id]` - Update tour
- `DELETE /api/tours/[id]` - Delete tour
- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/[id]/status` - Update booking status
- `POST /api/upload` - Upload images

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: CSS Modules + global CSS tokens
- **UI Components**: shadcn/ui
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with jose & bcryptjs
- **i18n**: next-intl
- **Image Optimization**: sharp
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, email info@sphinxreisen.com
