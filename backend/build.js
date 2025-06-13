const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting custom build process...');
console.log('📁 Current directory:', process.cwd());
console.log('📁 Directory contents:', fs.readdirSync('.'));

// Vérifier si nous avons tsconfig.json
if (!fs.existsSync('tsconfig.json')) {
  console.error('❌ Missing tsconfig.json');
  console.log('📁 Available files:', fs.readdirSync('.'));
  process.exit(1);
}

// Vérifier si nous avons le dossier src
if (!fs.existsSync('src')) {
  console.error('❌ Missing src directory');
  console.log('📁 Available files:', fs.readdirSync('.'));
  
  // Essayer de trouver les fichiers TypeScript dans le répertoire courant
  const files = fs.readdirSync('.', { withFileTypes: true });
  const tsFiles = files.filter(file => file.isFile() && file.name.endsWith('.ts'));
  
  if (tsFiles.length > 0) {
    console.log('📁 Found TypeScript files in current directory:', tsFiles.map(f => f.name));
    console.log('🔧 Trying to compile from current directory...');
  } else {
    console.error('❌ No TypeScript files found');
    process.exit(1);
  }
} else {
  console.log('📁 src directory contents:', fs.readdirSync('src'));
}

try {
  console.log('🔨 Running TypeScript compilation...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
  
  // Vérifier que le dossier dist a été créé
  if (fs.existsSync('dist')) {
    console.log('📁 dist directory contents:', fs.readdirSync('dist'));
  } else {
    console.error('❌ dist directory was not created');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 