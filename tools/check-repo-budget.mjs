#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repo = process.cwd();
const budgetPath = path.join(repo, '.repo-budget.json');
const manifestPath = path.join(repo, '.deploy', 'include-files.txt');

function fail(message) {
  errors.push(message);
}

function mb(bytes) {
  return bytes / 1024 / 1024;
}

function mbText(bytes) {
  return `${mb(bytes).toFixed(3)} MB`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function toUnix(p) {
  return p.split(path.sep).join('/');
}

function trackedFiles() {
  const out = execFileSync('git', ['ls-files', '-z'], {
    cwd: repo,
    encoding: 'utf8'
  });

  return out
    .split('\0')
    .filter(Boolean)
    .map(toUnix);
}

function fileSize(rel) {
  const abs = path.join(repo, rel);
  if (!fs.existsSync(abs)) return 0;
  const stat = fs.statSync(abs);
  return stat.isFile() ? stat.size : 0;
}

function basename(rel) {
  return path.posix.basename(rel);
}

function escapeRegex(s) {
  return s.replace(/[.+^${}()|[\]\\]/g, '\\$&');
}

function matchesPattern(rel, pattern) {
  const p = toUnix(rel);
  const base = basename(p);

  if (pattern === '.env') {
    return base === '.env';
  }

  if (pattern === '.env.*') {
    return base.startsWith('.env.');
  }

  if (pattern.endsWith('/')) {
    return p.startsWith(pattern);
  }

  if (pattern.startsWith('*.')) {
    return p.endsWith(pattern.slice(1));
  }

  if (pattern.includes('*')) {
    const re = new RegExp(
      '^' + pattern.split('*').map(escapeRegex).join('.*') + '$'
    );
    return re.test(p);
  }

  return p === pattern;
}

function sumTracked(files, predicate) {
  let total = 0;
  for (const rel of files) {
    if (predicate(rel)) total += fileSize(rel);
  }
  return total;
}

function readManifest() {
  if (!fs.existsSync(manifestPath)) return [];
  return fs.readFileSync(manifestPath, 'utf8')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x && !x.startsWith('#'));
}

function checkMax(label, bytes, maxMb) {
  const actual = mb(bytes);
  if (actual > maxMb) {
    fail(`${label} is too large: ${actual.toFixed(3)} MB > ${maxMb} MB`);
  }
}

const errors = [];

if (!fs.existsSync(budgetPath)) {
  console.error('Missing .repo-budget.json');
  process.exit(1);
}

const budget = readJson(budgetPath);
const files = trackedFiles();
const manifest = readManifest();

const trackedWorktreeBytes = sumTracked(files, () => true);
const assetsBytes = sumTracked(files, (rel) => rel.startsWith('assets/'));
const assetsImagesBytes = sumTracked(files, (rel) => rel.startsWith('assets/images/'));

let manifestBytes = 0;
const missingManifestFiles = [];
for (const rel of manifest) {
  const abs = path.join(repo, rel);

  if (!fs.existsSync(abs)) {
    // version.json создаётся VPS deploy script. Локально он может отсутствовать.
    if (rel !== 'version.json') {
      missingManifestFiles.push(rel);
    }
    continue;
  }

  manifestBytes += fileSize(rel);
}

checkMax('tracked worktree', trackedWorktreeBytes, budget.max_tracked_worktree_mb);
checkMax('assets', assetsBytes, budget.max_assets_mb);
checkMax('assets/images', assetsImagesBytes, budget.max_assets_images_mb);
checkMax('deploy manifest payload', manifestBytes, budget.max_deploy_manifest_mb);

const forbiddenTracked = [];
for (const rel of files) {
  for (const pattern of budget.forbidden_tracked_patterns || []) {
    if (matchesPattern(rel, pattern)) {
      forbiddenTracked.push({ rel, pattern });
      break;
    }
  }
}

if (forbiddenTracked.length) {
  fail(
    'forbidden tracked files:\n' +
    forbiddenTracked.map((x) => `  - ${x.rel} matches ${x.pattern}`).join('\n')
  );
}

const maxSingleAssetBytes = Math.round(Number(budget.max_single_asset_mb) * 1024 * 1024);
const tooLargeAssets = files
  .filter((rel) => rel.startsWith('assets/') && fileSize(rel) > maxSingleAssetBytes)
  .map((rel) => ({ rel, bytes: fileSize(rel) }))
  .sort((a, b) => b.bytes - a.bytes);

if (tooLargeAssets.length) {
  fail(
    'single asset budget exceeded:\n' +
    tooLargeAssets.map((x) => `  - ${mbText(x.bytes)} ${x.rel}`).join('\n')
  );
}

const allowlist = new Set(budget.manifest_forbidden_allowlist || []);
const forbiddenManifest = [];

for (const rel of manifest) {
  if (allowlist.has(rel)) continue;

  for (const pattern of budget.manifest_forbidden_patterns || []) {
    if (matchesPattern(rel, pattern)) {
      forbiddenManifest.push({ rel, pattern });
      break;
    }
  }
}

if (forbiddenManifest.length) {
  fail(
    'forbidden files in deploy manifest:\n' +
    forbiddenManifest.map((x) => `  - ${x.rel} matches ${x.pattern}`).join('\n')
  );
}

if (missingManifestFiles.length) {
  fail(
    'missing files from deploy manifest:\n' +
    missingManifestFiles.map((x) => `  - ${x}`).join('\n')
  );
}

const required = budget.required_manifest_files || [];
const manifestSet = new Set(manifest);
const missingRequired = required.filter((rel) => !manifestSet.has(rel));

if (missingRequired.length) {
  fail(
    'required files missing from deploy manifest:\n' +
    missingRequired.map((x) => `  - ${x}`).join('\n')
  );
}

console.log('# Repo budget check');
console.log(`tracked_files=${files.length}`);
console.log(`tracked_worktree=${mbText(trackedWorktreeBytes)} / max ${budget.max_tracked_worktree_mb} MB`);
console.log(`assets=${mbText(assetsBytes)} / max ${budget.max_assets_mb} MB`);
console.log(`assets_images=${mbText(assetsImagesBytes)} / max ${budget.max_assets_images_mb} MB`);
console.log(`deploy_manifest_files=${manifest.length}`);
console.log(`deploy_manifest_payload=${mbText(manifestBytes)} / max ${budget.max_deploy_manifest_mb} MB`);
console.log(`max_single_asset=${budget.max_single_asset_mb} MB`);

if (errors.length) {
  console.error('\n❌ Repo budget failed');
  for (const error of errors) {
    console.error('\n' + error);
  }
  process.exit(1);
}

console.log('\n✅ Repo budget passed');
