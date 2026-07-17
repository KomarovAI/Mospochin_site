import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(SITE_ROOT, '.deploy', 'include-files.txt');

const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const DEFAULT_SOFT_MAX_BYTES = 1_200_000;
const DEFAULT_HARD_MAX_BYTES = 8_000_000;

// Practical budgets for generated responsive files. They are intentionally
// conservative: the guard catches regressions without forcing destructive
// recompression of technical photos.
const RESPONSIVE_BUDGETS = Object.freeze({
  webp: Object.freeze({ 480: 90_000, 768: 220_000, 1080: 280_000, 1200: 340_000, 1600: 360_000 }),
  avif: Object.freeze({ 480: 80_000, 768: 190_000, 1080: 250_000, 1200: 310_000, 1600: 330_000 }),
  jpg: Object.freeze({ 480: 170_000, 768: 340_000, 1080: 500_000, 1200: 600_000, 1600: 650_000 }),
  jpeg: Object.freeze({ 480: 170_000, 768: 340_000, 1080: 500_000, 1200: 600_000, 1600: 650_000 }),
});

function toBytes(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Deploy manifest is missing: ${path.relative(SITE_ROOT, MANIFEST_PATH)}`);
    console.error('Run `npm run generate:deploy-manifest` first.');
    process.exit(1);
  }

  return fs.readFileSync(MANIFEST_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function collectRasterAssets(manifestEntries) {
  const assets = [];

  for (const entry of manifestEntries) {
    const extension = path.extname(entry).toLowerCase();
    if (!RASTER_EXTENSIONS.has(extension)) continue;

    const absolutePath = path.join(SITE_ROOT, entry);
    if (!fs.existsSync(absolutePath)) continue;

    const stat = fs.statSync(absolutePath);
    const width = Number.parseInt(path.basename(entry).match(/-(\d+)w(?:\.[^.]+)+$/i)?.[1] ?? '', 10) || null;
    let format = extension.slice(1);
    if (format === 'webp' || format === 'avif') {
      // Sidecars are commonly named *.jpg.webp or *.jpeg.webp.
      format = extension.slice(1);
    }
    assets.push({ path: entry, bytes: stat.size, width, format });
  }

  return assets.sort((a, b) => b.bytes - a.bytes);
}

function findResponsiveViolations(assets) {
  return assets
    .filter((asset) => asset.path.includes('assets/images/responsive/'))
    .map((asset) => {
      const budget = asset.width ? RESPONSIVE_BUDGETS[asset.format]?.[asset.width] : null;
      return budget && asset.bytes > budget ? { ...asset, budget } : null;
    })
    .filter(Boolean);
}

function findLoadingPriorityConflicts(manifestEntries) {
  const conflicts = [];
  for (const entry of manifestEntries) {
    if (!entry.endsWith('.html')) continue;
    const absolutePath = path.join(SITE_ROOT, entry);
    if (!fs.existsSync(absolutePath)) continue;
    const html = fs.readFileSync(absolutePath, 'utf8');
    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
      const tag = match[0];
      if (/\bloading\s*=\s*["']lazy["']/i.test(tag) && /\bfetchpriority\s*=\s*["']high["']/i.test(tag)) {
        conflicts.push(`${entry}: ${tag.slice(0, 220)}`);
      }
    }
  }
  return conflicts;
}

function main() {
  const softMaxBytes = toBytes(process.env.IMAGE_SOFT_MAX_BYTES, DEFAULT_SOFT_MAX_BYTES);
  const hardMaxBytes = toBytes(process.env.IMAGE_HARD_MAX_BYTES, DEFAULT_HARD_MAX_BYTES);
  const manifestEntries = readManifest();
  const rasterAssets = collectRasterAssets(manifestEntries);

  if (rasterAssets.length === 0) {
    console.log('Image budget: no raster assets found in deploy manifest.');
    return;
  }

  const softViolations = rasterAssets.filter((asset) => asset.bytes > softMaxBytes);
  const hardViolations = rasterAssets.filter((asset) => asset.bytes > hardMaxBytes);
  const responsiveViolations = findResponsiveViolations(rasterAssets);
  const loadingPriorityConflicts = findLoadingPriorityConflicts(manifestEntries);

  console.log(`Image budget scan: ${rasterAssets.length} raster assets`);
  console.log(`Soft limit: ${softMaxBytes} bytes (${formatMb(softMaxBytes)})`);
  console.log(`Hard limit: ${hardMaxBytes} bytes (${formatMb(hardMaxBytes)})`);

  if (softViolations.length > 0) {
    console.warn('\nSoft limit warnings (largest first):');
    softViolations.slice(0, 20).forEach((asset) => {
      console.warn(`- ${asset.path}: ${asset.bytes} bytes (${formatMb(asset.bytes)})`);
    });
  } else {
    console.log('\nSoft limit warnings: none');
  }

  if (responsiveViolations.length > 0) {
    console.error('\nResponsive image budget violations:');
    responsiveViolations.forEach((asset) => {
      console.error(`- ${asset.path}: ${formatKb(asset.bytes)} > ${formatKb(asset.budget)} (${asset.width}w ${asset.format})`);
    });
  } else {
    console.log('Responsive image budget violations: none');
  }

  if (loadingPriorityConflicts.length > 0) {
    console.error('\nConflicting image loading hints (`loading=lazy` + `fetchpriority=high`):');
    loadingPriorityConflicts.forEach((item) => console.error(`- ${item}`));
  } else {
    console.log('Conflicting image loading hints: none');
  }

  if (hardViolations.length > 0) {
    console.error('\nHard limit violations (build fails):');
    hardViolations.forEach((asset) => {
      console.error(`- ${asset.path}: ${asset.bytes} bytes (${formatMb(asset.bytes)})`);
    });
  } else {
    console.log('Hard limit violations: none');
  }

  if (hardViolations.length || responsiveViolations.length || loadingPriorityConflicts.length) {
    process.exit(1);
  }
}

main();
