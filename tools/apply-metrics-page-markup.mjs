#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const contextPath = path.join(root, 'data', 'metrics-page-context.json');
const htmlFiles = fs.readdirSync(root)
  .filter((name) => name.endsWith('.html'))
  .filter((name) => name !== '404.html')
  .sort();

const dishwasherManifestPath = path.join(root, 'data', 'dishwasher-cluster-pages.json');
const dishwasherMetrics = fs.existsSync(dishwasherManifestPath)
  ? new Map((JSON.parse(fs.readFileSync(dishwasherManifestPath, 'utf8')).pages || []).map((page) => [page.page, page.metrics || {}]))
  : new Map();

const BRAND_PATTERNS = [
  'rational', 'unox', 'abat', 'kpem', 'apach', 'atesy', 'iterma',
  'mkn', 'alphatech', 'convotherm', 'electrolux', 'lainox'
];

function slugFromFile(file) {
  return file.replace(/\.html$/, '') || 'index';
}

function canonicalPageVersion(html) {
  return crypto.createHash('sha256')
    .update(String(html || '').replace(/\sdata-page-version=["'][^"']*["']/gi, ''))
    .digest('hex')
    .slice(0, 16);
}

function inferEquipment(file) {
  const lower = file.toLowerCase();
  if (/pishevarochnyj|pishevarochnye|kotl/.test(lower)) return 'pishevarochnyj_kotel';
  if (/parokonvektomat/.test(lower)) return 'parokonvektomat';
  if (/microwaves|svch/.test(lower)) return 'svch';
  if (/holodil|ice-machines/.test(lower)) return 'holodilnoe_oborudovanie';
  if (/posudom/.test(lower)) return 'posudomoechnaya_mashina';
  if (/plity|pechi|grili/.test(lower)) return 'plity_pechi';
  if (/water-heaters/.test(lower)) return 'vodonagrevatel';
  if (/stiralnye/.test(lower)) return 'stiralnaya_mashina';
  if (/kompyutery|routery/.test(lower)) return 'electronics';
  return 'site';
}

function inferBrand(file) {
  const lower = file.toLowerCase();
  for (const brand of BRAND_PATTERNS) {
    if (lower.includes(brand)) return brand;
  }
  return '';
}

function inferPageIntent(file) {
  const lower = file.toLowerCase();
  if (/kod-oshibki|e\d{2}|af\d{2}|h20|rational-e9|unox-af/.test(lower)) return 'error_code';
  if (/ne-greet|dolgo-greet|techet|vybivaet|ne-vklyuchaetsya|net-para|suhoy-hod/.test(lower)) return 'symptom';
  if (/promo|srochn/.test(lower)) return 'urgent';
  if (/restorana|stolov|b2b/.test(lower)) return 'b2b';
  if (/rational|unox|abat|kpem|apach|atesy|iterma|convotherm|electrolux|lainox/.test(lower)) return 'brand';
  if (/index|uslugi|about|contact|parokonvektomaty|pishevarochnye-kotly/.test(lower)) return 'hub';
  return 'service';
}

function inferSegment(file) {
  const lower = file.toLowerCase();
  if (/bytovaya|holodilniki|stiralnye|posudomoyki|plity|microwaves|water-heaters|kompyutery|routery/.test(lower)) {
    return 'b2c_home';
  }
  return 'b2b_kitchen';
}

function buildContext() {
  const pages = {};
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const pageMetadata = fs.existsSync(path.join(root, 'data', 'page-metadata.json'))
      ? JSON.parse(fs.readFileSync(path.join(root, 'data', 'page-metadata.json'), 'utf8')).pages?.[file] || {}
      : {};
    const dishwasher = dishwasherMetrics.get(file) || {};
    pages[file] = {
      page_slug: slugFromFile(file),
      page_intent: dishwasher.pageIntent || inferPageIntent(file),
      equipment: dishwasher.equipment || inferEquipment(file),
      brand: inferBrand(file),
      service: dishwasher.service || 'repair',
      commercial_segment: dishwasher.commercialSegment || inferSegment(file),
      branch: pageMetadata.branch || 'neutral',
      page_version: canonicalPageVersion(html),
      source: dishwasherMetrics.has(file) ? 'dishwasher_manifest' : 'run4_archive_only_inferred'
    };
  }
  return {
    version: '2026-07-11-page-scorecard-v1',
    purpose: 'Page and CTA context map for clean MosPochin metrics. page_version is a stable content hash with its own markup field excluded.',
    required_body_attrs: [
      'data-page-slug',
      'data-page-intent',
      'data-equipment',
      'data-service',
      'data-commercial-segment',
      'data-page-version'
    ],
    cta_required_attrs: [
      'data-cta-id',
      'data-cta-group',
      'data-block'
    ],
    pages
  };
}

