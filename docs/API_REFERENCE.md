# API Reference - Sphinx Reisen Travel Platform

Complete API documentation for the backend endpoints.

---

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://your-domain.com/api`

---

## Authentication

Admin endpoints require a JWT token obtained from `/api/auth/verify`.

**Token Location:**

- Header: `Authorization: Bearer <token>`
- Cookie: `admin_token` (set automatically on login)

---

## Health Check

### GET /api/health

Check API and database health status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-01-23T10:00:00.000Z",
  "database": {
    "status": "connected",
    "host": "cluster0.mongodb.net",
    "name": "sphinx-reisen-db"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

---

## Tours API

### GET /api/tours

Get all tours with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| category | string | - | Filter by category |
| onSale | boolean | - | Filter sale items only |
| search | string | - | Text search in title/description |
| page | number | 1 | Page number |
| limit | number | 12 | Items per page |
| sortBy | string | sortOrder | Sort field: createdAt, price, title, sortOrder |
| sortOrder | string | asc | Sort direction: asc, desc |

**Response:**

```json
{
  "success": true,
  "data": {
    "tours": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 12,
      "totalPages": 5,
      "hasMore": true
    }
  }
}
```

---

### GET /api/tours/:id

Get a single tour by ID or slug.

**Response:**

```json
{
  "success": true,
  "data": {
    "tour": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Pyramids of Giza Tour",
      "slug": "pyramids-of-giza-tour",
      "price": 150,
      "category": "Historical",
      ...
    }
  }
}
```

---

### POST /api/tours 🔒

Create a new tour (admin only).

**Request Body:**

```json
{
  "title": "Pyramids of Giza Tour",
  "title_de": "Pyramiden von Gizeh Tour",
  "price": 150,
  "travelType": "1 day",
  "category": "Historical",
  "description": "Visit the ancient pyramids...",
  "image1": "/images/tours/pyramids.jpg",
  "onSale": true,
  "discount": 10
}
```

**Required Fields:** `title`, `price`, `travelType`, `category`, `description`

**Response (201):**

```json
{
  "success": true,
  "data": {
    "tour": { ... }
  }
}
```

---

### PUT /api/tours/:id 🔒

Update a tour (admin only).

**Request Body:** Any tour fields to update

**Response:**

```json
{
  "success": true,
  "data": {
    "tour": { ... }
  }
}
```

---

### DELETE /api/tours/:id 🔒

Soft delete a tour (admin only).

**Response:**

```json
{
  "success": true,
  "message": "Tour deleted successfully"
}
```

---

## Bookings API

### GET /api/bookings 🔒

Get all bookings (admin only).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | - | Filter: pending, confirmed, cancelled |
| search | string | - | Search by name/email/trip |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort direction |

**Response:**

```json
{
  "success": true,
  "data": {
    "bookings": [...],
    "pagination": { ... }
  }
}
```

---

### POST /api/bookings

Create a new booking (public - customer submission).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "travelDate": "2026-03-15",
  "confirmTrip": "Pyramids of Giza Tour",
  "pickupLocation": "Cairo Hotel",
  "totalPrice": 375,
  "currency": "USD",
  "message": "Looking forward to the tour!"
}
```

**Required Fields:** `name`, `email`, `phone`, `adults`, `travelDate`, `confirmTrip`, `totalPrice`

**Response (201):**

```json
{
  "success": true,
  "data": {
    "booking": { ... },
    "message": "Booking submitted successfully. We will contact you shortly."
  }
}
```

---

### GET /api/bookings/:id 🔒

Get a single booking (admin only).

---

### PUT /api/bookings/:id 🔒

Update a booking (admin only).

**Request Body:**

```json
{
  "status": "confirmed",
  "notes": "VIP customer",
  "pickupLocation": "Updated pickup location"
}
```

---

### PATCH /api/bookings/:id/status 🔒

Quick status update (admin only).

**Request Body:**

```json
{
  "status": "confirmed"
}
```

---

### DELETE /api/bookings/:id 🔒

Delete a booking (admin only).

---

## Reviews API

### GET /api/reviews

Get reviews with optional tour filter.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| tourId | string | - | Filter by tour ID |
| isApproved | boolean | true | Filter by approval status |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |

**Response:**

```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "averageRating": {
      "average": 4.5,
      "count": 23
    },
    "pagination": { ... }
  }
}
```

---

### POST /api/reviews

Submit a new review (public).

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "rating": 5,
  "reviewText": "Amazing tour! The guide was very knowledgeable...",
  "tourId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "review": { ... },
    "message": "Review submitted successfully. Thank you for your feedback!"
  }
}
```

---

### PUT /api/reviews/:id 🔒

Update/moderate a review (admin only).

**Request Body:**

```json
{
  "isApproved": false
}
```

---

### DELETE /api/reviews/:id 🔒

Delete a review (admin only).

---

## Authentication API

### POST /api/auth/verify

Login with admin password.

**Request Body:**

```json
{
  "password": "your-admin-password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Sets `admin_token` HTTP-only cookie automatically.

---

### DELETE /api/auth/verify

Logout (clears cookie).

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/password

Check if admin password is configured.

**Response:**

```json
{
  "success": true,
  "data": {
    "exists": true,
    "message": "Admin password is configured"
  }
}
```

---

### POST /api/auth/password

Set or update admin password.

**Request Body (first time):**

```json
{
  "newPassword": "secure-password-123"
}
```

**Request Body (update - with old password):**

```json
{
  "oldPassword": "current-password",
  "newPassword": "new-secure-password"
}
```

---

## File Upload API

### POST /api/upload 🔒

Upload images (admin only).

**Content-Type:** `multipart/form-data`

**Form Fields:**

- `files`: One or more image files (JPEG, PNG, WebP, GIF)

**Limits:**

- Max file size: 5MB per file
- Allowed types: image/jpeg, image/png, image/webp, image/gif

**Response:**

```json
{
  "success": true,
  "data": {
    "urls": ["/images/tours/tour-1706012345678-abc123.jpg"],
    "message": "Successfully uploaded 1 file(s)"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Common Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |

---

## Testing with cURL

### Get all tours

```bash
curl http://localhost:3000/api/tours
```

### Create a booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "adults": 2,
    "travelDate": "2026-03-15",
    "confirmTrip": "Pyramids Tour",
    "totalPrice": 300
  }'
```

### Admin login

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

### Create tour (admin)

```bash
curl -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Tour",
    "price": 199,
    "travelType": "1 day",
    "category": "Adventure",
    "description": "Amazing adventure..."
  }'
```

---

## Railway Deployment Notes

1. **Environment Variables:** Set `MONGODB_URI` and `NEXTAUTH_SECRET` in Railway dashboard
2. **Health Check:** Configure Railway to use `/api/health` for health checks
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
