#!/usr/bin/env node
/** Validate data/file-ownership.json and, when git is available, warn/fail on
 * changed generated files. In ZIP/no-git handoff mode it validates the contract
 * without requiring git metadata.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve(path.dirname(__filename), '..');
const MANIFEST = path.join(ROOT_DIR, 'data', 'file-ownership.json');

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function normalize(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function walk(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    const rel = normalize(path.join(prefix, name));
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, rel));
    else out.push(rel);
  }
  return out;
}

function patternToRegex(pattern) {
  const normalized = normalize(pattern);
  const tokenDeepSlash = '___DOUBLE_STAR_SLASH___';
  const tokenDeep = '___DOUBLE_STAR___';
  const tokenStar = '___STAR___';
  const marked = normalized
    .replace(/\*\*\//g, tokenDeepSlash)
    .replace(/\*\*/g, tokenDeep)
    .replace(/\*/g, tokenStar);
  const escaped = marked.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const regex = escaped
    .replaceAll(tokenDeepSlash, '(?:.*\/)?')
    .replaceAll(tokenDeep, '.*')
    .replaceAll(tokenStar, '[^/]*');
  return new RegExp(`^${regex}$`);
}

function matchesAny(file, patterns) {
  return patterns.some((pattern) => patternToRegex(pattern).test(file));
}

function gitChangedFiles() {
  if (!existsSync(path.join(ROOT_DIR, '.git'))) return [];
  const result = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT_DIR, encoding: 'utf8' });
  if (result.status !== 0) return [];
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => normalize(line.slice(3).trim()))
    .filter(Boolean);
}

if (!existsSync(MANIFEST)) {
  fail('data/file-ownership.json отсутствует');
  process.exit(process.exitCode || 1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
for (const key of ['manual', 'generated', 'dangerZones']) {
  if (!Array.isArray(manifest[key]) || manifest[key].length === 0) {
    fail(`file-ownership: ${key} должен быть непустым массивом`);
  }
}
if (manifest.optionalDangerZones !== undefined && !Array.isArray(manifest.optionalDangerZones)) {
  fail('file-ownership: optionalDangerZones должен быть массивом');
}

const allFiles = walk(ROOT_DIR);
for (const [key, patterns] of Object.entries({ manual: manifest.manual, generated: manifest.generated, dangerZones: manifest.dangerZones })) {
  for (const pattern of patterns) {
    const hasMagic = pattern.includes('*');
    const exists = hasMagic ? allFiles.some((file) => patternToRegex(pattern).test(file)) : existsSync(path.join(ROOT_DIR, pattern));
    if (!exists) fail(`file-ownership: pattern ${key}:${pattern} не совпадает ни с одним файлом`);
  }
}

const overlaps = allFiles.filter((file) => matchesAny(file, manifest.manual) && matchesAny(file, manifest.generated));
if (overlaps.length) {
  fail(`file-ownership: файл одновременно manual и generated: ${overlaps.slice(0, 10).join(', ')}`);
}

const changedGenerated = gitChangedFiles().filter((file) => matchesAny(file, manifest.generated));
if (changedGenerated.length) {
  fail(`changed generated files detected: ${changedGenerated.join(', ')}. Запусти sync:generated и проверь, что source тоже изменён.`);
}

if (process.exitCode) process.exit(process.exitCode);
console.log('✅ file ownership contract valid');
