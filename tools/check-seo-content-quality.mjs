#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const showDetails = process.argv.includes('--details');
const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/seo-content-budget.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/faq/page-faq-registry.json'), 'utf8'));
const htmlPages = fs.readdirSync(ROOT).filter((name) => name.endsWith('.html')).sort();
const registryPages = new Set(Object.keys(registry.pages || {}));

function decode(value) {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function text(value) {
  return decode(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function normalize(value) {
  return text(value).toLocaleLowerCase('ru-RU').replace(/[«»“”„"'`]/g, '').replace(/\s+/g, ' ').trim();
}

function schemaTypes(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) schemaTypes(item, output);
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  if (value['@type']) output.push(...[].concat(value['@type']));
  for (const item of Object.values(value)) schemaTypes(item, output);
  return output;
}

function placeholderOffers(value) {
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + placeholderOffers(item), 0);
  if (!value || typeof value !== 'object') return 0;
  let count = 0;
  if (value.offers && typeof value.offers === 'object') {
    const offer = value.offers;
    const price = offer.price;
    if ([].concat(offer['@type'] || []).includes('Offer') && typeof price === 'string' && !/^\s*\d+(?:[.,]\d+)?\s*$/.test(price)) count += 1;
  }
  for (const item of Object.values(value)) count += placeholderOffers(item);
  return count;
}

function contentChunks(html) {
  const main = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<header\b[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<form\b[\s\S]*?<\/form>/gi, ' ');
  const chunks = new Set();
  for (const match of main.matchAll(/<(p|li|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const value = normalize(match[2]);
    if (value.length >= 45) chunks.add(value);
  }
  return chunks;
}

const rows = [];
const h1Pages = new Map();
const chunkFrequency = new Map();
let invalidJsonLdBlocks = 0;
let pagesWithDuplicateFaqSchema = 0;
let faqSchemaPages = 0;
let pagesWithDuplicateServiceSchema = 0;
let faqSchemaPagesOutsideRegistry = 0;
let placeholderOfferPrices = 0;
let breadcrumbSchemaPages = 0;

for (const page of htmlPages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const indexable = !/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["'][^"']*noindex/i.test(html);
  const h1 = normalize(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const chunks = indexable ? contentChunks(html) : new Set();
  const schema = [];
  let faqCount = 0;
  let hasBreadcrumbSchema = false;
  for (const block of html.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(block[1]);
      const types = schemaTypes(parsed);
      schema.push(...[].concat(parsed?.['@type'] || []));
      faqCount += types.filter((type) => type === 'FAQPage').length;
      if (types.includes('BreadcrumbList')) hasBreadcrumbSchema = true;
      placeholderOfferPrices += placeholderOffers(parsed);
    } catch {
      invalidJsonLdBlocks += 1;
    }
  }
  const serviceCount = schema.filter((type) => type === 'Service').length;
  if (faqCount > 1) pagesWithDuplicateFaqSchema += 1;
  if (faqCount > 0) faqSchemaPages += 1;
  if (serviceCount > 1) pagesWithDuplicateServiceSchema += 1;
  if (faqCount && !registryPages.has(page)) faqSchemaPagesOutsideRegistry += 1;
  if (hasBreadcrumbSchema) breadcrumbSchemaPages += 1;
  if (indexable && h1) {
    if (!h1Pages.has(h1)) h1Pages.set(h1, []);
    h1Pages.get(h1).push(page);
  }
  if (indexable) {
    for (const chunk of chunks) chunkFrequency.set(chunk, (chunkFrequency.get(chunk) || 0) + 1);
    rows.push({ page, chunks });
  }
}

const duplicateH1Groups = [...h1Pages.entries()].filter(([, pages]) => pages.length > 1);
const lowUniquePages = rows.map(({ page, chunks }) => {
  const unique = [...chunks].filter((chunk) => chunkFrequency.get(chunk) === 1).length;
  return { page, ratio: chunks.size ? unique / chunks.size : 0, chunks: chunks.size };
}).filter((row) => row.ratio < 0.2);

const faqQuestionPages = new Map();
for (const [page, pageData] of Object.entries(registry.pages || {})) {
  for (const block of pageData.blocks || []) {
    for (const item of block.items || []) {
      const key = normalize(item.question || '');
      if (!key) continue;
      if (!faqQuestionPages.has(key)) faqQuestionPages.set(key, new Set());
      faqQuestionPages.get(key).add(page);
    }
  }
}
const duplicateFaqQuestionGroups = [...faqQuestionPages.values()].filter((pages) => pages.size > 1).length;

const stats = {
  indexablePages: rows.length,
  exactH1DuplicateGroups: duplicateH1Groups.length,
  pagesUnder20PercentUniqueChunks: lowUniquePages.length,
  invalidJsonLdBlocks,
  faqSchemaPages,
  pagesWithDuplicateFaqSchema,
  pagesWithDuplicateServiceSchema,
  faqSchemaPagesOutsideRegistry,
  placeholderOfferPrices,
  duplicateFaqQuestionGroups,
  breadcrumbSchemaPages,
};

const t = budget.thresholds;
const failures = [];
if (stats.indexablePages !== t.indexablePages) failures.push(`indexablePages=${stats.indexablePages}, expected ${t.indexablePages}`);
for (const [metric, threshold] of [
  ['exactH1DuplicateGroups', t.maxExactH1DuplicateGroups],
  ['pagesUnder20PercentUniqueChunks', t.maxPagesUnder20PercentUniqueChunks],
  ['invalidJsonLdBlocks', t.maxInvalidJsonLdBlocks],
  ['faqSchemaPages', t.maxFaqSchemaPages],
  ['pagesWithDuplicateFaqSchema', t.maxPagesWithDuplicateFaqSchema],
  ['pagesWithDuplicateServiceSchema', t.maxPagesWithDuplicateServiceSchema],
  ['faqSchemaPagesOutsideRegistry', t.maxFaqSchemaPagesOutsideRegistry],
  ['placeholderOfferPrices', t.maxPlaceholderOfferPrices],
  ['duplicateFaqQuestionGroups', t.maxDuplicateFaqQuestionGroups],
]) if (stats[metric] > threshold) failures.push(`${metric}=${stats[metric]}, max ${threshold}`);
if (stats.breadcrumbSchemaPages < t.minBreadcrumbSchemaPages) failures.push(`breadcrumbSchemaPages=${stats.breadcrumbSchemaPages}, min ${t.minBreadcrumbSchemaPages}`);

console.log('# SEO content quality');
for (const [metric, value] of Object.entries(stats)) console.log(`${metric}: ${value}`);
if (duplicateH1Groups.length) console.log(`duplicate H1 samples: ${duplicateH1Groups.slice(0, 5).map(([h1, pages]) => `${h1} => ${pages.join(', ')}`).join(' | ')}`);
if (lowUniquePages.length) {
  const sortedLowUniquePages = lowUniquePages.sort((a, b) => a.ratio - b.ratio || a.page.localeCompare(b.page));
  console.log(`low-unique samples: ${sortedLowUniquePages.slice(0, 10).map((row) => `${row.page}=${(row.ratio * 100).toFixed(1)}%`).join(', ')}`);
  if (showDetails) {
    console.log('\n# Low-unique page details');
    for (const row of sortedLowUniquePages) console.log(`${row.page}\t${(row.ratio * 100).toFixed(1)}%\t${row.chunks} chunks`);
  }
}

if (failures.length) {
  console.error(`\n❌ SEO content quality failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\n✅ SEO content quality is within budget');
