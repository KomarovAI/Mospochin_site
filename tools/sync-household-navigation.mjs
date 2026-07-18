#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const applyMode = process.argv.includes('--apply');
const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/page-metadata.json'), 'utf8')).pages;
const extended = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/household-extended-cluster-pages.json'), 'utf8'));
const householdPages = Object.entries(metadata)
  .filter(([, value]) => value.branch === 'household')
  .map(([page]) => page)
  .sort();

const specialized = [
  ['household-refrigerator-cluster-pages.json', 'Холодильники'],
  ['washing-machine-cluster-pages.json', 'Стиральные машины'],
  ['dryer-cluster-pages.json', 'Сушильные машины'],
  ['household-dishwasher-cluster-pages.json', 'Посудомоечные машины'],
  ['microwave-cluster-pages.json', 'Микроволновые печи'],
  ['water-heater-cluster-pages.json', 'Водонагреватели'],
];

const templatePaths = {
  1: 'src/components/parametric/household-breadcrumb/one-parent.template.html',
  2: 'src/components/parametric/household-breadcrumb/two-parent.template.html',
};
const templates = Object.fromEntries(Object.entries(templatePaths).map(([count, file]) => [count, fs.readFileSync(path.join(ROOT, file), 'utf8')]));
const assignments = new Map();
const assignmentErrors = [];

function addFamily({ id, hub, label, pages }) {
  for (const entry of pages || []) {
    const page = typeof entry === 'string' ? entry : entry.page;
    if (assignments.has(page)) {
      assignmentErrors.push(`${page}: assigned to both ${assignments.get(page).id} and ${id}`);
      continue;
    }
    assignments.set(page, { id, hub, label });
  }
}

for (const [file, label] of specialized) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', file), 'utf8'));
  addFamily({ id: manifest.cluster || file.replace(/-cluster-pages\.json$/, ''), hub: manifest.hub, label, pages: manifest.pages || manifest });
}
for (const family of extended.families || []) addFamily(family);

for (const page of householdPages) if (!assignments.has(page)) assignmentErrors.push(`${page}: missing household family`);
for (const page of assignments.keys()) if (!householdPages.includes(page)) assignmentErrors.push(`${page}: not registered as household`);

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(template, props) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
    const value = key.split('.').reduce((current, part) => current?.[part], props);
    return escapeHtml(value);
  });
}

function pageLabel(page, model) {
  const fixed = {
    'bytovaya-index.html': 'Бытовая техника',
    'bytovaya-uslugi.html': 'Услуги',
    'bytovaya-about.html': 'О сервисе',
    'bytovaya-contact.html': 'Контакты',
  };
  return fixed[page] || model.h1;
}

function linksFor(page, assignment) {
  if (page === 'bytovaya-index.html') return [{ href: '/', label: 'Главная' }];
  const links = [{ href: 'bytovaya-index.html', label: 'Бытовая техника' }];
  if (assignment.id === 'household-branch') return links;
  if (page !== assignment.hub) links.push({ href: assignment.hub, label: assignment.label });
  return links;
}

function ctaId(page, index) {
  return `${page.replace(/\.html$/i, '').replace(/[^a-z0-9]+/gi, '_')}_breadcrumb_${index + 1}`;
}

function absoluteUrl(href) {
  return new URL(href, 'https://mospochin.ru/').href;
}

function breadcrumbSchema(page, currentLabel, links) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...links.map((link, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: link.label,
        item: absoluteUrl(link.href),
      })),
      {
        '@type': 'ListItem',
        position: links.length + 1,
        name: currentLabel,
      },
    ],
  };
}

function hasType(value, type) {
  if (Array.isArray(value)) return value.some((item) => hasType(item, type));
  if (!value || typeof value !== 'object') return false;
  if ([].concat(value['@type'] || []).includes(type)) return true;
  return Object.values(value).some((item) => hasType(item, type));
}

function stripBreadcrumbNodes(value) {
  if (Array.isArray(value)) return value.map(stripBreadcrumbNodes).filter((item) => item != null);
  if (!value || typeof value !== 'object') return value;
  if ([].concat(value['@type'] || []).includes('BreadcrumbList')) return null;
  const output = {};
  for (const [key, item] of Object.entries(value)) {
    const cleaned = stripBreadcrumbNodes(item);
    if (cleaned != null && (!Array.isArray(cleaned) || cleaned.length)) output[key] = cleaned;
  }
  return output;
}

