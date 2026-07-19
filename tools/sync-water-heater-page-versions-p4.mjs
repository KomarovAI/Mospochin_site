#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  ROOT_DIR,
  hashContent,
  readSectionContent,
  renderPageFromModel,
  writeProjectFile
} from './site-builder-lib.mjs';

const clusterPath = path.join(ROOT_DIR, 'data', 'water-heater-cluster-pages.json');
const cluster = JSON.parse(fs.readFileSync(clusterPath, 'utf8'));
const metricsPath = path.join(ROOT_DIR, 'data', 'metrics-page-context.json');
const metrics = fs.existsSync(metricsPath)
  ? JSON.parse(fs.readFileSync(metricsPath, 'utf8'))
  : { pages: {} };

function upsertVersion(bodyOpen, version) {
  if (/\sdata-page-version=["'][^"']*["']/i.test(bodyOpen)) {
    return bodyOpen.replace(/\sdata-page-version=["'][^"']*["']/i, ` data-page-version="${version}"`);
  }
  return bodyOpen.replace(/<body\b([^>]*)>/i, `<body$1 data-page-version="${version}">`);
}

let changedMarkers = 0;
let renderedPages = 0;

for (const entry of cluster.pages) {
  const slug = entry.page.replace(/\.html$/, '');
  const modelRelative = `src/pages/${slug}/page.json`;
  const modelPath = path.join(ROOT_DIR, modelRelative);
  if (!fs.existsSync(modelPath)) throw new Error(`Missing source model: ${modelRelative}`);

  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const base = path.posix.dirname(modelRelative);
  for (const section of model.sections || []) {
    const content = readSectionContent(modelRelative, section);
    section.bytes = Buffer.byteLength(content);
    section.hash = hashContent(content).slice(0, 16);
  }

  const bodyOpenPath = path.join(ROOT_DIR, base, model.files.bodyOpen);
  const beforeBody = fs.readFileSync(bodyOpenPath, 'utf8');
  let html = renderPageFromModel(modelRelative).html;
  const version = crypto.createHash('sha256')
    .update(html.replace(/\sdata-page-version=["'][^"']*["']/gi, ''))
    .digest('hex')
    .slice(0, 16);
  const afterBody = upsertVersion(beforeBody, version);
  if (afterBody !== beforeBody) {
    fs.writeFileSync(bodyOpenPath, afterBody);
    changedMarkers += 1;
  }

  html = renderPageFromModel(modelRelative).html;
  model.source = {
    ...(model.source || {}),
    extractedFrom: entry.page,
    extractedAt: '1970-01-01T00:00:00.000Z',
    hash: hashContent(html),
    mode: 'lossless-section-snapshot'
  };
  fs.writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`);
  writeProjectFile(entry.page, html);
  writeProjectFile(`build/site-builder/${entry.page}`, html);
  if (metrics.pages?.[entry.page]) metrics.pages[entry.page].page_version = version;
  renderedPages += 1;
}

if (metrics.pages) fs.writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(`✅ Synced water-heater P4: ${renderedPages} pages, changed body markers=${changedMarkers}`);
