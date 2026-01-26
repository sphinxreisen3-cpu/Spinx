import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Admin } from '@/lib/db/models/admin.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  verifyAdminAuth,
  withErrorHandler,
} from '@/lib/api/helpers';
import { createAdminSchema } from '@/lib/validations/auth.schema';
import { hashPassword } from '@/lib/auth';

// GET /api/admin/users - Get all admin users
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Check if any users exist (for init check - allow unauthenticated if no users)
    const userCount = await Admin.countDocuments();
    
    // If no users exist, allow unauthenticated access (for initialization)
    if (userCount === 0) {
      return successResponse({ users: [] });
    }

    // If users exist, require authentication
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    const users = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();

    return successResponse({ users });
  });
}

// POST /api/admin/users - Create new admin user
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();

    const { data, error } = await validateBody(request, createAdminSchema);
    if (error) return error;

    // Check if email already exists
    const existingUser = await Admin.findOne({ email: data.email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await Admin.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Return user without password
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;

    return successResponse({ user: userObj }, 201);
  });
}
