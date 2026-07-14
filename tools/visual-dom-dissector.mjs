#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { getFirefoxContextOptions, getFirefoxLaunchOptions } from './visual-firefox-config.mjs';

const ROOT = process.cwd();
const OUT_DIR = process.env.MOSPOCHIN_VISUAL_OUT_DIR || 'reports/live-visual-pack';
const BASE_URL = process.env.MOSPOCHIN_SCREENSHOT_BASE_URL || 'https://mospochin.ru';

function argValue(name, fallback = '') {
  const prefix = `--${name}=`;
  const raw = process.argv.slice(2).find((x) => x.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : fallback;
}

const MAX_PAGES = Number(argValue('max-pages', '7'));
const MAX_BLOCK_SHOTS = Number(argValue('max-block-shots', '6'));
const MAX_ELEMENT_SHOTS = Number(argValue('max-element-shots', '8'));
const MAX_BLOCKS = Number(argValue('max-blocks', '42'));
const MAX_ELEMENTS = Number(argValue('max-elements', '64'));

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function safeName(value) {
  return String(value || 'item')
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90) || 'item';
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function normUrl(pagePath) {
  if (pagePath === '/') return `${BASE_URL.replace(/\/$/, '')}/`;
  return `${BASE_URL.replace(/\/$/, '')}${pagePath.startsWith('/') ? pagePath : '/' + pagePath}`;
}

function planRowsFromJson(plan) {
  const rows = plan.rows || plan.pages || [];
  return rows.map((r, i) => ({
    page_index: r.page_index ?? i,
    page_no: `p${String(r.page_index ?? i).padStart(3, '0')}`,
    page_id: r.page_id || safeName(r.path === '/' ? 'index' : r.path),
    path: r.path || '/',
    url: r.url || normUrl(r.path || '/'),
    class: r.class || 'CORE_ALWAYS',
    reason: r.reason || 'postdeploy_dom_map',
    depth: r.depth || 'lite',
    viewports: r.viewports || ['desktop', 'mobile']
  }));
}

function defaultRows() {
  const pages = [
    '/',
    '/contact.html',
    '/bytovaya-contact.html',
    '/pishevarochnye-kotly.html',
    '/pishevarochnyj-kotel-abat-kpem.html',
    '/pishevarochnyj-kotel-ne-greet.html',
    '/remont-pishevarochnyh-kotlov-abat.html'
  ];
  return pages.map((p, i) => ({
    page_index: i,
    page_no: `p${String(i).padStart(3, '0')}`,
    page_id: safeName(p === '/' ? 'index' : p.replace(/^\//, '').replace(/\.html$/, '')),
    path: p,
    url: normUrl(p),
    class: 'CORE_ALWAYS',
    reason: 'dom_map_default_core',
    depth: 'lite',
    viewports: ['desktop', 'mobile']
  }));
}

const viewportConfig = {
  desktop: { width: 1440, height: 1200, isMobile: false },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true }
};

async function screenshotIfPossible(page, selector, outFile, warnings, meta) {
  try {
    const locator = page.locator(selector).first();
    if (await locator.count() < 1) {
      warnings.push({ ...meta, code: 'locator_missing', message: selector });
      return '';
    }
    await locator.screenshot({ path: outFile, animations: 'disabled', timeout: 2500 });
    return outFile;
  } catch (err) {
    warnings.push({ ...meta, code: 'locator_screenshot_failed', message: String(err?.message || err).slice(0, 220) });
    return '';
  }
}

async function dissectPage(page, pagePlan, viewportName, pageDir, warnings) {
  const viewportDir = path.join(pageDir, viewportName);
  const blocksDir = path.join(viewportDir, 'blocks');
  const elementsDir = path.join(viewportDir, 'elements');
  await ensureDir(viewportDir);
  await ensureDir(blocksDir);
  await ensureDir(elementsDir);

  const result = await page.evaluate(({ pageNo, maxBlocks, maxElements }) => {
    const blockSelectors = [
      'header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'form',
      '[role="dialog"]', 'dialog', '[data-block]', '[data-section]', '[data-card]',
      '.hero', '.cta', '.lead-form', '.service-card', '.problem-card', '.faq', '.contacts', '.cluster-links'
    ];

    const elementSelectors = [
      'h1', 'h2', 'h3',
      'a[href]', 'button', 'input', 'textarea', 'select',
      'img', 'picture', '[data-contact-link]',
      'a[href^="tel:"]', 'a[href*="wa.me"]', 'a[href*="whatsapp"]', 'a[href*="t.me"]', 'a[href*="telegram"]'
    ];

    function cleanText(el) {
      return (el.innerText || el.textContent || el.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);
    }

    function visibleBox(el) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (!rect || rect.width < 24 || rect.height < 16 || rect.width * rect.height < 384) return null;
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return null;
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
      const dataBlock = el.getAttribute('data-block') || el.getAttribute('data-section') || '';

      if (tag === 'header') return 'header';
      if (tag === 'nav') return 'nav';
      if (tag === 'footer') return 'footer';
      if (tag === 'form') return 'form';
      if (tag === 'main') return 'main';
      if (tag === 'section') return 'section';
      if (tag === 'button') return 'button';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'form_field';
      if (/^h[1-6]$/.test(tag)) return 'heading';
      if (href.startsWith('tel:')) return 'phone_link';
      if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp_link';
      if (href.includes('t.me') || href.includes('telegram')) return 'telegram_link';
      if (tag === 'a') return 'link';
      if (tag === 'img' || tag === 'picture') return 'image';
      if (cls.includes('cta') || dataBlock.includes('cta')) return 'cta';
      if (cls.includes('hero') || dataBlock.includes('hero')) return 'hero';
      if (cls.includes('card') || dataBlock.includes('card')) return 'card';
      return tag;
    }

    function selectorHint(el) {
      const tag = el.tagName.toLowerCase();
      if (el.id) return `${tag}#${el.id}`;
      const dataBlock = el.getAttribute('data-block') || el.getAttribute('data-section') || el.getAttribute('data-card');
      if (dataBlock) return `${tag}[data-block="${dataBlock}"]`;
      const cls = String(el.className || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
      return cls ? `${tag}.${cls}` : tag;
    }

    function collect(selectors, limit, prefix) {
      const out = [];
      const seen = new Set();

      for (const selector of selectors) {
        for (const el of document.querySelectorAll(selector)) {
          if (out.length >= limit) break;

          const bbox = visibleBox(el);
          if (!bbox) continue;

          const key = [
            Math.round(bbox.doc_x / 8) * 8,
            Math.round(bbox.doc_y / 8) * 8,
            Math.round(bbox.width / 8) * 8,
            Math.round(bbox.height / 8) * 8
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
            href: el.getAttribute('href') || '',
            selector_hint: selectorHint(el),
            source_selector: selector,
            text_sample: cleanText(el),
            bbox
          });
        }
      }

      return out;
    }

    const blocks = collect(blockSelectors, maxBlocks, 'b');
    const elements = collect(elementSelectors, maxElements, 'e');

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
      box.style.border = type === 'block' ? '3px solid red' : '2px solid blue';
      box.style.boxSizing = 'border-box';
      box.style.pointerEvents = 'none';

      const label = document.createElement('div');
      label.textContent = `${item.id} ${item.kind}`;
      label.style.position = 'absolute';
      label.style.left = '0';
      label.style.top = '0';
      label.style.transform = 'translateY(-100%)';
      label.style.background = type === 'block' ? 'red' : 'blue';
      label.style.color = 'white';
      label.style.font = '12px Arial, sans-serif';
      label.style.padding = '2px 4px';
      label.style.maxWidth = '340px';
      label.style.whiteSpace = 'nowrap';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';

      box.appendChild(label);
      overlay.appendChild(box);
    }

    for (const b of blocks.slice(0, 32)) addBox(b, 'block');
    for (const e of elements.slice(0, 24)) addBox(e, 'element');

    return {
      title: document.title || '',
      h1: (document.querySelector('h1')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 180),
      blocks,
      elements
    };
  }, {
    pageNo: pagePlan.page_no,
    maxBlocks: MAX_BLOCKS,
    maxElements: MAX_ELEMENTS
  });

  const numberedPath = path.join(viewportDir, 'page-full-numbered.png');
  try {
    await page.screenshot({ path: numberedPath, fullPage: true, animations: 'disabled', timeout: 10000 });
  } catch (err) {
    warnings.push({
      page_id: pagePlan.page_no,
      path: pagePlan.path,
      viewport: viewportName,
      severity: 'warning',
      code: 'numbered_map_failed',
      message: String(err?.message || err).slice(0, 220),
      selector: '',
      part: 'numbered-map'
    });
  }

  let blockShots = 0;
  for (const item of result.blocks.slice(0, MAX_BLOCK_SHOTS)) {
    const out = path.join(blocksDir, `${safeName(item.id)}.png`);
    const saved = await screenshotIfPossible(
      page,
      `[data-visual-pack-id="${item.id}"]`,
      out,
      warnings,
      {
        page_id: pagePlan.page_no,
        path: pagePlan.path,
        viewport: viewportName,
        severity: 'warning',
        selector: item.selector_hint,
        part: 'blocks'
      }
    );
    item.screenshot = saved ? path.relative(path.join(ROOT, OUT_DIR), saved) : '';
    blockShots += saved ? 1 : 0;
  }

  let elementShots = 0;
  for (const item of result.elements.slice(0, MAX_ELEMENT_SHOTS)) {
    const out = path.join(elementsDir, `${safeName(item.id)}.png`);
    const saved = await screenshotIfPossible(
      page,
      `[data-visual-pack-id="${item.id}"]`,
      out,
      warnings,
      {
        page_id: pagePlan.page_no,
        path: pagePlan.path,
        viewport: viewportName,
        severity: 'warning',
        selector: item.selector_hint,
        part: 'elements'
      }
    );
    item.screenshot = saved ? path.relative(path.join(ROOT, OUT_DIR), saved) : '';
    elementShots += saved ? 1 : 0;
  }

  return {
    viewport: viewportName,
    title: result.title,
    h1: result.h1,
    numbered: path.relative(path.join(ROOT, OUT_DIR), numberedPath),
    block_screenshots: blockShots,
    element_screenshots: elementShots,
    blocks: result.blocks,
    elements: result.elements
  };
}

