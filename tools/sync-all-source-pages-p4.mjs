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

const pagesRoot = path.join(ROOT_DIR, 'src', 'pages');
const modelPaths = fs.readdirSync(pagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `src/pages/${entry.name}/page.json`)
  .filter((relative) => fs.existsSync(path.join(ROOT_DIR, relative)))
  .sort();
const metricsPath = path.join(ROOT_DIR, 'data', 'metrics-page-context.json');
const metadataPath = path.join(ROOT_DIR, 'data', 'page-metadata.json');
const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

function upsertVersion(bodyOpen, version) {
  if (/\sdata-page-version=["'][^"']*["']/i.test(bodyOpen)) {
    return bodyOpen.replace(/\sdata-page-version=["'][^"']*["']/i, ` data-page-version="${version}"`);
  }
  return bodyOpen.replace(/<body\b([^>]*)>/i, `<body$1 data-page-version="${version}">`);
}

function attr(tag, name) {
  const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return tag.match(new RegExp(`\\s${escaped}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

let renderedPages = 0;
let changedMarkers = 0;

for (const modelRelative of modelPaths) {
  const modelPath = path.join(ROOT_DIR, modelRelative);
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
    extractedFrom: model.page,
    extractedAt: '1970-01-01T00:00:00.000Z',
    hash: hashContent(html),
    mode: 'lossless-section-snapshot'
  };
  fs.writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`);
  writeProjectFile(model.page, html);
  writeProjectFile(`build/site-builder/${model.page}`, html);

  if (metrics.pages?.[model.page]) {
    const bodyTag = html.match(/<body\b[^>]*>/i)?.[0] || '';
    const current = metrics.pages[model.page];
    metrics.pages[model.page] = {
      ...current,
      page_slug: attr(bodyTag, 'data-page-slug') || model.slug,
      page_intent: attr(bodyTag, 'data-page-intent') || current.page_intent,
      equipment: attr(bodyTag, 'data-equipment') || current.equipment,
      brand: attr(bodyTag, 'data-brand'),
      service: attr(bodyTag, 'data-service') || current.service,
      commercial_segment: attr(bodyTag, 'data-commercial-segment') || current.commercial_segment,
      branch: metadata.pages?.[model.page]?.branch || current.branch,
      page_version: version,
      source: 'source_model_body_p4'
    };
  }
  renderedPages += 1;
}

fs.writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(`✅ Synced all source pages P4: ${renderedPages} pages, changed body markers=${changedMarkers}`);
