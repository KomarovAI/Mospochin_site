import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootArgIndex = process.argv.indexOf('--root');
const SITE_ROOT = rootArgIndex >= 0
  ? path.resolve(process.argv[rootArgIndex + 1] ?? '.')
  : path.resolve(__dirname, '..');
const DEPLOY_DIR = path.join(SITE_ROOT, '.deploy');
const MANIFEST_PATH = path.join(DEPLOY_DIR, 'include-files.txt');
const allowGeneratedVersion = process.argv.includes('--allow-generated-version');

const SOURCE_EXTENSIONS = new Set(['.html', '.css', '.js']);
const ALWAYS_INCLUDE = [
  '404.html',
  'data/page-metadata.json',
  'favicon.svg',
  'main.js',
  'og-image.svg',
  'package.json',
  'robots.txt',
  'sitemap.xml',
  'styles-built.css',
  'styles.css',
  'telegram-form.js',
  'version.json',
];

const errors = [];
const included = new Set();
const scanned = new Set();

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
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
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('//')
  ) {
    return null;
  }

  const withoutQuery = trimmed.split(/[?#]/, 1)[0];
  if (!withoutQuery) return null;
  if (withoutQuery.includes('${')) return null;

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
  if (normalized === 'version.json') {
    included.add(normalized);
    return;
  }
  if (normalized.startsWith('assets/fonts/remixicon.') && normalized !== 'assets/fonts/remixicon.css' && normalized !== 'assets/fonts/remixicon.woff2') {
    return;
  }

  if (!exists(normalized)) {
    if (normalized === 'version.json' && allowGeneratedVersion) {
      included.add(normalized);
      return;
    }
    errors.push(`${reason}: referenced file is missing: ${normalized}`);
    return;
  }

  included.add(normalized);
  scanFile(normalized);
}

function scanReferences(content, fromFile) {
  const patterns = [
    /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi,
    /\bsrcset\s*=\s*["']([^"']+)["']/gi,
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
  ];

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
}

function scanFile(relativePath) {
  if (scanned.has(relativePath)) return;
  scanned.add(relativePath);

  const extension = path.extname(relativePath);
  if (!SOURCE_EXTENSIONS.has(extension)) return;

  const content = fs.readFileSync(path.join(SITE_ROOT, relativePath), 'utf8');
  scanReferences(content, relativePath);
}

const rootFiles = fs.readdirSync(SITE_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((fileName) => fileName.endsWith('.html'));

for (const fileName of rootFiles) {
  addFile(fileName, 'root html');
}

for (const fileName of ALWAYS_INCLUDE) {
  addFile(fileName, 'always include');
}

if (errors.length) {
  console.error('Deploy manifest generation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

fs.mkdirSync(DEPLOY_DIR, { recursive: true });
const manifest = [...included].sort().join('\n') + '\n';
fs.writeFileSync(MANIFEST_PATH, manifest);

const assets = [...included].filter((fileName) => fileName.startsWith('assets/'));
console.log(
  `Generated ${toPosix(path.relative(SITE_ROOT, MANIFEST_PATH))}: ${included.size} files, ${assets.length} assets.`
);
