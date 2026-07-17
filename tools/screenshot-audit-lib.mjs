import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const AUDIT_MANIFEST_PATH = path.join(SITE_ROOT, 'data/screenshot-audit.json');
const VALID_BRANCHES = new Set(['household', 'restaurant', 'neutral']);
const VALID_PAGE_TYPES = new Set(['branch', 'service']);
const HOUSEHOLD_BRANCH_PAGES = new Set([
  'bytovaya-index.html',
  'bytovaya-uslugi.html',
  'bytovaya-about.html',
  'bytovaya-contact.html',
]);
const RESTAURANT_BRANCH_PAGES = new Set([
  'index.html',
  'uslugi.html',
  'about.html',
  'contact.html',
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getSiteRoot() {
  return SITE_ROOT;
}

export function getAuditManifestPath() {
  return AUDIT_MANIFEST_PATH;
}

export function resolveAuditManifestPath(manifestPath = AUDIT_MANIFEST_PATH) {
  return path.isAbsolute(manifestPath) ? manifestPath : path.join(SITE_ROOT, manifestPath);
}

export function loadAuditManifest(manifestPath = AUDIT_MANIFEST_PATH) {
  return readJson(resolveAuditManifestPath(manifestPath));
}

export function getPageMetadata() {
  return readJson(path.join(SITE_ROOT, 'data/page-metadata.json'));
}

export function getAuditContractSummary(manifestPath = AUDIT_MANIFEST_PATH) {
  const resolvedManifestPath = resolveAuditManifestPath(manifestPath);
  const manifestLabel =
    path.relative(SITE_ROOT, resolvedManifestPath) || path.basename(resolvedManifestPath);
  const manifest = loadAuditManifest(resolvedManifestPath);
  const metadata = getPageMetadata();
  const errors = [];

  if (!isPlainObject(manifest)) {
    errors.push(`${manifestLabel}: top-level object is required`);
    return { manifest: null, metadata, errors };
  }

  if (!Array.isArray(manifest.pages)) {
    errors.push(`${manifestLabel}: pages must be an array`);
  } else if (manifest.pages.length === 0 && manifest.status !== 'planned') {
    errors.push(`${manifestLabel}: pages must be non-empty unless status=planned`);
  }

  if (!Array.isArray(manifest.viewports) || manifest.viewports.length === 0) {
    errors.push(`${manifestLabel}: viewports must be a non-empty array`);
  }

  if (!isPlainObject(manifest.server)) {
    errors.push(`${manifestLabel}: server must be an object`);
  }

  if (!isPlainObject(manifest.waitStrategy)) {
    errors.push(`${manifestLabel}: waitStrategy must be an object`);
  }

  const seenPages = new Set();
  for (const [index, entry] of (manifest.pages ?? []).entries()) {
    const context = `${manifestLabel}: pages[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(`${context} must be an object`);
      continue;
    }

    if (typeof entry.page !== 'string' || !entry.page.endsWith('.html')) {
      errors.push(`${context}.page must be an html file name`);
      continue;
    }

    if (seenPages.has(entry.page)) {
      errors.push(`${context}.page duplicates ${entry.page}`);
    }
    seenPages.add(entry.page);

    if (!VALID_BRANCHES.has(entry.branch)) {
      errors.push(`${context}.branch must be one of ${Array.from(VALID_BRANCHES).join(', ')}`);
    }

    if (!VALID_PAGE_TYPES.has(entry.pageType)) {
      errors.push(`${context}.pageType must be one of ${Array.from(VALID_PAGE_TYPES).join(', ')}`);
    }

    if (typeof entry.fullPage !== 'boolean') {
      errors.push(`${context}.fullPage must be boolean`);
    }

    const metadataEntry = metadata.pages?.[entry.page];
    if (!metadataEntry) {
      errors.push(`${context}.page missing from data/page-metadata.json`);
      continue;
    }

    if (metadataEntry.branch !== entry.branch) {
      errors.push(`${context}.branch mismatch with data/page-metadata.json`);
    }

    const expectedPageType = inferPageType(entry.page, entry.branch);
    if (expectedPageType !== entry.pageType) {
      errors.push(
        `${context}.pageType mismatch with branch page mapping (expected ${expectedPageType})`
      );
    }

    const htmlPath = path.join(SITE_ROOT, entry.page);
    if (!fs.existsSync(htmlPath)) {
      errors.push(`${context}.page file is missing in repo`);
    }
  }

  const seenViewportIds = new Set();
  for (const [index, viewport] of (manifest.viewports ?? []).entries()) {
    const context = `${manifestLabel}: viewports[${index}]`;
    if (!isPlainObject(viewport)) {
      errors.push(`${context} must be an object`);
      continue;
    }

    if (typeof viewport.id !== 'string' || !viewport.id.trim()) {
      errors.push(`${context}.id must be a non-empty string`);
    } else if (seenViewportIds.has(viewport.id)) {
      errors.push(`${context}.id duplicates ${viewport.id}`);
    } else {
      seenViewportIds.add(viewport.id);
    }

    if (!isPositiveInteger(viewport.width)) errors.push(`${context}.width must be a positive integer`);
    if (!isPositiveInteger(viewport.height)) errors.push(`${context}.height must be a positive integer`);
    if (!isPositiveInteger(viewport.deviceScaleFactor)) {
      errors.push(`${context}.deviceScaleFactor must be a positive integer`);
    }
  }

  if (manifest.server) {
    if (typeof manifest.server.host !== 'string' || !manifest.server.host.trim()) {
      errors.push(`${manifestLabel}: server.host must be a non-empty string`);
    }
    if (!isPositiveInteger(manifest.server.port)) {
      errors.push(`${manifestLabel}: server.port must be a positive integer`);
    }
  }

  if (manifest.waitStrategy) {
    if (!isPositiveInteger(manifest.waitStrategy.networkIdleTimeoutMs)) {
      errors.push(`${manifestLabel}: waitStrategy.networkIdleTimeoutMs must be a positive integer`);
    }
    if (!isPositiveInteger(manifest.waitStrategy.postLoadDelayMs)) {
      errors.push(`${manifestLabel}: waitStrategy.postLoadDelayMs must be a positive integer`);
    }
  }

  if (typeof manifest.artifactRoot !== 'string' || !manifest.artifactRoot.trim()) {
    errors.push(`${manifestLabel}: artifactRoot must be a non-empty string`);
  }

  return { manifest, metadata, errors };
}

export function getDefaultArtifactDir(manifest) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(SITE_ROOT, manifest.artifactRoot, stamp);
}

function inferPageType(page, branch) {
  if (branch === 'household') {
    return HOUSEHOLD_BRANCH_PAGES.has(page) ? 'branch' : 'service';
  }

  if (branch === 'restaurant') {
    return RESTAURANT_BRANCH_PAGES.has(page) ? 'branch' : 'service';
  }

  if (branch === 'neutral') {
    return 'service';
  }

  return null;
}
