# Data Models

Comprehensive documentation of all database models and their relationships.

## Database: MongoDB
**ODM**: Mongoose with TypeScript

---

## Tour Model

**Collection**: `tours`

### Schema Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB document ID |
| `title` | String | Yes | Max 100 chars | Tour title (English) |
| `title_de` | String | No | Max 100 chars | Tour title (German) |
| `price` | Number | Yes | Min 0 | Base price in USD |
| `travelType` | String | Yes | Enum | Duration: '1 day', '2 days', '3 days', '1 week', '2 weeks' |
| `category` | String | Yes | Max 50 chars | Tour category (Beach, Mountain, etc.) |
| `description` | String | Yes | Max 2000 chars | Short description (English) |
| `description_de` | String | No | Max 2000 chars | Short description (German) |
| `longDescription` | String | No | - | Full tour details (English) |
| `longDescription_de` | String | No | - | Full tour details (German) |
| `highlights` | String[] | No | - | Tour highlights (English) |
| `highlights_de` | String[] | No | - | Tour highlights (German) |
| `location1` to `location6` | String | No | - | Tour locations 1-6 (English) |
| `location1_de` to `location6_de` | String | No | - | Tour locations 1-6 (German) |
| `image1` to `image4` | String | No | URL format | Tour image URLs |
| `slug` | String | Yes | Unique, lowercase | URL-friendly identifier |
| `sortOrder` | Number | No | Default: 0 | Display order |
| `isActive` | Boolean | No | Default: true | Visibility status |
| `onSale` | Boolean | No | Default: false | Sale status |
| `discount` | Number | No | 0-100 | Discount percentage |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Indexes
```javascript
{ category: 1, isActive: 1 }         // Filter by category and active status
{ onSale: 1, isActive: 1 }          // Filter sale tours
{ slug: 1 } unique                   // Fast slug lookups
```

### TypeScript Interface
```typescript
interface ITour {
  _id: string;
  title: string;
  title_de?: string;
  price: number;
  travelType: '1 day' | '2 days' | '3 days' | '1 week' | '2 weeks';
  category: string;
  description: string;
  description_de?: string;
  longDescription?: string;
  longDescription_de?: string;
  highlights?: string[];
  highlights_de?: string[];
  location1?: string;
  // ... other locations
  image1?: string;
  // ... other images
  slug: string;
  sortOrder: number;
  isActive: boolean;
  onSale: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Business Rules
1. **Slug Generation**: Auto-generated from title (lowercase, hyphens, unique)
2. **German Fields**: Optional, for bilingual support
3. **Image Limit**: Maximum 4 images per tour
4. **Location Limit**: Maximum 6 locations per tour
5. **Discount Range**: 0-100% only
6. **Active Status**: Only active tours shown to public

---

## Booking Model

**Collection**: `bookings`

### Schema Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB document ID |
| `name` | String | Yes | Trimmed | Customer full name |
| `phone` | String | Yes | - | Contact phone number |
| `email` | String | Yes | Lowercase, email format | Customer email |
| `adults` | Number | Yes | 1-20 | Number of adult travelers |
| `children` | Number | No | 0-20, Default: 0 | Number of children |
| `infants` | Number | No | 0-20, Default: 0 | Number of infants |
| `travelDate` | Date | Yes | Future date | Date of travel |
| `confirmTrip` | String | Yes | - | Tour name/reference |
| `tourTitle` | String | No | - | Associated tour title |
| `notes` | String | No | Max 1000 chars | Special requirements |
| `pickupLocation` | String | No | Max 200 chars | Pickup location |
| `requirements` | String | No | Max 100 chars | Additional requirements |
| `totalPrice` | Number | Yes | Positive | Total booking price |
| `currency` | String | No | Enum: USD, EUR | Currency code |
| `currencySymbol` | String | No | Enum: $, € | Currency symbol |
| `status` | String | No | Enum | 'pending', 'confirmed', 'cancelled' (Default: pending) |
| `createdAt` | Date | Auto | - | Booking timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Indexes
```javascript
{ email: 1 }                    // Lookup by email
{ status: 1, createdAt: -1 }   // Filter by status, sort by date
```

### TypeScript Interface
```typescript
interface IBooking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  infants: number;
  travelDate: Date;
  confirmTrip: string;
  tourTitle?: string;
  notes?: string;
  pickupLocation?: string;
  requirements?: string;
  totalPrice: number;
  currency: 'USD' | 'EUR';
  currencySymbol: '$' | '€';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Business Rules
1. **Travel Date**: Must be in the future (validation in API layer)
2. **Total Travelers**: adults + children + infants must be reasonable (max 20 total)
3. **Price Calculation**: Based on tour price × adults (children/infants may have different rates)
4. **Currency**: Auto-set based on user locale (EN=USD, DE=EUR)
5. **Status Flow**: pending → confirmed (or cancelled)
6. **Email Format**: Automatically lowercased for consistency

---

## Review Model

**Collection**: `reviews`

