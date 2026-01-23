# 🚀 Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Navigate to Project

```bash
cd "C:\Users\DeLL\Desktop\Travel Main\travel-next-js"
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- Next.js 15 and React 19
- PostCSS/autoprefixer and CSS module tooling
- Mongoose for MongoDB
- Authentication libraries (bcryptjs, jose)
- next-intl for translations
- TypeScript and dev tools

**Expected time**: 2-3 minutes

### 3. Set Up Environment Variables

```bash
# Copy the example file
copy .env.example .env.local
```

Edit `.env.local` and update:

```env
# Database - Use your local MongoDB or Atlas connection string
MONGODB_URI=mongodb://localhost:27017/sphinx-reisen

# Authentication - Generate a secure secret
# Run in terminal: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Leave as is for local development
NODE_ENV=development
ENABLE_CACHING=false
```

### 4. Start MongoDB (if running locally)

```bash
# Windows - If MongoDB installed as service, it should be running
# Check with:
mongosh

# If not running, start it:
net start MongoDB
```

### 5. Start Development Server

```bash
npm run dev
```

You should see:

```
   ▲ Next.js 15.1.0
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

### 6. Open in Browser

Visit: **http://localhost:3000**

You'll see a redirect to: **http://localhost:3000/en**

## First-Time Admin Setup

### 1. Set Admin Password

```bash
# Using MongoDB shell
mongosh sphinx-reisen

# Insert admin password document
db.admins.insertOne({
  password: "$2a$10$YourBcryptHashedPasswordHere",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**OR** use the application:

1. Visit `/en/admin`
2. If no password exists, you'll be prompted to create one
3. Enter a strong password
4. It will be hashed automatically

### 2. Access Admin Panel

- URL: http://localhost:3000/en/admin
- Or: http://localhost:3000/de/admin (German)

## Available Routes

### Public Routes

| URL                | Description        |
| ------------------ | ------------------ |
| `/en`              | Homepage (English) |
| `/de`              | Homepage (German)  |
| `/en/tours`        | Tour listing       |
| `/en/tours/[slug]` | Tour details       |
| `/en/about`        | About page         |

### Admin Routes (Protected)

| URL                  | Description     |
| -------------------- | --------------- |
| `/en/login`          | Admin login     |
| `/en/admin`          | Admin dashboard |
| `/en/admin/tours`    | Manage tours    |
| `/en/admin/bookings` | Manage bookings |
| `/en/admin/reviews`  | Manage reviews  |

### API Routes

| Endpoint        | Method | Description         |
| --------------- | ------ | ------------------- |
| `/api/health`   | GET    | Health check        |
| `/api/tours`    | GET    | Get all tours       |
| `/api/tours`    | POST   | Create tour (admin) |
| `/api/bookings` | POST   | Create booking      |
| `/api/reviews`  | POST   | Submit review       |

## Next Steps

### 1. Implement Components

The structure has placeholder components. Start with:

- `components/ui/` - Install shadcn/ui components
- `components/tours/TourCard.tsx` - Display tour cards
- `components/home/HeroSlider.tsx` - Homepage hero

### 2. Add shadcn/ui Components

```bash
# Initialize shadcn/ui (already configured)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
# ... add more as needed
```

### 3. Migrate Existing Data

Create a migration script in `scripts/migrate-data.ts`:

```typescript
// Read from old MongoDB database
// Transform data to new schema
// Insert into new database
```

### 4. Copy Images

```bash
# Copy tour images from old system
copy "C:\Users\DeLL\Desktop\Travel Main\travel-agency-main\public\images\tours\*" "public\images\tours\"
```

## Development Workflow

### Running Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run format       # Format with Prettier
```

### Making Changes

1. Edit files in `/app`, `/components`, `/lib`
2. Changes auto-reload in browser (Hot Module Replacement)
3. Check terminal for errors
4. Fix TypeScript/lint errors before committing

### Adding New Features

1. Check `/docs/architecture.md` for patterns
2. Add types to `/types`
3. Create API route in `/app/api`
4. Create components in `/components`
5. Update documentation

## Common Tasks

### Add a New Tour (Manual)

```javascript
// In MongoDB shell or Compass
use sphinx-reisen

db.tours.insertOne({
  title: "Egyptian Pyramids Tour",
  title_de: "Ägyptische Pyramiden Tour",
  price: 299,
  travelType: "1 day",
  category: "Cultural",
  description: "Explore the ancient pyramids of Giza",
  description_de: "Erkunden Sie die antiken Pyramiden von Gizeh",
  slug: "egyptian-pyramids-tour",
  image1: "/images/tours/pyramids-1.jpg",
  sortOrder: 1,
  isActive: true,
  onSale: false,
  discount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Get tours
curl http://localhost:3000/api/tours

# Create booking (POST with JSON body)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com",...}'
```

### View Logs

Development logs show in terminal where `npm run dev` is running.

## Troubleshooting

### "Cannot connect to MongoDB"

**Problem**: `MongoServerError: connect ECONNREFUSED`

**Solutions**:

1. Check MongoDB is running: `mongosh`
2. Verify MONGODB_URI in `.env.local`
3. Try: `net start MongoDB` (Windows)

### "Module not found" errors

**Problem**: `Cannot find module '@/components/...'`

**Solutions**:

1. Run `npm install`
2. Delete `.next` folder: `rmdir /s .next`
3. Restart dev server

### "Type errors" in VS Code

**Problem**: Red squiggly lines, type errors

**Solutions**:

1. Wait for TypeScript to finish checking
2. Run `npm run type-check`
3. Check `/types` for correct interfaces
4. Restart VS Code TypeScript server (Cmd+Shift+P → "Restart TS Server")

### Port 3000 already in use

**Problem**: `Port 3000 is already in use`

**Solutions**:

1. Kill existing process
2. Or use different port: `npm run dev -- -p 3001`

## File Structure Quick Reference

```
travel-next-js/
├── app/              # Routes and pages
├── components/       # React components
├── lib/              # Business logic
├── types/            # TypeScript types
├── config/           # Configuration
├── messages/         # Translations
├── docs/             # Documentation (you are here!)
└── public/           # Static assets
```

## Getting Help

1. **Check Documentation**
   - `/docs/IMPLEMENTATION_GUIDE.md` - Comprehensive guide
   - `/docs/architecture.md` - System design
   - `/docs/api-reference.md` - API docs
   - `/docs/data-models.md` - Database schemas

2. **Check Examples**
   - Look at existing components for patterns
   - Review similar API routes
   - Check type definitions in `/types`

3. **Console Logs**
   - Terminal shows server errors
   - Browser console shows client errors
   - Check Network tab for API calls

## Success Checklist

- ✅ Dependencies installed (`npm install` completed)
- ✅ Environment variables configured (`.env.local` created)
- ✅ MongoDB connection working
- ✅ Development server running (`npm run dev`)
- ✅ Homepage loads at http://localhost:3000
- ✅ No TypeScript errors
- ✅ No console errors

## What's Next?

1. **Implement UI Components** - Add shadcn/ui components
2. **Complete Tour Pages** - Implement tour listing and details
3. **Add Booking Flow** - Complete booking form and validation
4. **Migrate Data** - Move tours from old system
5. **Test Everything** - Ensure all features work
6. **Deploy** - Push to Vercel or Railway

---

**Ready to code!** 🚀

Start with: `npm install && npm run dev`

Then explore the codebase and start implementing features!
