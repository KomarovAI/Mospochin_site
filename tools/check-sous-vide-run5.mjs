#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-cluster-pages.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'data/page-metadata.json'), 'utf8')).pages || {};
const metricsContext = JSON.parse(fs.readFileSync(path.join(root, 'data/metrics-page-context.json'), 'utf8')).pages || {};
const faqRegistry = JSON.parse(fs.readFileSync(path.join(root, 'content/faq/page-faq-registry.json'), 'utf8')).pages || {};
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim()));
const clusterPages = new Set((manifest.pages || []).map((entry) => entry.page));
const promoPages = new Set(manifest.families?.promo || []);
const policy = manifest.run5Policy || {};
const titleMax = Number(policy.titleMaxChars || 75);
const descriptionMin = Number(policy.descriptionMinChars || 100);
const descriptionMax = Number(policy.descriptionMaxChars || 160);
const hubPage = policy.clusterHub || 'sous-vide-restoranov.html';
const homeCanonical = policy.breadcrumbHome || 'https://mospochin.ru/';
const canonicalBase = manifest.canonicalBase || 'https://mospochin.ru/';
const requiredSchema = policy.requiredPrimarySchema || {
  hub: 'CollectionPage',
  service: 'Service',
  guide: 'Article',
  promo: 'Service',
};

let errors = 0;
let checks = 0;
const titleOwners = new Map();
const descriptionOwners = new Map();
const h1Owners = new Map();
const faqOwners = new Map();
const inboundIndexable = new Map([...clusterPages].map((page) => [page, 0]));

