import fs from 'fs';
import net from 'net';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { chromium, errors as playwrightErrors } from 'playwright';
import {
  getAuditContractSummary,
  getDefaultArtifactDir,
  getSiteRoot,
} from './screenshot-audit-lib.mjs';

const SITE_ROOT = getSiteRoot();
const SCREENSHOT_TIMEOUT_MS = 20000;
const PAGE_LOAD_TIMEOUT_MS = 15000;
const CHUNK_HEIGHT_FALLBACK = 4000;
const AUDIT_DOM_SETTLE_MS = 250;

const SYSTEM_CHROMIUM_CANDIDATES = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  process.env.CHROMIUM_BIN,
  process.env.CHROME_BIN,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
].filter(Boolean);

function findExecutable(candidates) {
  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) return candidate;
    } catch {
      // Keep looking.
    }
  }
  return null;
}

function createChromiumLaunchOptions() {
  const explicitExecutable = findExecutable(SYSTEM_CHROMIUM_CANDIDATES);
  const args = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

  if (explicitExecutable) {
    return {
      executablePath: explicitExecutable,
      args,
    };
  }

  return { args };
}

function explainBrowserError(error) {
  const text = `${error?.message || error}`;
  if (text.includes('Executable doesn')) {
    return `${text}\n\nVisual audit cannot find a Playwright-managed Chromium browser. Run npm run setup:visual, or set PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium.`;
  }
  if (text.includes('ERR_BLOCKED_BY_ADMINISTRATOR')) {
    return `${text}\n\nVisual audit reached Chromium, but navigation was blocked by system/browser policy. Use npm run setup:visual in an unrestricted environment or run in the official Playwright Docker image.`;
  }
  return text;
}

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

function createViewportConfig(viewport) {
  return {
    viewport: {
      width: viewport.width,
      height: viewport.height,
    },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: Boolean(viewport.isMobile),
    hasTouch: Boolean(viewport.hasTouch),
  };
}

async function captureChunkedFullPage(page, screenshotPath) {
  const viewport = page.viewportSize();
  const height = await page.evaluate(() => {
    const body = document.body;
    const root = document.documentElement;
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      root.clientHeight,
      root.scrollHeight,
      root.offsetHeight
    );
  });
  const chunkHeight = Math.max(CHUNK_HEIGHT_FALLBACK, viewport?.height ?? 1000);
  const chunks = [];

  for (let top = 0; top < height; top += chunkHeight) {
    const remainingHeight = Math.min(chunkHeight, height - top);
    if (remainingHeight <= 0) break;

    const chunkPath = screenshotPath.replace(
      /\.png$/,
      `.part-${String(chunks.length + 1).padStart(2, '0')}.png`
    );
    await page.evaluate((scrollTop) => {
      window.scrollTo(0, scrollTop);
    }, top);
    await page.waitForTimeout(100);
    await page.screenshot({
      path: chunkPath,
      clip: {
        x: 0,
        y: 0,
        width: viewport?.width ?? 1280,
        height: remainingHeight,
      },
      animations: 'disabled',
      timeout: SCREENSHOT_TIMEOUT_MS,
    });
    chunks.push(chunkPath);
  }

  return chunks;
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

async function stabilizeAuditDom(page) {
  await page.evaluate(async () => {
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

    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(AUDIT_DOM_SETTLE_MS);
}

async function captureSingleViewport(manifest, artifactDir, baseUrl, pageEntry, viewport) {
  const browser = await chromium.launch(createChromiumLaunchOptions());
  const context = await browser.newContext(createViewportConfig(viewport));
  const page = await context.newPage();
  const pageUrl = `${baseUrl}/${pageEntry.page}`;
  const screenshotPath = path.join(
    artifactDir,
    `${pageEntry.page.replace(/\.html$/, '')}.${viewport.id}.png`
  );

  try {
    await preparePage(page, pageUrl, manifest);
    await stabilizeAuditDom(page);
    await page.screenshot({
      path: screenshotPath,
      fullPage: pageEntry.fullPage,
      animations: 'disabled',
      timeout: SCREENSHOT_TIMEOUT_MS,
    });

    return {
      page: pageEntry.page,
      viewport: viewport.id,
      file: path.relative(SITE_ROOT, screenshotPath),
      mode: pageEntry.fullPage ? 'full-page' : 'viewport',
    };
  } catch (error) {
    const isTimeout = error instanceof playwrightErrors.TimeoutError;
    if (!pageEntry.fullPage || !isTimeout) {
      throw new Error(explainBrowserError(error));
    }

    const chunkFiles = await captureChunkedFullPage(page, screenshotPath);
    return {
      page: pageEntry.page,
      viewport: viewport.id,
      file: chunkFiles.map((file) => path.relative(SITE_ROOT, file)).join(', '),
      mode: 'chunked-full-page',
    };
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

async function captureScreenshots(manifest, artifactDir, baseUrl) {
  fs.mkdirSync(artifactDir, { recursive: true });
  const created = [];

  for (const pageEntry of manifest.pages) {
    for (const viewport of manifest.viewports) {
      const result = await captureSingleViewport(
        manifest,
        artifactDir,
        baseUrl,
        pageEntry,
        viewport
      );
      created.push(result);
    }
  }

  return created;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = args.manifest ? String(args.manifest) : undefined;
  const { manifest, errors } = getAuditContractSummary(manifestPath);
  if (errors.length) {
    throw new Error(`Screenshot audit contract failed:\n- ${errors.join('\n- ')}`);
  }

  const artifactDir = args.output
    ? path.resolve(SITE_ROOT, String(args.output))
    : getDefaultArtifactDir(manifest);
  const result = await withDevServer(manifest, (baseUrl) =>
    captureScreenshots(manifest, artifactDir, baseUrl)
  );

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          pages: manifest.pages.map((entry) => entry.page),
          viewports: manifest.viewports.map((entry) => entry.id),
          artifactDir: path.relative(SITE_ROOT, artifactDir),
          screenshots: result,
        },
        null,
        2
      )
    );
  } else {
    console.log(
      `Screenshot audit complete: ${manifest.pages.length} pages x ${manifest.viewports.length} viewports`
    );
    console.log(`- artifacts: ${path.relative(SITE_ROOT, artifactDir)}`);
    manifest.pages.forEach((entry) => {
      console.log(`- page: ${entry.page} (${entry.branch}/${entry.pageType})`);
    });
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
