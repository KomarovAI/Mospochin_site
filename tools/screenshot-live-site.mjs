#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { buildCapturePlan } from './visual-capture-plan.mjs';

const ROOT = process.cwd();

function safeName(value) {
  return String(value || 'item')
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90) || 'item';
}

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function firstVisibleLocator(page, selectors) {
  for (const selector of selectors || []) {
    const loc = page.locator(selector).first();
    try {
      if (await loc.count() > 0 && await loc.isVisible({ timeout: 800 })) {
        return { selector, locator: loc };
      }
    } catch {}
  }
  return null;
}

async function screenshotLocator(page, selectors, outFile, warnings, label) {
  const found = await firstVisibleLocator(page, selectors);
  if (!found) {
    warnings.push({ type: 'selector_miss', label, selectors: (selectors || []).join('|') });
    return null;
  }

  try {
    await found.locator.screenshot({ path: outFile, animations: 'disabled' });
    const box = await found.locator.boundingBox().catch(() => null);
    return { selector: found.selector, file: outFile, box };
  } catch (err) {
    warnings.push({ type: 'screenshot_fail', label, selector: found.selector, message: String(err?.message || err) });
    return null;
  }
}

async function collectBlocks(page, selectors, maxBlocks) {
  return await page.evaluate(({ selectors, maxBlocks }) => {
    const out = [];
    const seen = new Set();

    function textSample(el) {
      return (el.innerText || el.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);
    }

    for (const selector of selectors) {
      for (const el of document.querySelectorAll(selector)) {
        if (out.length >= maxBlocks) break;
        const rect = el.getBoundingClientRect();
        if (!rect || rect.width < 24 || rect.height < 16 || rect.width * rect.height < 384) continue;

        const key = [
          Math.round(rect.x),
          Math.round(rect.y + window.scrollY),
          Math.round(rect.width),
          Math.round(rect.height)
        ].join(':');

        if (seen.has(key)) continue;
        seen.add(key);

        out.push({
          block_index: out.length,
          selector,
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          class_name: typeof el.className === 'string' ? el.className.slice(0, 160) : '',
          role: el.getAttribute('role') || '',
          data_block: el.getAttribute('data-block') || '',
          x: Math.round(rect.x + window.scrollX),
          y: Math.round(rect.y + window.scrollY),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          text: textSample(el)
        });
      }
    }

    return out;
  }, { selectors: selectors || [], maxBlocks });
}

async function clickMenuIfPossible(page, config, warnings) {
  const btn = await firstVisibleLocator(page, config.selectors?.menuButtons || []);
  if (!btn) {
    warnings.push({ type: 'selector_miss', label: 'menu_button', selectors: (config.selectors?.menuButtons || []).join('|') });
    return false;
  }

  try {
    await btn.locator.click({ timeout: 1200 });
    await page.waitForTimeout(350);
    return true;
  } catch (err) {
    warnings.push({ type: 'menu_click_fail', selector: btn.selector, message: String(err?.message || err) });
    return false;
  }
}

