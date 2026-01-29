import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
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

    const useCloudinary =
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET;

    const urls = useCloudinary
      ? await uploadToCloudinary(files)
      : await uploadToLocal(files);

    return NextResponse.json({
      success: true,
      data: {
        urls,
        message: `Successfully uploaded ${urls.length} file(s)`,
      },
    });
  });
}

async function uploadToCloudinary(files: File[]) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string;
  const apiKey = process.env.CLOUDINARY_API_KEY as string;
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string;
  const folder = process.env.CLOUDINARY_FOLDER || 'tours';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const urls: string[] = [];

  for (const file of files) {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    form.append('folder', folder);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as { secure_url?: string; url?: string };
    const fileUrl = result.secure_url || result.url;
    if (!fileUrl) {
      throw new Error('Cloudinary upload failed: missing URL in response');
    }
    urls.push(fileUrl);
  }

  return urls;
}

async function uploadToLocal(files: File[]) {
  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'tours');
  console.log('Upload directory:', uploadDir);

  try {
    await mkdir(uploadDir, { recursive: true });
    console.log('Directory created successfully');
  } catch (dirError) {
    console.error('Failed to create directory:', dirError);
    throw new Error('Failed to create upload directory');
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

  return urls;
}

// Configure body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
