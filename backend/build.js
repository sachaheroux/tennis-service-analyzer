const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting custom build process...');
console.log('📁 Current directory:', process.cwd());
console.log('📁 Directory contents:', fs.readdirSync('.'));

// Vérifier que nous sommes dans le bon répertoire
if (!fs.existsSync('src') || !fs.existsSync('tsconfig.json')) {
  console.error('❌ Missing src directory or tsconfig.json');
  console.log('📁 Available files:', fs.readdirSync('.'));
  process.exit(1);
}

console.log('📁 src directory contents:', fs.readdirSync('src'));

try {
  console.log('🔨 Running TypeScript compilation...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 