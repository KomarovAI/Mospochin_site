#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contextPath = path.join(root, 'data', 'metrics-page-context.json');
const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
const pages = context.pages || {};
const paidManifestPath = path.join(root, 'data', 'paid-landings.json');
const paidPages = fs.existsSync(paidManifestPath)
  ? new Set(JSON.parse(fs.readFileSync(paidManifestPath, 'utf8')).map((entry) => String(entry.landing_path || '').replace(/^\//, '')))
  : new Set();
const requiredBodyAttrs = context.required_body_attrs || [
  'data-page-slug',
  'data-page-intent',
  'data-equipment',
  'data-service',
  'data-commercial-segment'
];
const requiredCtaAttrs = context.cta_required_attrs || [
  'data-cta-id',
  'data-cta-group',
  'data-block'
];
const corePages = [
  'parokonvektomaty.html',
  'parokonvektomat-kod-oshibki.html',
  'parokonvektomat-e02-e07-e10.html',
  'parokonvektomat-rational-e9.html',
  'parokonvektomat-unox-af02-af08.html',
  'pishevarochnye-kotly.html',
  'pishevarochnyj-kotel-kod-oshibki.html',
  'pishevarochnyj-kotel-ne-greet.html',
  'pishevarochnyj-kotel-techet.html',
  'remont-pishevarochnyh-kotlov-abat.html',
  'remont-pishevarochnyh-kotlov-apach.html',
  'contact.html',
  'bytovaya-contact.html'
];

let errors = 0;
let checkedPages = 0;
let checkedCtas = 0;
let checkedForms = 0;

function fail(message) {
  errors += 1;
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function hasAttr(tag, name) {
  return new RegExp(`\\s${name}(?:=|\\s|>|/)`, 'i').test(tag);
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
}

function tagList(html, regex) {
  return [...html.matchAll(regex)].map((match) => match[0]);
}

function isContactLink(tag) {
  const href = getAttr(tag, 'href').toLowerCase();
  const contact = getAttr(tag, 'data-contact-link').toLowerCase();
  return Boolean(contact || href.startsWith('tel:') || href.includes('wa.me') || href.includes('whatsapp') || href.includes('t.me') || href.includes('telegram') || href.startsWith('mailto:'));
}

function isContactForm(tag) {
  return /telegram-form|data-telegram-form|data-contact-form|send-telegram/i.test(tag);
}

for (const [file, page] of Object.entries(pages)) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    fail(`context page missing root HTML: ${file}`);
    continue;
  }
  checkedPages += 1;
  const html = fs.readFileSync(filePath, 'utf8');
  const body = html.match(/<body\b[^>]*>/i)?.[0] || '';
  if (!body) {
    fail(`${file} missing body tag`);
    continue;
  }

  for (const attr of requiredBodyAttrs) {
    if (!hasAttr(body, attr)) fail(`${file} body missing ${attr}`);
  }

  const expected = {
    'data-page-slug': page.page_slug,
    'data-page-intent': page.page_intent,
    'data-equipment': page.equipment,
    'data-service': page.service,
    'data-commercial-segment': page.commercial_segment,
    'data-page-version': page.page_version
  };
  for (const [attr, value] of Object.entries(expected)) {
    if (value && getAttr(body, attr) !== value) {
      fail(`${file} body ${attr}=${getAttr(body, attr)} expected ${value}`);
    }
  }

  const ctaIds = new Set();
  const contactTags = tagList(html, /<a\b[^>]*>/gi).filter(isContactLink)
    .concat(tagList(html, /<button\b[^>]*data-contact-link=["'][^"']+["'][^>]*>/gi));
  for (const tag of contactTags) {
    checkedCtas += 1;
    for (const attr of requiredCtaAttrs) {
      if (!hasAttr(tag, attr)) fail(`${file} contact CTA missing ${attr}: ${tag.slice(0, 160)}`);
    }
    const ctaId = getAttr(tag, 'data-cta-id');
    if (ctaId) {
      if (ctaIds.has(ctaId)) fail(`${file} duplicate data-cta-id ${ctaId}`);
      ctaIds.add(ctaId);
    }
  }

  const forms = tagList(html, /<form\b[^>]*>/gi).filter(isContactForm);
  for (const tag of forms) {
    checkedForms += 1;
    if (!hasAttr(tag, 'data-contact-form')) fail(`${file} contact form missing data-contact-form`);
    if (paidPages.has(file)) {
      if (!hasAttr(tag, 'data-form-id')) fail(`${file} paid contact form missing data-form-id`);
      if (!hasAttr(tag, 'data-form-variant')) fail(`${file} paid contact form missing data-form-variant`);
    }
  }
}

for (const file of corePages) {
  if (!pages[file]) fail(`core metrics page missing from context map: ${file}`);
}

if (checkedPages < 50) fail(`too few pages checked: ${checkedPages}`);
if (checkedCtas < 50) fail(`too few contact CTAs checked: ${checkedCtas}`);
if (checkedForms < 20) fail(`too few contact forms checked: ${checkedForms}`);

if (errors > 0) {
  console.error(`Metrics markup check failed. errors=${errors} pages=${checkedPages} ctas=${checkedCtas} forms=${checkedForms}`);
  process.exit(1);
}

pass(`metrics markup ok: pages=${checkedPages} contact_ctas=${checkedCtas} contact_forms=${checkedForms}`);
