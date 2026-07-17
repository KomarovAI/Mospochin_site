#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  ROOT_DIR,
  hashContent,
  loadBuilderManifest,
  readSectionContent,
  renderPageFromModel,
  writeBuilderManifest,
  writeProjectFile
} from './site-builder-lib.mjs';

const cluster = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'ventilation-cluster-pages.json'), 'utf8'));
const targets = new Set(cluster.pages.map((row) => row.page));
const manifest = loadBuilderManifest();
const metricsPath = path.join(ROOT_DIR, 'data', 'metrics-page-context.json');
const metrics = fs.existsSync(metricsPath) ? JSON.parse(fs.readFileSync(metricsPath, 'utf8')) : { pages: {} };

function upsertVersion(bodyOpen, version) {
  if (/\sdata-page-version=["'][^"']*["']/i.test(bodyOpen)) {
    return bodyOpen.replace(/\sdata-page-version=["'][^"']*["']/i, ` data-page-version="${version}"`);
  }
  return bodyOpen.replace(/<body\b([^>]*)>/i, `<body$1 data-page-version="${version}">`);
}

let changed = 0;
for (const entry of manifest.pages) {
  if (!targets.has(entry.page)) continue;
  const modelPath = path.join(ROOT_DIR, entry.model);
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const base = path.posix.dirname(entry.model);
  for (const section of model.sections || []) {
    const content = readSectionContent(entry.model, section);
    section.bytes = Buffer.byteLength(content);
    section.hash = hashContent(content).slice(0, 16);
  }
  const bodyOpenPath = path.join(ROOT_DIR, base, model.files.bodyOpen);
  const beforeBody = fs.readFileSync(bodyOpenPath, 'utf8');
  let html = renderPageFromModel(entry.model).html;
  const version = crypto.createHash('sha256')
    .update(html.replace(/\sdata-page-version=["'][^"']*["']/gi, ''))
    .digest('hex')
    .slice(0, 16);
  const afterBody = upsertVersion(beforeBody, version);
  if (afterBody !== beforeBody) {
    fs.writeFileSync(bodyOpenPath, afterBody);
    changed += 1;
  }
  html = renderPageFromModel(entry.model).html;
  model.source = {
    ...(model.source || {}),
    extractedFrom: entry.page,
    extractedAt: '1970-01-01T00:00:00.000Z',
    hash: hashContent(html),
    mode: 'lossless-section-snapshot'
  };
  fs.writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`);
  entry.sections = model.sections.length;
  entry.sourceHash = model.source.hash;
  writeProjectFile(entry.page, html);
  writeProjectFile(`build/site-builder/${entry.page}`, html);
  if (metrics.pages?.[entry.page]) metrics.pages[entry.page].page_version = version;
}
writeBuilderManifest(manifest.pages);
if (metrics.pages) fs.writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(`✅ Synced ventilation page versions: ${targets.size} pages, changed markers=${changed}`);
