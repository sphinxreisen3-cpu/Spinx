# Railway Deployment Guide

This document provides complete instructions for deploying this Next.js application to Railway.

## Prerequisites

- Railway account (https://railway.app)
- MongoDB database (Railway provides MongoDB plugin or use MongoDB Atlas)
- Git repository connected to Railway

## Required Environment Variables

Set these in Railway's service settings under "Variables":

### Required (App won't work without these)

| Variable          | Description                   | Example                                                     |
| ----------------- | ----------------------------- | ----------------------------------------------------------- |
| `MONGODB_URI`     | MongoDB connection string     | `mongodb+srv://user:pass@cluster.mongodb.net/sphinx-reisen` |
| `NEXTAUTH_SECRET` | JWT secret for authentication | Generate with: `openssl rand -base64 32`                    |

### Recommended

| Variable              | Description            | Example                        |
| --------------------- | ---------------------- | ------------------------------ |
| `NEXT_PUBLIC_APP_URL` | Public URL of your app | `https://your-app.railway.app` |
| `ADMIN_PASSWORD`      | Initial admin password | `your-secure-password`         |

### Auto-Provided by Railway

These are automatically set by Railway - **do NOT set them manually**:

| Variable                | Description                      |
| ----------------------- | -------------------------------- |
| `PORT`                  | Port the app should listen on    |
| `RAILWAY_PUBLIC_DOMAIN` | Your app's Railway domain        |
| `RAILWAY_ENVIRONMENT`   | Environment name                 |
| `NODE_ENV`              | Set to `production` during build |

## Deployment Configuration

Railway uses Railpack (nixpacks) to automatically detect and build Next.js apps.

### Build Settings

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Node Version**: >= 20.0.0

These are automatically detected from `package.json` but can be overridden in Railway settings if needed.

## Deployment Steps

### 1. Connect Repository

1. Go to Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the Next.js project

### 2. Add MongoDB

Option A: Railway MongoDB Plugin

1. In your project, click "New" → "Database" → "MongoDB"
2. Click the MongoDB service → "Variables"
3. Copy `MONGO_URL` value
4. Add to your app service as `MONGODB_URI`

Option B: MongoDB Atlas

1. Create a free cluster at mongodb.com
2. Get connection string
3. Add as `MONGODB_URI` in Railway variables

### 3. Configure Environment Variables

1. Click your app service
2. Go to "Variables" tab
3. Add required variables (see table above)
4. Deploy will auto-trigger on save

### 4. Verify Deployment

After deployment completes:

1. Click the generated domain link
2. Test the health endpoint: `https://your-app.railway.app/api/health`
3. You should see:

```json
{
  "status": "healthy",
  "database": { "status": "connected" }
}
```

## Troubleshooting

### Build Fails with "npm ci failed"

- Ensure `package-lock.json` is committed to git
- Run `npm ci` locally to verify it works
- Check for Node version compatibility

### App Crashes on Start

- Check logs in Railway dashboard
- Verify `MONGODB_URI` is set correctly
- Ensure the MongoDB connection string includes the database name

### 502 Bad Gateway

- App might still be starting - wait 30 seconds
- Check if the app binds to `process.env.PORT`
- Verify start command: `npm run start`

### Images Not Loading

- Static assets should be in `public/` folder
- They're copied to standalone output automatically
- Check browser console for 404 errors

### Environment Variables Not Working

- Build-time vars (like `NEXT_PUBLIC_*`) require rebuild
- Runtime vars are available immediately
- Restart service after changing vars

## Architecture Notes

This project uses Next.js `output: 'standalone'` mode which:

- Creates a minimal, self-contained deployment
- Includes only necessary dependencies
- Reduces container size significantly
- Requires static assets to be copied post-build (handled by `postbuild` script)

## Health Check

Railway automatically monitors `/health` which is rewritten to `/api/health`:

```
GET /health → 200 OK (healthy)
GET /health → 503 Service Unavailable (unhealthy)
```

## Custom Domain

1. Go to your app service → "Settings"
2. Under "Domains", click "Add Custom Domain"
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Scaling

Railway auto-scales based on usage. For explicit control:

1. Go to service "Settings"
2. Adjust "Replicas" under "Scaling"
3. Configure memory/CPU limits as needed

## Costs

- Railway charges based on resource usage
- Standalone mode minimizes resource consumption
- Consider using sleep settings for development environments
