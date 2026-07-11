#!/usr/bin/env node

/**
 * Rebuilds the Static Component Builder manifest from existing page models.
 *
 * A model is registered only when rendering it is byte-identical to the
 * current root HTML page. Non-identical models stay pending and are never
 * allowed to overwrite production output implicitly.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { renderPageFromModel } from './site-builder-lib.mjs';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'src/site-builder.json');
const CHECK_MODE = process.argv.includes('--check');

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function pageModels() {
  const pagesRoot = path.join(ROOT, 'src/pages');
  return fs.readdirSync(pagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `src/pages/${entry.name}/page.json`)
    .filter((relativePath) => fs.existsSync(path.join(ROOT, relativePath)))
    .sort();
}

function buildManifest() {
  const current = readJson('src/site-builder.json');
  const rootPages = fs.readdirSync(ROOT)
    .filter((file) => file.endsWith('.html'))
    .sort();
  const models = [];

  for (const modelPath of pageModels()) {
    const model = readJson(modelPath);
    const rootPath = path.join(ROOT, model.page);
    if (!fs.existsSync(rootPath)) {
      models.push({ modelPath, model, status: 'missing-root-html' });
      continue;
    }

    try {
      const root = fs.readFileSync(rootPath);
      const rendered = Buffer.from(renderPageFromModel(modelPath).html, 'utf8');
      const equal = Buffer.compare(root, rendered) === 0;
      models.push({
        modelPath,
        model,
        status: equal ? 'registered' : 'pending-model-parity',
        rootHash: sha256(root),
      });
    } catch (error) {
      models.push({ modelPath, model, status: 'render-error', reason: error.message });
    }
  }

  const registered = models
    .filter((item) => item.status === 'registered')
    .map(({ modelPath, model, rootHash }) => ({
      page: model.page,
      slug: model.slug,
      model: modelPath,
      sections: model.sections?.length || 0,
      sourceHash: rootHash,
    }))
    .sort((a, b) => a.page.localeCompare(b.page));
  const modelPages = new Set(models.map((item) => item.model.page));
  const registeredPages = new Set(registered.map((item) => item.page));
  const pendingModelPages = [...modelPages].filter((page) => !registeredPages.has(page)).sort();
  const legacyHtmlPages = rootPages.filter((page) => !modelPages.has(page));
  const pendingReasons = Object.fromEntries(
    models
      .filter((item) => item.status !== 'registered')
      .map((item) => [item.model.page, item.reason || item.status])
  );

  const unified = pendingModelPages.length === 0 && legacyHtmlPages.length === 0;

  return {
    ...current,
    generatedAt: '1970-01-01T00:00:00.000Z',
    status: unified ? 'source-of-truth' : 'staged-migration',
    note: unified
      ? 'Every production HTML page has one byte-identical source model and is generated through the Static Component Builder.'
      : 'Only byte-identical source models are registered for builder writes. Pending models and legacy HTML pages are explicit migration work and cannot be overwritten implicitly.',
    pages: registered,
    migration: {
      mode: unified ? 'unified-source-parity' : 'staged-source-parity',
      generatedBy: 'tools/sync-site-builder-manifest.mjs',
      rootHtmlPages: rootPages.length,
      modelPages: modelPages.size,
      registeredPages: registered.length,
      pendingModelPages,
      pendingModelReasons: pendingReasons,
      legacyHtmlPages,
      rules: {
        registered: 'src/pages/<slug> is the editable source; build-site may write root HTML after parity checks.',
        pendingModel: 'Reconcile src/pages/<slug> with root HTML before adding the page to builder.pages.',
        legacyHtml: 'Root HTML plus branch/data authoring helpers remain the source until a model is created and reconciled.',
      },
    },
  };
}

const next = buildManifest();
const nextText = `${JSON.stringify(next, null, 2)}\n`;
const currentText = fs.readFileSync(MANIFEST_PATH, 'utf8');

if (CHECK_MODE) {
  if (currentText !== nextText) {
    console.error('❌ src/site-builder.json is stale. Run npm run site-builder:sync-manifest');
    process.exit(1);
  }
} else {
  fs.writeFileSync(MANIFEST_PATH, nextText);
}

console.log(`Builder manifest ${CHECK_MODE ? 'check' : 'sync'}: registered=${next.pages.length}, pendingModels=${next.migration.pendingModelPages.length}, legacyHtml=${next.migration.legacyHtmlPages.length}`);
