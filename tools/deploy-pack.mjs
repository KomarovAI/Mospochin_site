import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const DEPLOY_DIR = path.join(SITE_ROOT, '.deploy');
const MANIFEST_PATH = path.join(DEPLOY_DIR, 'include-files.txt');
const OUT_DIR = path.join(SITE_ROOT, 'dist', 'deploy');
const REPORT_DIR = path.join(SITE_ROOT, 'reports', 'deploy');

const now = new Date();
const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const stageDir = path.join(OUT_DIR, `mospochin-public-${stamp}`);
const zipPath = path.join(OUT_DIR, `mospochin-public-deploy-${stamp}.zip`);
const shaPath = `${zipPath}.sha256`;
const reportPath = path.join(REPORT_DIR, `DEPLOY_REPORT_${stamp}.md`);

const forbiddenPrefixes = [
  '.git/',
  '.github/',
  '.ai/',
  'docs/',
  'reports/',
  'node_modules/',
  'playwright-report/',
  'test-results/',
  'dist/',
];

const forbiddenExact = new Set([
  '.env',
  'package-lock.json.tmp',
]);

const forbiddenPatterns = [
  /\.env(\.|$)/,
  /\.(zip|tar|tgz|gz|7z|rar)$/i,
  /\.log$/i,
  /\.bak$/i,
  /\.old$/i,
  /\.orig$/i,
];

const required = [
  '.deploy/include-files.txt',
  'index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'styles-combined.css',
  'main.js',
  'telegram-form.js',
  'data/runtime-config.json',
  'data/contact-config.json',
  'server/telegram-api.mjs',
  'deploy/post-activate.sh',
  'deploy/systemd/mospochin-telegram-api.service',
  'deploy/env/telegram.env.example',
  'tools/generate-public-file-list.mjs',
  'package.json',
];

function relToAbs(rel) {
  return path.join(SITE_ROOT, rel);
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function fail(message) {
  console.error(`DEPLOY PACK FAILED: ${message}`);
  process.exit(1);
}

function ensureFile(rel) {
  const abs = relToAbs(rel);
  if (fs.existsSync(abs) === false || fs.statSync(abs).isFile() === false) {
    fail(`missing required file: ${rel}`);
  }
}

function isForbidden(rel) {
  if (rel.endsWith(".env.example")) return false;
  if (forbiddenExact.has(rel)) return true;
  if (forbiddenPrefixes.some((prefix) => rel.startsWith(prefix))) return true;
  if (forbiddenPatterns.some((re) => re.test(rel))) return true;
  return false;
}

function copyFile(rel) {
  const src = relToAbs(rel);
  const dst = path.join(stageDir, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  const mode = fs.statSync(src).mode;
  fs.chmodSync(dst, mode & 0o777);
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

if (fs.existsSync(MANIFEST_PATH) === false) {
  fail(`missing manifest: ${MANIFEST_PATH}`);
}

const manifestFiles = fs.readFileSync(MANIFEST_PATH, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (manifestFiles.length === 0) fail('manifest is empty');

const unique = [...new Set(manifestFiles)].sort();

for (const rel of unique) {
  if (rel.includes('..') || path.isAbsolute(rel)) fail(`unsafe manifest path: ${rel}`);
  if (isForbidden(rel)) fail(`forbidden file in deploy manifest: ${rel}`);
  ensureFile(rel);
}

for (const rel of required) {
  if (unique.includes(rel) === false) fail(`required file is not listed in manifest: ${rel}`);
  ensureFile(rel);
}

fs.rmSync(stageDir, { recursive: true, force: true });
fs.mkdirSync(stageDir, { recursive: true });
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const rel of unique) copyFile(rel);

const fileStats = unique.map((rel) => {
  const size = fs.statSync(path.join(stageDir, rel)).size;
  return { rel, size };
});

const totalBytes = fileStats.reduce((sum, item) => sum + item.size, 0);
const totalMb = totalBytes / 1024 / 1024;
const assetsCount = unique.filter((fileName) => fileName.startsWith('assets/')).length;

const maxMb = Number(process.env.DEPLOY_PACK_MAX_MB || '45');
if (totalMb > maxMb) {
  fail(`deploy pack is too large: ${totalMb.toFixed(2)} MB > ${maxMb} MB`);
}

const zip = spawnSync('zip', ['-qr', zipPath, '.'], {
  cwd: stageDir,
  encoding: 'utf8',
});

if (zip.status !== 0) {
  console.error(zip.stdout || '');
  console.error(zip.stderr || '');
  fail('zip command failed; install zip or check file permissions');
}

const digest = sha256File(zipPath);
fs.writeFileSync(shaPath, `${digest}  ${path.basename(zipPath)}\n`);

const topFiles = [...fileStats]
  .sort((a, b) => b.size - a.size)
  .slice(0, 30);

const report = [
  '# Mospochin production deploy pack',
  '',
  `Generated: **${now.toISOString()}**`,
  '',
  '## Summary',
  '',
  '| Field | Value |',
  '| --- | ---: |',
  `| Manifest files | ${unique.length} |`,
  `| Assets | ${assetsCount} |`,
  `| Raw size | ${totalMb.toFixed(2)} MB |`,
  `| ZIP | \`${toPosix(path.relative(SITE_ROOT, zipPath))}\` |`,
  `| SHA256 | \`${digest}\` |`,
  '',
  '## Top files',
  '',
  '| Size | File |',
  '| ---: | --- |',
  ...topFiles.map((item) => `| ${(item.size / 1024 / 1024).toFixed(2)} MB | \`${item.rel}\` |`),
  '',
  '## Guardrails',
  '',
  '- Forbidden dev folders are excluded.',
  '- Required backend/deploy artifacts are present.',
  `- Size budget: ${maxMb} MB.`,
  '- Source manifest: `.deploy/include-files.txt`.',
  '',
].join('\n');

fs.writeFileSync(reportPath, report);

console.log(`deploy_pack_zip=${toPosix(path.relative(SITE_ROOT, zipPath))}`);
console.log(`deploy_pack_sha256=${digest}`);
console.log(`deploy_pack_report=${toPosix(path.relative(SITE_ROOT, reportPath))}`);
console.log(`deploy_pack_files=${unique.length}`);
console.log(`deploy_pack_raw_mb=${totalMb.toFixed(2)}`);
