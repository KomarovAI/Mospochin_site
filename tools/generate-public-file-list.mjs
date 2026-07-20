import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(SITE_ROOT, '.deploy', 'include-files.txt');
const outArgIndex = process.argv.indexOf('--out');
const OUT_PATH = outArgIndex >= 0 ? path.resolve(process.argv[outArgIndex + 1] ?? '') : null;

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

function exists(file) {
  return fs.existsSync(path.join(SITE_ROOT, file));
}

function isPublicFile(file) {
  if (!file || file.startsWith('.') || file.includes('..')) return false;
  if (file === 'version.json') return exists(file);
  if (PUBLIC_DATA_FILES.has(file)) return exists(file);
  if (file.startsWith('assets/')) {
    if (file.includes('/AGENTS.md') || /(^|\/)README\.md$/i.test(file)) return false;
    return exists(file);
  }
  if (file.includes('/')) return false;
  return ['.html', '.css', '.js', '.svg', '.txt', '.xml'].includes(path.extname(file).toLowerCase()) && exists(file);
}

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`Missing deploy manifest: ${MANIFEST_PATH}`);
  process.exit(1);
}

const files = fs.readFileSync(MANIFEST_PATH, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(isPublicFile);

const output = [...new Set(files)].sort().join('\n') + '\n';
if (OUT_PATH) {
  fs.writeFileSync(OUT_PATH, output);
} else {
  process.stdout.write(output);
}