async function main() {
  await ensureDir(path.join(ROOT, OUT_DIR));
  await ensureDir(path.join(ROOT, OUT_DIR, 'llm'));

  const warnings = [];

  let playwright;
  try {
    playwright = await import('playwright');
  } catch (err) {
    const warnFile = path.join(ROOT, OUT_DIR, 'llm', 'llm_visual_dom_warnings.csv');
    await fs.writeFile(warnFile, `page_id,path,viewport,severity,code,message,selector,part\n,,global,warning,no_playwright,${csvEscape(String(err?.message || err))},,dom\n`);
    console.log('VISUAL_DOM_SKIP no_playwright');
    return;
  }

  const plan = await readJson(path.join(ROOT, OUT_DIR, 'capture-plan.json'), null);
  const rows = (plan ? planRowsFromJson(plan) : defaultRows()).slice(0, MAX_PAGES);

  const blocksCsv = [
    ['page_id', 'path', 'class', 'viewport', 'block_id', 'kind', 'role', 'text_sample', 'screenshot', 'parent_id', 'x', 'y', 'width', 'height'].join(',')
  ];
  const elementsCsv = [
    ['page_id', 'path', 'class', 'viewport', 'element_id', 'parent_block', 'tag', 'kind', 'text', 'href', 'screenshot', 'x', 'y', 'width', 'height'].join(',')
  ];
  const filesCsv = [
    ['page_id', 'path', 'viewport', 'kind', 'file'].join(',')
  ];

  const browser = await playwright.firefox.launch(getFirefoxLaunchOptions());

  let totalBlocks = 0;
  let totalElements = 0;
  let totalFiles = 0;

  try {
    for (const pagePlan of rows) {
      const pageDir = path.join(
        ROOT,
        OUT_DIR,
        'pages',
        `${String(pagePlan.page_index).padStart(3, '0')}__${safeName(pagePlan.page_id)}`
      );
      await ensureDir(pageDir);

      const pageMap = {
        page_id: pagePlan.page_no,
        page_key: pagePlan.page_id,
        path: pagePlan.path,
        url: pagePlan.url,
        class: pagePlan.class,
        depth: pagePlan.depth,
        reason: pagePlan.reason,
        generated_at: new Date().toISOString(),
        browser: 'firefox',
        viewports: {}
      };

      for (const viewportName of pagePlan.viewports.filter((v) => viewportConfig[v])) {
        const vp = viewportConfig[viewportName];
        const context = await browser.newContext({
          ...getFirefoxContextOptions(vp),
          deviceScaleFactor: 1,
          ignoreHTTPSErrors: true
        });

        const page = await context.newPage();
        page.setDefaultTimeout(5000);

        try {
          const resp = await page.goto(pagePlan.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
          await page.waitForTimeout(700);

          const vpMap = await dissectPage(page, pagePlan, viewportName, pageDir, warnings);
          vpMap.status = resp?.status() || 0;
          pageMap.viewports[viewportName] = vpMap;

          filesCsv.push([
            pagePlan.page_no,
            pagePlan.path,
            viewportName,
            'numbered-map',
            vpMap.numbered
          ].map(csvEscape).join(','));
          totalFiles += 1;

          for (const b of vpMap.blocks) {
            blocksCsv.push([
              pagePlan.page_no,
              pagePlan.path,
              pagePlan.class,
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
            ].map(csvEscape).join(','));
            totalBlocks += 1;
            if (b.screenshot) {
              filesCsv.push([pagePlan.page_no, pagePlan.path, viewportName, 'block', b.screenshot].map(csvEscape).join(','));
              totalFiles += 1;
            }
          }

          for (const e of vpMap.elements) {
            elementsCsv.push([
              pagePlan.page_no,
              pagePlan.path,
              pagePlan.class,
              viewportName,
              e.id,
              '',
              e.tag,
              e.kind,
              e.text_sample,
              e.href,
              e.screenshot || '',
              e.bbox.doc_x,
              e.bbox.doc_y,
              e.bbox.width,
              e.bbox.height
            ].map(csvEscape).join(','));
            totalElements += 1;
            if (e.screenshot) {
              filesCsv.push([pagePlan.page_no, pagePlan.path, viewportName, 'element', e.screenshot].map(csvEscape).join(','));
              totalFiles += 1;
            }
          }

          console.log(`VISUAL_DOM_PAGE_OK ${pagePlan.path} ${viewportName} blocks=${vpMap.blocks.length} elements=${vpMap.elements.length}`);
        } catch (err) {
          warnings.push({
            page_id: pagePlan.page_no,
            path: pagePlan.path,
            viewport: viewportName,
            severity: 'warning',
            code: 'dom_page_failed',
            message: String(err?.message || err).slice(0, 220),
            selector: '',
            part: 'dom'
          });
          console.log(`VISUAL_DOM_WARN ${pagePlan.path} ${viewportName} dom_page_failed`);
        } finally {
          await context.close();
        }
      }

      await fs.writeFile(path.join(pageDir, 'dom-map.json'), JSON.stringify(pageMap, null, 2));

      const pageMd = path.join(pageDir, 'page.md');
      try {
        let old = await fs.readFile(pageMd, 'utf8');
        if (!old.includes('## DOM visual map')) {
          old += '\n## DOM visual map\n\n- dom-map.json\n- desktop/page-full-numbered.png\n- mobile/page-full-numbered.png\n- desktop/blocks/\n- mobile/blocks/\n- desktop/elements/\n- mobile/elements/\n';
          await fs.writeFile(pageMd, old);
        }
      } catch {}
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(path.join(ROOT, OUT_DIR, 'llm', 'llm_visual_blocks.csv'), blocksCsv.join('\n') + '\n');
  await fs.writeFile(path.join(ROOT, OUT_DIR, 'llm', 'llm_visual_elements.csv'), elementsCsv.join('\n') + '\n');
  await fs.writeFile(path.join(ROOT, OUT_DIR, 'llm', 'llm_visual_files.csv'), filesCsv.join('\n') + '\n');

  await fs.writeFile(path.join(ROOT, OUT_DIR, 'llm', 'llm_visual_dom_warnings.csv'), [
    ['page_id', 'path', 'viewport', 'severity', 'code', 'message', 'selector', 'part'].join(','),
    ...warnings.map((w) => [
      w.page_id || '',
      w.path || '',
      w.viewport || '',
      w.severity || 'warning',
      w.code || '',
      w.message || '',
      w.selector || '',
      w.part || ''
    ].map(csvEscape).join(','))
  ].join('\n') + '\n');

  const summaryPath = path.join(ROOT, OUT_DIR, 'run-summary.md');
  try {
    let s = await fs.readFile(summaryPath, 'utf8');
    s += `\n## DOM visual dissector\n\n- browser: firefox\n- pages: ${rows.length}\n- blocks_indexed: ${totalBlocks}\n- elements_indexed: ${totalElements}\n- dom_files_indexed: ${totalFiles}\n- dom_warnings: ${warnings.length}\n`;
    await fs.writeFile(summaryPath, s);
  } catch {}

  console.log(`VISUAL_DOM_OK pages=${rows.length} blocks=${totalBlocks} elements=${totalElements} files=${totalFiles} warnings=${warnings.length}`);
}

main().catch((err) => {
  console.error('VISUAL_DOM_FAIL');
  console.error(err);
  process.exit(0);
});
