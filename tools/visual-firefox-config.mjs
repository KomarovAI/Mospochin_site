import fs from 'node:fs';

const FIREFOX_PREFS = {
  'browser.shell.checkDefaultBrowser': false,
  'browser.startup.page': 0,
  'browser.startup.homepage': 'about:blank',
  'toolkit.cosmeticAnimations.enabled': false,
};

function resolveFirefoxExecutable() {
  const candidates = [
    process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE,
    process.env.FIREFOX_BIN,
    '/usr/bin/firefox',
    '/usr/bin/firefox-esr',
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate)) || undefined;
}

/**
 * Launch contract for the explicit Firefox-only legacy/fallback tools.
 * The primary project visual runtime is Chromium; see visual-local-runtime.mjs.
 */
export function getFirefoxLaunchOptions({ headless = true } = {}) {
  const executablePath = resolveFirefoxExecutable();
  const options = {
    headless,
    timeout: 15000,
    firefoxUserPrefs: { ...FIREFOX_PREFS },
  };

  if (executablePath) options.executablePath = executablePath;

  // Firefox/fontconfig must have a writable cache in CI and restricted
  // runners. Keep this outside the repository so browser binaries never end
  // up in the project archive.
  if (process.platform === 'linux') {
    const cacheHome = process.env.XDG_CACHE_HOME || '/tmp/mospochin-firefox-cache';
    fs.mkdirSync(cacheHome, { recursive: true });
    options.env = {
      ...process.env,
      XDG_CACHE_HOME: cacheHome,
    };
  }

  return options;
}

export function getFirefoxExecutable() {
  return resolveFirefoxExecutable();
}

export function getFirefoxContextOptions(viewport = {}) {
  const { isMobile: _isMobile, hasTouch: _hasTouch, ...supported } = viewport;
  return supported;
}
