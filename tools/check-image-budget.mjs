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

function toBytes(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
    assets.push({
      path: entry,
      bytes: stat.size,
    });
  }

  return assets.sort((a, b) => b.bytes - a.bytes);
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

  if (hardViolations.length > 0) {
    console.error('\nHard limit violations (build fails):');
    hardViolations.forEach((asset) => {
      console.error(`- ${asset.path}: ${asset.bytes} bytes (${formatMb(asset.bytes)})`);
    });
    process.exit(1);
  }

  console.log('\nHard limit violations: none');
}

main();