### Schema Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB document ID |
| `name` | String | Yes | Max 100 chars | Reviewer name |
| `email` | String | Yes | Lowercase, email format | Reviewer email |
| `reviewText` | String | Yes | 10-1000 chars | Review content |
| `rating` | Number | Yes | 1-5 | Star rating |
| `tourId` | ObjectId | Yes | Ref: Tour | Associated tour |
| `isApproved` | Boolean | No | Default: true | Approval status |
| `createdAt` | Date | Auto | - | Submission timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Indexes
```javascript
{ tourId: 1, isApproved: 1 }        // Get approved reviews for tour
{ email: 1, tourId: 1 } unique      // Prevent duplicate reviews
```

### TypeScript Interface
```typescript
interface IReview {
  _id: string;
  name: string;
  email: string;
  reviewText: string;
  rating: number;
  tourId: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Business Rules
1. **Duplicate Prevention**: One review per email per tour (unique index)
2. **Auto-Approval**: Currently set to true (can be changed to false for moderation)
3. **Rating Range**: 1-5 stars only
4. **Text Length**: Minimum 10 characters to ensure meaningful reviews
5. **Tour Reference**: Must reference an existing tour (foreign key relationship)

---

## Admin Model

**Collection**: `admins`

### Schema Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB document ID |
| `password` | String | Yes | Hashed (bcrypt) | Admin password hash |
| `createdAt` | Date | Auto | - | Creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

### Indexes
None (single document collection)

### TypeScript Interface
```typescript
interface IAdmin {
  _id: string;
  password: string; // bcrypt hash
  createdAt: Date;
  updatedAt: Date;
}
```

### Business Rules
1. **Single Document**: Only ONE admin password document allowed (enforced in pre-save hook)
2. **Password Hashing**: Always bcrypt with 10 rounds (never store plain text)
3. **Password Update**: Requires old password verification
4. **First Setup**: If no admin exists, first password can be set without verification

---

## Relationships

### Tour ← Reviews (One-to-Many)
- Each tour can have multiple reviews
- Reviews reference tours via `tourId` field
- Cascade delete: When tour deleted, reviews should be deleted (not implemented yet)

### Tour ← Bookings (Indirect)
- Bookings reference tour via `confirmTrip` or `tourTitle` (string, not ObjectId)
- No enforced foreign key relationship
- Allows bookings for deleted tours (historical data)

---

## Data Validation

### Mongoose Schema Validation
All models use Mongoose built-in validators:
- `required`: Field must be present
- `min`/`max`: Numeric constraints
- `minlength`/`maxlength`: String length
- `enum`: Allowed values
- `match`: Regex patterns

### Zod Schema Validation (API Layer)
Additional validation in API routes using Zod:
```typescript
// Example: Tour creation schema
const createTourSchema = z.object({
  title: z.string().min(3).max(100),
  price: z.number().positive(),
  travelType: z.enum(['1 day', '2 days', '3 days', '1 week', '2 weeks']),
  // ...
});
```

---

## Migration Notes

### From Old System (travel-agency-main)
1. **Models are Compatible**: Schema structure matches existing MongoDB data
2. **Field Names**: Identical to old system (no breaking changes)
3. **Indexes**: Same indexes for performance
4. **New Features**: TypeScript types, stricter validation

### Data Migration Script
Location: `scripts/migrate-data.ts`

Purpose:
- Validate existing data
- Add missing slugs
- Ensure indexes exist
- Clean up invalid records

---

## Database Connection

### Configuration
```typescript
MONGODB_URI=mongodb://localhost:27017/sphinx-reisen
MONGODB_DB_NAME=sphinx-reisen
```

### Connection Options
```typescript
{
  bufferCommands: false,
  maxPoolSize: 10,
}
```

### Connection Pooling
- **Development**: Single connection, cached globally
- **Production**: Connection pool (max 10), shared across serverless functions

---

## Common Queries

### Get Active Tours on Sale
```typescript
Tour.find({ isActive: true, onSale: true })
  .sort({ sortOrder: 1 })
  .select('title price discount image1 slug');
```

### Get Approved Reviews for Tour
```typescript
Review.find({ tourId, isApproved: true })
  .sort({ createdAt: -1 })
  .select('name reviewText rating createdAt');
```

### Get Pending Bookings
```typescript
Booking.find({ status: 'pending' })
  .sort({ createdAt: -1 })
  .limit(50);
```

---

## Performance Considerations

1. **Indexes**: All frequently queried fields are indexed
2. **Projection**: Use `.select()` to limit returned fields
3. **Pagination**: Always paginate large result sets
4. **Lean Queries**: Use `.lean()` for read-only operations (faster)
5. **Connection Pooling**: Reuse connections in serverless environment

---

## Future Enhancements

1. **User Model**: For customer accounts (optional)
2. **Payment Model**: Track payment transactions
3. **Category Model**: Normalized category table instead of strings
4. **Tour Images**: Store in separate collection for better management
5. **Search Indexes**: Add text indexes for full-text search
