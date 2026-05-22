import fs from 'fs';
import path from 'path';

const srcDir = process.cwd();
const publicDir = path.join(srcDir, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sourceFile = path.join(srcDir, 'file_00000000e988722f8a542eda2234d7c0.png');
const destFile = path.join(publicDir, 'favicon.ico');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('Successfully copied logo to public/favicon.ico');
} else {
  console.error('Source logo file not found:', sourceFile);
}
