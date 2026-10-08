import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('Building production static site in dist/...');

// Clean and recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy all .html files from root to dist
const files = fs.readdirSync(rootDir);
let htmlCount = 0;
for (const file of files) {
  if (file.endsWith('.html')) {
    fs.copyFileSync(path.join(rootDir, file), path.join(distDir, file));
    htmlCount++;
  }
}
console.log(`Copied ${htmlCount} HTML files to dist/`);

// Recursive copy helper
const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Copy assets folder
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  copyRecursive(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
  console.log('Copied assets/ to dist/assets/');
}

// Copy public folder contents to dist root
if (fs.existsSync(path.join(rootDir, 'public'))) {
  const publicFiles = fs.readdirSync(path.join(rootDir, 'public'), { withFileTypes: true });
  for (const entry of publicFiles) {
    const srcPath = path.join(rootDir, 'public', entry.name);
    const destPath = path.join(distDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log('Copied public/ assets to dist/');
}

console.log('Build completed successfully! Home page (index.html) is ready at dist/index.html');
