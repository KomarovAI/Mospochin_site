#!/usr/bin/env node

/**
 * Structural architecture gate for the staged static-site migration.
 * Warnings describe intentional migration debt; only broken contracts fail.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { renderPageFromModel } from './site-builder-lib.mjs';

const ROOT = process.cwd();
const failures = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function fail(message) {
  failures.push(message);
  console.error(`❌ ${message}`);
}

function sorted(values) {
  return [...values].sort();
}

const rootPages = fs.readdirSync(ROOT).filter((file) => file.endsWith('.html')).sort();
const metadata = readJson('data/page-metadata.json').pages || {};
const metadataPages = Object.keys(metadata).sort();
const manifest = readJson('src/site-builder.json');
const manifestPages = manifest.pages || [];
const migration = manifest.migration || {};

if (sorted(metadataPages).join('\n') !== rootPages.join('\n')) {
  fail(`data/page-metadata.json does not cover exactly the ${rootPages.length} root HTML pages`);
}

const modelFiles = fs.readdirSync(path.join(ROOT, 'src/pages'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `src/pages/${entry.name}/page.json`)
  .filter((file) => fs.existsSync(path.join(ROOT, file)))
  .sort();
const models = modelFiles.map((file) => ({ file, model: readJson(file) }));
const modelPages = models.map(({ model }) => model.page);
const duplicateModelPages = sorted(modelPages.filter((page, index) => modelPages.indexOf(page) !== index));
if (duplicateModelPages.length) fail(`duplicate source models: ${duplicateModelPages.join(', ')}`);

const registeredPages = manifestPages.map((entry) => entry.page);
const duplicateRegisteredPages = sorted(registeredPages.filter((page, index) => registeredPages.indexOf(page) !== index));
if (duplicateRegisteredPages.length) fail(`duplicate builder entries: ${duplicateRegisteredPages.join(', ')}`);

for (const entry of manifestPages) {
  const modelPath = path.join(ROOT, entry.model);
  const rootPath = path.join(ROOT, entry.page);
  if (!fs.existsSync(modelPath)) {
    fail(`${entry.page}: builder model is missing (${entry.model})`);
    continue;
  }
  if (!fs.existsSync(rootPath)) {
    fail(`${entry.page}: builder root HTML is missing`);
    continue;
  }
  const model = readJson(entry.model);
  if (model.page !== entry.page) fail(`${entry.page}: manifest/model page mismatch`);
  try {
    const root = fs.readFileSync(rootPath);
    const rendered = Buffer.from(renderPageFromModel(entry.model).html, 'utf8');
    if (Buffer.compare(root, rendered) !== 0) fail(`${entry.page}: registered builder output differs from root HTML`);
    if (entry.sourceHash && entry.sourceHash !== hash(root)) fail(`${entry.page}: manifest sourceHash does not match root HTML`);
  } catch (error) {
    fail(`${entry.page}: builder render failed: ${error.message}`);
  }
}

const expectedPendingModels = sorted(modelPages.filter((page) => !registeredPages.includes(page)));
const expectedLegacyPages = sorted(rootPages.filter((page) => !modelPages.includes(page)));
const declaredPendingModels = sorted(migration.pendingModelPages || []);
const declaredLegacyPages = sorted(migration.legacyHtmlPages || []);
const unified = expectedPendingModels.length === 0 && expectedLegacyPages.length === 0;
const expectedStatus = unified ? 'source-of-truth' : 'staged-migration';

const expectedMode = unified
  ? 'unified-source-parity'
  : 'staged-source-parity';
if (manifest.status !== expectedStatus) fail(`src/site-builder.json status is ${manifest.status || '(missing)'}, expected ${expectedStatus}`);
if (migration.mode !== expectedMode) fail(`src/site-builder.json migration mode is ${migration.mode || '(missing)'}, expected ${expectedMode}`);
if (migration.rootHtmlPages !== rootPages.length) fail('migration.rootHtmlPages is stale');
if (migration.modelPages !== models.length) fail('migration.modelPages is stale');
if (migration.registeredPages !== manifestPages.length) {
  fail('migration.registeredPages is not aligned with builder.pages');
}
if (expectedPendingModels.join('\n') !== declaredPendingModels.join('\n')) {
  fail('migration.pendingModelPages is stale');
}
if (expectedLegacyPages.join('\n') !== declaredLegacyPages.join('\n')) {
  fail('migration.legacyHtmlPages is stale');
}

console.log('Architecture contract:');
console.log(`- root HTML pages: ${rootPages.length}`);
console.log(`- source models: ${models.length}`);
console.log(`- builder-registered pages: ${manifestPages.length}`);
console.log(`- pending source models: ${expectedPendingModels.length}`);
console.log(`- legacy HTML pages: ${expectedLegacyPages.length}`);

if (expectedPendingModels.length || expectedLegacyPages.length) {
  console.warn('⚠️ staged migration is active: pending/legacy pages are intentionally excluded from builder writes');
} else {
  console.log('✅ unified source-of-truth: every root HTML page is builder-managed');
}

if (failures.length) {
  console.error(`Architecture contract failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log('✅ architecture contract passed');
