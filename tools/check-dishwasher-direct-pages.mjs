#!/usr/bin/env node
import fs from 'node:fs';

const cluster = JSON.parse(fs.readFileSync('data/dishwasher-cluster-pages.json', 'utf8'));
const directManifest = JSON.parse(fs.readFileSync('data/direct-landing-pages.json', 'utf8'));
const metadata = JSON.parse(fs.readFileSync('data/page-metadata.json', 'utf8'));
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const directRows = cluster.pages.filter((p) => p.pageType === 'direct');
const config = new Map(directManifest.pages.map((p) => [p.file, p]));
const errors = [];
const titles = new Set();
const h1s = new Set();
const directSet = new Set(directRows.map((p) => p.page));

for (const row of directRows) {
  const page = row.page;
  if (row.status !== 'published' || row.indexable !== false) errors.push(`${page}: must be published noindex Direct`);
  if (!fs.existsSync(page)) { errors.push(`${page}: HTML missing`); continue; }
  const html = fs.readFileSync(page, 'utf8');
  const cfg = config.get(page);
  const meta = metadata.pages?.[page];
  if (!cfg) errors.push(`${page}: direct manifest entry missing`);
  if (!/<meta\b(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*noindex[^"']*follow[^"']*["'])[^>]*>/i.test(html)) errors.push(`${page}: noindex,follow missing in source HTML`);
  if (sitemap.includes(`/${page}`)) errors.push(`${page}: noindex URL present in sitemap`);
  if (!meta || meta.robots !== 'noindex,follow') errors.push(`${page}: metadata robots invalid`);
  if (!html.includes(`rel="canonical" href="https://mospochin.ru/${page}"`) && !html.includes(`href="https://mospochin.ru/${page}" rel="canonical"`)) errors.push(`${page}: self canonical missing`);
  if (!html.includes('data-equipment="commercial_dishwasher"')) errors.push(`${page}: equipment context missing`);
  if (!html.includes('data-page-intent="promo"')) errors.push(`${page}: promo intent missing`);
  if (!html.includes('data-direct-ad-ids=')) errors.push(`${page}: Direct attribution missing`);
  for (const field of ['campaign_id', 'ad_group_id', 'direct_ad_ids', 'equipment_model', 'serial_number', 'error_code', 'wash_stage', 'details']) {
    if (!new RegExp(`name=["']${field}["']`, 'i').test(html)) errors.push(`${page}: form field ${field} missing`);
  }
  if (!/href=["']tel:\+79990057172["']/i.test(html)) errors.push(`${page}: phone CTA missing`);
  if (!/href=["']https:\/\/wa\.me\/79990057172/i.test(html)) errors.push(`${page}: WhatsApp CTA missing`);
  if (!/<form\b[^>]*telegram-form/i.test(html)) errors.push(`${page}: lead form missing`);
  for (const type of ['Service', 'FAQPage', 'BreadcrumbList']) if (!html.includes(`"@type": "${type}"`)) errors.push(`${page}: ${type} schema missing`);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim();
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!title || titles.has(title)) errors.push(`${page}: title missing/duplicate`); else titles.add(title);
  if (!h1 || h1s.has(h1)) errors.push(`${page}: H1 missing/duplicate`); else h1s.add(h1);
  if (!cfg?.campaignId || !cfg?.adGroupId || !(cfg?.directAdIds?.length)) errors.push(`${page}: campaign/ad group/ad IDs incomplete`);
  if ((cfg?.relatedLinks?.length || 0) < 4) errors.push(`${page}: fewer than 4 organic related links`);
  for (const other of directSet) if (other !== page && new RegExp(`href=["']/?${other.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(html)) errors.push(`${page}: Direct-to-Direct link ${other}`);
}

for (const source of cluster.pages.filter((p) => p.status === 'published' && p.indexable)) {
  const html = fs.readFileSync(source.page, 'utf8');
  for (const target of directSet) {
    if (html.includes(`href="${target}"`) || html.includes(`href='${target}'`) || html.includes(`href="/${target}"`) || html.includes(`href='/${target}'`)) errors.push(`${source.page}: organic link to Direct ${target}`);
  }
}

if (errors.length) {
  console.error(`❌ Dishwasher Direct pages failed (${errors.length})`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`✅ Dishwasher Direct pages passed: ${directRows.length} noindex landings, no organic inbound links`);
