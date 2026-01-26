import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { Admin } from '@/lib/db/models/admin.model';
import { connectDB } from '@/lib/db/mongoose';
import { UnauthorizedError } from '@/lib/utils/errors';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production'
);

interface JWTPayload {
  isAdmin: boolean;
  iat: number;
  exp: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export async function generateToken(): Promise<string> {
  const token = await new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as JoseJWTPayload & { isAdmin?: unknown };

    if (
      typeof payload.isAdmin !== 'boolean' ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number'
    ) {
      throw new UnauthorizedError('Invalid token payload');
    }

    return {
      isAdmin: payload.isAdmin,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

// Check admin authentication with email
export async function verifyAdmin(email: string, password: string): Promise<{ success: boolean; token?: string; admin?: { name: string; email: string } }> {
  try {
    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return { success: false };
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return { success: false };
    }

    const token = await generateToken();
    return { 
      success: true, 
      token,
      admin: {
        name: admin.name,
        email: admin.email,
      }
    };
  } catch (error) {
    throw error;
  }
}

// Set admin password
export async function setAdminPassword(password: string, oldPassword?: string): Promise<void> {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      // Verify old password if provided
      if (oldPassword) {
        const isValid = await verifyPassword(oldPassword, existingAdmin.password);
        if (!isValid) {
          throw new UnauthorizedError('Invalid old password');
        }
      }

      // Update password
      existingAdmin.password = await hashPassword(password);
      await existingAdmin.save();
    } else {
      // Create new admin
      const hashedPassword = await hashPassword(password);
      await Admin.create({ password: hashedPassword });
    }
  } catch (error) {
    throw error;
  }
}

// Check if admin password exists
export async function adminPasswordExists(): Promise<boolean> {
  try {
    await connectDB();
    const count = await Admin.countDocuments();
    return count > 0;
  } catch {
    return false;
  }
}
