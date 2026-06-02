import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(SITE_ROOT, '.deploy', 'include-files.txt');

const TEXT_EXTENSIONS = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt']);
const PUBLIC_DATA_FILES = new Set([
  'data/contact-config.json',
  'data/page-metadata.json',
  'data/schema-profile.json',
  'data/runtime-config.json',
  'data/restaurant-branch.json',
  'data/restaurant-services.json',
  'data/restaurant-page-slots.json',
  'data/restaurant-proof-layer.json',
  'data/household-branch.json',
  'data/household-services.json',
  'data/household-page-slots.json',
  'data/household-card-presets.json',
  'data/household-proof-layer.json',
]);

function runScript(scriptName) {
  const result = spawnSync(process.execPath, [path.join(SITE_ROOT, 'tools', scriptName)], {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    process.exit(result.status ?? 1);
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) runScript('generate-deploy-manifest.mjs');
  return fs.readFileSync(MANIFEST_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function isPublicFile(relativePath) {
  if (relativePath === 'version.json') return fs.existsSync(path.join(SITE_ROOT, relativePath));
  if (PUBLIC_DATA_FILES.has(relativePath)) return true;
  if (relativePath.startsWith('assets/')) {
    if (relativePath.includes('/AGENTS.md') || /(^|\/)README\.md$/i.test(relativePath)) return false;
    return fs.existsSync(path.join(SITE_ROOT, relativePath));
  }
  if (relativePath.includes('/')) return false;
  return ['.html', '.css', '.js', '.svg', '.txt', '.xml'].includes(path.extname(relativePath).toLowerCase()) && fs.existsSync(path.join(SITE_ROOT, relativePath));
}

function bucketOf(file) {
  if (file.startsWith('assets/images/responsive/')) return 'responsive images';
  if (file.startsWith('assets/images/')) return 'source images / small assets';
  if (file.startsWith('assets/fonts/')) return 'fonts';
  if (file.startsWith('assets/brand-logos/')) return 'brand logos';
  if (file.startsWith('assets/')) return 'other assets';
  if (file.endsWith('.html')) return 'html';
  if (file.endsWith('.css')) return 'css';
  if (file.endsWith('.js')) return 'js';
  if (file.startsWith('data/')) return 'data';
  return 'other public files';
}

function compressedSizes(buffer, extension) {
  if (!TEXT_EXTENSIONS.has(extension)) return { gzip: 0, brotli: 0 };
  if (buffer.length < 1024) return { gzip: 0, brotli: 0 };
  return {
    gzip: zlib.gzipSync(buffer, { level: 9 }).length,
    brotli: zlib.brotliCompressSync(buffer, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  };
}

const manifestFiles = readManifest();
const files = [...new Set(manifestFiles.filter(isPublicFile))].sort();
const rows = [];
const buckets = new Map();
let totalRaw = 0;
let totalGzip = 0;
let totalBrotli = 0;

for (const file of files) {
  const absolutePath = path.join(SITE_ROOT, file);
  if (!fs.existsSync(absolutePath)) continue;
  const buffer = fs.readFileSync(absolutePath);
  const raw = buffer.length;
  const { gzip, brotli } = compressedSizes(buffer, path.extname(file).toLowerCase());
  totalRaw += raw;
  totalGzip += gzip;
  totalBrotli += brotli;
  rows.push({ file, raw, gzip, brotli });

  const bucket = bucketOf(file);
  const previous = buckets.get(bucket) ?? { count: 0, raw: 0, gzip: 0, brotli: 0 };
  previous.count += 1;
  previous.raw += raw;
  previous.gzip += gzip;
  previous.brotli += brotli;
  buckets.set(bucket, previous);
}

console.log('Public size report');
console.log('==================');
console.log(`Files: ${files.length}`);
console.log(`Raw total: ${formatBytes(totalRaw)}`);
console.log(`Precompressed text gzip total: ${formatBytes(totalGzip)}`);
console.log(`Precompressed text Brotli total: ${formatBytes(totalBrotli)}`);
console.log('');
console.log('By bucket:');
[...buckets.entries()]
  .sort((a, b) => b[1].raw - a[1].raw)
  .forEach(([bucket, value]) => {
    console.log(`- ${bucket}: ${formatBytes(value.raw)} (${value.count} files, gzip ${formatBytes(value.gzip)}, br ${formatBytes(value.brotli)})`);
  });
console.log('');
console.log('Top 20 largest public files:');
rows
  .sort((a, b) => b.raw - a.raw)
  .slice(0, 20)
  .forEach((row, index) => {
    const compressed = row.gzip || row.brotli ? `, gzip ${formatBytes(row.gzip)}, br ${formatBytes(row.brotli)}` : '';
    console.log(`${String(index + 1).padStart(2, ' ')}. ${row.file}: ${formatBytes(row.raw)}${compressed}`);
  });
