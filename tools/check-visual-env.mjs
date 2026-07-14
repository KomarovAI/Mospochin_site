#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { getSystemChromiumLaunchOptions, LOCAL_VISUAL_ORIGIN, probePillowStitcher, resolveSystemChromium } from './visual-local-runtime.mjs';

const ROOT = process.cwd();
const PAGE_NAME = process.env.VISUAL_ENV_PAGE || 'index.html';

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return ({
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.html': 'text/html; charset=utf-8',
  })[extension] || 'application/octet-stream';
}

function resolveLocalPath(requestUrl) {
  const url = new URL(requestUrl);
  if (url.origin !== LOCAL_VISUAL_ORIGIN) return null;
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || PAGE_NAME;
  const resolved = path.resolve(ROOT, relative);
  const rootPrefix = `${path.resolve(ROOT)}${path.sep}`;
  if (resolved !== path.resolve(ROOT) && !resolved.startsWith(rootPrefix)) return null;
  return resolved;
}

let browser;
let context;
let page;
let tempDir;
try {
  const executable = resolveSystemChromium();
  if (!executable) throw new Error('System Chromium not found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE or CHROMIUM_PATH.');
  const pillow = probePillowStitcher();
  if (!pillow.available) throw new Error(`Python Pillow full-page stitcher is unavailable: ${pillow.error || 'unknown error'}`);
  const htmlPath = path.join(ROOT, PAGE_NAME);
  if (!fs.existsSync(htmlPath)) throw new Error(`Visual environment probe page is missing: ${PAGE_NAME}`);

  console.log('# visual-env: local-native');
  console.log(`node: ${process.version}`);
  console.log(`chromiumExecutable: ${executable}`);
  console.log('transport: Playwright page.setContent + route.fulfill');
  console.log('network navigation: not required');
  console.log(`fullPageStitcher: Python Pillow ${pillow.version}`);

  browser = await chromium.launch(getSystemChromiumLaunchOptions());
  context = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  page = await context.newPage();
  await page.route('**/*', async (route) => {
    const localPath = resolveLocalPath(route.request().url());
    if (!localPath || !fs.existsSync(localPath) || !fs.statSync(localPath).isFile()) {
      await route.abort('blockedbyclient');
      return;
    }
    await route.fulfill({ status: 200, contentType: contentType(localPath), body: fs.readFileSync(localPath) });
  });

  let html = fs.readFileSync(htmlPath, 'utf8');
  const base = `<base href="${LOCAL_VISUAL_ORIGIN}/">`;
  html = /<head(?:\s[^>]*)?>/i.test(html)
    ? html.replace(/<head(?:\s[^>]*)?>/i, (match) => `${match}${base}`)
    : `${base}${html}`;
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(300);

  const title = await page.title();
  const h1 = (await page.locator('h1').first().textContent({ timeout: 5000 }))?.trim() || '';
  if (!title || !h1) throw new Error(`Probe page did not render expected content (title=${JSON.stringify(title)}, h1=${JSON.stringify(h1)})`);

  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mospochin-visual-env-'));
  const screenshotPath = path.join(tempDir, 'probe.png');
  await page.screenshot({ path: screenshotPath, fullPage: false, animations: 'disabled', timeout: 15000 });
  const signature = fs.readFileSync(screenshotPath).subarray(0, 8);
  if (!signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    throw new Error('Probe screenshot is not a valid PNG');
  }

  console.log(`title: ${title}`);
  console.log(`h1: ${h1}`);
  console.log('✅ visual-env passed: native local screenshots are available');
} catch (error) {
  console.error('❌ visual-env failed');
  console.error(String(error?.stack || error));
  console.error('Primary visual path requires the preinstalled system Chromium and local-content routing.');
  console.error('GitHub Actions is a manual fallback only; run the Visual Audit workflow with workflow_dispatch when local Chromium is genuinely unavailable.');
  process.exitCode = 1;
} finally {
  if (page) await page.close().catch(() => {});
  if (context) await context.close().catch(() => {});
  if (browser) await browser.close().catch(() => {});
  if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
}
