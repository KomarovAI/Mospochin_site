#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_DIR = process.env.MOSPOCHIN_VISUAL_OUT_DIR || 'reports/live-visual-pack';
const OUT_ROOT = path.join(ROOT, OUT_DIR);
const LLM_DIR = path.join(OUT_ROOT, 'llm');
const BASE_URL = process.env.MOSPOCHIN_SCREENSHOT_BASE_URL || 'https://mospochin.ru';

function argValue(name, fallback = '') {
  const prefix = `--${name}=`;
  const raw = process.argv.slice(2).find((x) => x.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : fallback;
}

function envOrArg(envName, argName, fallback = '') {
  return process.env[envName] || argValue(argName, fallback);
}

const SCOPE = envOrArg('MOSPOCHIN_VISUAL_SCOPE', 'scope', 'auto');
const PAGE_PATH_RAW = envOrArg('MOSPOCHIN_VISUAL_PAGE', 'page', '');
const DEPTH = envOrArg('MOSPOCHIN_VISUAL_DEPTH', 'depth', 'atomic') || 'atomic';

const MAX_BLOCKS = Number(argValue('max-blocks', process.env.MOSPOCHIN_ATOMIC_MAX_BLOCKS || '120'));
const MAX_ELEMENTS = Number(argValue('max-elements', process.env.MOSPOCHIN_ATOMIC_MAX_ELEMENTS || '260'));
const MAX_BLOCK_SHOTS = Number(argValue('max-block-shots', process.env.MOSPOCHIN_ATOMIC_MAX_BLOCK_SHOTS || '48'));
const MAX_ELEMENT_SHOTS = Number(argValue('max-element-shots', process.env.MOSPOCHIN_ATOMIC_MAX_ELEMENT_SHOTS || '96'));

const VIEWPORTS = {
  desktop: { width: 1440, height: 1200, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true }
};

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function safeName(value) {
  return String(value || 'item')
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'item';
}

function normalizePagePath(value) {
  let p = String(value || '').trim();
  if (!p) return '';
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

function pageUrl(pagePath) {
  if (pagePath === '/') return `${BASE_URL.replace(/\/$/, '')}/`;
  return `${BASE_URL.replace(/\/$/, '')}${pagePath}`;
}

function findChrome() {
  const forced = process.env.MOSPOCHIN_CHROME_PATH || '';
  if (forced) return forced;
  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try {
      return execFileSync('which', [bin], { encoding: 'utf8' }).trim();
    } catch {}
  }
  return '';
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readText(file, fallback = '') {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return fallback;
  }
}

async function appendCsv(file, header, rows) {
  await ensureDir(path.dirname(file));
  let text = await readText(file, '');
  if (!text.trim()) text = header.join(',') + '\n';
  for (const row of rows) text += row.map(csvEscape).join(',') + '\n';
  await fs.writeFile(file, text);
}

async function screenshotLocator(page, selector, outFile, warnings, meta) {
  try {
    const locator = page.locator(selector).first();
    if (await locator.count() < 1) {
      warnings.push({ ...meta, code: 'locator_missing', message: selector });
      return '';
    }
    await locator.screenshot({ path: outFile, animations: 'disabled', timeout: 3500 });
    return outFile;
  } catch (err) {
    warnings.push({ ...meta, code: 'locator_screenshot_failed', message: String(err?.message || err).slice(0, 260) });
    return '';
  }
}

async function tryAriaSnapshot(page, outFile, warnings, meta) {
  try {
    const body = page.locator('body').first();
    if (typeof body.ariaSnapshot === 'function') {
      const snapshot = await body.ariaSnapshot({ timeout: 3000 });
      await fs.writeFile(outFile, String(snapshot || ''));
      return outFile;
    }
    await fs.writeFile(outFile, '# ariaSnapshot not available in current Playwright runtime\n');
    return outFile;
  } catch (err) {
    warnings.push({ ...meta, code: 'aria_snapshot_failed', message: String(err?.message || err).slice(0, 220) });
    await fs.writeFile(outFile, '# ariaSnapshot failed\n');
    return '';
  }
}

async function buildAtomicDom(page, pageNo) {
  return await page.evaluate(({ pageNo, maxBlocks, maxElements }) => {
    const SKIP_TAGS = new Set(['script', 'style', 'meta', 'link', 'template', 'noscript']);

    const blockSelectors = [
      'header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'form',
      'dialog', '[role="dialog"]', '[data-block]', '[data-section]', '[data-card]',
      '.hero', '.cta', '.lead-form', '.service-card', '.problem-card', '.repair-bridge',
      '.faq', '.steps', '.prices', '.contacts', '.cluster-links', '.card'
    ];

    const elementSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a[href]', 'button', 'input', 'textarea', 'select',
      'img', 'picture', 'svg[role]', '[data-contact-link]',
      'a[href^="tel:"]', 'a[href*="wa.me"]', 'a[href*="whatsapp"]',
      'a[href*="t.me"]', 'a[href*="telegram"]'
    ];

    function textOf(el) {
      const txt = el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('alt') || '';
      return txt.replace(/\s+/g, ' ').trim().slice(0, 220);
    }

    function bboxOf(el) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (!rect || rect.width < 24 || rect.height < 16 || rect.width * rect.height < 384) return null;
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return null;
      if (SKIP_TAGS.has(el.tagName.toLowerCase())) return null;

      const text = textOf(el);
      const hasMedia = Boolean(el.querySelector?.('img,picture,svg,video,canvas'));
      const hasControl = Boolean(el.matches?.('a[href],button,input,textarea,select,form') || el.querySelector?.('a[href],button,input,textarea,select,form'));
      const tag = el.tagName.toLowerCase();
      const semantic = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'form', 'dialog'].includes(tag);
      const dataSemantic = el.hasAttribute('data-block') || el.hasAttribute('data-section') || el.hasAttribute('data-card') || el.hasAttribute('data-contact-link');

      if (!semantic && !dataSemantic && !hasMedia && !hasControl && !text) return null;

      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        doc_x: Math.round(rect.x + window.scrollX),
        doc_y: Math.round(rect.y + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    }

    function kindOf(el) {
      const tag = el.tagName.toLowerCase();
      const href = el.getAttribute('href') || '';
      const cls = String(el.className || '').toLowerCase();
      const data = `${el.getAttribute('data-block') || ''} ${el.getAttribute('data-section') || ''} ${el.getAttribute('data-card') || ''}`.toLowerCase();

      if (tag === 'header') return 'header';
      if (tag === 'nav') return 'nav';
      if (tag === 'footer') return 'footer';
      if (tag === 'form') return 'form';
      if (tag === 'main') return 'main';
      if (tag === 'section') return 'section';
      if (tag === 'dialog' || el.getAttribute('role') === 'dialog') return 'dialog';
      if (/^h[1-6]$/.test(tag)) return 'heading';
      if (tag === 'button') return 'button';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'form_field';
      if (href.startsWith('tel:')) return 'phone_link';
      if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp_link';
      if (href.includes('t.me') || href.includes('telegram')) return 'telegram_link';
      if (tag === 'a') return 'link';
      if (tag === 'img' || tag === 'picture') return 'image';
      if (cls.includes('hero') || data.includes('hero')) return 'hero';
      if (cls.includes('cta') || data.includes('cta')) return 'cta';
      if (cls.includes('card') || data.includes('card')) return 'card';
      if (cls.includes('faq') || data.includes('faq')) return 'faq';
      return tag;
    }

    function selectorHint(el) {
      const tag = el.tagName.toLowerCase();
      if (el.id) return `${tag}#${el.id}`;
      for (const attr of ['data-block', 'data-section', 'data-card', 'data-contact-link']) {
        const v = el.getAttribute(attr);
        if (v) return `${tag}[${attr}="${v}"]`;
      }
      const cls = String(el.className || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      return cls ? `${tag}.${cls}` : tag;
    }

    function collect(selectors, limit, prefix) {
      const out = [];
      const seen = new Set();

      for (const selector of selectors) {
        for (const el of document.querySelectorAll(selector)) {
          if (out.length >= limit) break;

          const bbox = bboxOf(el);
          if (!bbox) continue;

          const key = [
            Math.round(bbox.doc_x / 6) * 6,
            Math.round(bbox.doc_y / 6) * 6,
            Math.round(bbox.width / 6) * 6,
            Math.round(bbox.height / 6) * 6
          ].join(':');

          if (seen.has(key)) continue;
          seen.add(key);

          const kind = kindOf(el);
          const id = `${pageNo}-${prefix}${String(out.length).padStart(3, '0')}-${kind.replace(/[^a-z0-9_-]+/gi, '-')}`;
          el.setAttribute('data-visual-pack-id', id);

          out.push({
            id,
            kind,
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            aria: el.getAttribute('aria-label') || '',
            name: el.getAttribute('name') || '',
            href: el.getAttribute('href') || '',
            selector_hint: selectorHint(el),
            source_selector: selector,
            text_sample: textOf(el),
            bbox
          });
        }
      }

      return out;
    }

    const blocks = collect(blockSelectors, maxBlocks, 'b');
    const elements = collect(elementSelectors, maxElements, 'e');

    for (const e of elements) {
      let parent = '';
      let bestArea = Infinity;
      for (const b of blocks) {
        const inside =
          e.bbox.doc_x >= b.bbox.doc_x &&
          e.bbox.doc_y >= b.bbox.doc_y &&
          e.bbox.doc_x + e.bbox.width <= b.bbox.doc_x + b.bbox.width + 4 &&
          e.bbox.doc_y + e.bbox.height <= b.bbox.doc_y + b.bbox.height + 4;
        const area = b.bbox.width * b.bbox.height;
        if (inside && area < bestArea) {
          parent = b.id;
          bestArea = area;
        }
      }
      e.parent_block = parent;
    }

    const overlay = document.createElement('div');
    overlay.setAttribute('data-visual-pack-overlay', '1');
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '1px';
    overlay.style.height = '1px';
    overlay.style.zIndex = '2147483647';
    overlay.style.pointerEvents = 'none';
    document.documentElement.appendChild(overlay);

    function addBox(item, type) {
      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.left = `${item.bbox.doc_x}px`;
      box.style.top = `${item.bbox.doc_y}px`;
      box.style.width = `${item.bbox.width}px`;
      box.style.height = `${item.bbox.height}px`;
      box.style.border = type === 'block' ? '3px solid #e00000' : '2px solid #0057ff';
      box.style.boxSizing = 'border-box';
      box.style.pointerEvents = 'none';

      const label = document.createElement('div');
      label.textContent = `${item.id} ${item.kind}`;
      label.style.position = 'absolute';
      label.style.left = '0';
      label.style.top = '0';
      label.style.transform = 'translateY(-100%)';
      label.style.background = type === 'block' ? '#e00000' : '#0057ff';
      label.style.color = 'white';
      label.style.font = '12px Arial, sans-serif';
      label.style.padding = '2px 4px';
      label.style.maxWidth = '380px';
      label.style.whiteSpace = 'nowrap';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';

      box.appendChild(label);
      overlay.appendChild(box);
    }

    for (const b of blocks.slice(0, 80)) addBox(b, 'block');
    for (const e of elements.slice(0, 120)) addBox(e, 'element');

    return {
      title: document.title || '',
      h1: (document.querySelector('h1')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 220),
      blocks,
      elements
    };
  }, { pageNo, maxBlocks: MAX_BLOCKS, maxElements: MAX_ELEMENTS });
}

