#!/usr/bin/env node
/**
 * Cross-platform server start script for Railway
 * Ensures Next.js listens on the PORT environment variable
 */

const { spawn } = require('child_process');

// Get port from environment (Railway provides this, default to 8080 for Railway)
const port = process.env.PORT || '8080';

console.log(`Starting Next.js server on port ${port}...`);

// Start Next.js with the port
const server = spawn('next', ['start', '-p', port], {
  stdio: 'inherit',
  shell: true,
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  process.exit(code || 0);
});
