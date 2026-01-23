import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyAdminAuth, errorResponse, withErrorHandler } from '@/lib/api/helpers';

// POST /api/upload - Upload images (admin only)
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    console.log('Upload API called');

    // Skip admin authentication in development mode
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) {
        console.log('Auth failed:', auth.error);
        return auth.error;
      }
    } else {
      console.log('Skipping auth in development mode');
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    console.log('Files received:', files.length);

    if (!files || files.length === 0) {
      return errorResponse('No files provided', 400);
    }

    // Validate files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return errorResponse(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF`, 400);
      }
      if (file.size > maxSize) {
        return errorResponse(`File ${file.name} exceeds 5MB limit`, 400);
      }
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'tours');
    console.log('Upload directory:', uploadDir);

    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('Directory created successfully');
    } catch (dirError) {
      console.error('Failed to create directory:', dirError);
      return errorResponse('Failed to create upload directory', 500);
    }

    // Process and save files
    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `tour-${timestamp}-${randomStr}.${ext}`;

      // Save file
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // Add public URL
      urls.push(`/images/tours/${filename}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        urls,
        message: `Successfully uploaded ${urls.length} file(s)`,
      },
    });
  });
}

// Configure body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
