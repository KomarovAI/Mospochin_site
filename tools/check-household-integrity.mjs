#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/page-metadata.json'), 'utf8')).pages;
const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/household-page-policy.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/faq/page-faq-registry.json'), 'utf8')).pages;
const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/household-seo-budget.json'), 'utf8')).thresholds;
const householdPages = Object.entries(metadata).filter(([, value]) => value.branch === 'household').map(([page]) => page).sort();
const householdSet = new Set(householdPages);
const branchPages = new Set(policy.sharedCardSlots?.branchPages || []);
const manifests = [
  'household-refrigerator-cluster-pages.json',
  'washing-machine-cluster-pages.json',
  'dryer-cluster-pages.json',
  'household-dishwasher-cluster-pages.json',
  'microwave-cluster-pages.json',
  'water-heater-cluster-pages.json',
];
const extendedManifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/household-extended-cluster-pages.json'), 'utf8'));

function visibleText(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function normalize(value) {
  return visibleText(value).toLocaleLowerCase('ru-RU').replace(/[«»“”„\"'`]/g, '').replace(/\s+/g, ' ').trim();
}

function localTarget(href) {
  if (!href || /^(?:#|tel:|mailto:|javascript:)/i.test(href)) return null;
  try {
    const url = new URL(href, 'https://mospochin.ru/');
    if (url.hostname !== 'mospochin.ru') return null;
    const target = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    return target.endsWith('.html') ? target : null;
  } catch {
    return null;
  }
}

function duplicateGroups(map) {
  return [...map.entries()].filter(([value, pages]) => value && pages.length > 1);
}

const governed = new Set();
for (const file of manifests) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', file), 'utf8'));
  for (const entry of data.pages || data) governed.add(typeof entry === 'string' ? entry : entry.page);
}
for (const family of extendedManifest.families || []) {
  for (const entry of family.pages || []) governed.add(typeof entry === 'string' ? entry : entry.page);
}

const incoming = new Map(householdPages.map((page) => [page, 0]));
for (const page of fs.readdirSync(ROOT).filter((name) => name.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const targets = new Set([...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((match) => localTarget(match[1])).filter(Boolean));
  for (const target of targets) if (incoming.has(target) && target !== page) incoming.set(target, incoming.get(target) + 1);
}

const maps = { title: new Map(), h1: new Map(), description: new Map() };
const sourceIssues = [];
const bodyClassIssues = [];
const indexable = [];
let breadcrumbSchemaPages = 0;
let visibleBreadcrumbPages = 0;
let faqSchemaPages = 0;

for (const page of householdPages) {
  const slug = page.replace(/\.html$/i, '');
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const model = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/pages', slug, 'page.json'), 'utf8'));
  const title = visibleText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const h1 = visibleText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const description = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["']([^"']*)/i)?.[1] || '';
  const expectedRole = branchPages.has(page) ? 'branch' : 'service';
  const expectedClass = expectedRole === 'branch' ? 'page-household-branch' : 'page-household-service';
  const fields = [];
  if (model.branch !== 'household') fields.push('branch');
  if (model.role !== expectedRole) fields.push('role');
  if (model.title !== metadata[page].title || model.title !== title) fields.push('title');
  if (model.h1 !== h1) fields.push('h1');
  if (fields.length) sourceIssues.push({ page, fields });
  if (!new RegExp(`<body\\b[^>]*class=["'][^"']*\\b${expectedClass}\\b`, 'i').test(html)) bodyClassIssues.push(page);
  const noindex = /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["'][^"']*noindex/i.test(html);
  if (!noindex) indexable.push(page);
  if (/"@type"\s*:\s*"BreadcrumbList"/.test(html)) breadcrumbSchemaPages += 1;
  if (/<nav\b(?=[^>]*\baria-label=["']Хлебные крошки["'])(?=[^>]*\bdata-generated=["']household-breadcrumb["'])/i.test(html)) visibleBreadcrumbPages += 1;
  if (/"@type"\s*:\s*"FAQPage"/.test(html)) faqSchemaPages += 1;
  for (const [key, value] of Object.entries({ title, h1, description })) {
    const normalized = normalize(value);
    if (!maps[key].has(normalized)) maps[key].set(normalized, []);
    maps[key].get(normalized).push(page);
  }
}

const faqQuestions = new Map();
for (const page of householdPages) {
  for (const block of registry[page]?.blocks || []) {
    for (const item of block.items || []) {
      const question = normalize(item.question);
      if (!question) continue;
      if (!faqQuestions.has(question)) faqQuestions.set(question, new Set());
      faqQuestions.get(question).add(page);
    }
  }
}

const titleDuplicates = duplicateGroups(maps.title);
const h1Duplicates = duplicateGroups(maps.h1);
const descriptionDuplicates = duplicateGroups(maps.description);
const organicOrphans = indexable.filter((page) => (incoming.get(page) || 0) === 0);
const governedPages = householdPages.filter((page) => governed.has(page)).length;
const duplicateFaqQuestionGroups = [...faqQuestions.values()].filter((pages) => pages.size > 1).length;
const stats = {
  householdPages: householdPages.length,
  indexablePages: indexable.length,
  sourceModelIssues: sourceIssues.length,
  bodyClassIssues: bodyClassIssues.length,
  organicOrphans: organicOrphans.length,
  exactTitleDuplicateGroups: titleDuplicates.length,
  exactH1DuplicateGroups: h1Duplicates.length,
  exactDescriptionDuplicateGroups: descriptionDuplicates.length,
  governedPages,
  ungovernedPages: householdPages.length - governedPages,
  visibleBreadcrumbPages,
  breadcrumbSchemaPages,
  faqSchemaPages,
  duplicateFaqQuestionGroups,
};

const failures = [];
if (stats.householdPages !== budget.householdPages) failures.push(`householdPages=${stats.householdPages}, expected ${budget.householdPages}`);
if (stats.indexablePages !== budget.indexablePages) failures.push(`indexablePages=${stats.indexablePages}, expected ${budget.indexablePages}`);
for (const [metric, threshold] of [
  ['sourceModelIssues', budget.maxSourceModelIssues],
  ['bodyClassIssues', budget.maxBodyClassIssues],
  ['organicOrphans', budget.maxOrganicOrphans],
  ['exactTitleDuplicateGroups', budget.maxExactTitleDuplicateGroups],
  ['exactH1DuplicateGroups', budget.maxExactH1DuplicateGroups],
  ['exactDescriptionDuplicateGroups', budget.maxExactDescriptionDuplicateGroups],
  ['ungovernedPages', budget.maxUngovernedPages],
  ['faqSchemaPages', budget.maxFaqSchemaPages],
  ['duplicateFaqQuestionGroups', budget.maxDuplicateFaqQuestionGroups],
]) if (stats[metric] > threshold) failures.push(`${metric}=${stats[metric]}, max ${threshold}`);
if (stats.governedPages < budget.minGovernedPages) failures.push(`governedPages=${stats.governedPages}, min ${budget.minGovernedPages}`);
if (stats.visibleBreadcrumbPages < budget.minVisibleBreadcrumbPages) failures.push(`visibleBreadcrumbPages=${stats.visibleBreadcrumbPages}, min ${budget.minVisibleBreadcrumbPages}`);
if (stats.breadcrumbSchemaPages < budget.minBreadcrumbSchemaPages) failures.push(`breadcrumbSchemaPages=${stats.breadcrumbSchemaPages}, min ${budget.minBreadcrumbSchemaPages}`);

console.log('# Household integrity');
for (const [metric, value] of Object.entries(stats)) console.log(`${metric}: ${value}`);
if (organicOrphans.length) console.log(`orphan pages: ${organicOrphans.join(', ')}`);
if (sourceIssues.length) console.log(`source issue samples: ${sourceIssues.slice(0, 10).map((item) => `${item.page}(${item.fields.join('+')})`).join(', ')}`);

if (failures.length) {
  console.error(`\n❌ Household integrity failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\n✅ Household integrity is within budget');
