#!/usr/bin/env node
/** Conversion runtime guard for the paid tracking v3 release. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let errors = 0;
function read(rel) { return fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8'); }
function fail(message) { errors += 1; console.error(`❌ ${message}`); }
function ok(message) { console.log(`✅ ${message}`); }
function contains(file, text, label = text) {
  if (!read(file).includes(text)) fail(`${file}: missing ${label}`); else ok(`${file}: ${label}`);
}
function regex(file, pattern, label) {
  if (!pattern.test(read(file))) fail(`${file}: missing ${label}`); else ok(`${file}: ${label}`);
}

console.log('\n# Conversion runtime guard — paid tracking v3');

for (const [text, label] of [
  ["var SCHEMA_VERSION = 'mospochin.web.v3'", 'web schema v3'],
  ["var TRACKING_VERSION = '2026-07-15'", 'tracking version'],
  ["window.MOSPOCHIN_METRICA_COUNTER_ID || '109138661'", 'Yandex Metrika counter fallback'],
  ["var PRODUCTION_HOSTS = ['mospochin.ru', 'www.mospochin.ru']", 'production host whitelist'],
  ['function analyticsEnabled()', 'analytics runtime gate'],
  ['function initializeAttribution()', 'attribution v3 initialization'],
  ["var ATTRIBUTION_KEY = 'mospochin_attribution_v3'", 'attribution v3 storage'],
  ["var VISITOR_KEY = 'mospochin_visitor_v1'", 'visitor identity'],
  ["var SESSION_KEY = 'mospochin_session_v3'", 'cross-tab session identity'],
  ["var TAB_KEY = 'mospochin_tab_v1'", 'tab identity'],
  ['function warmMetricaClientId()', 'cached Metrika ClientID'],
  ['var EVENT_DEFINITIONS = Object.freeze', 'safe event registry'],
  ['var RESERVED_EVENT_FIELDS = new Set', 'reserved event fields'],
  ['window.mospochinTrackGoal', 'safe reachGoal wrapper'],
  ['keepalive: true', 'keepalive event transport'],
  ['navigator.sendBeacon', 'beacon fallback']
]) contains('analytics.js', text, label);

for (const [text, label] of [
  ["var LEAD_SCHEMA_VERSION = 'mospochin.lead.v3'", 'lead schema v3'],
  ['function buildLeadPayload', 'lead payload builder'],
  ['page_url: window.location.href', 'current page URL'],
  ['page_path: window.location.pathname', 'current page path'],
  ['first_touch:', 'first touch'],
  ['last_touch:', 'last touch'],
  ['first_touch_yclid:', 'first-touch yclid'],
  ['last_touch_yclid:', 'last-touch yclid'],
  ['yclid_for_offline:', 'offline yclid'],
  ['metrika_client_id:', 'Metrika ClientID'],
  ['idempotency_key', 'idempotency key'],
  ['submit_attempt_event_id', 'submit attempt trace'],
  ['15000', '15 second lead timeout'],
  ['result.ok !== true', 'JSON ok=true success gate'],
  ['form_validation_error', 'validation lifecycle'],
  ['form_submit_blocked', 'consent block lifecycle'],
  ['form_submit_success', 'success lifecycle']
]) contains('telegram-form.js', text, label);

for (const [text, label] of [
  ['function sanitizeAttribution(value)', 'server attribution sanitizer'],
  ['page_url: 4096', 'long page URL limit'],
  ['function optionalHash', 'null-safe optional hashing'],
  ['payloadFingerprintHash', 'idempotency payload fingerprint'],
  ['idempotency_conflict', 'idempotency conflict response'],
  ['trace_id', 'trace chain'],
  ['Рекламная атрибуция:', 'Telegram attribution block'],
  ['Источник заявки:', 'Telegram source block']
]) contains('server/telegram-api.mjs', text, label);
regex('server/telegram-api.mjs', /optionalHash\([^)]*\)[\s\S]{0,240}normalized\s*\?[\s\S]{0,120}:\s*null/, 'empty identifier hash resolves to null');

const runtime = JSON.parse(read('data/runtime-config.json'));
if (runtime.telegramFormEndpoint === '/api/send-telegram') ok('data/runtime-config.json: Telegram endpoint');
else fail('data/runtime-config.json: telegramFormEndpoint must be /api/send-telegram');

const manifest = JSON.parse(read('data/paid-landings.json'));
if (manifest.length !== 5) fail(`paid landing manifest must contain 5 entries, got ${manifest.length}`);
for (const entry of manifest) {
  const page = String(entry.landing_path || '').replace(/^\//, '');
  const html = read(page);
  const requirements = [
    ['data-paid-landing="true"', 'paid marker'],
    [`data-page-slug="${entry.page_slug}"`, 'page slug'],
    [`data-page-intent="${entry.page_intent}"`, 'page intent'],
    [`data-equipment="${entry.equipment}"`, 'equipment'],
    ['data-contact-link="phone"', 'phone CTA'],
    ['data-contact-link="whatsapp"', 'WhatsApp CTA'],
    ['data-contact-form', 'contact form'],
    ['data-form-id=', 'form id'],
    ['data-form-variant=', 'form variant'],
    ['name="consent"', 'static consent']
  ];
  for (const [needle, label] of requirements) {
    if (!html.includes(needle)) fail(`${page}: missing ${label}`);
  }
  ok(`${page}: paid runtime markers`);
}

const rootHtmlFiles = fs.readdirSync(ROOT_DIR).filter((name) => name.endsWith('.html'));
const noscriptMetrika = rootHtmlFiles.filter((file) => /mc\.yandex\.ru\/watch/i.test(read(file)) || /<noscript[^>]*>[\s\S]{0,600}mc\.yandex\.ru/i.test(read(file)));
if (noscriptMetrika.length) fail(`Metrika noscript pixel found: ${noscriptMetrika.join(', ')}`); else ok('root HTML: no legacy Metrika noscript pixel');

if (errors) {
  console.error(`\n❌ Conversion runtime guard failed: ${errors}`);
  process.exit(1);
}
console.log('\n✅ Conversion runtime guard passed');
