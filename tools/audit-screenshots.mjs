import fs from 'fs';
import net from 'net';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { chromium, errors as playwrightErrors, firefox } from 'playwright';
import {
  getAuditContractSummary,
  getDefaultArtifactDir,
  getSiteRoot,
} from './screenshot-audit-lib.mjs';
import { getFirefoxLaunchOptions } from './visual-firefox-config.mjs';
import { getSystemChromiumLaunchOptions, LOCAL_VISUAL_ORIGIN } from './visual-local-runtime.mjs';

const SITE_ROOT = getSiteRoot();
const SCREENSHOT_TIMEOUT_MS = 20000;
const PAGE_LOAD_TIMEOUT_MS = 15000;
const CHUNK_HEIGHT_FALLBACK = 4000;
const AUDIT_DOM_SETTLE_MS = 250;
const LOCAL_CONTENT_ORIGIN = LOCAL_VISUAL_ORIGIN;

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function getBrowserConfig(browserName) {
  const normalized = String(browserName || 'firefox').toLowerCase();
  if (normalized === 'firefox') {
    return {
      name: 'firefox',
      type: firefox,
      launchOptions: getFirefoxLaunchOptions(),
    };
  }

  if (normalized === 'chromium') {
    return {
      name: 'chromium',
      type: chromium,
      launchOptions: getSystemChromiumLaunchOptions(),
    };
  }

  throw new Error(`Unsupported visual audit browser: ${browserName}`);
}

