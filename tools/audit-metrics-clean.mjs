#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let errors = 0;
let warnings = 0;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function fail(message) {
  errors += 1;
  console.error(`FAIL: ${message}`);
}

function warn(message) {
  warnings += 1;
  console.warn(`WARN: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
  else pass(message);
}

function listFiles(dir, predicate = () => true, output = []) {
  if (!exists(dir)) return output;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) listFiles(rel, predicate, output);
    else if (predicate(rel)) output.push(rel);
  }
  return output;
}

const analytics = read('analytics.js');
const server = read('server/telegram-api.mjs');
const directGenerator = read('tools/generate-direct-landings.mjs');
const contract = JSON.parse(read('data/metrics-event-contract.json'));
const metadata = JSON.parse(read('data/page-metadata.json'));

console.log(`Clean metrics audit version: ${contract.version}`);

assert(!server.includes('...extraHeaders,\n    ...extraHeaders'), 'server sendJson has no duplicate header spread');
assert(!server.includes('decodedChunks.push(bodyBuffer.slice(offset, offset + chunkSize));\n    decodedChunks.push(bodyBuffer.slice(offset, offset + chunkSize));'), 'chunked decoder does not duplicate chunks');
assert(!server.includes('extra_field_keys: Object.keys(submission.extraFields || {}).slice(0, MAX_EXTRA_FIELDS),\n    extra_field_keys:'), 'lead log object has no duplicate extra_field_keys key');
assert(server.includes('redactSensitiveText') && server.includes('sanitizeContactHref'), 'backend redacts contact href/text before event log');
assert(analytics.includes('safeContactHref') && analytics.includes('redactContactText'), 'frontend redacts contact href/text before Metrika/local event payload');
assert(/tel:\[redacted\]/.test(analytics) && /mailto:\[redacted\]/.test(analytics), 'frontend masks tel/mailto targets');
assert(/tel:\[redacted\]/.test(server) && /mailto:\[redacted\]/.test(server), 'backend masks tel/mailto targets');
assert(directGenerator.includes('Array.isArray(page.analysisCards)'), 'direct landing generator tolerates pages without analysisCards');
assert(directGenerator.includes('<body\\b([^>]*)\\sclass=') || directGenerator.includes('<body\\b([^>]*)\\sclass="'), 'direct landing generator preserves body attributes while replacing class');

const staleRootFiles = fs.readdirSync(root).filter((name) => /^METRICS_RUN[1-4]_(CHECKS|CHANGED_FILES)_20260620\.txt$/.test(name));
if (staleRootFiles.length) fail(`stale root metrics run artifacts remain: ${staleRootFiles.join(', ')}`);
else pass('stale root metrics run artifacts removed');

const staleDocs = listFiles('docs', (rel) => /metrics-analytics-run[1-4]-.*20260620\.md$/.test(path.basename(rel)));
if (staleDocs.length) fail(`stale metrics run handoff docs remain: ${staleDocs.join(', ')}`);
else pass('stale metrics run handoff docs removed');

const longTitles = Object.entries(metadata.pages || {})
  .filter(([, page]) => typeof page.title === 'string' && page.title.length > 75)
  .map(([file, page]) => `${file} (${page.title.length})`);
if (longTitles.length) fail(`page titles longer than 75 chars: ${longTitles.join(', ')}`);
else pass('page metadata titles are within 75 characters');

for (const [file, page] of Object.entries(metadata.pages || {})) {
  if (!page?.canonical && file !== '404.html') warn(`${file}: no canonical in metadata`);
}

if (errors) {
  console.error(`Clean metrics audit failed: ${errors} error(s), ${warnings} warning(s).`);
  process.exit(1);
}
console.log(`Clean metrics audit passed: 0 errors, ${warnings} warning(s).`);
