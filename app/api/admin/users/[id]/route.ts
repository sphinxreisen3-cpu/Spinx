import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Admin } from '@/lib/db/models/admin.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  verifyAdminAuth,
  withErrorHandler,
  isValidObjectId,
} from '@/lib/api/helpers';
import { updateAdminSchema } from '@/lib/validations/auth.schema';
import { hashPassword } from '@/lib/auth';

// PUT /api/admin/users/[id] - Update admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse('Invalid user ID', 400);
    }

    const { data, error } = await validateBody(request, updateAdminSchema);
    if (error) return error;

    const user = await Admin.findById(id);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Update fields
    if (data.name) {
      user.name = data.name.trim();
    }
    if (data.email) {
      // Check if email is already taken by another user
      const existingUser = await Admin.findOne({
        email: data.email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (existingUser) {
        return errorResponse('Email already in use', 409);
      }
      user.email = data.email.toLowerCase().trim();
    }
    if (data.password) {
      user.password = await hashPassword(data.password);
    }

    await user.save();

    // Return user without password
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;

    return successResponse({ user: userObj });
  });
}

// DELETE /api/admin/users/[id] - Delete admin user
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(_request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse('Invalid user ID', 400);
    }

    const user = await Admin.findByIdAndDelete(id);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse({ message: 'User deleted successfully' });
  });
}
