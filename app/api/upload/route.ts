import { NextRequest, NextResponse } from 'next/server';

// POST /api/upload - Upload images (admin only)
export async function POST(_request: NextRequest) {
  try {
    // TODO: Validate authentication
    // TODO: Handle file upload with sharp optimization
    // TODO: Save to public/images/tours or cloud storage

    return NextResponse.json({ urls: [] }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
