# API Reference

Complete API documentation for Sphinx Reisen Next.js application.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://sphinxreisen.com/api`

## Authentication

Most admin endpoints require JWT authentication via cookie.

**Cookie Name**: `admin-token`
**Token Type**: JWT (HS256)
**Expiry**: 7 days

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 50,
    "totalPages": 2
  }
}
```

## Endpoints

### Health Check

#### `GET /api/health`
Check server and database health.

**Authentication**: None

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T10:00:00.000Z",
  "database": "connected"
}
```

---

### Tours

#### `GET /api/tours`
Get all active tours with optional filters.

**Authentication**: None (public)

**Query Parameters**:
- `category` (optional): Filter by category
- `onSale` (optional): Filter tours on sale (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Egyptian Pyramids Tour",
      "title_de": "Ägyptische Pyramiden Tour",
      "price": 299,
      "travelType": "1 day",
      "category": "Cultural",
      "description": "Visit the great pyramids...",
      "slug": "egyptian-pyramids-tour",
      "image1": "/images/tours/pyramid1.jpg",
      "isActive": true,
      "onSale": false,
      "discount": 0,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/tours/[id]`
Get a single tour by ID.

**Authentication**: None (public)

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Egyptian Pyramids Tour",
    "longDescription": "Full description...",
    "highlights": ["Great Pyramid", "Sphinx", "Valley Temple"],
    "location1": "Giza",
    "location2": "Cairo",
    ...
  }
}
```

---

#### `POST /api/tours`
Create a new tour.

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "title": "New Tour",
  "title_de": "Neue Tour",
  "price": 499,
  "travelType": "2 days",
  "category": "Adventure",
  "description": "Tour description",
  "description_de": "Tour Beschreibung",
  "highlights": ["Item 1", "Item 2"],
  "locations": {
    "location1": "City A",
    "location1_de": "Stadt A"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "slug": "new-tour",
    ...
  }
}
```

---

#### `PUT /api/tours/[id]`
Update an existing tour.

**Authentication**: Required (Admin)

**Request Body**: (partial update supported)
```json
{
  "price": 399,
  "onSale": true,
  "discount": 20
}
```

---

#### `DELETE /api/tours/[id]`
Delete a tour.

**Authentication**: Required (Admin)

**Response**:
```json
{
  "success": true,
  "message": "Tour deleted"
}
```

---

### Bookings

#### `POST /api/bookings`
Create a new booking.

**Authentication**: None (public)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "travelDate": "2026-06-15",
  "confirmTrip": "Egyptian Pyramids Tour",
  "tourTitle": "Egyptian Pyramids Tour",
  "totalPrice": 598,
  "currency": "USD",
  "notes": "Vegetarian meals please"
}
```

**Validation Rules**:
- `name`: 2-100 characters, letters and spaces only
- `email`: Valid email format
- `phone`: Required
- `adults`: 1-20
- `children`: 0-20
- `infants`: 0-20
- `travelDate`: Future date only
- `totalPrice`: Positive number

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "pending",
    ...
  }
}
```

---

#### `GET /api/bookings`
Get all bookings with filters.

**Authentication**: Required (Admin)

**Query Parameters**:
- `status` (optional): pending | confirmed | cancelled
- `search` (optional): Search by name or email
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response**: Paginated list of bookings

---

#### `GET /api/bookings/[id]`
Get a single booking.

**Authentication**: Required (Admin)

---

#### `PUT /api/bookings/[id]`
Update a booking.

**Authentication**: Required (Admin)

---

#### `PATCH /api/bookings/[id]/status`
Update booking status only.

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "status": "confirmed"
}
```

---

#### `DELETE /api/bookings/[id]`
Delete a booking.

**Authentication**: Required (Admin)

---

### Reviews

#### `GET /api/reviews`
Get reviews with optional filters.

**Authentication**: None (returns only approved reviews for public)

**Query Parameters**:
- `tourId` (optional): Filter by tour ID
- `isApproved` (optional): Filter by approval status (admin only)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Jane Smith",
      "reviewText": "Amazing experience!",
      "rating": 5,
      "tourId": "507f1f77bcf86cd799439011",
      "isApproved": true,
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

---

#### `POST /api/reviews`
Submit a new review.

**Authentication**: None (public)

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "reviewText": "Amazing experience! Highly recommended.",
  "rating": 5,
  "tourId": "507f1f77bcf86cd799439011"
}
```

**Validation Rules**:
- `name`: Max 100 characters
- `email`: Valid email, lowercase
- `reviewText`: 10-1000 characters
- `rating`: 1-5
- `tourId`: Valid MongoDB ObjectId
- Duplicate prevention: One review per email per tour

---

#### `PUT /api/reviews/[id]`
Update review (typically for approval).

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "isApproved": true
}
```

---

#### `DELETE /api/reviews/[id]`
Delete a review.

**Authentication**: Required (Admin)

---

### Authentication

#### `POST /api/auth/verify`
Verify admin password and get token.

**Authentication**: None

**Request Body**:
```json
{
  "password": "admin-password"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Rate Limit**: 5 requests per 15 minutes

---

#### `GET /api/auth/password`
Check if admin password exists.

**Authentication**: None

**Response**:
```json
{
  "exists": true
}
```

---

#### `POST /api/auth/password`
Set or update admin password.

**Authentication**: Required if password exists (must provide old password)

**Request Body**:
```json
{
  "password": "new-password",
  "oldPassword": "old-password"  // Required if password exists
}
```

---

### File Upload

#### `POST /api/upload`
Upload tour images.

**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `image1` (optional): First tour image
- `image2` (optional): Second tour image
- `image3` (optional): Third tour image
- `image4` (optional): Fourth tour image

**File Constraints**:
- Max size: 10MB per file
- Allowed types: JPEG, PNG, WebP, AVIF
- Max 4 images per tour

**Response**:
```json
{
  "success": true,
  "urls": [
    "/images/tours/tour-123-image1.webp",
    "/images/tours/tour-123-image2.webp"
  ]
}
```

---

## Rate Limiting

### Default Limits
- Public endpoints: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

### Response Headers
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

### 429 Response
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

---

## Error Codes

| Code | Meaning                |
|------|------------------------|
| 200  | Success                |
| 201  | Created                |
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized / Authentication Required |
| 403  | Forbidden              |
| 404  | Not Found              |
| 409  | Conflict (duplicate)   |
| 429  | Rate Limit Exceeded    |
| 500  | Internal Server Error  |

---

## Common Validation Errors

### Tour Validation
- `title`: Required, max 100 chars
- `price`: Required, positive number
- `travelType`: Must be one of: '1 day', '2 days', '3 days', '1 week', '2 weeks'
- `category`: Required, max 50 chars
- `description`: Required, max 2000 chars

### Booking Validation
- `email`: Must be valid email format
- `travelDate`: Must be future date, max 2 years from now
- `adults`: At least 1, max 20

### Review Validation
- `reviewText`: 10-1000 characters
- `rating`: Integer between 1-5
- `email`: Unique per tour (no duplicate reviews)
