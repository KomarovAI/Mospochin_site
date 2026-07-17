#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cluster = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-cluster-pages.json'), 'utf8'));
const taxonomyDoc = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-fault-taxonomy.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-symptom-pages.json'), 'utf8'));
const graph = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-link-graph.json'), 'utf8'));
const taxonomy = new Map(taxonomyDoc.symptoms.map((item) => [item.symptomId, item]));
const published = registry.pages.filter((item) => item.status === 'published');
const pageBySymptom = new Map(published.map((item) => [item.symptomId, item.page]));
const clusterEntries = new Map(cluster.pages.map((item) => [item.page, item]));
const clusterPages = new Set(cluster.pages.map((item) => item.page));
const promoPages = new Set(cluster.families?.promo || []);
const symptomPages = new Set(published.map((item) => item.page));
let errors = 0;
let checks = 0;

function pass(message) { checks += 1; console.log(`PASS: ${message}`); }
function fail(message) { checks += 1; errors += 1; console.error(`FAIL: ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
function decode(value) {
  return String(value || '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function attr(tag, name) {
  const match = String(tag || '').match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'));
  return match ? decode(match[1]) : '';
}
function anchors(html) {
  return [...String(html).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => {
    const tag = `<a${match[1]}>`;
    return { href: attr(tag, 'href').split('#')[0].split('?')[0], text: decode(match[2]), cta: attr(tag, 'data-cta-id'), group: attr(tag, 'data-cta-group'), block: attr(tag, 'data-block') };
  });
}
function symptomIdForPage(page) { return published.find((item) => item.page === page)?.symptomId; }

const adjacency = new Map();
const inbound = new Map([...clusterPages].map((page) => [page, 0]));
for (const page of clusterPages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const links = anchors(html).filter((item) => clusterPages.has(item.href) && item.href !== page);
  const unique = [...new Set(links.map((item) => item.href))];
  adjacency.set(page, unique);
  for (const target of unique) {
    if (clusterEntries.get(page)?.indexable && !promoPages.has(target)) inbound.set(target, (inbound.get(target) || 0) + 1);
    if (clusterEntries.get(page)?.indexable && promoPages.has(target)) fail(`${page}: indexable page links to promo ${target}`);
  }
}

const reachable = new Set([graph.hubPage]);
const queue = [graph.hubPage];
while (queue.length) {
  const page = queue.shift();
  for (const target of adjacency.get(page) || []) if (!reachable.has(target)) { reachable.add(target); queue.push(target); }
}
for (const entry of cluster.pages.filter((item) => item.indexable)) assert(reachable.has(entry.page), `${entry.page}: reachable from cluster hub`);
for (const page of promoPages) assert(!reachable.has(page), `${page}: promo is not exposed from organic cluster graph`);

const hubHtml = fs.readFileSync(path.join(root, graph.hubPage), 'utf8');
const hubAnchors = anchors(hubHtml);
for (const entry of published) {
  const count = hubAnchors.filter((item) => item.href === entry.page).length;
  assert(count === 1, `${graph.hubPage}: symptom ${entry.page} appears exactly once`);
}
assert((hubHtml.match(/<h3\b[^>]*>Термостаты и водяные бани<\/h3>/g) || []).length === 1, `${graph.hubPage}: circulator symptom group exists`);
assert((hubHtml.match(/<h3\b[^>]*>Камерные вакуумные упаковщики<\/h3>/g) || []).length === 1, `${graph.hubPage}: vacuum symptom group exists`);
assert(!hubHtml.includes('Безопасная проверка, отдельное дерево причин и форма для модели оборудования.'), `${graph.hubPage}: symptom cards use target-specific descriptions`);

for (const entry of published) {
  const item = taxonomy.get(entry.symptomId);
  const family = graph.equipmentFamilies[item?.equipmentFamily];
  const sourceFile = path.join(root, 'src/pages', entry.page.replace(/\.html$/, ''), 'sections/100-related-symptoms.html');
  const html = fs.readFileSync(sourceFile, 'utf8');
  const links = anchors(html);
  const targets = links.map((link) => link.href);
  assert(targets.includes(graph.hubPage), `${entry.page}: links to cluster hub`);
  assert(targets.includes(family.overviewPage), `${entry.page}: links to equipment overview`);
  assert(targets.includes(family.repairPage), `${entry.page}: links to equipment-specific repair page`);
  assert(!targets.includes('remont-sous-vide.html'), `${entry.page}: does not use generic repair page instead of equipment-specific service`);
  const actualRelated = links.filter((link) => symptomPages.has(link.href)).map((link) => symptomIdForPage(link.href));
  const expectedRelated = item.relatedSymptoms || [];
  assert(JSON.stringify(actualRelated) === JSON.stringify(expectedRelated), `${entry.page}: related symptom links match taxonomy order`);
  assert(actualRelated.length >= Number(graph.quality?.minimumRelatedSymptoms || 3), `${entry.page}: minimum related symptom links`);
  for (const relatedId of actualRelated) {
    const related = taxonomy.get(relatedId);
    assert(related?.equipmentFamily === item.equipmentFamily, `${entry.page}: ${relatedId} stays inside equipment family`);
  }
  for (const expected of graph.contextualGuideLinks?.[entry.symptomId] || []) assert(targets.includes(expected.target), `${entry.page}: contextual guide ${expected.target} exists`);
  assert(new Set(targets).size === targets.length, `${entry.page}: related block has no duplicate targets`);
  for (const link of links) {
    assert(Boolean(link.cta), `${entry.page}: ${link.href} has data-cta-id`);
    assert(link.group === 'internal_link', `${entry.page}: ${link.href} uses internal_link group`);
    assert(link.block === 'related_cluster', `${entry.page}: ${link.href} uses related_cluster block`);
    assert(link.text.length >= 12, `${entry.page}: ${link.href} has descriptive anchor text`);
  }
}

for (const entry of cluster.pages.filter((item) => item.indexable && item.page !== graph.hubPage)) {
  assert((inbound.get(entry.page) || 0) >= Number(graph.quality?.minimumInboundIndexable || 2), `${entry.page}: receives at least ${graph.quality?.minimumInboundIndexable || 2} indexable cluster links`);
}

if (errors) {
  console.error(`\nSous-vide link graph failed: ${errors}/${checks} checks`);
  process.exit(1);
}
console.log(`\nSous-vide link graph passed: ${checks} checks, ${clusterPages.size} pages`);
