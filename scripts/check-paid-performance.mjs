#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel));
const readText = (rel) => read(rel).toString('utf8');
const baseline = JSON.parse(readText('data/paid-tracking-performance-baseline.json'));
const manifest = JSON.parse(readText('data/paid-landings.json'));
let errors = 0;
const result = { schemaVersion: 1, release: baseline.release, checkedAt: new Date().toISOString(), scripts: {}, paidPages: [] };
function fail(message) { errors += 1; console.error(`FAIL: ${message}`); }
function pass(message) { console.log(`PASS: ${message}`); }

let baselineGzip = 0;
let currentGzip = 0;
for (const [file, spec] of Object.entries(baseline.scripts)) {
  const body = read(file);
  const gzipBytes = zlib.gzipSync(body, { level: 9 }).length;
  baselineGzip += Number(spec.baseline_gzip_bytes || 0);
  currentGzip += gzipBytes;
  result.scripts[file] = { rawBytes: body.length, gzipBytes, baselineGzipBytes: spec.baseline_gzip_bytes, deltaGzipBytes: gzipBytes - spec.baseline_gzip_bytes };
  if (/\.open\s*\([^,]+,[^,]+,\s*false\s*\)/.test(body.toString('utf8'))) fail(`${file}: synchronous XHR found`);
  else pass(`${file}: no synchronous XHR`);
  if (/document\.write\s*\(/.test(body.toString('utf8'))) fail(`${file}: document.write found`);
  else pass(`${file}: no document.write`);
}
const delta = currentGzip - baselineGzip;
result.combined = { baselineGzipBytes: baselineGzip, currentGzipBytes: currentGzip, deltaGzipBytes: delta, budgetGzipBytes: baseline.blockingIncreaseBudgetGzipBytes };
if (delta > baseline.blockingIncreaseBudgetGzipBytes) fail(`combined JS gzip delta ${delta} exceeds budget ${baseline.blockingIncreaseBudgetGzipBytes}`);
else pass(`combined JS gzip delta ${delta} within budget ${baseline.blockingIncreaseBudgetGzipBytes}`);

for (const entry of manifest) {
  const page = String(entry.landing_path).replace(/^\//, '');
  const html = readText(page);
  const analyticsTags = [...html.matchAll(/<script\b[^>]*src=["']analytics\.js["'][^>]*><\/script>/gi)].map((m) => m[0]);
  const formTags = [...html.matchAll(/<script\b[^>]*src=["']telegram-form\.js["'][^>]*><\/script>/gi)].map((m) => m[0]);
  if (analyticsTags.length !== 1) fail(`${page}: analytics.js count=${analyticsTags.length}`);
  if (formTags.length !== 1) fail(`${page}: telegram-form.js count=${formTags.length}`);
  for (const tag of [...analyticsTags, ...formTags]) if (!/\sdefer(?:\s|>|=)/i.test(tag)) fail(`${page}: blocking script tag ${tag}`);
  result.paidPages.push({ page, analyticsCount: analyticsTags.length, formCount: formTags.length, defer: [...analyticsTags, ...formTags].every((tag) => /\sdefer(?:\s|>|=)/i.test(tag)) });
}
if (!errors) pass(`five paid pages keep analytics/form scripts single and defer-loaded`);
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports', 'paid-tracking-performance.json'), JSON.stringify(result, null, 2) + '\n');
if (errors) process.exit(1);
console.log(`Paid performance guard passed: current=${currentGzip} gzip bytes, delta=${delta}.`);
