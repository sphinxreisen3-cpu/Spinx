import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { verifyToken } from '@/lib/auth';
import { AppError, handleError } from '@/lib/utils/errors';

// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: { field: string; message: string }[];
}

// Standard success response
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

// Standard error response
export function errorResponse(
  message: string,
  status = 500,
  errors?: { field: string; message: string }[]
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message, errors }, { status });
}

// Validate request body with Zod schema
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return {
        data: null,
        error: errorResponse('Validation failed', 400, errors),
      };
    }
    if (err instanceof SyntaxError) {
      return {
        data: null,
        error: errorResponse('Invalid JSON body', 400),
      };
    }
    return {
      data: null,
      error: errorResponse('Failed to parse request body', 400),
    };
  }
}

// Validate query parameters with Zod schema
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { data: T; error: null } | { data: null; error: NextResponse } {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const data = schema.parse(params);
    return { data, error: null };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return {
        data: null,
        error: errorResponse('Invalid query parameters', 400, errors),
      };
    }
    return {
      data: null,
      error: errorResponse('Failed to parse query parameters', 400),
    };
  }
}

// Verify admin authentication from request
export async function verifyAdminAuth(
  request: NextRequest
): Promise<{ authenticated: true } | { authenticated: false; error: NextResponse }> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('Authorization');
    const cookieToken = request.cookies.get('admin_token')?.value;

    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      return {
        authenticated: false,
        error: errorResponse('Authentication required', 401),
      };
    }

    await verifyToken(token);
    return { authenticated: true };
  } catch (err) {
    const { message, statusCode } = handleError(err);
    return {
      authenticated: false,
      error: errorResponse(message, statusCode),
    };
  }
}

// Wrapper for handling API errors consistently
export async function withErrorHandler<T>(handler: () => Promise<T>): Promise<T | NextResponse> {
  try {
    return await handler();
  } catch (err) {
    console.error('API Error:', err);

    if (err instanceof AppError) {
      return errorResponse(err.message, err.statusCode);
    }

    if (err instanceof Error) {
      // Handle MongoDB duplicate key errors
      if (err.message.includes('duplicate key') || err.message.includes('E11000')) {
        return errorResponse('Resource already exists', 409);
      }

      // Handle MongoDB validation errors
      if (err.name === 'ValidationError') {
        return errorResponse(err.message, 400);
      }

      // Handle MongoDB cast errors (invalid ObjectId)
      if (err.name === 'CastError') {
        return errorResponse('Invalid ID format', 400);
      }
    }

    return errorResponse('Internal server error', 500);
  }
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Check if string is valid MongoDB ObjectId
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
