#!/usr/bin/env node
/**
 * Lightweight production smoke check for conversion release.
 * It reads public pages and runtime endpoints. It does NOT submit a test lead
 * unless --submit-test-lead is explicitly passed.
 */
const DEFAULT_BASE = process.env.MOSPOCHIN_SMOKE_BASE || 'https://mospochin.ru';
const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const item = process.argv[i];
  if (item.startsWith('--')) args.set(item, process.argv[i + 1]?.startsWith('--') ? true : (process.argv[i + 1] || true));
}
const base = String(args.get('--base') || DEFAULT_BASE).replace(/\/+$/, '');
const submitTestLead = args.has('--submit-test-lead');

const pages = [
  '/',
  '/parokonvektomaty.html',
  '/parokonvektomat-rational.html',
  '/parokonvektomat-unox.html',
  '/parokonvektomat-kod-oshibki.html',
  '/data/runtime-config.json',
  '/version.json',
  '/robots.txt',
  '/sitemap.xml',
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}
function ok(message) {
  console.log(`✅ ${message}`);
}

async function fetchText(pathname) {
  const url = `${base}${pathname}`;
  const response = await fetch(url, { redirect: 'manual' });
  if (response.status >= 400) {
    fail(`${pathname}: HTTP ${response.status}`);
    return '';
  }
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location') || '';
    fail(`${pathname}: redirect ${response.status} → ${location || '(no location)'}`);
    return '';
  }
  ok(`${pathname}: HTTP ${response.status}`);
  return response.text();
}

async function main() {
  console.log(`\n# Production conversion smoke: ${base}`);
  const responses = new Map();
  for (const page of pages) {
    responses.set(page, await fetchText(page));
  }

  for (const page of ['/', '/parokonvektomaty.html', '/parokonvektomat-rational.html', '/parokonvektomat-unox.html', '/parokonvektomat-kod-oshibki.html']) {
    const html = responses.get(page) || '';
    if (!/<link[^>]+rel="canonical"/i.test(html)) fail(`${page}: missing canonical`);
    if (!html.includes('analytics.js')) fail(`${page}: missing analytics.js`);
    if (!html.includes('telegram-form.js')) fail(`${page}: missing telegram-form.js`);
    if (/127\.0\.0\.1|localhost/i.test(html)) fail(`${page}: contains localhost/127.0.0.1 marker`);
    if (/mc\.yandex\.ru\/watch/i.test(html)) fail(`${page}: contains unsafe noscript Metrika pixel`);
    if (!html.includes('class="telegram-form')) fail(`${page}: missing telegram form markup`);
  }

  try {
    const runtime = JSON.parse(responses.get('/data/runtime-config.json') || '{}');
    if (runtime.telegramFormEndpoint !== '/api/send-telegram') fail('runtime-config: telegram endpoint mismatch');
    else ok('runtime-config: telegram endpoint');
  } catch (error) {
    fail(`runtime-config JSON parse error: ${error.message}`);
  }

  try {
    const version = JSON.parse(responses.get('/version.json') || '{}');
    const hasPackMetadata = Boolean(version.project || version.artifact);
    const hasDeployMetadata = Boolean(version.commit && version.run_id && version.deployed_at);
    if (hasPackMetadata || hasDeployMetadata) ok('version.json: readable');
    else fail('version.json: unexpected payload');
  } catch (error) {
    fail(`version.json JSON parse error: ${error.message}`);
  }

  if (submitTestLead) {
    const payload = {
      page: 'parokonvektomaty',
      branch: 'restaurant',
      name: 'GitHub Actions Smoke',
      phone: '+7 999 123-45-67',
      type: 'Deploy smoke test',
      problem: 'Автоматическая проверка после выкладки',
      formContext: 'github-actions-deploy',
      consent: true,
      message: 'SMOKE TEST: проверка атрибуции, не обрабатывать как реальную заявку',
      pageIntent: 'smoke-test',
      leadQuality: 'test',
      attribution: {
        page_url: `${base}/parokonvektomaty.html?utm_source=smoke&utm_medium=test&utm_campaign=stage6&yclid=smoke-test`,
        page_path: '/parokonvektomaty.html',
        referrer: 'smoke-production-conversion',
        utm_source: 'smoke',
        utm_medium: 'test',
        utm_campaign: 'stage6',
        yclid: 'smoke-test',
      },
    };
    const response = await fetch(`${base}/api/send-telegram`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const responseText = await response.text().catch(() => '');
    if (response.ok) ok('/api/send-telegram: test lead accepted');
    else if (response.status === 429 && responseText.includes('rate_limited')) {
      ok('/api/send-telegram: rate limited after recent smoke lead');
    } else fail(`/api/send-telegram: HTTP ${response.status} ${responseText}`);
  } else {
    ok('test lead submit skipped (pass --submit-test-lead to send)');
  }

  if (process.exitCode) {
    console.error('\n❌ Production conversion smoke failed');
    process.exit(process.exitCode);
  }
  console.log('\n✅ Production conversion smoke passed');
}

main().catch((error) => {
  console.error(`❌ smoke failed: ${error.message}`);
  process.exit(1);
});
