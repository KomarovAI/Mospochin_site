#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSystemChromiumLaunchOptions, LOCAL_VISUAL_ORIGIN } from './visual-local-runtime.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_JSON = path.join(ROOT, 'reports', 'kutter-lead-smoke.json');
const REPORT_MD = path.join(ROOT, 'reports', 'kutter-lead-smoke.md');
const check = process.argv.includes('--check');
const SCENARIO_TIMEOUT_MS = 25000;
const PAGES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/kutter-conversion-pages.json'), 'utf8')).pages.map((item) => item.page).sort();
const REPRESENTATIVE = ['remont-kutterov.html', 'kutter-ne-vklyuchaetsya.html', 'kutter-remont-moskva.html'];

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({ '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' })[ext] || 'application/octet-stream';
}

function attr(tag, name) {
  const match = String(tag).match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? '';
}

function staticChecks() {
  const issues = [];
  let forms = 0;
  let phoneLinks = 0;
  let whatsappLinks = 0;
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const formTags = html.match(/<form\b[^>]*>/gi) || [];
    const telegramForms = formTags.filter((tag) => /telegram-form/i.test(attr(tag, 'class')));
    forms += telegramForms.length;
    if (!telegramForms.length) issues.push({ code: 'missing_form', page, message: 'Нет .telegram-form' });
    if (!/src=["']telegram-form\.js["']/i.test(html)) issues.push({ code: 'missing_runtime', page, message: 'Не подключён telegram-form.js' });
    if (!/<input\b(?=[^>]*name=["']phone["'])(?=[^>]*required)/i.test(html)) issues.push({ code: 'phone_not_required', page, message: 'Телефон не отмечен required' });
    if (!/<button\b[^>]*type=["']submit["']/i.test(html)) issues.push({ code: 'missing_submit', page, message: 'Нет submit button' });
    const tel = (html.match(/href=["']tel:/gi) || []).length;
    const wa = (html.match(/href=["'][^"']*(?:wa\.me|whatsapp)/gi) || []).length;
    phoneLinks += tel;
    whatsappLinks += wa;
    if (!tel) issues.push({ code: 'missing_tel', page, message: 'Нет tel: fallback' });
    if (!wa) issues.push({ code: 'missing_whatsapp', page, message: 'Нет WhatsApp fallback' });
    if (/moskva\.html$/.test(page)) {
      for (const field of ['campaign_id', 'ad_group_id', 'direct_ad_ids']) {
        if (!new RegExp(`name=["']${field}["']`, 'i').test(html)) issues.push({ code: 'missing_direct_attribution', page, message: `Нет ${field}` });
      }
    }
  }
  return { issues, forms, phoneLinks, whatsappLinks };
}

function injectHarness(html, pageFile) {
  const bootstrap = `<script>
    (() => {
      const store = new Map();
      const storage = {
        getItem: (key) => store.has(String(key)) ? store.get(String(key)) : null,
        setItem: (key, value) => store.set(String(key), String(value)),
        removeItem: (key) => store.delete(String(key)),
        clear: () => store.clear(),
        key: (index) => Array.from(store.keys())[index] ?? null,
        get length() { return store.size; }
      };
      try { Object.defineProperty(window, 'localStorage', { configurable: true, value: storage }); } catch {}
      window.__MOSPOCHIN_RUNTIME__ = { telegramFormEndpoint: '/api/send-telegram', pageFile: ${JSON.stringify(pageFile)} };
      window.mospochinGetAttribution = () => ({
        last_touch: {
          utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: 'kutter_k9',
          utm_content: 'direct_test', utm_term: 'remont kuttera', yclid: 'yclid-k9',
          referrer_host: 'yandex.ru', metrika_client_id: '1234567890'
        }
      });
      window.mospochinTrackGoal = () => {};
      window.mospochinTrackSiteEvent = () => {};
    })();
  <\/script>`;
  return html.replace(/<head([^>]*)>/i, `<head$1><base href="${LOCAL_VISUAL_ORIGIN}/">${bootstrap}`);
}

async function withScenarioTimeout(name, callback) {
  let timer;
  try {
    return await Promise.race([
      callback(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${name} exceeded ${SCENARIO_TIMEOUT_MS}ms`)), SCENARIO_TIMEOUT_MS);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function createHarness(browser, pageFile, apiMode = 'success') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(10000);
  const requests = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== 'mospochin.local') {
      await route.fulfill({ status: 204, body: '' });
      return;
    }
    if (url.pathname === '/api/send-telegram') {
      const raw = request.postData() || '{}';
      let body = {};
      try { body = JSON.parse(raw); } catch { /* report below */ }
      requests.push(body);
      if (apiMode === 'error') await route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false}' });
      else await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, mocked: true }) });
      return;
    }
    const local = path.resolve(ROOT, `.${url.pathname}`);
    const relative = path.relative(ROOT, local);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.existsSync(local) || !fs.statSync(local).isFile()) {
      await route.fulfill({ status: 404, body: 'not found' });
      return;
    }
    await route.fulfill({ status: 200, contentType: contentType(local), body: fs.readFileSync(local) });
  });
  const html = injectHarness(fs.readFileSync(path.join(ROOT, pageFile), 'utf8'), pageFile);
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.telegram-form[data-telegram-enhanced="1"]', { timeout: 10000 });
  await page.evaluate(() => {
    window.mospochinGetAttribution = () => ({
      last_touch: {
        utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: 'kutter_k9',
        utm_content: 'direct_test', utm_term: 'remont kuttera', yclid: 'yclid-k9',
        referrer_host: 'yandex.ru', metrika_client_id: '1234567890'
      }
    });
    window.mospochinTrackGoal = () => {};
    window.mospochinTrackSiteEvent = () => {};
  });
  return { page, requests };
}

async function prepareForm(page, { phone = '+7 999 123-45-67', consent = true, oldEnough = true } = {}) {
  const form = page.locator('.telegram-form').first();
  if (oldEnough) await form.evaluate((node) => { node.dataset.startedAt = String(Date.now() - 3000); });
  const phoneInput = form.locator('[name="phone"]');
  await phoneInput.fill(phone);
  const name = form.locator('[name="name"]');
  if (await name.count()) await name.fill('Тест K9');
  const type = form.locator('[name="type"]');
  if (await type.count()) await type.fill('Robot Coupe R 4');
  const equipment = form.locator('[name="equipment_model"]');
  if (await equipment.count()) await equipment.fill('Robot Coupe R 4');
  const details = form.locator('[name="details"]');
  if (await details.count()) await details.fill('Не включается после закрытия крышки');
  const checkbox = form.locator('[name="consent"]');
  if (consent) await checkbox.check();
  // Keep the anti-bot timing scenario deterministic even on slower CI hosts.
  if (!oldEnough) await form.evaluate((node) => { node.dataset.startedAt = String(Date.now()); });
  return form;
}

async function runBrowserScenarios() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch(getSystemChromiumLaunchOptions());
  const results = [];
  const assert = (condition, name, detail = '') => results.push({ name, passed: Boolean(condition), detail });

  async function scenario(label, pageFile, apiMode, callback) {
    console.log(`lead-smoke: ${label}`);
    let harness = null;
    try {
      await withScenarioTimeout(label, async () => {
        harness = await createHarness(browser, pageFile, apiMode);
        await callback(harness.page, harness.requests);
      });
    } catch (error) {
      assert(false, `scenario_${label.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}`, error.message);
    } finally {
      if (harness?.page && !harness.page.isClosed()) await harness.page.close().catch(() => {});
    }
  }

  try {
    await scenario('invalid phone', REPRESENTATIVE[0], 'success', async (page, requests) => {
      const form = await prepareForm(page, { phone: '123', consent: true });
      await form.locator('button[type="submit"]').click();
      await page.waitForSelector('[data-form-status]');
      assert((await form.locator('[data-form-status]').textContent()).includes('корректный номер'), 'invalid_phone_message');
      assert(await form.locator('[name="phone"]').getAttribute('aria-invalid') === 'true', 'invalid_phone_aria');
      assert(await form.locator('[name="phone"]').evaluate((el) => document.activeElement === el), 'invalid_phone_focus');
      assert(requests.length === 0, 'invalid_phone_no_request');
    });

    await scenario('missing consent', REPRESENTATIVE[1], 'success', async (page, requests) => {
      const form = await prepareForm(page, { consent: false });
      await form.locator('button[type="submit"]').click();
      await page.waitForSelector('[data-form-status]');
      assert((await form.locator('[data-form-status]').textContent()).includes('Подтвердите согласие'), 'missing_consent_message');
      assert(await form.locator('[name="consent"]').getAttribute('aria-invalid') === 'true', 'missing_consent_aria');
      assert(await form.locator('[name="consent"]').evaluate((el) => document.activeElement === el), 'missing_consent_focus');
      const size = await form.locator('[name="consent"]').evaluate((el) => ({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height }));
      assert(size.w >= 24 && size.h >= 24, 'consent_target_24px', JSON.stringify(size));
      assert(requests.length === 0, 'missing_consent_no_request');
    });

    await scenario('too fast', REPRESENTATIVE[0], 'success', async (page, requests) => {
      const form = await prepareForm(page, { oldEnough: false });
      await form.locator('button[type="submit"]').click();
      await page.waitForSelector('[data-form-status]');
      assert((await form.locator('[data-form-status]').textContent()).includes('чуть медленнее'), 'too_fast_message');
      assert(requests.length === 0, 'too_fast_no_request');
    });

    await scenario('success and rate limit', REPRESENTATIVE[2], 'success', async (page, requests) => {
      const form = await prepareForm(page);
      await form.locator('button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('[data-form-status]')?.textContent?.includes('Заявка принята'));
      assert(requests.length === 1, 'success_one_request', `requests=${requests.length}`);
      const payload = requests[0] || {};
      assert(payload.page === REPRESENTATIVE[2], 'success_page_slug', payload.page || '');
      assert(payload.attribution?.last_touch?.utm_source === 'yandex', 'success_utm_source');
      assert(payload.attribution?.last_touch?.utm_campaign === 'kutter_k9', 'success_utm_campaign');
      assert(payload.extraFields?.campaign_id === 'kutter_repair_moscow', 'success_campaign_id');
      assert(payload.extraFields?.ad_group_id === 'general_repair', 'success_ad_group_id');
      assert(String(payload.extraFields?.direct_ad_ids || '').includes('kutter-general-repair'), 'success_direct_ad_ids');
      assert(Boolean(payload.idempotencyKey), 'success_idempotency_key');

      await page.waitForTimeout(3200);
      const second = await prepareForm(page);
      await second.evaluate((node) => { node.dataset.startedAt = String(Date.now() - 3000); });
      await second.locator('button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('[data-form-status]')?.textContent?.includes('через минуту'));
      const secondStatus = await second.locator('[data-form-status]').textContent();
      assert(String(secondStatus || '').includes('через минуту'), 'rate_limit_message', String(secondStatus || ''));
      assert(requests.length === 1, 'rate_limit_no_second_request', `requests=${requests.length}`);
    });

    await scenario('network error fallback', REPRESENTATIVE[0], 'error', async (page, requests) => {
      const form = await prepareForm(page);
      await form.locator('button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('[data-form-status]')?.textContent?.includes('Не удалось отправить'));
      const text = await form.locator('[data-form-status]').textContent();
      assert(requests.length === 1, 'network_error_one_request');
      assert(text.includes('+79990057172') && text.includes('wa.me'), 'network_error_fallback_contacts', text);
    });
  } finally {
    await browser.close().catch(() => {});
  }
  return results;
}

function markdown(report) {
  const browser = report.browserScenarios.map((x) => `- ${x.passed ? '✅' : '❌'} ${x.name}${x.detail ? ` — ${x.detail}` : ''}`).join('\n');
  const staticIssues = report.staticIssues.length ? report.staticIssues.map((x) => `- ❌ ${x.page}: ${x.message}`).join('\n') : '- ✅ Статические контракты 45 страниц прошли.';
  return `# Kutter lead smoke\n\n## Summary\n\n- Pages: **${report.summary.pages}**\n- Forms: **${report.summary.forms}**\n- Browser scenarios: **${report.summary.browserPassed}/${report.summary.browserTotal}**\n- Issues: **${report.summary.issues}**\n\n## Static\n\n${staticIssues}\n\n## Browser scenarios\n\n${browser}\n`;
}

async function main() {
  const stat = staticChecks();

  if (check) {
    const issues = [...stat.issues];
    if (!fs.existsSync(REPORT_JSON) || !fs.existsSync(REPORT_MD)) {
      issues.push({ page: 'reports/kutter-lead-smoke.*', message: 'Stored browser evidence is missing. Run npm run smoke:kutter-leads.' });
    } else {
      let stored = null;
      try { stored = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8')); }
      catch { issues.push({ page: 'reports/kutter-lead-smoke.json', message: 'Stored browser evidence is invalid JSON.' }); }
      if (stored) {
        const summary = stored.summary || {};
        if (summary.pages !== PAGES.length) issues.push({ page: REPORT_JSON, message: `Stored page count ${summary.pages} != ${PAGES.length}` });
        if (summary.forms !== stat.forms) issues.push({ page: REPORT_JSON, message: `Stored form count ${summary.forms} != ${stat.forms}` });
        if (summary.phoneLinks !== stat.phoneLinks) issues.push({ page: REPORT_JSON, message: 'Stored phone-link count is stale.' });
        if (summary.whatsappLinks !== stat.whatsappLinks) issues.push({ page: REPORT_JSON, message: 'Stored WhatsApp-link count is stale.' });
        if (summary.issues !== 0) issues.push({ page: REPORT_JSON, message: `Stored browser evidence contains ${summary.issues} issue(s).` });
        if (!summary.browserTotal || summary.browserPassed !== summary.browserTotal) issues.push({ page: REPORT_JSON, message: 'Stored browser evidence is not fully passing.' });
        if ((stored.staticIssues || []).length) issues.push({ page: REPORT_JSON, message: 'Stored evidence contains static issues.' });
        if (fs.readFileSync(REPORT_MD, 'utf8') !== markdown(stored)) issues.push({ page: REPORT_MD, message: 'Markdown evidence does not match JSON evidence.' });
      }
    }

    if (issues.length) {
      console.error(`Kutter lead evidence check failed: ${issues.length} issue(s)`);
      for (const issue of issues) console.error(`- ${issue.page}: ${issue.message}`);
      process.exit(1);
    }
    const stored = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8'));
    console.log(`Kutter lead evidence: static=${PAGES.length} pages, browser=${stored.summary.browserPassed}/${stored.summary.browserTotal}, 0 issues`);
    return;
  }

  const browserScenarios = await runBrowserScenarios();
  const failedBrowser = browserScenarios.filter((item) => !item.passed);
  const report = {
    schemaVersion: 1,
    scope: '45-kutter-pages-and-representative-browser-e2e',
    summary: {
      pages: PAGES.length,
      forms: stat.forms,
      phoneLinks: stat.phoneLinks,
      whatsappLinks: stat.whatsappLinks,
      browserTotal: browserScenarios.length,
      browserPassed: browserScenarios.length - failedBrowser.length,
      issues: stat.issues.length + failedBrowser.length,
    },
    staticIssues: stat.issues,
    browserScenarios,
  };
  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}
`);
  fs.writeFileSync(REPORT_MD, markdown(report));
  console.log(`Kutter lead smoke: ${report.summary.browserPassed}/${report.summary.browserTotal} browser checks, ${report.summary.issues} issues`);
  if (report.summary.issues) {
    for (const issue of stat.issues) console.error(`- ${issue.page}: ${issue.message}`);
    for (const item of failedBrowser) console.error(`- ${item.name}: ${item.detail || 'failed'}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`smoke-kutter-leads failed: ${error.stack || error.message}`);
  process.exit(1);
});
