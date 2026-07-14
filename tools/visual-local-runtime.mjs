import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const DEFAULT_CANDIDATES = [
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
];

export function resolveSystemChromium() {
  const explicit = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || process.env.CHROMIUM_PATH;
  const candidates = [explicit, ...DEFAULT_CANDIDATES].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

export function getSystemChromiumLaunchOptions() {
  const executablePath = resolveSystemChromium();
  if (!executablePath) {
    throw new Error(
      'System Chromium was not found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE or CHROMIUM_PATH. ' +
      `Checked: ${DEFAULT_CANDIDATES.join(', ')}`
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

