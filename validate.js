// Simple validation script to check if project is set up correctly

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Next.js project structure...\n');

let hasErrors = false;

// Check required files
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'i18n.ts',
  '.env.local',
  'app/layout.tsx',
  'app/globals.css',
  'middleware.ts',
];

console.log('📁 Checking required files...');
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check required directories
const requiredDirs = [
  'app',
  'app/[locale]',
  'app/api',
  'components',
  'lib',
  'lib/db',
  'lib/auth',
  'types',
  'config',
  'messages',
  'public',
];

console.log('\n📂 Checking required directories...');
requiredDirs.forEach((dir) => {
  const exists = fs.existsSync(path.join(__dirname, dir));
  if (exists) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ - MISSING`);
    hasErrors = true;
  }
});

// Check translation files
console.log('\n🌍 Checking translation files...');
const translationFiles = ['messages/en.json', 'messages/de.json'];
translationFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check environment variables
console.log('\n🔐 Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredEnvVars = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_APP_URL'];

  requiredEnvVars.forEach((envVar) => {
    if (envContent.includes(envVar)) {
      console.log(`  ✅ ${envVar}`);
    } else {
      console.log(`  ❌ ${envVar} - MISSING`);
      hasErrors = true;
    }
  });
} else {
  console.log('  ❌ .env.local file not found');
  hasErrors = true;
}

// Check package.json
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  const requiredDeps = ['next', 'react', 'react-dom', 'next-intl', 'mongoose'];

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`  ✅ ${dep}`);
    } else {
      console.log(`  ❌ ${dep} - MISSING`);
      hasErrors = true;
    }
  });
} catch (error) {
  console.log('  ❌ Error reading package.json');
  hasErrors = true;
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Validation FAILED - Please fix the errors above');
  process.exit(1);
} else {
  console.log('✅ Validation PASSED - Project is ready!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm install');
  console.log('  2. Run: npm run dev');
  console.log('  3. Open: http://localhost:3000\n');
  process.exit(0);
}
