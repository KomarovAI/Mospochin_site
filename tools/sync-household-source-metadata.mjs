#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apply = process.argv.includes('--apply');
const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/page-metadata.json'), 'utf8')).pages;
const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/household-page-policy.json'), 'utf8'));
const branchPages = new Set(policy.sharedCardSlots?.branchPages || []);
const changes = [];

function visibleText(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

for (const [page, pageMetadata] of Object.entries(metadata)) {
  if (pageMetadata.branch !== 'household') continue;
  const slug = page.replace(/\.html$/i, '');
  const modelPath = path.join(ROOT, 'src/pages', slug, 'page.json');
  const rootPath = path.join(ROOT, page);
  if (!fs.existsSync(modelPath) || !fs.existsSync(rootPath)) {
    changes.push({ page, missing: !fs.existsSync(modelPath) ? 'model' : 'root' });
    continue;
  }

  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const html = fs.readFileSync(rootPath, 'utf8');
  const h1 = visibleText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const expected = {
    branch: 'household',
    role: branchPages.has(page) ? 'branch' : 'service',
    title: pageMetadata.title,
    h1,
  };
  const fields = Object.entries(expected).filter(([key, value]) => model[key] !== value);
  if (!fields.length) continue;
  changes.push({ page, fields: fields.map(([key]) => key) });
  if (apply) {
    for (const [key, value] of fields) model[key] = value;
    fs.writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`);
  }
}

if (!apply && changes.length) {
  console.error(`❌ Household source metadata is stale: ${changes.length} page(s)`);
  for (const change of changes.slice(0, 20)) console.error(`- ${change.page}: ${change.missing || change.fields.join(', ')}`);
  if (changes.length > 20) console.error(`- … ещё ${changes.length - 20}`);
  console.error('Run: node tools/sync-household-source-metadata.mjs --apply');
  process.exit(1);
}

console.log(`✅ Household source metadata ${apply ? 'synchronized' : 'current'}: ${changes.length} changed page(s)`);
