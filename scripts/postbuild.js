const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'dist', 'mentalist', 'browser', 'index.csr.html');
const dest = path.join(__dirname, '..', 'dist', 'mentalist', 'browser', 'index.html');

if (fs.existsSync(src)) {
  fs.unlinkSync(src);
  console.log('Removed index.csr.html (prerendered index.html is used)');
}