async function main() {
  const { config, args, plan } = await buildCapturePlan(process.argv.slice(2));
  const outRoot = path.join(ROOT, config.outputDir || 'reports/live-visual-pack');

  await ensureDir(outRoot);
  await ensureDir(path.join(outRoot, 'llm'));
  await ensureDir(path.join(outRoot, 'pages'));

  const manifestRows = [];
  const blockRows = [];
  const warnings = [];
  const pageMdLinks = [];
  const criticalFailures = [];

  const browser = await chromium.launch({ headless: true });

  try {
    for (const row of plan.rows) {
      const pageDir = path.join(outRoot, 'pages', `${String(row.page_index).padStart(3, '0')}__${safeName(row.page_id)}`);
      await ensureDir(pageDir);

      const pageMd = [];
      pageMd.push(`# ${row.path}`);
      pageMd.push('');
      pageMd.push(`- class: ${row.class}`);
      pageMd.push(`- reason: ${row.reason}`);
      pageMd.push(`- depth: ${row.depth}`);
      pageMd.push(`- url: ${row.url}`);
      pageMd.push(`- parts: ${row.parts.join(', ')}`);
      pageMd.push('');

      for (const viewportName of row.viewports) {
        const viewport = config.viewports?.[viewportName];
        if (!viewport) continue;

        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.deviceScaleFactor || 1,
          isMobile: Boolean(viewport.isMobile),
          hasTouch: Boolean(viewport.hasTouch),
          ignoreHTTPSErrors: true
        });

        const page = await context.newPage();
        page.setDefaultTimeout(5000);

        const vpDir = path.join(pageDir, viewportName);
        await ensureDir(vpDir);

        let responseStatus = 0;
        let title = '';
        let h1 = '';
        let finalUrl = row.url;

        try {
          const resp = await page.goto(row.url, { waitUntil: 'networkidle', timeout: 30000 });
          responseStatus = resp?.status() || 0;
          finalUrl = page.url();

          if (row.critical && (responseStatus < 200 || responseStatus >= 400)) {
            criticalFailures.push(`${row.path}:${viewportName}:status=${responseStatus}`);
          }

          title = await page.title().catch(() => '');
          h1 = await page.locator('h1').first().innerText({ timeout: 1500 }).catch(() => '');

          if (row.parts.includes('full')) {
            const file = path.join(vpDir, 'page-full.png');
            await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
            manifestRows.push({
              page_id: row.page_id,
              path: row.path,
              viewport: viewportName,
              part: 'full',
              selector: '',
              file: path.relative(outRoot, file),
              status: 'ok',
              x: '', y: '', w: '', h: '',
              text: title || h1 || row.path
            });
          }

          if (row.parts.includes('top')) {
            const file = path.join(vpDir, 'top.png');
            await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
            manifestRows.push({
              page_id: row.page_id,
              path: row.path,
              viewport: viewportName,
              part: 'top',
              selector: '',
              file: path.relative(outRoot, file),
              status: 'ok',
              x: 0, y: 0, w: viewport.width, h: viewport.height,
              text: 'initial viewport'
            });
          }

          const partSelectors = {
            header: config.selectors?.header || [],
            footer: config.selectors?.footer || [],
            forms: config.selectors?.forms || [],
            contacts: config.selectors?.contacts || [],
            cta: config.selectors?.cta || []
          };

          for (const [part, selectors] of Object.entries(partSelectors)) {
            if (!row.parts.includes(part)) continue;
            const file = path.join(vpDir, `${part}.png`);
            const shot = await screenshotLocator(page, selectors, file, warnings, `${row.path}:${viewportName}:${part}`);
            if (shot) {
              manifestRows.push({
                page_id: row.page_id,
                path: row.path,
                viewport: viewportName,
                part,
                selector: shot.selector,
                file: path.relative(outRoot, file),
                status: 'ok',
                x: Math.round(shot.box?.x || 0),
                y: Math.round(shot.box?.y || 0),
                w: Math.round(shot.box?.width || 0),
                h: Math.round(shot.box?.height || 0),
                text: part
              });
            }
          }

          if (row.parts.includes('menu')) {
            const opened = await clickMenuIfPossible(page, config, warnings);
            if (opened) {
              const file = path.join(vpDir, 'menu-open.png');
              await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
              manifestRows.push({
                page_id: row.page_id,
                path: row.path,
                viewport: viewportName,
                part: 'menu-open',
                selector: 'menu button click',
                file: path.relative(outRoot, file),
                status: 'ok',
                x: 0, y: 0, w: viewport.width, h: viewport.height,
                text: 'menu opened viewport'
              });
            }
          }

          if (row.parts.includes('blocks')) {
            const blocks = await collectBlocks(page, config.selectors?.blocks || [], config.budgets?.maxBlocksPerPage || 80);
            for (const block of blocks) {
              blockRows.push({
                page_id: row.page_id,
                path: row.path,
                viewport: viewportName,
                block_id: `${row.page_id}_${viewportName}_b${String(block.block_index).padStart(3, '0')}`,
                selector: block.selector,
                tag: block.tag,
                data_block: block.data_block,
                role: block.role,
                x: block.x,
                y: block.y,
                w: block.w,
                h: block.h,
                text: block.text
              });
            }
          }

          pageMd.push(`## ${viewportName}`);
          pageMd.push('');
          pageMd.push(`- status: ${responseStatus}`);
          pageMd.push(`- final_url: ${finalUrl}`);
          pageMd.push(`- title: ${title}`);
          pageMd.push(`- h1: ${h1}`);
          pageMd.push('');
        } catch (err) {
          const msg = String(err?.message || err);
          warnings.push({ type: 'page_capture_fail', label: `${row.path}:${viewportName}`, message: msg });
          if (row.critical) criticalFailures.push(`${row.path}:${viewportName}:${msg}`);
        } finally {
          await context.close();
        }
      }

      const pageMdPath = path.join(pageDir, 'page.md');
      await fs.writeFile(pageMdPath, pageMd.join('\n') + '\n');
      pageMdLinks.push({ path: row.path, file: path.relative(outRoot, pageMdPath), class: row.class, reason: row.reason });
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(path.join(outRoot, 'manifest.csv'), [
    ['page_id', 'path', 'viewport', 'part', 'selector', 'file', 'status', 'x', 'y', 'w', 'h', 'text'].join(','),
    ...manifestRows.map((r) => [
      r.page_id, r.path, r.viewport, r.part, r.selector, r.file, r.status, r.x, r.y, r.w, r.h, r.text
    ].map(csvEscape).join(','))
  ].join('\n') + '\n');

  await fs.writeFile(path.join(outRoot, 'llm', 'llm_visual_blocks.csv'), [
    ['page_id', 'path', 'viewport', 'block_id', 'selector', 'tag', 'data_block', 'role', 'x', 'y', 'w', 'h', 'text'].join(','),
    ...blockRows.map((r) => [
      r.page_id, r.path, r.viewport, r.block_id, r.selector, r.tag, r.data_block, r.role, r.x, r.y, r.w, r.h, r.text
    ].map(csvEscape).join(','))
  ].join('\n') + '\n');

  await fs.writeFile(path.join(outRoot, 'llm', 'llm_visual_warnings.csv'), [
    ['type', 'label', 'selectors', 'selector', 'message'].join(','),
    ...warnings.map((w) => [
      w.type, w.label || '', w.selectors || '', w.selector || '', w.message || ''
    ].map(csvEscape).join(','))
  ].join('\n') + '\n');

  await fs.writeFile(path.join(outRoot, 'llm', 'llm_visual_pages.jsonl'),
    plan.rows.map((r) => JSON.stringify({
      page_id: r.page_id,
      path: r.path,
      url: r.url,
      class: r.class,
      reason: r.reason,
      depth: r.depth,
      viewports: r.viewports,
      parts: r.parts
    })).join('\n') + '\n'
  );

  const indexMd = [];
  indexMd.push('# MosPochin Live Visual Pack');
  indexMd.push('');
  indexMd.push(`Generated: ${new Date().toISOString()}`);
  indexMd.push(`Base URL: ${plan.base_url}`);
  indexMd.push(`Pages planned: ${plan.pages_planned}`);
  indexMd.push(`Screenshots/files indexed: ${manifestRows.length}`);
  indexMd.push(`Blocks indexed: ${blockRows.length}`);
  indexMd.push(`Warnings: ${warnings.length}`);
  indexMd.push('');
  indexMd.push('## Pages');
  indexMd.push('');
  for (const p of pageMdLinks) {
    indexMd.push(`- ${p.path} — ${p.class}, ${p.reason}, map: ${p.file}`);
  }
  await fs.writeFile(path.join(outRoot, 'llm_visual_index.md'), indexMd.join('\n') + '\n');

  const summary = [];
  summary.push('# Live Visual Pack Run Summary');
  summary.push('');
  summary.push(`- generated_at: ${new Date().toISOString()}`);
  summary.push(`- base_url: ${plan.base_url}`);
  summary.push(`- pages_planned: ${plan.pages_planned}`);
  summary.push(`- manifest_rows: ${manifestRows.length}`);
  summary.push(`- block_rows: ${blockRows.length}`);
  summary.push(`- warnings: ${warnings.length}`);
  summary.push(`- critical_failures: ${criticalFailures.length}`);
  summary.push('');
  summary.push('## Output');
  summary.push('');
  summary.push('- capture-plan.json');
  summary.push('- capture-plan.csv');
  summary.push('- manifest.csv');
  summary.push('- llm_visual_index.md');
  summary.push('- llm/llm_visual_pages.jsonl');
  summary.push('- llm/llm_visual_blocks.csv');
  summary.push('- llm/llm_visual_warnings.csv');
  await fs.writeFile(path.join(outRoot, 'run-summary.md'), summary.join('\n') + '\n');

  console.log(`LIVE_VISUAL_PACK_OK pages=${plan.pages_planned} manifest=${manifestRows.length} blocks=${blockRows.length} warnings=${warnings.length} critical_failures=${criticalFailures.length}`);

  if (args.failOnCritical && criticalFailures.length) {
    console.error('LIVE_VISUAL_PACK_CRITICAL_FAIL');
    for (const failure of criticalFailures) console.error(failure);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('LIVE_VISUAL_PACK_FAIL');
  console.error(err);
  process.exit(1);
});
