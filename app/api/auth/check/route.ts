import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/api/helpers';

// GET /api/auth/check - Check if user is authenticated
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  
  return NextResponse.json({
    authenticated: auth.authenticated,
  });
}
