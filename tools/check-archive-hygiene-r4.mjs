#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const load = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const exists = (file) => fs.existsSync(path.join(root, file));

const bannedFiles = [
  'partials-injector.js',
  'main_js_followup_visual.diff',
  'main_js_visual_patch.diff',
  'styles_floating_cta_patch.diff',
  'styles_visual_patch.diff',
  'tools/validate-site-v11-static-wrapper.mjs',
  'tools/validate-site.strict.mjs',
  'action',
  'landing-',
  'main',
  'mospochin-site@1.0.0',
  'node',
];
for (const file of bannedFiles) if (exists(file)) errors.push(`legacy file returned: ${file}`);
if (exists('partials')) errors.push('legacy partials directory returned');

const dishwasher = load('data/dishwasher-symptom-pages.json');
for (const entry of dishwasher.pages || []) {
  if (!exists(entry.page)) errors.push(`dishwasher registry target missing: ${entry.page}`);
  if (entry.status !== 'published') errors.push(`dishwasher status is not published: ${entry.page}`);
  if (entry.publicationState !== 'published') errors.push(`dishwasher publicationState is not published: ${entry.page}`);
}

const refrigeration = load('data/refrigeration-conversion-pages.json');
if (refrigeration.status !== 'published') errors.push('refrigeration conversion manifest is not published');
for (const entry of refrigeration.pages || []) {
  if (!exists(entry.page)) errors.push(`refrigeration conversion target missing: ${entry.page}`);
  if (entry.status !== 'published') errors.push(`refrigeration conversion status is not published: ${entry.page}`);
  if (entry.indexable !== false) errors.push(`refrigeration Direct page must remain non-indexable: ${entry.page}`);
}

const kutter = load('data/kutter-cluster-pages.json');
const kutterPublished = (kutter.pages || []).filter((entry) => entry.status === 'published');
if (kutterPublished.length !== 45) errors.push(`kutter published count must be 45, got ${kutterPublished.length}`);
if (!/45 published pages/.test(kutter.purpose || '')) errors.push('kutter purpose is stale');

const backlog = load('data/sous-vide-p2-backlog.json');
if (backlog.status !== 'deferred') errors.push('sous-vide P2 backlog must be deferred');
if (backlog.currentPublishedScopeComplete !== true) errors.push('sous-vide current published scope must be marked complete');
if ((backlog.pages || []).length !== 12) errors.push(`sous-vide deferred backlog must contain 12 entries, got ${(backlog.pages || []).length}`);
for (const entry of backlog.pages || []) {
  if (entry.status !== 'planned' || entry.releaseState !== 'deferred_backlog') errors.push(`invalid deferred state: ${entry.page}`);
  if (exists(entry.page)) errors.push(`deferred backlog page unexpectedly exists: ${entry.page}`);
  if (entry.indexable !== false) errors.push(`deferred backlog page must be non-indexable: ${entry.page}`);
}

const registry = load('data/cluster-registry.json');
if (registry.clusters?.['sous-vide']?.backlogManifest !== 'data/sous-vide-p2-backlog.json') errors.push('cluster registry does not expose sous-vide backlog manifest');
if (!exists('docs/ARCHIVE_HYGIENE_R4.md')) errors.push('archive hygiene handoff missing');

if (errors.length) {
  console.error(`Archive Hygiene R4 failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Archive Hygiene R4 passed: dishwasher=${dishwasher.pages.length}, refrigeration=${refrigeration.pages.length}, kutter=${kutterPublished.length}, sousVideDeferred=${backlog.pages.length}`);
