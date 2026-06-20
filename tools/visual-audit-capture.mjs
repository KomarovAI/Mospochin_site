import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const shard = Number.parseInt(process.env.SHARD || '0', 10);
const planPath = 'reports/visual-audit/plan.json';
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const bucket = plan.buckets.find(b => b.shard === shard);
if (!bucket) throw new Error(`Shard ${shard} not found in plan`);

const outDir = `reports/visual-audit/shards/shard-${shard}`;
fs.mkdirSync(outDir, { recursive: true });

function findChrome() {
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  return candidates.find(p => fs.existsSync(p));
}

function safeName(s) {
  return s.replace(/^\/$/, 'index').replace(/^\//, '').replace(/\.html$/, '').replace(/[^a-zA-Z0-9а-яА-Я_-]+/g, '_') || 'index';
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

const executablePath = findChrome();
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const manifest = [];
const issues = [];

for (const task of bucket.tasks) {
  const pageId = `${safeName(task.path)}__${task.viewport}`;
  const pageDir = path.join(outDir, 'pages', pageId);
  fs.mkdirSync(pageDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: task.width, height: task.height },
    deviceScaleFactor: 1,
    userAgent: `MosPochinVisualAudit/1.0 ${task.viewport}`,
  });
  const page = await context.newPage();

  let status = null;
  let error = '';
  try {
    const response = await page.goto(task.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    status = response?.status() ?? null;
    await page.waitForTimeout(1200);

    await page.screenshot({ path: path.join(pageDir, 'viewport.png'), fullPage: false });
    await page.screenshot({ path: path.join(pageDir, 'full.png'), fullPage: true });

    const audit = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a[href]')].map(a => ({
        text: (a.textContent || '').trim().slice(0, 120),
        href: a.getAttribute('href') || '',
        top: a.getBoundingClientRect().top,
      }));
      const buttons = [...document.querySelectorAll('button, .btn, [role="button"], a[class*="btn"], a[class*="button"]')].map(el => ({
        text: (el.textContent || '').trim().slice(0, 120),
        top: el.getBoundingClientRect().top,
      }));
      const forms = [...document.querySelectorAll('form')].map(f => ({
        top: f.getBoundingClientRect().top,
        fields: f.querySelectorAll('input, textarea, select').length,
      }));
      const h1 = [...document.querySelectorAll('h1')].map(h => (h.textContent || '').trim()).filter(Boolean);
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const vh = window.innerHeight;
      const contactLinks = links.filter(l => /^(tel:|mailto:)|wa\.me|whatsapp|t\.me|telegram/i.test(l.href));
      const firstScreenCta = [...links, ...buttons].filter(x => x.top >= 0 && x.top < vh && /(звон|позвон|whatsapp|telegram|заявк|вызв|ремонт|получ|остав)/i.test(x.text + ' ' + (x.href || '')));
      return {
        title: document.title,
        h1,
        links: links.length,
        buttons: buttons.length,
        forms: forms.length,
        contact_links: contactLinks.length,
        first_screen_cta: firstScreenCta.length,
        horizontal_scroll: sw > vw + 2,
        scroll_width: sw,
        client_width: vw,
        body_text_len: (document.body?.innerText || '').trim().length,
      };
    });

    const addIssue = (severity, type, evidence, recommendation) => {
      issues.push({ path: task.path, url: task.url, viewport: task.viewport, severity, type, evidence, recommendation, screenshot: `pages/${pageId}/viewport.png` });
    };

    if (!status || status >= 400) addIssue('P0', 'http_status', `HTTP status ${status}`, 'Проверить доступность страницы и routing.');
    if (audit.horizontal_scroll) addIssue('P1', 'horizontal_scroll', `scrollWidth=${audit.scroll_width}, clientWidth=${audit.client_width}`, 'Убрать горизонтальный overflow на viewport.');
    if (!audit.h1.length) addIssue('P1', 'missing_h1', 'H1 не найден', 'Добавить один понятный H1 с услугой/оборудованием.');
    if (audit.contact_links < 1) addIssue('P1', 'missing_contact_links', 'Нет tel/WhatsApp/Telegram/mailto ссылок', 'Добавить явный контактный CTA.');
    if (audit.first_screen_cta < 1) addIssue('P1', 'no_first_screen_cta', 'На первом экране не найден CTA', 'Поднять CTA в hero/первый экран.');
    if (audit.forms < 1 && !/contact/i.test(task.path)) addIssue('P2', 'missing_form', 'Форма не найдена', 'Проверить, нужна ли форма на коммерческой странице.');
    if (audit.body_text_len < 500) addIssue('P2', 'thin_visible_content', `body text len=${audit.body_text_len}`, 'Проверить полноту видимого контента.');

    manifest.push({ ...task, status, error, page_id: pageId, title: audit.title, h1: audit.h1.join(' | '), screenshot: `pages/${pageId}/viewport.png`, full: `pages/${pageId}/full.png`, ...audit });
  } catch (e) {
    error = e?.message || String(e);
    issues.push({ path: task.path, url: task.url, viewport: task.viewport, severity: 'P0', type: 'capture_failed', evidence: error, recommendation: 'Проверить доступность URL/рендеринг.', screenshot: '' });
    manifest.push({ ...task, status, error, page_id: pageId });
  } finally {
    await context.close();
  }
}

await browser.close();

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(outDir, 'issues.jsonl'), issues.map(x => JSON.stringify(x)).join('\n') + (issues.length ? '\n' : ''));

const header = ['path','url','viewport','severity','type','evidence','recommendation','screenshot'];
const rows = issues.map(i => header.map(k => csvEscape(i[k])).join(','));
fs.writeFileSync(path.join(outDir, 'issues.csv'), header.join(',') + '\n' + rows.join('\n') + '\n');

console.log(`shard=${shard} tasks=${bucket.tasks.length} issues=${issues.length}`);