function pass(message) {
  checks += 1;
  console.log(`PASS: ${message}`);
}
function fail(message) {
  checks += 1;
  errors += 1;
  console.error(`FAIL: ${message}`);
}
function assert(condition, message) {
  if (condition) pass(message);
  else fail(message);
}
function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}
function text(value) {
  return decodeEntities(String(value || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function attr(tag, name) {
  const match = String(tag || '').match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}
function tags(html, name) {
  return [...String(html).matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}
function meta(html, name) {
  const tag = tags(html, 'meta').find((candidate) => attr(candidate, 'name').toLowerCase() === name.toLowerCase());
  return tag ? attr(tag, 'content') : '';
}
function propertyMeta(html, property) {
  const tag = tags(html, 'meta').find((candidate) => attr(candidate, 'property').toLowerCase() === property.toLowerCase());
  return tag ? attr(tag, 'content') : '';
}
function canonical(html) {
  const tag = tags(html, 'link').find((candidate) => attr(candidate, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  return tag ? attr(tag, 'href') : '';
}
function jsonLd(html, page) {
  const objects = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      objects.push(JSON.parse(match[1].trim()));
    } catch (error) {
      fail(`${page}: invalid JSON-LD (${error.message})`);
    }
  }
  return objects;
}
function typeOf(object) {
  return Array.isArray(object?.['@type']) ? object['@type'] : [object?.['@type']].filter(Boolean);
}
function schemaByType(objects, type) {
  return objects.find((object) => typeOf(object).includes(type));
}
function mainEntityPageId(article) {
  if (typeof article?.mainEntityOfPage === 'string') return article.mainEntityOfPage;
  return article?.mainEntityOfPage?.['@id'] || '';
}
function detailsItems(html) {
  return [...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)].map((match) => {
    const body = match[1];
    const summary = body.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || '';
    const answer = body.replace(/<summary\b[^>]*>[\s\S]*?<\/summary>/i, '');
    return { question: text(summary), answer: text(answer) };
  }).filter((item) => item.question && item.answer);
}
function faqSchemaItems(object) {
  return (object?.mainEntity || []).map((item) => ({
    question: text(item?.name),
    answer: text(item?.acceptedAnswer?.text),
  }));
}
function signature(items) {
  return items.map((item) => `${item.question.toLowerCase()}=>${item.answer.toLowerCase()}`).join('|');
}
function remember(map, value, page) {
  if (!value) return;
  const list = map.get(value) || [];
  list.push(page);
  map.set(value, list);
}
function expectedCanonical(page) {
  return `${canonicalBase.endsWith('/') ? canonicalBase : `${canonicalBase}/`}${page}`;
}
function normalizeHref(href) {
  return String(href || '').split('#')[0].split('?')[0];
}

for (const entry of manifest.pages || []) {
  const page = entry.page;
  const pagePath = path.join(root, page);
  assert(fs.existsSync(pagePath), `${page}: root HTML exists`);
  if (!fs.existsSync(pagePath)) continue;
  const html = fs.readFileSync(pagePath, 'utf8');
  const expectedUrl = expectedCanonical(page);
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = meta(html, 'description');
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => text(match[1]));
  const pageCanonical = canonical(html);
  const robots = meta(html, 'robots').toLowerCase().replace(/\s+/g, '');
  const ogUrl = propertyMeta(html, 'og:url');
  const bodyTag = tags(html, 'body')[0] || '';
  const schemas = jsonLd(html, page);

  assert(title.length > 0 && title.length <= titleMax, `${page}: title length ${title.length}/${titleMax}`);
  assert(description.length >= descriptionMin && description.length <= descriptionMax, `${page}: description length ${description.length} within ${descriptionMin}-${descriptionMax}`);
  assert(h1s.length === 1, `${page}: exactly one H1`);
  assert(pageCanonical === expectedUrl, `${page}: canonical matches contract`);
  assert(ogUrl === expectedUrl, `${page}: og:url matches canonical`);
  assert(!/[?&](utm_|yclid|gclid)/i.test(pageCanonical), `${page}: canonical has no campaign parameters`);
  assert(metadata[page]?.title === title, `${page}: metadata title matches HTML`);
  assert(metadata[page]?.description === description, `${page}: metadata description matches HTML`);
  assert(metadata[page]?.canonical === expectedUrl, `${page}: metadata canonical matches contract`);

  if (entry.indexable) {
    assert(!robots.includes('noindex'), `${page}: indexable page has no noindex`);
    assert(sitemapUrls.has(expectedUrl), `${page}: indexable page is present in sitemap`);
    remember(titleOwners, title, page);
    remember(descriptionOwners, description, page);
    remember(h1Owners, h1s[0], page);
  } else {
    assert(robots.includes('noindex') && robots.includes('follow'), `${page}: promo page uses noindex,follow`);
    assert(!sitemapUrls.has(expectedUrl), `${page}: promo page is excluded from sitemap`);
  }

  const expectedType = requiredSchema[entry.intent];
  const primary = schemaByType(schemas, expectedType);
  assert(Boolean(primary), `${page}: primary schema ${expectedType} exists`);
  if (primary) {
    assert(primary.inLanguage === 'ru-RU', `${page}: primary schema declares ru-RU`);
    if (expectedType === 'Article') {
      assert(primary.url === expectedUrl, `${page}: Article url matches canonical`);
      assert(mainEntityPageId(primary) === expectedUrl, `${page}: Article mainEntityOfPage matches canonical`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(primary.datePublished || ''), `${page}: Article datePublished exists`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(primary.dateModified || ''), `${page}: Article dateModified exists`);
      assert(primary.author?.['@id'] === 'https://mospochin.ru/#organization', `${page}: Article author uses organization identity`);
      assert(primary.publisher?.['@id'] === 'https://mospochin.ru/#organization', `${page}: Article publisher uses organization identity`);
    } else if (expectedType === 'Service') {
      assert(primary.url === expectedUrl, `${page}: Service url matches canonical`);
      assert(Boolean(primary.serviceType), `${page}: Service serviceType exists`);
      assert(primary.provider?.['@id'] === 'https://mospochin.ru/#organization', `${page}: Service provider uses organization identity`);
    } else if (expectedType === 'CollectionPage') {
      assert(primary.url === expectedUrl, `${page}: CollectionPage url matches canonical`);
      assert(primary.isPartOf?.['@id'] === 'https://mospochin.ru/#website', `${page}: CollectionPage links to WebSite identity`);
    }
  }

  const faq = schemaByType(schemas, 'FAQPage');
  const visibleFaq = detailsItems(html);
  assert(visibleFaq.length >= 2, `${page}: visible FAQ has at least two entries`);
  assert(!faq, `${page}: retired FAQPage schema is absent`);
  remember(faqOwners, signature(visibleFaq), page);
  const registry = faqRegistry[page];
  assert(Boolean(registry), `${page}: FAQ is registered in machine-readable registry`);
  assert(Boolean(registry?.schema?.retired), `${page}: FAQ registry records schema retirement`);
  assert(!registry?.schema?.enabled, `${page}: FAQ registry schema is disabled`);
  assert((registry?.itemCount || 0) === visibleFaq.length, `${page}: FAQ registry item count matches visible FAQ`);
  assert((html.match(/data-generated=["']faq-registry["']/g) || []).length === 0, `${page}: generated FAQ schema block is absent`);

  const breadcrumb = schemaByType(schemas, 'BreadcrumbList');
  assert(Boolean(breadcrumb), `${page}: BreadcrumbList exists`);
  if (breadcrumb) {
    const items = breadcrumb.itemListElement || [];
    const expectedCount = page === hubPage ? 2 : 3;
    assert(items.length === expectedCount, `${page}: breadcrumb depth is ${expectedCount}`);
    assert(items[0]?.item === homeCanonical, `${page}: breadcrumb home uses canonical root`);
    if (page !== hubPage) assert(items[1]?.item === expectedCanonical(hubPage), `${page}: breadcrumb contains cluster hub`);
    assert(items.at(-1)?.item === expectedUrl, `${page}: breadcrumb ends at current canonical`);
    assert(items.every((item, index) => item.position === index + 1), `${page}: breadcrumb positions are contiguous`);
  }

  const metrics = entry.metrics || {};
  const context = metricsContext[page] || {};
  const expectedBody = {
    'data-page-slug': page.replace(/\.html$/, ''),
    'data-page-intent': metrics.pageIntent,
    'data-equipment': metrics.equipment,
    'data-service': metrics.service,
    'data-commercial-segment': metrics.commercialSegment,
    'data-page-version': context.page_version,
  };
  assert(Boolean(context.page_version), `${page}: metrics page_version exists`);
  assert(context.page_intent === metrics.pageIntent, `${page}: metrics page_intent matches cluster contract`);
  assert(context.equipment === metrics.equipment, `${page}: metrics equipment matches cluster contract`);
  assert(context.service === metrics.service, `${page}: metrics service matches cluster contract`);
  assert(context.commercial_segment === metrics.commercialSegment, `${page}: metrics segment matches cluster contract`);
  for (const [name, value] of Object.entries(expectedBody)) {
    assert(attr(bodyTag, name) === value, `${page}: body ${name} matches metrics context`);
  }
  assert(/<script\b[^>]*src=["'](?:\.\/)?analytics\.js["']/i.test(html), `${page}: analytics.js is loaded`);
  assert(/<script\b[^>]*src=["'](?:\.\/)?telegram-form\.js["']/i.test(html), `${page}: telegram-form.js is loaded`);

  const seenCtaIds = new Set();
  let clusterLinkCount = 0;
  // Global header/footer links are validated by static-shell and crawl guards.
  // Some legacy-generated pages keep an empty <main></main> mount before the
  // editorial sections, so scope by the shell boundaries instead of scanning
  // the complete document.
  const emptyMain = html.match(/<main\b[^>]*>\s*<\/main>/i);
  const footerIndex = html.indexOf('<div id=\"footer-container\"');
  const normalMain = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const editorialHtml = emptyMain && footerIndex > (emptyMain.index ?? -1)
    ? html.slice((emptyMain.index ?? 0) + emptyMain[0].length, footerIndex)
    : (normalMain || html);
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  for (const anchor of editorialHtml.matchAll(anchorPattern)) {
    const tag = `<a${anchor[1]}>`;
    const href = attr(tag, 'href');
    const target = normalizeHref(href);
    if (!target || /^(?:https?:|tel:|mailto:|tg:|javascript:)/i.test(target) || target.startsWith('#')) continue;
    if (target.endsWith('.html')) assert(fs.existsSync(path.join(root, target)), `${page}: internal target exists (${target})`);
    if (!clusterPages.has(target) || target === page) continue;
    clusterLinkCount += 1;
    if (entry.indexable && promoPages.has(target)) fail(`${page}: indexable page links to noindex promo ${target}`);
    if (entry.indexable && !promoPages.has(target)) inboundIndexable.set(target, (inboundIndexable.get(target) || 0) + 1);
    const ctaId = attr(tag, 'data-cta-id');
    assert(Boolean(ctaId), `${page}: cluster link to ${target} has data-cta-id`);
    assert(attr(tag, 'data-cta-group') === 'internal_link', `${page}: cluster link to ${target} uses internal_link group`);
    assert(attr(tag, 'data-block') === 'related_cluster', `${page}: cluster link to ${target} uses related_cluster block`);
    if (ctaId) {
      assert(!seenCtaIds.has(ctaId), `${page}: internal link CTA id is unique (${ctaId})`);
      seenCtaIds.add(ctaId);
    }
  }
  assert(clusterLinkCount >= Number(entry.minClusterLinks || manifest.defaults?.minClusterLinks || 3), `${page}: cluster link count ${clusterLinkCount} meets minimum`);
}

for (const [value, owners] of titleOwners) if (owners.length > 1) fail(`duplicate indexable title: ${owners.join(', ')} (${value})`);
for (const [value, owners] of descriptionOwners) if (owners.length > 1) fail(`duplicate indexable description: ${owners.join(', ')} (${value})`);
for (const [value, owners] of h1Owners) if (owners.length > 1) fail(`duplicate indexable H1: ${owners.join(', ')} (${value})`);
if (policy.requireUniqueFaqSet !== false) {
  for (const [value, owners] of faqOwners) if (owners.length > 1) fail(`duplicate FAQ set: ${owners.join(', ')} (${value.slice(0, 120)}...)`);
}
for (const entry of manifest.pages || []) {
  if (!entry.indexable || entry.page === hubPage) continue;
  assert((inboundIndexable.get(entry.page) || 0) >= 1, `${entry.page}: has at least one inbound link from an indexable cluster page`);
}

if (errors) {
  console.error(`\nSous-vide Run 5 audit failed: errors=${errors}, checks=${checks}`);
  process.exit(1);
}
console.log(`\nSous-vide Run 5 audit passed: pages=${manifest.pages.length}, checks=${checks}, sitemapUrls=${sitemapUrls.size}`);