function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok || response.status === 404) {
          resolve();
          return;
        }
      } catch {
        // Retry until timeout.
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for dev server at ${url}`));
        return;
      }

      setTimeout(check, 250);
    };

    check();
  });
}

function canListen(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
  });
}

function getEphemeralPort(host) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close(() => {
        if (port) {
          resolve(port);
        } else {
          reject(new Error('Unable to allocate screenshot audit port'));
        }
      });
    });
  });
}

async function resolveAuditServerPort(host, preferredPort) {
  if (await canListen(host, preferredPort)) return preferredPort;
  return getEphemeralPort(host);
}

async function stopChildProcess(child) {
  if (child.exitCode != null) return;

  child.kill('SIGTERM');
  await new Promise((resolve) => {
    const forceStop = setTimeout(() => {
      if (child.exitCode == null) child.kill('SIGKILL');
      resolve();
    }, 1000);
    child.once('exit', () => {
      clearTimeout(forceStop);
      resolve();
    });
  });
}

async function withDevServer(manifest, callback) {
  const port = await resolveAuditServerPort(manifest.server.host, manifest.server.port);
  const baseUrl = `http://${manifest.server.host}:${port}`;
  const child = spawn('node', ['tools/dev-server.mjs'], {
    cwd: SITE_ROOT,
    env: {
      ...process.env,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverLog = '';
  child.stdout.on('data', (chunk) => {
    serverLog += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    serverLog += chunk.toString();
  });

  try {
    await waitForServer(`${baseUrl}/`, 10000);
    return await callback(baseUrl);
  } finally {
    await stopChildProcess(child);
    if (child.exitCode && child.exitCode !== 0 && child.signalCode == null) {
      throw new Error(`Dev server exited with code ${child.exitCode}\n${serverLog}`.trim());
    }
  }
}

function createViewportConfig(viewport, browserName) {
  const config = {
    viewport: {
      width: viewport.width,
      height: viewport.height,
    },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: Boolean(viewport.isMobile),
    hasTouch: Boolean(viewport.hasTouch),
  };

  // Firefox does not implement Playwright's isMobile context emulation.
  // The audit still exercises the mobile breakpoint through the viewport width.
  if (browserName === 'firefox') {
    delete config.isMobile;
    delete config.hasTouch;
  }

  return config;
}

function stitchViewportChunks(chunks, screenshotPath, documentHeight, viewportHeight) {
  const pythonScript = `
from PIL import Image
import json
import sys
out = sys.argv[1]
meta = json.loads(sys.argv[2])
chunks = meta['chunks']
images = [Image.open(item['path']).convert('RGB') for item in chunks]
if not images:
    raise RuntimeError('No viewport chunks supplied')
scale = images[0].height / float(meta['viewportHeight'])
width = max(img.width for img in images)
height = max(1, round(float(meta['documentHeight']) * scale))
canvas = Image.new('RGB', (width, height), 'white')
for item, img in zip(chunks, images):
    y = max(0, round(float(item['scrollY']) * scale))
    remaining = height - y
    if remaining <= 0:
        continue
    piece = img if img.height <= remaining else img.crop((0, 0, img.width, remaining))
    canvas.paste(piece, (0, y))
canvas.save(out, format='PNG', compress_level=1)
for img in images:
    img.close()
`;
  const metadata = JSON.stringify({
    documentHeight,
    viewportHeight,
    chunks,
  });
  const python = spawnSync('python3', ['-c', pythonScript, screenshotPath, metadata], {
    cwd: SITE_ROOT,
    encoding: 'utf8',
    timeout: 30000,
    killSignal: 'SIGKILL',
  });
  if (python.status !== 0 || !fs.existsSync(screenshotPath)) {
    const details = String(python.stderr || python.stdout || '').trim();
    throw new Error(`Unable to stitch viewport screenshot chunks for ${screenshotPath}${details ? `\n${details}` : ''}`);
  }
}

async function captureChunkedFullPage(page, screenshotPath) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Viewport is unavailable for chunked full-page capture');

  const dimensions = await page.evaluate(() => {
    const body = document.body;
    const root = document.documentElement;
    document.querySelectorAll('*').forEach((element) => {
      const position = window.getComputedStyle(element).position;
      if (position === 'fixed' || position === 'sticky') {
        element.setAttribute('data-visual-audit-fixed-surface', 'true');
      }
    });
    return {
      height: Math.max(body.scrollHeight, body.offsetHeight, root.clientHeight, root.scrollHeight, root.offsetHeight),
    };
  });

  const maxScroll = Math.max(0, dimensions.height - viewport.height);
  const requestedPositions = [];
  for (let top = 0; top < maxScroll; top += viewport.height) requestedPositions.push(top);
  if (!requestedPositions.length || requestedPositions.at(-1) !== maxScroll) requestedPositions.push(maxScroll);

  const chunks = [];
  const seenPositions = new Set();
  for (const requestedTop of requestedPositions) {
    const actualTop = await page.evaluate((scrollTop) => {
      window.scrollTo(0, scrollTop);
      const hidden = window.scrollY > 0;
      document.querySelectorAll('[data-visual-audit-fixed-surface="true"]').forEach((element) => {
        element.style.setProperty('visibility', hidden ? 'hidden' : 'visible', 'important');
      });
      return window.scrollY;
    }, requestedTop);
    await page.waitForTimeout(80);
    if (seenPositions.has(actualTop)) continue;
    seenPositions.add(actualTop);

    const chunkPath = screenshotPath.replace(
      /\.png$/,
      `.part-${String(chunks.length + 1).padStart(2, '0')}.png`
    );
    await page.screenshot({
      path: chunkPath,
      fullPage: false,
      animations: 'disabled',
      timeout: SCREENSHOT_TIMEOUT_MS,
    });
    chunks.push({ path: chunkPath, scrollY: actualTop });
  }

  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('[data-visual-audit-fixed-surface="true"]').forEach((element) => {
      element.style.removeProperty('visibility');
      element.removeAttribute('data-visual-audit-fixed-surface');
    });
  });

  if (!chunks.length) throw new Error(`No chunks created for ${screenshotPath}`);
  stitchViewportChunks(chunks, screenshotPath, dimensions.height, viewport.height);
  for (const chunk of chunks) fs.rmSync(chunk.path, { force: true });
  return screenshotPath;
}

async function preparePage(page, pageUrl, manifest) {
  page.setDefaultTimeout(PAGE_LOAD_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(PAGE_LOAD_TIMEOUT_MS);
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

  try {
    await page.waitForLoadState('networkidle', {
      timeout: manifest.waitStrategy.networkIdleTimeoutMs,
    });
  } catch {
    // Some pages keep connections open; preserve the audit pass.
  }

  await page.waitForTimeout(manifest.waitStrategy.postLoadDelayMs);
}

function getContentType(filePath) {
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
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.html': 'text/html; charset=utf-8',
  })[extension] || 'application/octet-stream';
}

function resolveLocalContentPath(requestUrl) {
  const url = new URL(requestUrl);
  if (url.origin !== LOCAL_CONTENT_ORIGIN) return null;

  const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
  const resolvedPath = path.resolve(SITE_ROOT, relativePath);
  const rootPrefix = `${path.resolve(SITE_ROOT)}${path.sep}`;
  if (resolvedPath !== path.resolve(SITE_ROOT) && !resolvedPath.startsWith(rootPrefix)) return null;
  return resolvedPath;
}

