import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const SITEMAP_PATH = path.join(SITE_ROOT, 'sitemap.xml');

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

function isNoindex(page) {
  return typeof page.robots === 'string' && page.robots.toLowerCase().includes('noindex');
}

function getPageGroup(fileName) {
  if (fileName.startsWith('bytovaya-')) return 'household-root';
  if (
    [
      'holodilniki.html',
      'stiralnye-mashiny.html',
      'posudomoyki.html',
      'kompyutery.html',
      'routery.html',
      'microwaves.html',
      'water-heaters.html',
    ].includes(fileName)
  ) {
    return 'household-service';
  }

  if (['index.html', 'uslugi.html', 'about.html', 'contact.html'].includes(fileName)) {
    return 'restaurant-root';
  }

  return 'restaurant-service';
}

function getChangefreq(fileName) {
  if (fileName === 'index.html' || fileName === 'bytovaya-index.html') return 'weekly';
  return 'monthly';
}

function getPriority(fileName) {
  const group = getPageGroup(fileName);

  if (fileName === 'index.html' || fileName === 'bytovaya-index.html') return '1.0';
  if (fileName === 'uslugi.html' || fileName === 'bytovaya-uslugi.html') return '0.9';
  if (fileName === 'about.html' || fileName === 'contact.html') return '0.7';
  if (fileName === 'bytovaya-about.html' || fileName === 'bytovaya-contact.html') return '0.7';
  if (group === 'restaurant-service') return '0.8';
  if (['kompyutery.html', 'routery.html', 'microwaves.html'].includes(fileName)) {
    return '0.7';
  }
  return '0.8';
}

const urlEntries = Object.entries(metadata.pages)
  .filter(([, page]) => Boolean(page.canonical) && !isNoindex(page))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([fileName, page]) => ({
    fileName,
    loc: page.canonical,
    lastmod: today,
    changefreq: getChangefreq(fileName),
    priority: getPriority(fileName),
  }));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urlEntries.map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(SITEMAP_PATH, xml);
console.log(`Generated sitemap.xml with ${urlEntries.length} URLs.`);
