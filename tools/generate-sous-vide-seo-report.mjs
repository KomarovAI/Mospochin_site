#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const FILES = {
  cluster: 'data/sous-vide-cluster-pages.json',
  taxonomy: 'data/sous-vide-fault-taxonomy.json',
  linkGraph: 'data/sous-vide-link-graph.json',
  json: 'reports/sous-vide-seo-cluster-audit.json',
  markdown: 'reports/sous-vide-seo-cluster-audit.md',
};

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}
function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}
function normalizeText(value) {
  return String(value || '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
function stripTags(value) {
  return normalizeText(String(value || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '));
}
function decodeEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}
function localHtmlTarget(href) {
  if (!href || href.startsWith('#') || /^(?:tel:|mailto:|javascript:|data:)/i.test(href)) return null;
  let value = href.trim();
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!/^(?:www\.)?mospochin\.ru$/i.test(url.hostname)) return null;
      value = url.pathname;
    } catch {
      return null;
    }
  }
  value = value.split('#')[0].split('?')[0].replace(/^\/+/, '');
  return value.endsWith('.html') ? value : null;
}
function extractTagContent(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((match) => stripTags(match[1]));
}
function extractTitle(html) {
  return stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
}
function extractDescription(html) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of tags) {
    if (!/\bname=["']description["']/i.test(tag)) continue;
    return decodeEntities(tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] || '');
  }
  return '';
}
function extractLinks(html) {
  const links = [];
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = match[1];
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1] || '';
    const target = localHtmlTarget(href);
    if (!target) continue;
    links.push({
      target,
      anchor: stripTags(match[2]),
      ctaId: attrs.match(/\bdata-cta-id=["']([^"']+)["']/i)?.[1] || null,
      ctaGroup: attrs.match(/\bdata-cta-group=["']([^"']+)["']/i)?.[1] || null,
      block: attrs.match(/\bdata-block=["']([^"']+)["']/i)?.[1] || null,
    });
  }
  return links;
}
function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function duplicates(values) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({ value, count }));
}
function bfsDepth(adjacency, start) {
  const depth = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    for (const next of adjacency.get(current) || []) {
      if (depth.has(next)) continue;
      depth.set(next, depth.get(current) + 1);
      queue.push(next);
    }
  }
  return depth;
}
function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
function writeOrCheck(relativePath, content) {
  const absolute = path.join(ROOT, relativePath);
  if (CHECK) {
    if (!fs.existsSync(absolute) || fs.readFileSync(absolute, 'utf8') !== content) {
      throw new Error(`${relativePath} is stale. Run npm run report:sous-vide-seo`);
    }
    return;
  }
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

const cluster = readJson(FILES.cluster);
const taxonomy = readJson(FILES.taxonomy);
const graphContract = readJson(FILES.linkGraph);
const clusterEntries = cluster.pages || [];
const clusterSet = new Set(clusterEntries.map((entry) => entry.page));
const indexableSet = new Set(clusterEntries.filter((entry) => entry.indexable).map((entry) => entry.page));
const promoSet = new Set(clusterEntries.filter((entry) => !entry.indexable).map((entry) => entry.page));
const symptomByPage = new Map();
const symptomById = new Map();
for (const symptom of taxonomy.symptoms || []) {
  symptomById.set(symptom.symptomId, symptom);
  if (symptom.slug) symptomByPage.set(`${symptom.slug}.html`, symptom);
}

const pageData = {};
const allEdges = [];
const uniqueEdgeKeys = new Set();
const adjacency = new Map();
const incoming = new Map([...clusterSet].map((page) => [page, new Set()]));
for (const entry of clusterEntries) {
  const html = read(entry.page);
  const links = extractLinks(html).filter((link) => clusterSet.has(link.target) && link.target !== entry.page);
  const uniqueTargets = [...new Set(links.map((link) => link.target))];
  adjacency.set(entry.page, uniqueTargets);
  for (const link of links) {
    allEdges.push({ source: entry.page, ...link });
    uniqueEdgeKeys.add(`${entry.page}\u0000${link.target}`);
    incoming.get(link.target)?.add(entry.page);
  }
  const h1 = extractTagContent(html, 'h1');
  const h2 = extractTagContent(html, 'h2');
  const faq = [...html.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map((m) => stripTags(m[1]));
  const bodyText = stripTags(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html);
  pageData[entry.page] = {
    page: entry.page,
    intent: entry.intent,
    indexable: Boolean(entry.indexable),
    title: extractTitle(html),
    description: extractDescription(html),
    h1: h1[0] || '',
    h1Count: h1.length,
    h2Count: h2.length,
    duplicateH2: duplicates(h2),
    words: bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0,
    faqQuestions: faq,
    outgoingUnique: uniqueTargets.length,
    incomingUnique: 0,
    incomingAll: incoming.get(entry.page)?.size || 0,
    targets: uniqueTargets,
    equipmentFamily: symptomByPage.get(entry.page)?.equipmentFamily || null,
  };
}

// Incoming counts are complete only after every source page has been read.
for (const page of clusterSet) {
  const sources = [...(incoming.get(page) || [])];
  pageData[page].incomingAll = sources.length;
  pageData[page].incomingUnique = sources.filter((source) => indexableSet.has(source)).length;
}

const depth = bfsDepth(adjacency, graphContract.hubPage);
for (const page of clusterSet) pageData[page].depthFromHub = depth.has(page) ? depth.get(page) : null;

const indexablePages = clusterEntries.filter((entry) => entry.indexable).map((entry) => entry.page);
const symptomPages = indexablePages.filter((page) => symptomByPage.has(page));
const crossEquipmentSymptomEdges = [];
for (const edge of allEdges) {
  const sourceSymptom = symptomByPage.get(edge.source);
  const targetSymptom = symptomByPage.get(edge.target);
  if (sourceSymptom && targetSymptom && sourceSymptom.equipmentFamily !== targetSymptom.equipmentFamily) {
    crossEquipmentSymptomEdges.push({
      source: edge.source,
      sourceFamily: sourceSymptom.equipmentFamily,
      target: edge.target,
      targetFamily: targetSymptom.equipmentFamily,
    });
  }
}
const indexableToPromoEdges = allEdges
  .filter((edge) => indexableSet.has(edge.source) && promoSet.has(edge.target))
  .map((edge) => ({ source: edge.source, target: edge.target }));
const promoIncomingFromIndexable = [...promoSet].map((page) => ({
  page,
  incoming: [...(incoming.get(page) || [])].filter((source) => indexableSet.has(source)),
})).filter((item) => item.incoming.length);

const faqOccurrences = [];
for (const [page, data] of Object.entries(pageData)) {
  for (const question of data.faqQuestions) faqOccurrences.push({ page, question });
}
const faqQuestionGroups = new Map();
for (const item of faqOccurrences) {
  if (!faqQuestionGroups.has(item.question)) faqQuestionGroups.set(item.question, []);
  faqQuestionGroups.get(item.question).push(item.page);
}
const duplicateFaqQuestions = [...faqQuestionGroups.entries()]
  .filter(([, pages]) => new Set(pages).size > 1)
  .map(([question, pages]) => ({ question, pages: [...new Set(pages)].sort() }));

const titleDuplicates = duplicates(indexablePages.map((page) => pageData[page].title));
const descriptionDuplicates = duplicates(indexablePages.map((page) => pageData[page].description));
const h1Duplicates = duplicates(indexablePages.map((page) => pageData[page].h1));
const lowIncoming = indexablePages
  .filter((page) => page !== graphContract.hubPage)
  .filter((page) => pageData[page].incomingUnique < graphContract.quality.minimumInboundIndexable)
  .map((page) => ({ page, incoming: pageData[page].incomingUnique }));
const unreachableIndexable = indexablePages.filter((page) => !depth.has(page));
const unreachablePromos = [...promoSet].filter((page) => !depth.has(page));
const qualityWarnings = [];
if (titleDuplicates.length) qualityWarnings.push('duplicate indexable titles');
if (descriptionDuplicates.length) qualityWarnings.push('duplicate indexable descriptions');
if (h1Duplicates.length) qualityWarnings.push('duplicate indexable H1');
if (lowIncoming.length) qualityWarnings.push('indexable pages below incoming-link minimum');
if (unreachableIndexable.length) qualityWarnings.push('indexable pages unreachable from hub');
if (crossEquipmentSymptomEdges.length) qualityWarnings.push('cross-equipment symptom links');
if (indexableToPromoEdges.length) qualityWarnings.push('indexable pages linking to promo pages');
if (promoIncomingFromIndexable.length) qualityWarnings.push('promo pages receiving organic cluster links');
if (duplicateFaqQuestions.length) qualityWarnings.push('duplicate FAQ questions across cluster pages');

const report = {
  schemaVersion: 1,
  sourceUpdatedAt: graphContract.updatedAt,
  cluster: 'sous-vide',
  summary: {
    pages: clusterEntries.length,
    indexable: indexablePages.length,
    noindexPromo: promoSet.size,
    symptomService: symptomPages.length,
    linksTotal: allEdges.length,
    uniqueEdges: uniqueEdgeKeys.size,
    maxDepthFromHub: Math.max(0, ...[...depth.values()]),
    medianWordsIndexable: median(indexablePages.map((page) => pageData[page].words)),
    minimumIncomingIndexable: Math.min(...indexablePages.filter((page) => page !== graphContract.hubPage).map((page) => pageData[page].incomingUnique)),
    medianIncomingIndexable: median(indexablePages.filter((page) => page !== graphContract.hubPage).map((page) => pageData[page].incomingUnique)),
    qualityWarnings: qualityWarnings.length,
  },
  graph: {
    hub: graphContract.hubPage,
    unreachableIndexable,
    intentionallyUnreachablePromos: unreachablePromos,
    lowIncoming,
    crossEquipmentSymptomEdges,
    indexableToPromoEdges,
    promoIncomingFromIndexable,
  },
  content: {
    duplicateTitles: titleDuplicates,
    duplicateDescriptions: descriptionDuplicates,
    duplicateH1: h1Duplicates,
    duplicateFaqQuestions,
    pagesWithDuplicateH2: Object.values(pageData)
      .filter((page) => page.duplicateH2.length)
      .map((page) => ({ page: page.page, duplicates: page.duplicateH2 })),
  },
  qualityWarnings,
  pages: Object.fromEntries(Object.entries(pageData).sort(([a], [b]) => a.localeCompare(b))),
};

const md = `# Sous-vide SEO and internal-link audit\n\n` +
`Source contract date: ${report.sourceUpdatedAt}\n\n` +
`## Summary\n\n` +
`| Metric | Value |\n|---|---:|\n` +
`| Cluster pages | ${report.summary.pages} |\n` +
`| Indexable pages | ${report.summary.indexable} |\n` +
`| Direct/noindex pages | ${report.summary.noindexPromo} |\n` +
`| Symptom-service pages | ${report.summary.symptomService} |\n` +
`| Unique internal edges | ${report.summary.uniqueEdges} |\n` +
`| Maximum depth from hub | ${report.summary.maxDepthFromHub} |\n` +
`| Median indexable word count | ${report.summary.medianWordsIndexable} |\n` +
`| Minimum incoming links | ${report.summary.minimumIncomingIndexable} |\n` +
`| Median incoming links | ${report.summary.medianIncomingIndexable} |\n` +
`| Quality warnings | ${report.summary.qualityWarnings} |\n\n` +
`## Graph checks\n\n` +
`- Unreachable indexable pages: ${unreachableIndexable.length ? unreachableIndexable.join(', ') : 'none'}.\n` +
`- Intentionally unreachable Direct/noindex pages: ${unreachablePromos.join(', ') || 'none'}.\n` +
`- Pages below incoming-link minimum: ${lowIncoming.length ? lowIncoming.map((item) => `${item.page} (${item.incoming})`).join(', ') : 'none'}.\n` +
`- Cross-equipment symptom links: ${crossEquipmentSymptomEdges.length}.\n` +
`- Indexable → promo links: ${indexableToPromoEdges.length}.\n` +
`- Promo pages with indexable incoming links: ${promoIncomingFromIndexable.length}.\n\n` +
`## Content checks\n\n` +
`- Duplicate indexable titles: ${titleDuplicates.length}.\n` +
`- Duplicate indexable descriptions: ${descriptionDuplicates.length}.\n` +
`- Duplicate indexable H1: ${h1Duplicates.length}.\n` +
`- Duplicate FAQ questions across cluster pages: ${duplicateFaqQuestions.length}.\n` +
`- Pages with repeated H2 text: ${report.content.pagesWithDuplicateH2.length}.\n\n` +
`## Result\n\n` +
`${qualityWarnings.length ? `Warnings: ${qualityWarnings.join('; ')}.` : 'The cluster passes the generated SEO/content/link-graph report without warnings.'}\n`;

writeOrCheck(FILES.json, stableJson(report));
writeOrCheck(FILES.markdown, md);
console.log(`✅ Sous-vide SEO report ${CHECK ? 'is current' : 'generated'}: pages=${report.summary.pages}, edges=${report.summary.uniqueEdges}, warnings=${report.summary.qualityWarnings}`);