function patchVisualScript(source, pageName) {
  const pagePath = `/${pageName}`;
  const pageUrl = `${LOCAL_CONTENT_ORIGIN}${pagePath}`;
  return source
    .replaceAll('window.location.pathname', JSON.stringify(pagePath))
    .replaceAll('window.location.search', "''")
    .replaceAll('window.location.href', JSON.stringify(pageUrl))
    .replaceAll('window.location.origin', JSON.stringify(LOCAL_CONTENT_ORIGIN));
}

async function installLocalContentRouter(page, pageName) {
  await page.route('**/*', async (route) => {
    const requestUrl = route.request().url();
    const localPath = resolveLocalContentPath(requestUrl);
    if (!localPath || !fs.existsSync(localPath) || !fs.statSync(localPath).isFile()) {
      await route.abort('blockedbyclient');
      return;
    }

    let body = fs.readFileSync(localPath);
    if (/\.(?:m?js)$/i.test(localPath)) {
      body = Buffer.from(patchVisualScript(body.toString('utf8'), pageName), 'utf8');
    }

    await route.fulfill({
      status: 200,
      contentType: getContentType(localPath),
      body,
    });
  });
}

async function preparePageFromLocalContent(page, pageEntry, manifest) {
  page.setDefaultTimeout(PAGE_LOAD_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(PAGE_LOAD_TIMEOUT_MS);
  await installLocalContentRouter(page, pageEntry.page);

  const htmlPath = path.join(SITE_ROOT, pageEntry.page);
  let html = fs.readFileSync(htmlPath, 'utf8');
  const baseTag = `<base href="${LOCAL_CONTENT_ORIGIN}/">`;
  html = /<head(?:\s[^>]*)?>/i.test(html)
    ? html.replace(/<head(?:\s[^>]*)?>/i, (match) => `${match}${baseTag}`)
    : `${baseTag}${html}`;

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForLoadState('networkidle', {
      timeout: manifest.waitStrategy.networkIdleTimeoutMs,
    });
  } catch {
    // Local scripts can keep timers alive; continue after the manifest delay.
  }
  await page.waitForTimeout(manifest.waitStrategy.postLoadDelayMs);
}