async function main() {
  const pagePath = normalizePagePath(PAGE_PATH_RAW);

  if (!(SCOPE === 'page' && pagePath && DEPTH === 'atomic')) {
    console.log(`VISUAL_ATOMIC_SKIP scope=${SCOPE} page=${pagePath || ''} depth=${DEPTH}`);
    return;
  }

  await ensureDir(OUT_ROOT);
  await ensureDir(LLM_DIR);

  const chromePath = findChrome();
  if (!chromePath) {
    console.log('VISUAL_ATOMIC_SKIP no_chrome');
    await appendCsv(
      path.join(LLM_DIR, 'llm_visual_atomic_warnings.csv'),
      ['page_id', 'path', 'viewport', 'severity', 'code', 'message', 'selector', 'part'],
      [['p999', pagePath, 'global', 'warning', 'no_chrome', 'No system Chrome found', '', 'atomic']]
    );
    return;
  }

  let playwright;
  try {
    playwright = await import('playwright');
  } catch (err) {
    console.log('VISUAL_ATOMIC_SKIP no_playwright');
    await appendCsv(
      path.join(LLM_DIR, 'llm_visual_atomic_warnings.csv'),
      ['page_id', 'path', 'viewport', 'severity', 'code', 'message', 'selector', 'part'],
      [['p999', pagePath, 'global', 'warning', 'no_playwright', String(err?.message || err).slice(0, 220), '', 'atomic']]
    );
    return;
  }

  const pageKey = safeName(pagePath === '/' ? 'index' : pagePath.replace(/^\//, '').replace(/\.html$/, ''));
  const pageNo = 'p999';
  const url = pageUrl(pagePath);
  const pageDir = path.join(OUT_ROOT, 'pages', 'atomic', `999__${pageKey}`);
  await ensureDir(pageDir);

  const warnings = [];
  const filesRows = [];
  const blocksRows = [];
  const elementsRows = [];
  const pageJsonlRows = [];

  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const domMap = {
    page_id: pageNo,
    page_key: pageKey,
    path: pagePath,
    url,
    class: 'MANUAL_ATOMIC',
    depth: 'atomic',
    reason: 'manual_workflow_dispatch',
    generated_at: new Date().toISOString(),
    chrome: chromePath,
    limits: {
      max_blocks: MAX_BLOCKS,
      max_elements: MAX_ELEMENTS,
      max_block_screenshots: MAX_BLOCK_SHOTS,
      max_element_screenshots: MAX_ELEMENT_SHOTS
    },
    viewports: {}
  };

  try {
    for (const [viewportName, vp] of Object.entries(VIEWPORTS)) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: Boolean(vp.isMobile),
        hasTouch: Boolean(vp.hasTouch),
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true
      });

      const page = await context.newPage();
      page.setDefaultTimeout(6000);

      const vpDir = path.join(pageDir, viewportName);
      const blocksDir = path.join(vpDir, 'blocks');
      const elementsDir = path.join(vpDir, 'elements');
      await ensureDir(blocksDir);
      await ensureDir(elementsDir);

      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(900);

        const status = resp?.status() || 0;

        const fullPath = path.join(vpDir, 'page-full.png');
        await page.screenshot({ path: fullPath, fullPage: true, animations: 'disabled', timeout: 12000 });
        filesRows.push([pageNo, pagePath, viewportName, 'atomic-full', path.relative(OUT_ROOT, fullPath).replaceAll(path.sep, '/')]);

        const topPath = path.join(vpDir, 'top.png');
        await page.screenshot({ path: topPath, fullPage: false, animations: 'disabled', timeout: 8000 });
        filesRows.push([pageNo, pagePath, viewportName, 'atomic-top', path.relative(OUT_ROOT, topPath).replaceAll(path.sep, '/')]);

        const ariaFile = path.join(pageDir, 'aria.ai.yaml');
        await tryAriaSnapshot(page, ariaFile, warnings, {
          page_id: pageNo,
          path: pagePath,
          viewport: viewportName,
          severity: 'warning',
          selector: 'body',
          part: 'aria'
        });
        filesRows.push([pageNo, pagePath, viewportName, 'aria', path.relative(OUT_ROOT, ariaFile).replaceAll(path.sep, '/')]);

        const result = await buildAtomicDom(page, pageNo);

        const numberedPath = path.join(vpDir, 'page-full-numbered.png');
        await page.screenshot({ path: numberedPath, fullPage: true, animations: 'disabled', timeout: 12000 });
        filesRows.push([pageNo, pagePath, viewportName, 'atomic-numbered-map', path.relative(OUT_ROOT, numberedPath).replaceAll(path.sep, '/')]);

        let blockShotCount = 0;
        for (const b of result.blocks.slice(0, MAX_BLOCK_SHOTS)) {
          const out = path.join(blocksDir, `${safeName(b.id)}.png`);
          const saved = await screenshotLocator(page, `[data-visual-pack-id="${b.id}"]`, out, warnings, {
            page_id: pageNo,
            path: pagePath,
            viewport: viewportName,
            severity: 'warning',
            selector: b.selector_hint,
            part: 'atomic-block'
          });
          b.screenshot = saved ? path.relative(OUT_ROOT, saved).replaceAll(path.sep, '/') : '';
          if (b.screenshot) {
            blockShotCount++;
            filesRows.push([pageNo, pagePath, viewportName, 'atomic-block', b.screenshot]);
          }
        }

        let elementShotCount = 0;
        for (const e of result.elements.slice(0, MAX_ELEMENT_SHOTS)) {
          const out = path.join(elementsDir, `${safeName(e.id)}.png`);
          const saved = await screenshotLocator(page, `[data-visual-pack-id="${e.id}"]`, out, warnings, {
            page_id: pageNo,
            path: pagePath,
            viewport: viewportName,
            severity: 'warning',
            selector: e.selector_hint,
            part: 'atomic-element'
          });
          e.screenshot = saved ? path.relative(OUT_ROOT, saved).replaceAll(path.sep, '/') : '';
          if (e.screenshot) {
            elementShotCount++;
            filesRows.push([pageNo, pagePath, viewportName, 'atomic-element', e.screenshot]);
          }
        }

        domMap.viewports[viewportName] = {
          status,
          title: result.title,
          h1: result.h1,
          full: path.relative(OUT_ROOT, fullPath).replaceAll(path.sep, '/'),
          top: path.relative(OUT_ROOT, topPath).replaceAll(path.sep, '/'),
          numbered: path.relative(OUT_ROOT, numberedPath).replaceAll(path.sep, '/'),
          blocks: result.blocks,
          elements: result.elements,
          block_screenshots: blockShotCount,
          element_screenshots: elementShotCount
        };

        for (const b of result.blocks) {
          blocksRows.push([
            pageNo,
            pagePath,
            'MANUAL_ATOMIC',
            viewportName,
            b.id,
            b.kind,
            b.role,
            b.text_sample,
            b.screenshot || '',
            '',
            b.bbox.doc_x,
            b.bbox.doc_y,
            b.bbox.width,
            b.bbox.height
          ]);
        }

        for (const e of result.elements) {
          elementsRows.push([
            pageNo,
            pagePath,
            'MANUAL_ATOMIC',
            viewportName,
            e.id,
            e.parent_block || '',
            e.tag,
            e.kind,
            e.text_sample,
            e.href,
            e.screenshot || '',
            e.bbox.doc_x,
            e.bbox.doc_y,
            e.bbox.width,
            e.bbox.height
          ]);
        }

        console.log(`VISUAL_ATOMIC_VIEWPORT_OK ${pagePath} ${viewportName} status=${status} blocks=${result.blocks.length} elements=${result.elements.length} blockShots=${blockShotCount} elementShots=${elementShotCount}`);
      } catch (err) {
        warnings.push({
          page_id: pageNo,
          path: pagePath,
          viewport: viewportName,
          severity: 'warning',
          code: 'atomic_viewport_failed',
          message: String(err?.message || err).slice(0, 260),
          selector: '',
          part: 'atomic'
        });
        console.log(`VISUAL_ATOMIC_WARN ${pagePath} ${viewportName} atomic_viewport_failed`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(path.join(pageDir, 'dom-map.json'), JSON.stringify(domMap, null, 2));

  const pageMd = [
    `# ${pageNo} ${pagePath}`,
    '',
    'Class: MANUAL_ATOMIC',
    'Depth: atomic',
    'Reason: manual_workflow_dispatch',
    `URL: ${url}`,
    `Chrome: ${chromePath}`,
    '',
    '## Main screenshots',
    '',
    '- desktop/page-full.png',
    '- desktop/page-full-numbered.png',
    '- mobile/page-full.png',
    '- mobile/page-full-numbered.png',
    '',
    '## DOM map',
    '',
    '- dom-map.json',
    '- aria.ai.yaml',
    '- desktop/blocks/',
    '- desktop/elements/',
    '- mobile/blocks/',
    '- mobile/elements/',
    '',
    '## Counts',
    '',
    `- blocks_indexed: ${blocksRows.length}`,
    `- elements_indexed: ${elementsRows.length}`,
    `- warnings: ${warnings.length}`,
    ''
  ].join('\n');

  await fs.writeFile(path.join(pageDir, 'page.md'), pageMd);

  pageJsonlRows.push(JSON.stringify({
    page_id: pageNo,
    page_key: pageKey,
    path: pagePath,
    url,
    class: 'MANUAL_ATOMIC',
    depth: 'atomic',
    reason: 'manual_workflow_dispatch',
    page_md: path.relative(OUT_ROOT, path.join(pageDir, 'page.md')).replaceAll(path.sep, '/'),
    dom_map: path.relative(OUT_ROOT, path.join(pageDir, 'dom-map.json')).replaceAll(path.sep, '/'),
    status_desktop: domMap.viewports.desktop?.status || 0,
    status_mobile: domMap.viewports.mobile?.status || 0
  }));

  await fs.writeFile(path.join(LLM_DIR, 'llm_visual_atomic_pages.jsonl'), pageJsonlRows.join('\n') + '\n');

  await appendCsv(
    path.join(LLM_DIR, 'llm_visual_blocks.csv'),
    ['page_id', 'path', 'class', 'viewport', 'block_id', 'kind', 'role', 'text_sample', 'screenshot', 'parent_id', 'x', 'y', 'width', 'height'],
    blocksRows
  );

  await appendCsv(
    path.join(LLM_DIR, 'llm_visual_elements.csv'),
    ['page_id', 'path', 'class', 'viewport', 'element_id', 'parent_block', 'tag', 'kind', 'text', 'href', 'screenshot', 'x', 'y', 'width', 'height'],
    elementsRows
  );

  await appendCsv(
    path.join(LLM_DIR, 'llm_visual_files.csv'),
    ['page_id', 'path', 'viewport', 'kind', 'file'],
    filesRows
  );

  await appendCsv(
    path.join(LLM_DIR, 'llm_visual_atomic_warnings.csv'),
    ['page_id', 'path', 'viewport', 'severity', 'code', 'message', 'selector', 'part'],
    warnings.map((w) => [
      w.page_id || pageNo,
      w.path || pagePath,
      w.viewport || '',
      w.severity || 'warning',
      w.code || '',
      w.message || '',
      w.selector || '',
      w.part || ''
    ])
  );

  const summaryPath = path.join(OUT_ROOT, 'run-summary.md');
  let summary = await readText(summaryPath, '# MosPochin Live Visual Pack\n');
  summary += `\n## Manual atomic capture\n\n- page: ${pagePath}\n- url: ${url}\n- page_id: ${pageNo}\n- blocks_indexed: ${blocksRows.length}\n- elements_indexed: ${elementsRows.length}\n- files_indexed: ${filesRows.length}\n- warnings: ${warnings.length}\n- output: ${path.relative(OUT_ROOT, pageDir).replaceAll(path.sep, '/')}\n`;
  await fs.writeFile(summaryPath, summary);

  console.log(`VISUAL_ATOMIC_OK page=${pagePath} blocks=${blocksRows.length} elements=${elementsRows.length} files=${filesRows.length} warnings=${warnings.length}`);
}

main().catch((err) => {
  console.error('VISUAL_ATOMIC_FAIL');
  console.error(err);
  process.exit(0);
});
