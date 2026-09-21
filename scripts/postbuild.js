const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'dist', 'mentalist', 'browser', 'index.csr.html');
const dest = path.join(__dirname, '..', 'dist', 'mentalist', 'browser', 'index.html');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied index.csr.html -> index.html');
} else {
  console.warn('index.csr.html not found, skipping copy');
}
