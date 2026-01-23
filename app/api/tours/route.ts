import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';

// GET /api/tours - Get all tours (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const onSale = searchParams.get('onSale');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (onSale === 'true') {
      query.onSale = true;
    }

    // Get tours with pagination
    const tours = await Tour.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Tour.countDocuments(query);

    return NextResponse.json({
      tours,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

// POST /api/tours - Create new tour (admin only)
export async function POST(_request: NextRequest) {
  try {
    // TODO: Validate authentication
    // TODO: Validate request body
    // TODO: Create tour

    return NextResponse.json({ message: 'Tour created' }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
