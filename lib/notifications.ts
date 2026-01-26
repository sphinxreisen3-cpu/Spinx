// Notification broadcasting utility
// This file exports the broadcastNotification function to avoid circular dependencies

// Store active SSE connections
const connections = new Set<ReadableStreamDefaultController>();

// Broadcast notification to all connected clients
export function broadcastNotification(type: 'booking' | 'review', data: unknown) {
  const message = JSON.stringify({ type, data, timestamp: Date.now() });
  
  connections.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(`data: ${message}\n\n`));
    } catch {
      // Connection closed, remove it
      connections.delete(controller);
    }
  });
}

// Add connection to the set
export function addConnection(controller: ReadableStreamDefaultController) {
  connections.add(controller);
}

// Remove connection from the set
export function removeConnection(controller: ReadableStreamDefaultController) {
  connections.delete(controller);
}
