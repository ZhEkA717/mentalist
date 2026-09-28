const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.resolve(__dirname, '..', 'dist', 'mentalist', 'browser', 'sitemap.xml');

if (!fs.existsSync(SITEMAP_PATH)) {
  console.warn('⚠️ sitemap.xml not found in dist — skipping lastmod update');
  process.exit(0);
}

const now = new Date();
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');

const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');

if (!/<lastmod>[^<]*<\/lastmod>/.test(sitemap)) {
  console.warn('⚠️ no <lastmod> in sitemap.xml — nothing to update');
  process.exit(0);
}

let count = 0;
const updated = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, () => {
  count++;
  return `<lastmod>${date}</lastmod>`;
});

if (updated !== sitemap) {
  fs.writeFileSync(SITEMAP_PATH, updated, 'utf-8');
}

console.log(`✅ sitemap.xml: ${count} <lastmod> → ${date}`);
