import { NextRequest } from 'next/server';
import { verifyAdminAuth } from '@/lib/api/helpers';
import { addConnection, removeConnection } from '@/lib/notifications';

// GET /api/notifications - Server-Sent Events stream for real-time notifications
export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (process.env.NODE_ENV !== 'development') {
    const auth = await verifyAdminAuth(request);
    if (!auth.authenticated) {
      return auth.error;
    }
  }

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Add connection to set
      addConnection(controller);

      // Send initial connection message
      const welcomeMessage = JSON.stringify({
        type: 'connected',
        message: 'Notification stream connected',
        timestamp: Date.now(),
      });
      controller.enqueue(new TextEncoder().encode(`data: ${welcomeMessage}\n\n`));

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        removeConnection(controller);
        try {
          controller.close();
        } catch (error) {
          // Connection already closed
        }
      });
    },
    cancel() {
      // Clean up handled by abort event
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering in nginx
    },
  });
}