async function stabilizeAuditDom(page, fullPage = false) {
  await page.evaluate(async (shouldScrollFullPage) => {
    // The page uses smooth scrolling for normal visitors. During a visual
    // audit it can leave the first screenshot at an intermediate scroll
    // position after the reveal pass, making the hero look clipped.
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const revealSelectors = [
      '.scroll-reveal',
      '.scroll-reveal-left',
      '.scroll-reveal-right',
      '.scroll-scale',
      '.heading-reveal',
      '.fade-in-section',
      '.counter',
      '.grid',
      '.space-y-4',
    ];

    const elements = document.querySelectorAll(revealSelectors.join(', '));
    elements.forEach((element) => {
      element.classList.add('is-visible', 'revealed');
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.filter = 'none';
      element.style.transition = 'none';
      element.style.animation = 'none';
    });

    if (shouldScrollFullPage) {
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      );

      const viewportHeight = window.innerHeight || 1000;
      const step = Math.max(Math.floor(viewportHeight * 0.8), 400);

      for (let top = 0; top < scrollHeight; top += step) {
        window.scrollTo(0, top);
        await new Promise((resolve) => window.setTimeout(resolve, 25));
        document.querySelectorAll(revealSelectors.join(', ')).forEach((element) => {
          element.classList.add('is-visible', 'revealed');
        });
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, fullPage);

  await page.waitForTimeout(AUDIT_DOM_SETTLE_MS);
}

async function closeWithTimeout(resource, timeoutMs = 1500) {
  if (!resource || typeof resource.close !== 'function') return;
  await Promise.race([
    resource.close().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

async function captureSingleViewport(
  manifest,
  artifactDir,
  baseUrl,
  pageEntry,
  viewport,
  browserConfig,
  localContent = false,
  sharedBrowser = null,
) {
  const browser = sharedBrowser || await browserConfig.type.launch(browserConfig.launchOptions);
  const context = await browser.newContext(
    createViewportConfig(viewport, browserConfig.name)
  );
  const page = await context.newPage();
  const pageUrl = baseUrl ? `${baseUrl}/${pageEntry.page}` : null;
  const screenshotPath = path.join(
    artifactDir,
    `${pageEntry.page.replace(/\.html$/, '')}.${viewport.id}.png`
  );

  try {
    if (localContent) {
      await preparePageFromLocalContent(page, pageEntry, manifest);
    } else {
      await preparePage(page, pageUrl, manifest);
    }
    await stabilizeAuditDom(page, pageEntry.fullPage);
    if (pageEntry.fullPage && viewport.width <= 767) {
      await page.evaluate(() => {
        const mobileFooter = document.querySelector('#mobile-footer-container');
        if (mobileFooter) {
          mobileFooter.setAttribute('data-visual-audit-hidden', 'true');
          mobileFooter.style.setProperty('display', 'none', 'important');
        }
      });
    }
    const useChunkedFullPage = pageEntry.fullPage && browserConfig.name === 'chromium' && viewport.width <= 767;
    if (useChunkedFullPage) {
      console.error(`Using chunked full-page capture for ${pageEntry.page} (${viewport.id})...`);
      await captureChunkedFullPage(page, screenshotPath);
    } else {
      await page.screenshot({
        path: screenshotPath,
        fullPage: pageEntry.fullPage,
        animations: 'disabled',
        timeout: SCREENSHOT_TIMEOUT_MS,
      });
    }

    return {
      page: pageEntry.page,
      viewport: viewport.id,
      file: path.relative(SITE_ROOT, screenshotPath),
      mode: useChunkedFullPage ? 'chunked-full-page' : pageEntry.fullPage ? 'full-page' : 'viewport',
    };
  } catch (error) {
    const isTimeout = error instanceof playwrightErrors.TimeoutError;
    const isFirefoxScreenshotLimit =
      browserConfig.name === 'firefox' &&
      /Cannot take screenshot larger than 32767/i.test(String(error?.message || ''));
    if (!pageEntry.fullPage || (!isTimeout && !isFirefoxScreenshotLimit)) {
      throw error;
    }

    const chunkFile = await captureChunkedFullPage(page, screenshotPath);
    return {
      page: pageEntry.page,
      viewport: viewport.id,
      file: path.relative(SITE_ROOT, chunkFile),
      mode: 'chunked-full-page',
    };
  } finally {
    await closeWithTimeout(page);
    await closeWithTimeout(context);
    if (!sharedBrowser) await closeWithTimeout(browser);
  }
}

async function captureScreenshots(
  manifest,
  artifactDir,
  baseUrl,
  browserConfig,
  localContent = false,
  browserPageBatchPlan = [1],
) {
  fs.mkdirSync(artifactDir, { recursive: true });
  const created = [];
  const batchPlan = Array.isArray(browserPageBatchPlan) && browserPageBatchPlan.length
    ? browserPageBatchPlan
    : [1];
  let start = 0;
  let batchIndex = 0;

  while (start < manifest.pages.length) {
    const configuredSize = batchPlan[Math.min(batchIndex, batchPlan.length - 1)];
    const pagesPerBrowser = Math.max(1, Number(configuredSize) || 1);
    const pageBatch = manifest.pages.slice(start, start + pagesPerBrowser);
    // A bounded browser batch avoids both failure modes seen in constrained
    // containers: too many sequential Chromium launches and renderer-state
    // accumulation in one long-lived process.
    const sharedBrowser = localContent
      ? await browserConfig.type.launch(browserConfig.launchOptions)
      : null;

    try {
      for (const pageEntry of pageBatch) {
        for (const viewport of manifest.viewports) {
          console.error(`Capturing ${pageEntry.page} (${viewport.id})...`);
          const result = await captureSingleViewport(
            manifest,
            artifactDir,
            baseUrl,
            pageEntry,
            viewport,
            browserConfig,
            localContent,
            sharedBrowser,
          );
          created.push(result);
        }
      }
    } finally {
      if (sharedBrowser) await closeWithTimeout(sharedBrowser);
    }

    start += pageBatch.length;
    batchIndex += 1;
  }

  return created;
}

function formatAuditFailure(error) {
  const message = String(error?.message || error);
  if (/\/proc\/self\/uid_map|Sandbox/i.test(message)) {
    return `${message}\nFirefox visual audit is blocked by the current container sandbox; run this profile in GitHub Actions, a Playwright runner, or a host with user namespaces enabled.`;
  }
  return message;
}

function parseBrowserPageBatchPlan(args, pageCount) {
  const rawPlan = args['browser-page-batches'] || process.env.AUDIT_BROWSER_PAGE_BATCHES;
  if (rawPlan) {
    const plan = String(rawPlan)
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((value) => Number.isInteger(value) && value > 0);
    if (!plan.length) throw new Error(`Invalid --browser-page-batches value: ${rawPlan}`);
    const result = [];
    let covered = 0;
    for (const size of plan) {
      if (covered >= pageCount) break;
      const bounded = Math.min(size, pageCount - covered);
      result.push(bounded);
      covered += bounded;
    }
    while (covered < pageCount) {
      result.push(1);
      covered += 1;
    }
    return result;
  }

  const uniformSize = Math.max(
    1,
    Number(args['browser-page-batch'] || process.env.AUDIT_BROWSER_PAGE_BATCH || 1) || 1,
  );
  const result = [];
  for (let covered = 0; covered < pageCount; covered += uniformSize) {
    result.push(Math.min(uniformSize, pageCount - covered));
  }
  return result;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = args.manifest ? String(args.manifest) : undefined;
  const { manifest, errors } = getAuditContractSummary(manifestPath);
  if (errors.length) {
    throw new Error(`Screenshot audit contract failed:\n- ${errors.join('\n- ')}`);
  }
  const browserConfig = getBrowserConfig(
    args.browser || process.env.AUDIT_BROWSER || manifest.browser || 'firefox'
  );

  const requestedPages = args.page
    ? String(args.page).split(',').map((item) => item.trim()).filter(Boolean)
    : null;
  let auditManifest = requestedPages
    ? {
        ...manifest,
        pages: requestedPages
          .map((pageName) => manifest.pages.find((entry) => entry.page === pageName))
          .filter(Boolean),
      }
    : manifest;
  if (args['viewport-only'] && args['full-page']) {
    throw new Error('--viewport-only and --full-page are mutually exclusive');
  }
  if (args['viewport-only']) {
    auditManifest = {
      ...auditManifest,
      pages: auditManifest.pages.map((entry) => ({ ...entry, fullPage: false })),
    };
  }
  if (args['full-page']) {
    auditManifest = {
      ...auditManifest,
      pages: auditManifest.pages.map((entry) => ({ ...entry, fullPage: true })),
    };
  }
  if (!auditManifest.pages.length) {
    throw new Error(`No screenshot audit pages matched: ${String(args.page)}`);
  }

  const artifactDir = args.output
    ? path.resolve(SITE_ROOT, String(args.output))
    : getDefaultArtifactDir(auditManifest);
  const localContent = Boolean(
    args['local-content'] || process.env.AUDIT_LOCAL_CONTENT === '1'
  );
  const browserPageBatchPlan = parseBrowserPageBatchPlan(args, auditManifest.pages.length);
  const result = localContent
    ? await captureScreenshots(
        auditManifest,
        artifactDir,
        null,
        browserConfig,
        true,
        browserPageBatchPlan,
      )
    : await withDevServer(auditManifest, (baseUrl) =>
        captureScreenshots(auditManifest, artifactDir, baseUrl, browserConfig, false, 1)
      );

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          pages: auditManifest.pages.map((entry) => entry.page),
          viewports: auditManifest.viewports.map((entry) => entry.id),
          artifactDir: path.relative(SITE_ROOT, artifactDir),
          browser: browserConfig.name,
          transport: localContent ? 'local-content' : 'dev-server',
          browserPageBatchPlan: localContent ? browserPageBatchPlan : [auditManifest.pages.length],
          screenshots: result,
        },
        null,
        2
      )
    );
  } else {
    console.log(
      `Screenshot audit complete: ${auditManifest.pages.length} pages x ${auditManifest.viewports.length} viewports`
    );
    console.log(`- browser: ${browserConfig.name}`);
    console.log(`- transport: ${localContent ? 'local-content' : 'dev-server'}`);
    if (localContent) console.log(`- browser page batches: ${browserPageBatchPlan.join('+')}`);
    console.log(`- artifacts: ${path.relative(SITE_ROOT, artifactDir)}`);
    auditManifest.pages.forEach((entry) => {
      console.log(`- page: ${entry.page} (${entry.branch}/${entry.pageType})`);
    });
  }
  process.exit(0);
} catch (error) {
  console.error(formatAuditFailure(error));
  process.exit(1);
}
