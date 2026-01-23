import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Check database connection
    await connectDB();

    const dbState = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: stateMap[dbState] || 'unknown',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
