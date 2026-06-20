import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.VISUAL_BASE_URL || 'https://mospochin.ru';
const pagesInput = process.env.VISUAL_TARGET_PAGES || [
  '/water-heaters.html',
  '/contact.html',
  '/about.html',
  '/pishevarochnyj-kotel-abat-e01.html',
  '/pishevarochnye-kotly.html',
].join(',');

const outDir = process.env.VISUAL_OUT_DIR || 'reports/visual-targeted-mobile';
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const pages = [...new Set(
  pagesInput
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(p => p.startsWith('/') ? p : `/${p}`)
)];

function safeName(p) {
  return p.replace(/^\//, '').replace(/\.html$/, '').replace(/[^a-zA-Z0-9_-]+/g, '_') || 'index';
}

function findChrome() {
  return [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].find(p => fs.existsSync(p));
}

function esc(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

async function safeShot(locator, file, opts = {}) {
  try {
    const count = await locator.count();
    if (!count) return false;
    const first = locator.first();
    await first.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await first.screenshot({ path: file, timeout: 45000, animations: 'disabled', caret: 'hide', ...opts });
    return true;
  } catch {
    return false;
  }
}

const browser = await chromium.launch({
  headless: true,
  executablePath: findChrome(),
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const rows = [];
const issues = [];

for (const pagePath of pages) {
  const key = safeName(pagePath);
  const dir = path.join(outDir, 'pages', key);
  fs.mkdirSync(dir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    userAgent: 'MosPochinTargetedMobileDeep/1.0',
  });

  await context.route('**/*', async route => {
    const type = route.request().resourceType();
    if (type === 'font' || type === 'media') return route.abort().catch(() => {});
    return route.continue().catch(() => {});
  });

  const page = await context.newPage();
  const url = `${baseUrl}${pagePath}`;
  let status = null;
  let title = '';
  let h1 = '';
  let error = '';

  try {
    const response = await page.goto(url, { waitUntil: 'commit', timeout: 60000 });
    status = response?.status() ?? null;
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2200);
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          scroll-behavior: auto !important;
        }
      `
    }).catch(() => {});
    await page.evaluate(() => window.stop()).catch(() => {});

    title = await page.title().catch(() => '');
    h1 = await page.locator('h1').first().innerText({ timeout: 3000 }).catch(() => '');

    await page.screenshot({
      path: path.join(dir, '01_viewport.png'),
      fullPage: false,
      timeout: 90000,
      animations: 'disabled',
      caret: 'hide'
    });

    // Avoid heavy fullPage screenshot in targeted mode: it can hang on long pages.
    // Instead capture top/middle/bottom viewport evidence.
    await page.screenshot({
      path: path.join(dir, '02_top.png'),
      fullPage: false,
      timeout: 45000,
      animations: 'disabled',
      caret: 'hide'
    });

    await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.45))).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(dir, '02_mid.png'),
      fullPage: false,
      timeout: 45000,
      animations: 'disabled',
      caret: 'hide'
    });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(dir, '02_bottom.png'),
      fullPage: false,
      timeout: 45000,
      animations: 'disabled',
      caret: 'hide'
    });

    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
    await page.waitForTimeout(500);

    await safeShot(page.locator('body > div').first(), path.join(dir, '03_topbar_or_first_wrapper.png'));
    await safeShot(page.locator('header, nav, #header-container, [data-block*="header"], [class*="header"], [class*="nav"]').first(), path.join(dir, '04_header.png'));
    await safeShot(page.locator('main section, main .hero, section').first(), path.join(dir, '05_hero.png'));
    await safeShot(page.locator('a:has-text("Для ресторанов"), a:has-text("Для дома"), a:has-text("ресторанный"), a:has-text("бытовой")'), path.join(dir, '06_branch_switcher.png'));
    await safeShot(page.locator('form').first(), path.join(dir, '07_form.png'));
    await safeShot(page.locator('text=/24\\/7|45 мин|0₽|4\\.9|15\\+|500\\+|0\\+|0%/').first(), path.join(dir, '08_stats_or_counters.png'));
    await safeShot(page.locator('a[href^="tel:"], a[href*="wa.me"], a[href*="whatsapp"], button:has-text("Позвон"), a:has-text("WhatsApp")').first(), path.join(dir, '09_primary_cta.png'));

    const menuButton = page.locator('button:has-text("Меню"), button[aria-label*="меню" i], button[aria-label*="menu" i]').first();
    if (await menuButton.count()) {
      await menuButton.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(dir, '10_mobile_menu_open.png'),
        fullPage: false,
        timeout: 45000,
        animations: 'disabled',
        caret: 'hide'
      });
    }

    const audit = await page.evaluate(() => {
      const text = document.body?.innerText || '';
      return {
        has_for_restaurants: /Для ресторанов|Перейти в ресторанный раздел/i.test(text),
        has_old_restaurant_equipment: /🔧\s*Ресторанное оборудование|Ресторанное оборудование/i.test(text),
        has_zero_counter: /\b0\+|\b0%/.test(text),
        has_contact_stats: /24\/7|45 мин|0₽|4\.9/.test(text),
        horizontal_scroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        scroll_width: document.documentElement.scrollWidth,
        client_width: document.documentElement.clientWidth,
      };
    });

    if (status >= 400) issues.push({ page: pagePath, severity: 'P0', type: 'http_status', evidence: `HTTP ${status}` });
    if (audit.horizontal_scroll) issues.push({ page: pagePath, severity: 'P1', type: 'horizontal_scroll', evidence: `scrollWidth=${audit.scroll_width} clientWidth=${audit.client_width}` });
    if (pagePath === '/water-heaters.html' && !audit.has_for_restaurants) issues.push({ page: pagePath, severity: 'P1', type: 'missing_new_switcher_label', evidence: 'Не найдено “Для ресторанов / Перейти в ресторанный раздел”.' });
    if (pagePath === '/water-heaters.html' && audit.has_old_restaurant_equipment) issues.push({ page: pagePath, severity: 'P1', type: 'old_switcher_label_visible', evidence: 'Всё ещё видно “Ресторанное оборудование”.' });
    if (pagePath === '/about.html' && audit.has_zero_counter) issues.push({ page: pagePath, severity: 'P1', type: 'zero_counter_visible', evidence: 'Видно 0+ или 0%.' });

    rows.push({ page: pagePath, url, status, title, h1, error, ...audit });
  } catch (e) {
    error = e?.message || String(e);
    issues.push({ page: pagePath, severity: 'P0', type: 'capture_failed', evidence: error });
    rows.push({ page: pagePath, url, status, title, h1, error });
  } finally {
    await context.close();
  }
}

await browser.close();

const header = ['page','url','status','title','h1','error','has_for_restaurants','has_old_restaurant_equipment','has_zero_counter','has_contact_stats','horizontal_scroll','scroll_width','client_width'];
fs.writeFileSync(path.join(outDir, 'summary.csv'), header.join(',') + '\n' + rows.map(r => header.map(k => esc(r[k])).join(',')).join('\n') + '\n');

const issueHeader = ['page','severity','type','evidence'];
fs.writeFileSync(path.join(outDir, 'issues.csv'), issueHeader.join(',') + '\n' + issues.map(i => issueHeader.map(k => esc(i[k])).join(',')).join('\n') + '\n');
fs.writeFileSync(path.join(outDir, 'issues.json'), JSON.stringify(issues, null, 2));

const sections = rows.map(r => {
  const key = safeName(r.page);
  return `
## ${r.page}

- status: ${r.status ?? ''}
- title: ${r.title ?? ''}
- h1: ${r.h1 ?? ''}
- horizontal_scroll: ${r.horizontal_scroll ?? ''}

![viewport](pages/${key}/01_viewport.png)
![header](pages/${key}/04_header.png)
![top](pages/${key}/02_top.png)
![mid](pages/${key}/02_mid.png)
![bottom](pages/${key}/02_bottom.png)
![hero](pages/${key}/05_hero.png)
![switcher](pages/${key}/06_branch_switcher.png)
![form](pages/${key}/07_form.png)
![stats](pages/${key}/08_stats_or_counters.png)
![cta](pages/${key}/09_primary_cta.png)
`;
}).join('\n');

fs.writeFileSync(path.join(outDir, 'TARGETED_MOBILE_DEEP_REPORT.md'), `# MosPochin targeted mobile deep visual evidence

Generated: ${new Date().toISOString()}

Pages:
${pages.map(p => `- ${p}`).join('\n')}

Issues: ${issues.length}

${issues.map(i => `- ${i.severity} ${i.type}: ${i.page} — ${i.evidence}`).join('\n') || 'No automated issues.'}

${sections}
`);

console.log(`captured pages=${rows.length} issues=${issues.length} out=${outDir}`);
