import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { validateBody, errorResponse, withErrorHandler } from '@/lib/api/helpers';
import { loginSchema } from '@/lib/validations/auth.schema';

// POST /api/auth/verify - Verify admin password and get JWT token
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // Validate request body
    const { data, error } = await validateBody(request, loginSchema);
    if (error) return error;

    // Verify admin password
    const result = await verifyAdmin(data.password);

    if (!result.success || !result.token) {
      return errorResponse('Invalid password', 401);
    }

    // Create response with token
    const response = NextResponse.json({
      success: true,
      data: {
        message: 'Login successful',
        token: result.token,
      },
    });

    // Set HTTP-only cookie for security
    response.cookies.set('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  });
}

// DELETE /api/auth/verify - Logout (clear cookie)
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Clear the cookie
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
