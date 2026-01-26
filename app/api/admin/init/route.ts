import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Admin } from '@/lib/db/models/admin.model';
import { hashPassword } from '@/lib/auth';
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api/helpers';

// POST /api/admin/init - Initialize first admin user (only works if no users exist)
// This endpoint is public and only works when no admin users exist
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Check if any admin users exist
    const userCount = await Admin.countDocuments();
    if (userCount > 0) {
      return errorResponse('Admin users already exist. Please use the login page.', 403);
    }

    // Get request body
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid request body', 400);
    }

    const { name, email, password } = body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return errorResponse('Name must be at least 2 characters', 400);
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return errorResponse('Valid email is required', 400);
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }

    // Check if email already exists
    const existingUser = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }

    // Create first admin user
    const hashedPassword = await hashPassword(password);
    const user = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Return user without password
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;

    return successResponse(
      {
        user: userObj,
        message: 'First admin user created successfully. You can now log in.',
      },
      201
    );
  });
}
