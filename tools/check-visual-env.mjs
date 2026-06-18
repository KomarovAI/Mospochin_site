#!/usr/bin/env node
import fs from 'fs';
import { spawn } from 'child_process';
import { chromium } from 'playwright';

const SITE_ROOT = process.cwd();
const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  process.env.CHROMIUM_BIN,
  process.env.CHROME_BIN,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
].filter(Boolean);

function findExecutable() {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function waitForServer(url, timeoutMs = 8000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok || response.status === 404) return resolve();
      } catch {
        // Retry.
      }
      if (Date.now() - started > timeoutMs) return reject(new Error(`Timed out waiting for ${url}`));
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function stop(child) {
  if (!child || child.exitCode != null) return;
  child.kill('SIGTERM');
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (child.exitCode == null) child.kill('SIGKILL');
      resolve();
    }, 1000);
    child.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

const executablePath = findExecutable();
const launchOptions = {
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
};
if (executablePath) launchOptions.executablePath = executablePath;

const port = 9997;
const baseUrl = `http://127.0.0.1:${port}`;
let server;
let browser;
try {
  console.log('# visual-env');
  console.log(`node: ${process.version}`);
  console.log(`chromiumExecutable: ${executablePath || 'playwright-managed browser'}`);

  server = spawn('node', ['tools/dev-server.mjs'], {
    cwd: SITE_ROOT,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await waitForServer(`${baseUrl}/`);
  browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
  await page.goto(`${baseUrl}/parokonvektomaty.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  const title = await page.title();
  const h1 = (await page.locator('h1').first().textContent({ timeout: 5000 }))?.trim();
  console.log(`title: ${title}`);
  console.log(`h1: ${h1}`);
  console.log('✅ visual-env passed');
} catch (error) {
  const message = String(error?.message || error);
  console.error('❌ visual-env failed');
  console.error(message);
  if (message.includes('ERR_BLOCKED_BY_ADMINISTRATOR')) {
    console.error('Reason: Chromium exists, but this environment blocks navigation by managed browser policy. Use npm run setup:visual in an unrestricted environment, or a Playwright Docker/CI runner.');
  } else if (message.includes('Executable') || message.includes('browserType.launch')) {
    console.error('Reason: Playwright Chromium is not installed. Run npm run setup:visual or set PLAYWRIGHT_CHROMIUM_EXECUTABLE.');
  }
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  await stop(server);
}
