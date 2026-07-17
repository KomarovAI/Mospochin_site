#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'data/paid-landings.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const failures = [];
const warnings = [];

function check(ok, page, message) {
  if (!ok) failures.push(`${page}: ${message}`);
}
function one(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}
function all(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}
function count(html, needle) {
  return html.split(needle).length - 1;
}

for (const entry of manifest) {
  const page = entry.landing_path.replace(/^\//, '');
  const filePath = path.join(root, page);
  check(fs.existsSync(filePath), page, 'HTML file is missing');
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const title = one(html, /<title>([\s\S]*?)<\/title>/i);
  const h1s = all(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
  const canonical = one(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
    || one(html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const body = one(html, /<body\b([^>]*)>/i) || '';
  const attr = (name) => one(body, new RegExp(`${name}=["']([^"']+)["']`, 'i'));

  check(Boolean(title && title.trim()), page, 'title is empty');
  check(h1s.length === 1, page, `expected one H1, got ${h1s.length}`);
  check(canonical === `https://mospochin.ru${entry.landing_path}`, page, `canonical mismatch: ${canonical}`);
  check(attr('data-page-slug') === entry.page_slug, page, 'data-page-slug mismatch');
  check(attr('data-page-intent') === entry.page_intent, page, 'data-page-intent mismatch');
  check(attr('data-equipment') === entry.equipment, page, 'data-equipment mismatch');
  check(attr('data-commercial-segment') === 'b2b_kitchen', page, 'commercial segment mismatch');
  check(attr('data-paid-landing') === 'true', page, 'data-paid-landing missing');
  check(attr('data-ad-group-id') === String(entry.ad_group_id), page, 'ad group mismatch');
  check(attr('data-site-release') === 'site-paid-tracking-v3-20260716', page, 'release marker missing');

  check(/href=["']tel:/i.test(html), page, 'phone CTA missing');
  check(/(?:wa\.me|whatsapp\.com)/i.test(html), page, 'WhatsApp CTA missing');
  check((html.match(/src=["']\/?analytics\.js["']/g) || []).length === 1, page, 'analytics.js must be included once');
  check((html.match(/src=["']\/?telegram-form\.js["']/g) || []).length === 1, page, 'telegram-form.js must be included once');

  const quick = html.match(/<form\b[^>]*data-paid-phone-only=["']true["'][^>]*>([\s\S]*?)<\/form>/i);
  check(Boolean(quick), page, 'paid phone-only form missing');
  if (quick) {
    const names = all(quick[1], /\bname=["']([^"']+)["']/gi);
    const allowed = new Set(['phone', 'consent', 'problem']);
    check(names.includes('phone'), page, 'quick form phone missing');
    check(names.includes('consent'), page, 'quick form consent missing');
    check(names.every((name) => allowed.has(name)), page, `quick form has extra fields: ${names.filter((x) => !allowed.has(x)).join(', ')}`);
    check(/name=["']phone["'][^>]*required/i.test(quick[1]) || /required[^>]*name=["']phone["']/i.test(quick[1]), page, 'phone is not required');
    check(/name=["']consent["'][^>]*required/i.test(quick[1]) || /required[^>]*name=["']consent["']/i.test(quick[1]), page, 'consent is not required');
    check(/data-form-variant=["'][^"']*phone_only[^"']*["']/i.test(quick[0]), page, 'quick form variant mismatch');
  }

  const ctaIds = all(html, /\bdata-cta-id=["']([^"']+)["']/gi);
  const formIds = all(html, /\bdata-form-id=["']([^"']+)["']/gi);
  check(new Set(ctaIds).size === ctaIds.length, page, 'duplicate data-cta-id');
  check(new Set(formIds).size === formIds.length, page, 'duplicate data-form-id');
  check(!/59:59|parokonvektomaty_timer_end|countdown-section/i.test(html), page, 'fake countdown remains');
  check(!/Премиум-бренды требуют оригинальных запчастей|До 3 лет \(гарантия\)/i.test(html), page, 'unresolved commercial claim');
  check(!/(?:src|href)=["']http:\/\//i.test(html), page, 'mixed-content URL detected');
}

const analytics = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
const formJs = fs.readFileSync(path.join(root, 'telegram-form.js'), 'utf8');
const backend = fs.readFileSync(path.join(root, 'server/telegram-api.mjs'), 'utf8');
check(analytics.includes('mospochin_attribution_v3'), 'analytics.js', 'attribution v3 key missing');
check(analytics.includes('mospochin_session_v3'), 'analytics.js', 'cross-tab session key missing');
check(analytics.includes('mospochin_tab_v1'), 'analytics.js', 'tab key missing');
check(analytics.includes('RESERVED_EVENT_FIELDS'), 'analytics.js', 'reserved event fields missing');
check(analytics.includes('getClientID'), 'analytics.js', 'Metrica ClientID missing');
check(formJs.includes('mospochin.lead.v3'), 'telegram-form.js', 'lead schema v3 missing');
check(formJs.includes('15000'), 'telegram-form.js', '15-second timeout missing');
check(formJs.indexOf('form.reportValidity') < formJs.indexOf("'form_submit_attempt'"), 'telegram-form.js', 'attempt appears before validation');
check(!backend.includes('hash(value || "")') && !backend.includes("hash(value || '')"), 'backend', 'empty hash anti-pattern remains');
check(backend.includes('idempotency_conflict'), 'backend', 'idempotency conflict missing');
check(backend.includes('payloadFingerprintHash'), 'backend', 'payload fingerprint missing');

if (warnings.length) warnings.forEach((x) => console.warn(`WARN ${x}`));
if (failures.length) {
  failures.forEach((x) => console.error(`FAIL ${x}`));
  console.error(`Commercial audit failed: ${failures.length} issue(s)`);
  process.exit(1);
}
console.log(`Commercial audit passed: ${manifest.length} paid landing(s), P0 source contracts OK.`);