function syncHead(head, schema) {
  const generatedRe = /\n?\s*<script\b(?=[^>]*\btype=["']application\/ld\+json["'])(?=[^>]*\bdata-generated=["']household-breadcrumb["'])[^>]*>[\s\S]*?<\/script>\s*/gi;
  const jsonLdRe = /\n?\s*<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>\s*/gi;
  let clean = String(head).replace(generatedRe, '\n');
  clean = clean.replace(jsonLdRe, (match, body) => {
    try {
      const parsed = JSON.parse(body);
      if (!hasType(parsed, 'BreadcrumbList')) return match;
      const stripped = stripBreadcrumbNodes(parsed);
      if (stripped == null || (Array.isArray(stripped) && !stripped.length)) return match.startsWith('\n') ? '\n' : '';
      return `${match.startsWith('\n') ? '\n' : ''}<script type="application/ld+json">${JSON.stringify(stripped)}</script>`;
    } catch {
      return match;
    }
  }).replace(/\n{3,}/g, '\n\n');
  if (!schema) return clean;
  const block = `\n    <script type="application/ld+json" data-generated="household-breadcrumb">\n${JSON.stringify(schema, null, 2).split('\n').map((line) => `      ${line}`).join('\n')}\n    </script>`;
  if (!/<\/head>/i.test(clean)) throw new Error('head.html has no closing head tag');
  return clean.replace(/\s*<\/head>/i, `${block}\n</head>`);
}

function insertBreadcrumbSection(model, section) {
  const sections = model.sections || [];
  const existingIndex = sections.findIndex((item) => item.component === 'breadcrumb' || /breadcrumb/.test(item.id || ''));
  const filtered = sections.filter((item) => item.component !== 'breadcrumb' && !/breadcrumb/.test(item.id || ''));
  let insertAt = existingIndex >= 0 ? Math.min(existingIndex, filtered.length) : 0;
  if (existingIndex < 0) {
    while (insertAt < filtered.length && ['body-preamble', 'mobile-contact', 'layout-fragment'].includes(filtered[insertAt].component)) insertAt += 1;
  }
  filtered.splice(insertAt, 0, section);
  return filtered;
}

const changed = [];
for (const page of householdPages) {
  const slug = page.replace(/\.html$/i, '');
  const modelPath = path.join(ROOT, 'src/pages', slug, 'page.json');
  const headPath = path.join(ROOT, 'src/pages', slug, 'head.html');
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const assignment = assignments.get(page);
  const currentLabel = pageLabel(page, model);
  const links = linksFor(page, assignment).map((link, index) => ({ ...link, ctaId: ctaId(page, index) }));
  if (!templatePaths[links.length]) throw new Error(`${page}: unsupported breadcrumb depth ${links.length}`);
  const props = { links, currentLabel };
  const html = render(templates[links.length], props);
  const section = {
    id: 'p1-household-breadcrumb',
    component: 'breadcrumb',
    label: 'Хлебные крошки бытовой ветки',
    bytes: Buffer.byteLength(html),
    hash: crypto.createHash('sha256').update(html).digest('hex').slice(0, 16),
    componentMode: 'parametric',
    componentScope: 'parametric',
    variant: links.length === 1 ? 'household-one-parent' : 'household-two-parent',
    templateRef: templatePaths[links.length],
    props,
  };
  const expectedModel = { ...model, sections: insertBreadcrumbSection(model, section) };
  const modelContent = `${JSON.stringify(expectedModel, null, 2)}\n`;
  const currentModelContent = fs.readFileSync(modelPath, 'utf8');
  const noindex = /(?:^|,)\s*noindex(?:,|$)/i.test(metadata[page].robots || '');
  const expectedHead = syncHead(fs.readFileSync(headPath, 'utf8'), noindex ? null : breadcrumbSchema(page, currentLabel, links));
  const currentHead = fs.readFileSync(headPath, 'utf8');
  const fields = [];
  if (modelContent !== currentModelContent) fields.push('model');
  if (expectedHead !== currentHead) fields.push('head');
  if (fields.length) {
    changed.push({ page, fields });
    if (applyMode) {
      fs.writeFileSync(modelPath, modelContent);
      fs.writeFileSync(headPath, expectedHead);
    }
  }
}

if (assignmentErrors.length) {
  console.error(`❌ Household navigation assignment failed (${assignmentErrors.length})`);
  for (const error of assignmentErrors) console.error(`- ${error}`);
  process.exit(1);
}

if (!applyMode && changed.length) {
  console.error(`❌ Household navigation stale: ${changed.length} page(s)`);
  console.error(changed.slice(0, 20).map((item) => `${item.page}(${item.fields.join('+')})`).join(', '));
  console.error('Run: node tools/sync-household-navigation.mjs --apply');
  process.exit(1);
}

console.log(`✅ Household navigation ${applyMode ? 'synced' : 'current'}: ${changed.length} changed page(s), ${householdPages.length} governed page(s)`);
