#!/usr/bin/env node
/**
 * Conversion runtime guard for Direct/Metrika work.
 * Checks that the high-impact runtime pieces required for attribution are present.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
}

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✅ ${message}`);
}

function requireContains(file, text, label) {
  const content = read(file);
  if (!content.includes(text)) fail(`${file}: missing ${label || text}`);
  else ok(`${file}: ${label || text}`);
}

function requireRegex(file, regex, label) {
  const content = read(file);
  if (!regex.test(content)) fail(`${file}: missing ${label}`);
  else ok(`${file}: ${label}`);
}

console.log('\n# Conversion runtime guard');

requireContains('analytics.js', "var METRIKA_ID = '109138661'", 'Yandex Metrika counter id');
requireContains('analytics.js', "var PRODUCTION_HOSTS = ['mospochin.ru', 'www.mospochin.ru']", 'production host whitelist');
requireContains('analytics.js', 'function analyticsEnabled()', 'analyticsEnabled runtime gate');
requireContains('analytics.js', 'window.MOSPOCHIN_RUNTIME.analyticsEnabled', 'public runtime analytics flag');
requireContains('analytics.js', 'window.__MOSPOCHIN_RUNTIME__.analyticsEnabled', 'compat runtime analytics flag');
requireContains('analytics.js', 'window.mospochinTrackGoal', 'safe reachGoal wrapper');
requireContains('analytics.js', 'captureAttribution();', 'first/last touch capture');

const attributionFields = [
  'page_url',
  'page_path',
  'page_title',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_service',
  'utm_landing',
  'yclid',
  'gclid',
  'metrika_client_id',
  'ym_client_id',
];

const telegramForm = read('telegram-form.js');
for (const field of attributionFields) {
  if (!telegramForm.includes(`'${field}'`)) fail(`telegram-form.js: missing attribution field ${field}`);
}
ok(`telegram-form.js: attribution field list (${attributionFields.length})`);
requireContains('telegram-form.js', 'function ensureAttributionFields(form)', 'auto hidden attribution fields');
requireContains('telegram-form.js', 'function fillAttributionFields(form)', 'attribution fill on forms');
requireContains('telegram-form.js', 'attribution: getAttributionSnapshot(currentAttributionFields)', 'attribution payload in submit');
requireContains('telegram-form.js', 'leadQuality', 'lead quality payload');
requireContains('telegram-form.js', 'pageIntent', 'page intent payload');

requireContains('server/telegram-api.mjs', 'function sanitizeAttribution(value)', 'server attribution sanitizer');
requireContains('server/telegram-api.mjs', 'page_url: 800', 'long page_url is preserved');
requireContains('server/telegram-api.mjs', 'Рекламная атрибуция:', 'Telegram ad attribution block');
requireContains('server/telegram-api.mjs', 'Источник заявки:', 'Telegram source block');

const runtime = JSON.parse(read('data/runtime-config.json'));
if (runtime.telegramFormEndpoint !== '/api/send-telegram') {
  fail('data/runtime-config.json: telegramFormEndpoint must be /api/send-telegram');
} else {
  ok('data/runtime-config.json: telegram endpoint');
}

const rootHtmlFiles = fs.readdirSync(ROOT_DIR).filter((name) => name.endsWith('.html'));
let noscriptMetrika = [];
for (const file of rootHtmlFiles) {
  const content = read(file);
  if (/mc\.yandex\.ru\/watch/i.test(content) || /<noscript[^>]*>[\s\S]{0,600}mc\.yandex\.ru/i.test(content)) {
    noscriptMetrika.push(file);
  }
}
if (noscriptMetrika.length) fail(`Metrika noscript pixel found in root HTML: ${noscriptMetrika.join(', ')}`);
else ok('root HTML: no Metrika noscript pixel');

const criticalPages = [
  'parokonvektomaty.html',
  'parokonvektomat-rational.html',
  'parokonvektomat-unox.html',
  'parokonvektomat-kod-oshibki.html',
  'parokonvektomat-rational-e9.html',
  'parokonvektomat-e02-e07-e10.html',
  'parokonvektomaty-promo.html',
  'parokonvektomat-unox-af02-af08.html',
];
for (const page of criticalPages) {
  const html = read(page);
  if (!html.includes('stage4-visual-nav')) fail(`${page}: missing stage4 visual CTA rail`);
  if (!html.includes('class="telegram-form')) fail(`${page}: missing telegram form`);
  if (!html.includes('data-contact-link="phone"')) fail(`${page}: missing phone contact markers`);
  if (!html.includes('data-contact-link="whatsapp"')) fail(`${page}: missing WhatsApp contact markers`);
}
ok(`critical Direct pages: CTA rails, forms and contact markers (${criticalPages.length})`);

if (process.exitCode) {
  console.error('\n❌ Conversion runtime guard failed');
  process.exit(process.exitCode);
}
console.log('\n✅ Conversion runtime guard passed');
