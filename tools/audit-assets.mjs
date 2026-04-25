import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const SOURCE_EXTENSIONS = new Set(['.html', '.css', '.js', '.json']);
const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const ASSET_DIRS = ['assets'];
const TOP_LIMIT = 25;

const ALWAYS_INCLUDE = [
  '404.html',
  'data/contact-config.json',
  'data/household-card-presets.json',
  'data/household-branch.json',
  'data/restaurant-page-policy.json',
  'data/restaurant-page-slots.json',
  'data/restaurant-proof-layer.json',
  'data/restaurant-services.json',
  'data/restaurant-taxonomy.json',
  'data/household-proof-layer.json',
  'data/household-page-slots.json',
  'data/page-metadata.json',
  'data/household-services.json',
  'data/restaurant-branch.json',
  'data/schema-profile.json',
  'data/site-page-contracts.json',
  'data/runtime-config.json',
  'deploy/env/telegram.env.example',
  'deploy/post-activate.sh',
  'deploy/systemd/mospochin-telegram-api.service',
  'deploy/systemd/mospochin-telegram-tunnel.service',
  'favicon.svg',
  'main.js',
  'og-image.svg',
  'package.json',
  'robots.txt',
  'server/telegram-api.mjs',
  'sitemap.xml',
  'styles-built.css',
  'styles.css',
  'telegram-form.js',
  'version.json',
];

const included = new Set();
const scanned = new Set();
const missing = [];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getBytes(relativePath) {
  return fs.statSync(path.join(SITE_ROOT, relativePath)).size;
}

function exists(relativePath) {
  return fs.existsSync(path.join(SITE_ROOT, relativePath));
}

function isDeployable(relativePath) {
  return (
    relativePath &&
    !relativePath.startsWith('.') &&
    !relativePath.startsWith('node_modules/') &&
    !relativePath.startsWith('docs/') &&
    !relativePath.startsWith('tools/') &&
    !relativePath.includes('/AGENTS.md') &&
    relativePath !== 'AGENTS.md'
  );
}

function normalizeReference(rawReference, fromFile) {
  if (!rawReference) return null;

  const trimmed = rawReference.trim().replace(/^['"]|['"]$/g, '');
  if (
    !trimmed ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('@contact-') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('tg://') ||
    trimmed.startsWith('//')
  ) {
    return null;
  }

  const withoutQuery = trimmed.split(/[?#]/, 1)[0];
  if (!withoutQuery || withoutQuery.includes('${')) return null;

  const resolved = withoutQuery.startsWith('/')
    ? withoutQuery.slice(1)
    : toPosix(path.normalize(path.join(path.dirname(fromFile), withoutQuery)));

  if (resolved.startsWith('../')) return null;
  return resolved;
}

function addFile(relativePath, reason) {
  if (!relativePath) return;

  const normalized = toPosix(path.normalize(relativePath));
  if (!isDeployable(normalized)) return;

  if (normalized.startsWith('assets/fonts/remixicon.') && normalized !== 'assets/fonts/remixicon.css' && normalized !== 'assets/fonts/remixicon.woff2') {
    return;
  }

  if (!exists(normalized)) {
    if (normalized !== 'version.json') {
      missing.push({ path: normalized, reason });
    }
    return;
  }

  included.add(normalized);
  scanFile(normalized);
}

function scanReferences(content, fromFile) {
  const patterns = [
    /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi,
    /\bsrcset\s*=\s*["']([^"']+)["']/gi,
  ];
  const extension = path.extname(fromFile);
  if (extension === '.css' || extension === '.html') {
    patterns.push(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi);
  }

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const value = pattern.source.includes('srcset') ? match[1] : match[2] ?? match[1];

      if (pattern.source.includes('srcset')) {
        for (const candidate of value.split(',')) {
          addFile(normalizeReference(candidate.trim().split(/\s+/)[0], fromFile), fromFile);
        }
      } else {
        addFile(normalizeReference(value, fromFile), fromFile);
      }
    }
  }

  for (const match of content.matchAll(/(?:^|["'(\s])((?:\/)?assets\/[^"'()\s<>]+)/g)) {
    addFile(match[1].startsWith('/') ? match[1].slice(1) : match[1], fromFile);
  }
}

function scanFile(relativePath) {
  if (scanned.has(relativePath)) return;
  scanned.add(relativePath);

  const extension = path.extname(relativePath);
  if (!SOURCE_EXTENSIONS.has(extension)) return;

  const content = fs.readFileSync(path.join(SITE_ROOT, relativePath), 'utf8');
  scanReferences(content, relativePath);
}

function getTrackedFiles(relativeDirs) {
  const result = spawnSync('git', ['ls-files', ...relativeDirs], {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || 'git ls-files failed');
  }
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((filePath) => exists(filePath));
}

function sortBySizeDesc(files) {
  return [...files].sort((a, b) => getBytes(b) - getBytes(a));
}

function summarizeFiles(label, files) {
  const totalBytes = files.reduce((sum, filePath) => sum + getBytes(filePath), 0);
  console.log(`${label}: ${files.length} file(s), ${formatMb(totalBytes)}`);
}

function printTop(label, files) {
  console.log(`\n${label}:`);
  if (files.length === 0) {
    console.log('- none');
    return;
  }

  sortBySizeDesc(files).slice(0, TOP_LIMIT).forEach((filePath) => {
    console.log(`- ${filePath}: ${formatMb(getBytes(filePath))}`);
  });
}

function main() {
  const rootHtmlFiles = fs.readdirSync(SITE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith('.html'));

  rootHtmlFiles.forEach((fileName) => addFile(fileName, 'root html'));
  ALWAYS_INCLUDE.forEach((fileName) => addFile(fileName, 'always include'));

  const trackedAssets = getTrackedFiles(ASSET_DIRS).filter((filePath) => !filePath.endsWith('/README.md'));
  const deployAssets = [...included].filter((filePath) => filePath.startsWith('assets/'));
  const trackedRasters = trackedAssets.filter((filePath) => RASTER_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
  const deployRasters = deployAssets.filter((filePath) => RASTER_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
  const outsideDeployGraph = trackedAssets.filter((filePath) => !included.has(filePath));
  const orphanedRasters = trackedRasters.filter((filePath) => !included.has(filePath));

  console.log('Asset audit is read-only. Files outside the site reference graph may still be an intentional source library.');
  summarizeFiles('Site reference graph assets', deployAssets);
  summarizeFiles('Site reference graph raster assets', deployRasters);
  summarizeFiles('Tracked asset files outside site reference graph', outsideDeployGraph);
  summarizeFiles('Tracked raster assets outside site reference graph', orphanedRasters);

  printTop('Largest site reference graph raster assets', deployRasters);
  printTop('Largest tracked raster assets outside site reference graph', orphanedRasters);

  if (missing.length > 0) {
    console.log('\nMissing referenced files:');
    missing.slice(0, TOP_LIMIT).forEach((item) => {
      console.log(`- ${item.path} (${item.reason})`);
    });
    if (missing.length > TOP_LIMIT) {
      console.log(`- ... ${missing.length - TOP_LIMIT} more`);
    }
    process.exitCode = 1;
  } else {
    console.log('\nMissing referenced files: none');
  }
}

main();
