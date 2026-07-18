import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const DEFAULT_CANDIDATES = [
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
];

function resolvePlaywrightChromium() {
  try {
    const executable = chromium.executablePath();
    return executable && fs.existsSync(executable) ? executable : null;
  } catch {
    return null;
  }
}

export function resolveChromiumExecutable() {
  const explicit = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || process.env.CHROMIUM_PATH;
  const candidates = [explicit, ...DEFAULT_CANDIDATES, resolvePlaywrightChromium()].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

export function getChromiumLaunchOptions() {
  const executablePath = resolveChromiumExecutable();
  if (!executablePath) {
    throw new Error(
      'Chromium was not found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE or CHROMIUM_PATH, ' +
      'install a system Chromium, or run npm run setup:visual:github for the manual Playwright fallback. ' +
      `System paths checked: ${DEFAULT_CANDIDATES.join(', ')}`
    );
  }

  return {
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-first-run',
    ],
  };
}

export function getChromiumRuntimeSource(executablePath = resolveChromiumExecutable()) {
  if (!executablePath) return 'unavailable';
  return DEFAULT_CANDIDATES.includes(executablePath) ? 'system' : 'explicit-or-playwright';
}

// Compatibility exports for older cluster helpers. New code should use the
// generic Chromium names because the manual CI fallback is Playwright-managed.
export const resolveSystemChromium = resolveChromiumExecutable;
export const getSystemChromiumLaunchOptions = getChromiumLaunchOptions;

export const LOCAL_VISUAL_ORIGIN = 'http://mospochin.local';
export function probePillowStitcher() {
  const result = spawnSync('python3', ['-c', 'from PIL import Image; print(Image.__version__)'], {
    encoding: 'utf8',
  });
  return {
    available: result.status === 0,
    version: result.status === 0 ? String(result.stdout || '').trim() : null,
    error: result.status === 0 ? null : String(result.stderr || result.stdout || '').trim(),
  };
}
