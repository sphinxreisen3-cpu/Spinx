import { NextRequest, NextResponse } from 'next/server';
import { adminPasswordExists, setAdminPassword } from '@/lib/auth';
import {
  validateBody,
  successResponse,
  errorResponse,
  verifyAdminAuth,
  withErrorHandler,
} from '@/lib/api/helpers';
import { passwordUpdateSchema } from '@/lib/validations/auth.schema';

// GET /api/auth/password - Check if admin password exists
export async function GET() {
  return withErrorHandler(async () => {
    const exists = await adminPasswordExists();

    return NextResponse.json({
      success: true,
      data: {
        exists,
        message: exists
          ? 'Admin password is configured'
          : 'No admin password set. Please configure one.',
      },
    });
  });
}

// POST /api/auth/password - Set/update admin password
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // Validate request body
    const { data, error } = await validateBody(request, passwordUpdateSchema);
    if (error) return error;

    // Check if password already exists
    const exists = await adminPasswordExists();

    // If password exists, require authentication or old password
    if (exists) {
      // First try token authentication
      const auth = await verifyAdminAuth(request);

      // If not authenticated with token, require old password
      if (!auth.authenticated) {
        if (!data.oldPassword) {
          return errorResponse('Old password is required to change password', 400);
        }
      }

      // Set new password (with old password verification if provided)
      await setAdminPassword(data.newPassword, data.oldPassword);
    } else {
      // First time setup - no auth required
      await setAdminPassword(data.newPassword);
    }

    return successResponse({
      message: exists ? 'Password updated successfully' : 'Password created successfully',
    });
  });
}
