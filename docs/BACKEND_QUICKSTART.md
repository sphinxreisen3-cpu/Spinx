# 🚀 Backend Implementation Quick Start

## First API Endpoint: Create Tour

Let's implement your first working API endpoint to create tours.

---

## Step 1: Update Tours POST Handler

**File:** `app/api/tours/route.ts`

Replace the TODO section with this implementation:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';

// GET /api/tours - Already works! ✅

// POST /api/tours - Create new tour
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, category' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Create tour
    const tour = await Tour.create({
      ...body,
      slug,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
    });

    return NextResponse.json({ success: true, tour }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);

    // Handle duplicate slug error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ error: 'A tour with this slug already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
```

---

## Step 2: Update Tours GET by ID

**File:** `app/api/tours/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';

// GET /api/tours/[id] - Get single tour
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    // Try to find by MongoDB _id or by slug
    const tour = await Tour.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }],
      isActive: true,
    }).lean();

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

// PUT /api/tours/[id] - Update tour (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // TODO: Add authentication check here

    const tour = await Tour.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tour });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

// DELETE /api/tours/[id] - Delete tour (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // TODO: Add authentication check here

    // Soft delete (set isActive to false)
    const tour = await Tour.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Tour deleted' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}
```

---

## Step 3: Test with Thunder Client / Postman

### Test 1: Create a Tour (POST)

**Endpoint:** `http://localhost:3000/api/tours`  
**Method:** POST  
**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "title": "Pyramids of Giza Tour",
  "price": 150,
  "travelType": "1 day",
  "category": "Historical",
  "description": "Visit the ancient pyramids and sphinx",
  "location1": "Great Pyramid of Khufu",
  "location2": "Pyramid of Khafre",
  "location3": "Pyramid of Menkaure",
  "image1": "/images/tours/pyramids.jpg",
  "onSale": true,
  "discount": 10
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "tour": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Pyramids of Giza Tour",
    "slug": "pyramids-of-giza-tour",
    "price": 150,
    "isActive": true,
    "createdAt": "2026-01-23T10:30:00.000Z",
    ...
  }
}
```

### Test 2: Get All Tours (GET)

**Endpoint:** `http://localhost:3000/api/tours`  
**Method:** GET

**Expected Response (200):**

```json
{
  "tours": [
    {
      "_id": "...",
      "title": "Pyramids of Giza Tour",
      ...
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### Test 3: Get Single Tour (GET)

**Endpoint:** `http://localhost:3000/api/tours/pyramids-of-giza-tour`  
**Method:** GET

**Expected Response (200):**

```json
{
  "tour": {
    "_id": "...",
    "title": "Pyramids of Giza Tour",
    ...
  }
}
```

### Test 4: Update Tour (PUT)

**Endpoint:** `http://localhost:3000/api/tours/[id]`  
**Method:** PUT  
**Body:**

```json
{
  "price": 140,
  "discount": 15
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "tour": {
    "price": 140,
    "discount": 15,
    ...
  }
}
```

---

## Step 4: Verify in MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click "Browse Collections"
3. Select Database: `sphinx-reisen-db`
4. You should see a new collection: `tours`
5. View the documents you created

---

## Step 5: Connect Frontend Form

Update your admin tour form to submit to the API:

**File:** `components/admin/TourForm.tsx`

```typescript
const handleSubmit = async (data: TourFormData) => {
  try {
    const response = await fetch('/api/tours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create tour');
    }

    const result = await response.json();
    console.log('Tour created:', result.tour);

    // Show success message
    alert('Tour created successfully!');

    // Redirect to tours list
    router.push('/admin/tours');
  } catch (error) {
    console.error('Error creating tour:', error);
    alert('Failed to create tour');
  }
};
```

---

## Next: Implement Bookings API

After Tours API works, implement Bookings:

1. **File:** `app/api/bookings/route.ts`
2. **Operations:**
   - POST - Create booking (public)
   - GET - List bookings (admin)
3. **Test with Thunder Client**
4. **Connect booking form**

---

## Development Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Make API changes

# 3. Test in browser or Thunder Client
# http://localhost:3000/api/tours

# 4. Check MongoDB Atlas for data

# 5. Repeat!
```

---

## Common Issues

### Issue: "Tour not created"

**Solution:** Check:

- Dev server is running (`npm run dev`)
- MongoDB connection works (`npm run db:test`)
- Request body has required fields
- Check browser console for errors

### Issue: "Duplicate key error"

**Solution:** Slug already exists, change the tour title or slug

### Issue: "401 Unauthorized"

**Solution:** Authentication not implemented yet - temporarily remove auth checks

---

## 🎉 Success Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] MongoDB connection tested (`npm run db:test`)
- [ ] Tours POST handler implemented
- [ ] Created first tour via API
- [ ] Verified tour in MongoDB Atlas
- [ ] Tours GET handler works
- [ ] Connected frontend form to API

**You're ready to build the rest of your backend!** 🚀
