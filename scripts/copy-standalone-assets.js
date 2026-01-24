/**
 * Copy static assets for Next.js standalone mode
 *
 * Standalone output doesn't include static files by default.
 * This script copies:
 * - public/ -> .next/standalone/public/
 * - .next/static/ -> .next/standalone/.next/static/
 *
 * Required for Railway deployment with standalone output.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');

// Source and destination paths
const copies = [
  {
    src: path.join(projectRoot, 'public'),
    dest: path.join(standaloneDir, 'public'),
    name: 'public assets',
  },
  {
    src: path.join(projectRoot, '.next', 'static'),
    dest: path.join(standaloneDir, '.next', 'static'),
    name: 'Next.js static files',
  },
];

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main execution
console.log('📦 Copying standalone assets...\n');

for (const { src, dest, name } of copies) {
  if (fs.existsSync(src)) {
    console.log(`  ✓ Copying ${name}...`);
    console.log(`    From: ${src}`);
    console.log(`    To:   ${dest}`);
    copyDir(src, dest);
    console.log(`    Done!\n`);
  } else {
    console.log(`  ⚠ Skipping ${name} (source not found: ${src})\n`);
  }
}

console.log('✅ Standalone assets copied successfully!');
