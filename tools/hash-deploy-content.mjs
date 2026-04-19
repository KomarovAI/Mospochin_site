import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const rootArgIndex = process.argv.indexOf('--root');
const SITE_ROOT = rootArgIndex >= 0
  ? path.resolve(process.argv[rootArgIndex + 1] ?? '.')
  : path.resolve(process.cwd());
const MANIFEST_PATH = path.join(SITE_ROOT, '.deploy', 'include-files.txt');
const HASH_PATH = path.join(SITE_ROOT, '.deploy', 'content.sha256');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`Deploy manifest is missing: ${MANIFEST_PATH}`);
  process.exit(1);
}

const files = fs.readFileSync(MANIFEST_PATH, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((fileName) => fileName !== 'version.json')
  .sort();

const hash = crypto.createHash('sha256');

for (const fileName of files) {
  const absolutePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Manifest file is missing: ${fileName}`);
    process.exit(1);
  }

  hash.update(fileName);
  hash.update('\0');
  hash.update(fs.readFileSync(absolutePath));
  hash.update('\0');
}

fs.mkdirSync(path.dirname(HASH_PATH), { recursive: true });
const digest = hash.digest('hex');
fs.writeFileSync(HASH_PATH, `${digest}\n`);
console.log(digest);