function readContext() {
  if (!fs.existsSync(contextPath)) return buildContext();
  const existing = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
  const generated = buildContext();
  return {
    ...generated,
    ...existing,
    required_body_attrs: [...new Set([
      ...(generated.required_body_attrs || []),
      ...(existing.required_body_attrs || [])
    ])],
    pages: {
      ...Object.fromEntries(Object.entries(generated.pages).map(([file, generatedPage]) => [
        file,
        {
          ...(existing.pages?.[file] || {}),
          ...generatedPage,
          page_version: generatedPage.page_version,
          branch: generatedPage.branch
        }
      ])),
      ...(existing.pages || {}),
      ...Object.fromEntries(Object.entries(generated.pages).map(([file, generatedPage]) => [
        file,
        {
          ...(existing.pages?.[file] || {}),
          ...generatedPage,
          page_version: generatedPage.page_version,
          branch: generatedPage.branch
        }
      ]))
    }
  };
}

function hasAttr(tag, name) {
  return new RegExp(`\\s${name}(?:=|\\s|>|/)`, 'i').test(tag);
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function addAttrs(tag, attrs) {
  let next = tag;
  const insertion = Object.entries(attrs)
    .filter(([name, value]) => value !== undefined && value !== null && String(value) !== '' && !hasAttr(next, name))
    .map(([name, value]) => ` ${name}="${escapeAttr(value)}"`)
    .join('');
  if (!insertion) return next;
  return next.replace(/>$/, `${insertion}>`);
}

function upsertAttrs(tag, attrs) {
  let next = tag;
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || String(value) === '') continue;
    const pattern = new RegExp(`\\s${name}=["'][^"']*["']`, 'i');
    const replacement = ` ${name}="${escapeAttr(value)}"`;
    next = pattern.test(next) ? next.replace(pattern, replacement) : next.replace(/>$/, `${replacement}>`);
  }
  return next;
}

function classifyContact(tag) {
  const href = getAttr(tag, 'href').toLowerCase();
  const dataContact = getAttr(tag, 'data-contact-link').toLowerCase();
  if (href.startsWith('tel:') || dataContact === 'phone') return 'phone';
  if (href.includes('wa.me') || href.includes('whatsapp') || dataContact === 'whatsapp') return 'whatsapp';
  if (href.startsWith('tg://') || href.includes('t.me') || href.includes('telegram') || dataContact === 'telegram') return 'telegram';
  if (href.startsWith('mailto:') || dataContact === 'email') return 'email';
  if (dataContact) return dataContact;
  return '';
}

function annotateHtml(file, context) {
  const page = context.pages[file];
  const slug = page.page_slug || slugFromFile(file);
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;
  const counters = new Map();

  function nextId(type) {
    const count = (counters.get(type) || 0) + 1;
    counters.set(type, count);
    return `${slug}_${type}_${String(count).padStart(2, '0')}`;
  }

  html = html.replace(/<body\b[^>]*>/i, (tag) => upsertAttrs(tag, {
    'data-page-slug': slug,
    'data-page-intent': page.page_intent,
    'data-equipment': page.equipment,
    'data-brand': page.brand,
    'data-service': page.service || 'repair',
    'data-commercial-segment': page.commercial_segment,
    'data-page-version': page.page_version
  }));

  html = html.replace(/<a\b[^>]*>/gi, (tag) => {
    const type = classifyContact(tag);
    if (!type) return tag;
    const attrs = {
      'data-contact-link': type,
      'data-cta-id': nextId(type),
      'data-cta-group': `${type}_contact`,
      'data-block': page.page_intent === 'error_code' ? 'error_bridge' : page.page_intent === 'urgent' ? 'urgent_cta' : 'auto_contact'
    };
    return addAttrs(tag, attrs);
  });

  html = html.replace(/<button\b[^>]*data-contact-link=["'][^"']+["'][^>]*>/gi, (tag) => {
    const type = getAttr(tag, 'data-contact-link').toLowerCase() || 'contact';
    return addAttrs(tag, {
      'data-cta-id': nextId(type),
      'data-cta-group': `${type}_contact`,
      'data-block': 'auto_contact'
    });
  });

  html = html.replace(/<form\b[^>]*>/gi, (tag) => {
    const isContactForm = /telegram-form|data-telegram-form|data-contact-form|send-telegram/i.test(tag);
    if (!isContactForm) return tag;
    return addAttrs(tag, {
      'data-contact-form': 'true',
      'data-cta-id': nextId('form'),
      'data-cta-group': 'lead_form',
      'data-block': page.page_intent === 'error_code' ? 'error_form' : 'lead_form'
    });
  });

  if (html !== before) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

const context = readContext();
fs.writeFileSync(contextPath, `${JSON.stringify(context, null, 2)}\n`);

let changed = 0;
for (const file of htmlFiles) {
  if (annotateHtml(file, context)) changed += 1;
}

console.log(`Metrics page markup applied. html_files=${htmlFiles.length} changed=${changed}`);
console.log(`Context map: ${path.relative(root, contextPath)}`);
