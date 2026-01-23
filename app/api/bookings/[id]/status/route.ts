import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/bookings/[id]/status - Update booking status (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const _resolvedParams = await params;
    // TODO: Validate authentication
    const _body = await request.json();
    // TODO: Update status

    return NextResponse.json({ message: 'Status updated' });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
