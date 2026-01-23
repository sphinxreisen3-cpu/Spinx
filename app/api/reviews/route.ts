import { NextRequest, NextResponse } from 'next/server';

// GET /api/reviews - Get reviews (with optional tour filter)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const _tourId = searchParams.get('tourId');
    const _status = searchParams.get('status');

    // TODO: Fetch reviews
    return NextResponse.json({ reviews: [], total: 0 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - Submit new review (public)
export async function POST(_request: NextRequest) {
  try {
    // TODO: Validate request body
    // TODO: Check for duplicate review
    // TODO: Create review

    return NextResponse.json({ message: 'Review submitted' }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
