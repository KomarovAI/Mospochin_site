#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const BASE_URL = process.env.MOSPOCHIN_SCREENSHOT_BASE_URL || 'https://mospochin.ru';
const SHARD = String(process.env.MOSPOCHIN_VISUAL_SHARD || '0');
const TASKS = JSON.parse(process.env.MOSPOCHIN_VISUAL_TASKS || '[]');
const OUT_ROOT = path.join(ROOT, 'reports', 'live-visual-shards', `shard-${SHARD}`);
const LLM_DIR = path.join(OUT_ROOT, 'llm');

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

function urlFor(pagePath) {
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

async function appendFile(file, text) {
  await ensureDir(path.dirname(file));
  await fs.appendFile(file, text);
}

function rel(file) {
  return path.relative(OUT_ROOT, file).replaceAll(path.sep, '/');
}

async function screenshotLocator(page, selector, outFile, warnings, meta) {
  try {
    const locator = page.locator(selector).first();
    if (await locator.count() < 1) return '';
    await locator.screenshot({ path: outFile, animations: 'disabled', timeout: 2500 });
    return rel(outFile);
  } catch (err) {
    warnings.push({ ...meta, code: 'locator_shot_failed', message: String(err?.message || err).slice(0, 180) });
    return '';
  }
}

async function collectDom(page, pageNo, maxBlocks, maxElements) {
  return await page.evaluate(({ pageNo, maxBlocks, maxElements }) => {
    const blockSelectors = ['header', 'nav', 'main', 'section', 'footer', 'form', '[data-block]', '[data-section]', '.hero', '.cta', '.lead-form', '.service-card', '.problem-card', '.faq', '.contacts'];
    const elementSelectors = ['h1', 'h2', 'h3', 'a[href]', 'button', 'input', 'textarea', 'select', 'img', 'picture', 'a[href^="tel:"]', 'a[href*="wa.me"]', 'a[href*="t.me"]'];

    function textOf(el) {
      return (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('alt') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 220);
    }

    function boxOf(el) {
      const r = el.getBoundingClientRect();
      const st = window.getComputedStyle(el);
      if (!r || r.width < 24 || r.height < 16 || r.width * r.height < 384) return null;
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return null;
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        doc_x: Math.round(r.x + scrollX),
        doc_y: Math.round(r.y + scrollY),
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    }

    function kindOf(el) {
      const tag = el.tagName.toLowerCase();
      const href = el.getAttribute('href') || '';
      const cls = String(el.className || '').toLowerCase();
      if (tag === 'header') return 'header';
      if (tag === 'nav') return 'nav';
      if (tag === 'footer') return 'footer';
      if (tag === 'form') return 'form';
      if (/^h[1-6]$/.test(tag)) return 'heading';
      if (tag === 'button') return 'button';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'form_field';
      if (href.startsWith('tel:')) return 'phone_link';
      if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp_link';
      if (href.includes('t.me') || href.includes('telegram')) return 'telegram_link';
      if (tag === 'a') return 'link';
      if (tag === 'img' || tag === 'picture') return 'image';
      if (cls.includes('hero')) return 'hero';
      if (cls.includes('cta')) return 'cta';
      if (cls.includes('card')) return 'card';
      return tag;
    }

    function collect(selectors, limit, prefix) {
      const out = [];
      const seen = new Set();

      for (const selector of selectors) {
        for (const el of document.querySelectorAll(selector)) {
          if (out.length >= limit) break;
          const bbox = boxOf(el);
          if (!bbox) continue;

          const key = [Math.round(bbox.doc_x / 8), Math.round(bbox.doc_y / 8), Math.round(bbox.width / 8), Math.round(bbox.height / 8)].join(':');
          if (seen.has(key)) continue;
          seen.add(key);

          const kind = kindOf(el);
          const id = `${pageNo}-${prefix}${String(out.length).padStart(3, '0')}-${kind}`;
          el.setAttribute('data-visual-pack-id', id);

          out.push({
            id,
            kind,
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            href: el.getAttribute('href') || '',
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
      let area = Infinity;
      for (const b of blocks) {
        const inside =
          e.bbox.doc_x >= b.bbox.doc_x &&
          e.bbox.doc_y >= b.bbox.doc_y &&
          e.bbox.doc_x + e.bbox.width <= b.bbox.doc_x + b.bbox.width + 4 &&
          e.bbox.doc_y + e.bbox.height <= b.bbox.doc_y + b.bbox.height + 4;
        const a = b.bbox.width * b.bbox.height;
        if (inside && a < area) {
          parent = b.id;
          area = a;
        }
      }
      e.parent_block = parent;
    }

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.zIndex = '2147483647';
    overlay.style.pointerEvents = 'none';
    document.documentElement.appendChild(overlay);

    function addBox(item, color) {
      const d = document.createElement('div');
      d.style.position = 'absolute';
      d.style.left = `${item.bbox.doc_x}px`;
      d.style.top = `${item.bbox.doc_y}px`;
      d.style.width = `${item.bbox.width}px`;
      d.style.height = `${item.bbox.height}px`;
      d.style.border = `2px solid ${color}`;
      d.style.boxSizing = 'border-box';
      const l = document.createElement('div');
      l.textContent = `${item.id} ${item.kind}`;
      l.style.background = color;
      l.style.color = '#fff';
      l.style.font = '12px Arial';
      l.style.padding = '2px 4px';
      d.appendChild(l);
      overlay.appendChild(d);
    }

    for (const b of blocks.slice(0, 80)) addBox(b, '#e00000');
    for (const e of elements.slice(0, 120)) addBox(e, '#0057ff');

    return {
      title: document.title || '',
      h1: (document.querySelector('h1')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 220),
      blocks,
      elements
    };
  }, { pageNo, maxBlocks, maxElements });
}

async function main() {
  await ensureDir(OUT_ROOT);
  await ensureDir(LLM_DIR);

  await fs.writeFile(path.join(OUT_ROOT, 'capture-plan.csv'), 'page_index,page_id,path,url,class,reason,depth,critical,viewports,parts,status\n');
  await fs.writeFile(path.join(OUT_ROOT, 'manifest.csv'), 'page_id,path,viewport,part,selector,file,status,x,y,w,h,text\n');
  await fs.writeFile(path.join(LLM_DIR, 'llm_visual_blocks.csv'), 'page_id,path,class,viewport,block_id,kind,role,text_sample,screenshot,parent_id,x,y,width,height\n');
  await fs.writeFile(path.join(LLM_DIR, 'llm_visual_elements.csv'), 'page_id,path,class,viewport,element_id,parent_block,tag,kind,text,href,screenshot,x,y,width,height\n');
  await fs.writeFile(path.join(LLM_DIR, 'llm_visual_files.csv'), 'page_id,path,viewport,kind,file\n');
  await fs.writeFile(path.join(LLM_DIR, 'llm_visual_warnings.csv'), 'type,label,message\n');
  await fs.writeFile(path.join(LLM_DIR, 'llm_visual_dom_warnings.csv'), 'page_id,path,viewport,severity,code,message,selector,part\n');

  const chromePath = findChrome();
  if (!chromePath) throw new Error('No system Chrome found');

  const playwright = await import('playwright');
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const warnings = [];
  const planRows = [];

  try {
    for (const task of TASKS) {
      const vp = VIEWPORTS[task.viewport];
      if (!vp) continue;

      const pageKey = safeName(task.path === '/' ? 'index' : task.path.replace(/^\//, '').replace(/\.html$/, ''));
      const pageId = task.mode === 'atomic' ? 'p999' : `p${String(task.page_index).padStart(3, '0')}`;
      const pageDirName = task.mode === 'atomic'
        ? path.join('pages', 'atomic', `999__${pageKey}`)
        : path.join('pages', `${String(task.page_index).padStart(3, '0')}__${pageKey}`);

      const pageDir = path.join(OUT_ROOT, pageDirName);
      const vpDir = path.join(pageDir, task.viewport);
      const blocksDir = path.join(vpDir, 'blocks');
      const elementsDir = path.join(vpDir, 'elements');

      await ensureDir(blocksDir);
      await ensureDir(elementsDir);

      const url = urlFor(task.path);

      planRows.push({
        page_index: task.page_index,
        page_id: pageKey,
        path: task.path,
        url,
        class: task.class,
        reason: task.reason,
        depth: task.depth,
        critical: true,
        viewport: task.viewport
      });

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: Boolean(vp.isMobile),
        hasTouch: Boolean(vp.hasTouch),
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true
      });

      const page = await context.newPage();
      page.setDefaultTimeout(6000);

      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(task.mode === 'atomic' ? 900 : 500);

        const viewportShot = path.join(vpDir, 'viewport.png');
        await page.screenshot({ path: viewportShot, fullPage: false, animations: 'disabled', timeout: 10000 });

        const fullShot = path.join(vpDir, task.mode === 'atomic' ? 'page-full.png' : 'page-full-numbered.png');
        const dom = await collectDom(
          page,
          pageId,
          task.mode === 'atomic' ? 120 : 42,
          task.mode === 'atomic' ? 260 : 64
        );

        await page.screenshot({ path: fullShot, fullPage: true, animations: 'disabled', timeout: 12000 });

        await appendFile(path.join(OUT_ROOT, 'manifest.csv'), [
          pageId, task.path, task.viewport, 'viewport', '', rel(viewportShot), 'ok', 0, 0, vp.width, vp.height, `http_${resp?.status() || 0}`
        ].map(csvEscape).join(',') + '\n');

        await appendFile(path.join(LLM_DIR, 'llm_visual_files.csv'), [
          pageId, task.path, task.viewport, 'viewport', rel(viewportShot)
        ].map(csvEscape).join(',') + '\n');

        await appendFile(path.join(LLM_DIR, 'llm_visual_files.csv'), [
          pageId, task.path, task.viewport, task.mode === 'atomic' ? 'atomic-full' : 'numbered-map', rel(fullShot)
        ].map(csvEscape).join(',') + '\n');

        let blockShots = 0;
        for (const b of dom.blocks.slice(0, task.mode === 'atomic' ? 48 : 6)) {
          const shot = path.join(blocksDir, `${safeName(b.id)}.png`);
          b.screenshot = await screenshotLocator(page, `[data-visual-pack-id="${b.id}"]`, shot, warnings, {
            page_id: pageId, path: task.path, viewport: task.viewport, selector: b.id, part: 'block'
          });
          if (b.screenshot) {
            blockShots++;
            await appendFile(path.join(LLM_DIR, 'llm_visual_files.csv'), [pageId, task.path, task.viewport, 'block', b.screenshot].map(csvEscape).join(',') + '\n');
          }
        }

        let elementShots = 0;
        for (const e of dom.elements.slice(0, task.mode === 'atomic' ? 96 : 8)) {
          const shot = path.join(elementsDir, `${safeName(e.id)}.png`);
          e.screenshot = await screenshotLocator(page, `[data-visual-pack-id="${e.id}"]`, shot, warnings, {
            page_id: pageId, path: task.path, viewport: task.viewport, selector: e.id, part: 'element'
          });
          if (e.screenshot) {
            elementShots++;
            await appendFile(path.join(LLM_DIR, 'llm_visual_files.csv'), [pageId, task.path, task.viewport, 'element', e.screenshot].map(csvEscape).join(',') + '\n');
          }
        }

        for (const b of dom.blocks) {
          await appendFile(path.join(LLM_DIR, 'llm_visual_blocks.csv'), [
            pageId, task.path, task.class, task.viewport, b.id, b.kind, b.role, b.text_sample, b.screenshot || '', '', b.bbox.doc_x, b.bbox.doc_y, b.bbox.width, b.bbox.height
          ].map(csvEscape).join(',') + '\n');
        }

        for (const e of dom.elements) {
          await appendFile(path.join(LLM_DIR, 'llm_visual_elements.csv'), [
            pageId, task.path, task.class, task.viewport, e.id, e.parent_block || '', e.tag, e.kind, e.text_sample, e.href, e.screenshot || '', e.bbox.doc_x, e.bbox.doc_y, e.bbox.width, e.bbox.height
          ].map(csvEscape).join(',') + '\n');
        }

        const pageMapFile = path.join(pageDir, 'dom-map.json');
        let domMap = {};
        try {
          domMap = JSON.parse(await fs.readFile(pageMapFile, 'utf8'));
        } catch {
          domMap = {
            page_id: pageId,
            page_key: pageKey,
            path: task.path,
            url,
            class: task.class,
            depth: task.depth,
            reason: task.reason,
            generated_at: new Date().toISOString(),
            viewports: {}
          };
        }

        domMap.viewports[task.viewport] = {
          status: resp?.status() || 0,
          title: dom.title,
          h1: dom.h1,
          viewport: rel(viewportShot),
          numbered: rel(fullShot),
          blocks: dom.blocks,
          elements: dom.elements,
          block_screenshots: blockShots,
          element_screenshots: elementShots
        };

        await fs.writeFile(pageMapFile, JSON.stringify(domMap, null, 2));

        await fs.writeFile(path.join(pageDir, 'page.md'), [
          `# ${pageId} ${task.path}`,
          '',
          `- class: ${task.class}`,
          `- depth: ${task.depth}`,
          `- reason: ${task.reason}`,
          `- url: ${url}`,
          '',
          '## Files',
          '',
          '- dom-map.json',
          '- desktop/viewport.png',
          '- desktop/page-full-numbered.png',
          '- mobile/viewport.png',
          '- mobile/page-full-numbered.png',
          '- blocks/',
          '- elements/',
          ''
        ].join('\n'));

        if (task.mode === 'atomic') {
          await fs.writeFile(path.join(LLM_DIR, 'llm_visual_atomic_pages.jsonl'), JSON.stringify({
            page_id: pageId,
            page_key: pageKey,
            path: task.path,
            url,
            class: task.class,
            depth: task.depth,
            reason: task.reason,
            dom_map: rel(pageMapFile),
            page_md: rel(path.join(pageDir, 'page.md')),
            viewport: task.viewport
          }) + '\n', { flag: 'a' });
        }

        console.log(`VISUAL_SHARD_TASK_OK shard=${SHARD} ${task.path} ${task.viewport} blocks=${dom.blocks.length} elements=${dom.elements.length}`);
      } catch (err) {
        warnings.push({
          page_id: pageId,
          path: task.path,
          viewport: task.viewport,
          severity: 'warning',
          code: 'task_failed',
          message: String(err?.message || err).slice(0, 220),
          selector: '',
          part: 'shard'
        });
        console.log(`VISUAL_SHARD_TASK_WARN shard=${SHARD} ${task.path} ${task.viewport}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  for (const r of planRows) {
    await appendFile(path.join(OUT_ROOT, 'capture-plan.csv'), [
      r.page_index, r.page_id, r.path, r.url, r.class, r.reason, r.depth, r.critical ? 'yes' : 'no', r.viewport, 'parallel-shard', 'done'
    ].map(csvEscape).join(',') + '\n');
  }

  for (const w of warnings) {
    await appendFile(path.join(LLM_DIR, 'llm_visual_dom_warnings.csv'), [
      w.page_id || '', w.path || '', w.viewport || '', w.severity || 'warning', w.code || '', w.message || '', w.selector || '', w.part || ''
    ].map(csvEscape).join(',') + '\n');
  }

  await fs.writeFile(path.join(OUT_ROOT, 'shard-summary.json'), JSON.stringify({
    shard: SHARD,
    tasks: TASKS.length,
    warnings: warnings.length,
    generated_at: new Date().toISOString()
  }, null, 2));

  console.log(`VISUAL_SHARD_OK shard=${SHARD} tasks=${TASKS.length} warnings=${warnings.length}`);
}

main().catch((err) => {
  console.error('VISUAL_SHARD_FAIL');
  console.error(err);
  process.exit(0);
});
