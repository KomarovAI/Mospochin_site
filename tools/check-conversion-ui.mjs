#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = 'data/cluster-registry.json';
const SITEMAP_PATH = path.join(SITE_ROOT, 'sitemap.xml');
const METADATA_PATH = 'data/page-metadata.json';

function readText(relativePath) {
  return fs.readFileSync(path.join(SITE_ROOT, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function normalizeLocalHtmlHref(href) {
  if (!href || href.startsWith('#')) return null;
  if (/^(tel:|mailto:|javascript:|data:)/i.test(href)) return null;
  let value = href.trim();
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!/^(www\.)?mospochin\.ru$/i.test(url.hostname)) return null;
      value = url.pathname;
    } catch {
      return null;
    }
  }
  value = value.split('#')[0].split('?')[0].replace(/^\/+/, '');
  if (!value || !value.endsWith('.html')) return null;
  return value;
}

function extractHrefs(html) {
  return Array.from(html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi), (match) => match[1]);
}

function hasMetaNoindex(html) {
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

function canonicalHref(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? null;
}

function metaDescription(html) {
  return html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? '';
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function conversionManifestEntries(registry) {
  return Object.entries(registry.clusters ?? {})
    .map(([cluster, config]) => ({ cluster, manifestPath: config.conversionManifest }))
    .filter((entry) => typeof entry.manifestPath === 'string' && entry.manifestPath.length > 0);
}

function validateManifest(manifest, metadata, manifestPath) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') errors.push(`${manifestPath}: conversion manifest must be an object`);
  if (!Array.isArray(manifest.pages) || !manifest.pages.length) errors.push(`${manifestPath}: pages must be a non-empty array`);
  if (!manifest.canonicalBase || typeof manifest.canonicalBase !== 'string') errors.push(`${manifestPath}: canonicalBase is required`);
  const seen = new Set();
  for (const [index, entry] of (manifest.pages ?? []).entries()) {
    const context = `${manifestPath} pages[${index}]`;
    if (!entry || typeof entry !== 'object') {
      errors.push(`${context} must be an object`);
      continue;
    }
    if (typeof entry.page !== 'string' || !entry.page.endsWith('.html')) errors.push(`${context}.page must be an HTML file`);
    if (seen.has(entry.page)) errors.push(`${context}.page duplicates ${entry.page}`);
    seen.add(entry.page);
    if (!fs.existsSync(path.join(SITE_ROOT, entry.page))) errors.push(`${entry.page}: root HTML file is missing`);
    const metadataEntry = metadata.pages?.[entry.page];
    if (!metadataEntry) errors.push(`${entry.page}: missing from data/page-metadata.json`);
    if (metadataEntry && entry.branch && metadataEntry.branch !== entry.branch) {
      errors.push(`${entry.page}: branch mismatch (${entry.branch} in manifest, ${metadataEntry.branch} in metadata)`);
    }
  }
  return errors;
}

function validatePage(entry, manifest, metadata, sitemap, clusterPages) {
  const errors = [];
  const warnings = [];
  const html = readText(entry.page);
  const text = stripTags(html);
  const defaults = manifest.defaults ?? {};
  const canonicalBase = manifest.canonicalBase.endsWith('/') ? manifest.canonicalBase : `${manifest.canonicalBase}/`;
  const expectedCanonical = `${canonicalBase}${entry.page}`;
  const indexable = Boolean(entry.indexable);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (defaults.requireSingleH1 && h1Count !== 1) errors.push(`${entry.page}: expected exactly 1 H1, found ${h1Count}`);
  const canonical = canonicalHref(html);
  if (canonical !== expectedCanonical) errors.push(`${entry.page}: canonical mismatch (${canonical ?? 'missing'} != ${expectedCanonical})`);
  const noindex = hasMetaNoindex(html);
  const sitemapUrl = `${canonicalBase}${entry.page}`;
  const inSitemap = sitemap.includes(sitemapUrl);
  if (indexable) {
    if (noindex) errors.push(`${entry.page}: indexable page has noindex`);
    if (!inSitemap) errors.push(`${entry.page}: indexable page is missing from sitemap.xml`);
  } else {
    if (!noindex) errors.push(`${entry.page}: non-indexable page must have noindex`);
    if (inSitemap) errors.push(`${entry.page}: non-indexable page must not be in sitemap.xml`);
  }
  const description = metaDescription(html);
  if (description && description.length > 170) warnings.push(`${entry.page}: description is ${description.length} chars`);
  const formCount = (html.match(/<form\b/gi) ?? []).length;
  const minForms = entry.minForms ?? defaults.minForms ?? 0;
  if (formCount < minForms) errors.push(`${entry.page}: expected at least ${minForms} form(s), found ${formCount}`);
  if (minForms > 0 && !/<form\b[^>]*class=["'][^"']*telegram-form/i.test(html)) errors.push(`${entry.page}: missing .telegram-form`);
  if (defaults.requireHiddenProblem && !/<input\b[^>]*type=["']hidden["'][^>]*name=["']problem["']/i.test(html)) errors.push(`${entry.page}: missing hidden problem input`);
  if (minForms > 0 && !/<input\b[^>]*name=["']phone["'][^>]*required/i.test(html) && !/<input\b[^>]*required[^>]*name=["']phone["']/i.test(html)) errors.push(`${entry.page}: missing required phone input`);
  if (minForms > 0 && !/<button\b[^>]*type=["']submit["']/i.test(html)) errors.push(`${entry.page}: missing submit button`);
  if (defaults.requirePhoneLink && !/href=["']tel:\+?\d+/i.test(html)) errors.push(`${entry.page}: missing tel: CTA link`);
  if (defaults.requireWhatsappLink && !/href=["']https?:\/\/wa\.me\/\d+/i.test(html)) errors.push(`${entry.page}: missing WhatsApp CTA link`);
  if (defaults.requireAnalytics && !/src=["']analytics\.js["']/i.test(html)) errors.push(`${entry.page}: missing analytics.js`);
  if (defaults.requireTelegramFormScript && !/src=["']telegram-form\.js["']/i.test(html)) errors.push(`${entry.page}: missing telegram-form.js`);
  if (defaults.requireMobileContactContainers) {
    if (!/id=["']mobile-footer-container["']/i.test(html)) errors.push(`${entry.page}: missing #mobile-footer-container`);
    if (!/id=["']whatsapp-float-container["']/i.test(html)) errors.push(`${entry.page}: missing #whatsapp-float-container`);
    if (!/src=["']partials-injector\.js["']/i.test(html)) errors.push(`${entry.page}: missing partials-injector.js`);
  }
  if (defaults.requireFaqSchema && !/"@type"\s*:\s*"FAQPage"/i.test(html)) errors.push(`${entry.page}: missing FAQPage schema`);
  const localHtmlLinks = extractHrefs(html).map(normalizeLocalHtmlHref).filter(Boolean);
  const broken = [...new Set(localHtmlLinks.filter((href) => !fs.existsSync(path.join(SITE_ROOT, href))))];
  if (broken.length) errors.push(`${entry.page}: broken local HTML links: ${broken.join(', ')}`);
  if (localHtmlLinks.includes(entry.page)) errors.push(`${entry.page}: self-link detected`);
  const clusterLinks = [...new Set(localHtmlLinks.filter((href) => clusterPages.has(href) && href !== entry.page))];
  const minClusterLinks = entry.minClusterLinks ?? defaults.minClusterLinks ?? 0;
  if (clusterLinks.length < minClusterLinks) errors.push(`${entry.page}: expected at least ${minClusterLinks} cluster links, found ${clusterLinks.length}`);
  const metadataEntry = metadata.pages?.[entry.page];
  if (metadataEntry?.canonical && metadataEntry.canonical !== expectedCanonical) errors.push(`${entry.page}: metadata canonical mismatch (${metadataEntry.canonical} != ${expectedCanonical})`);
  return { page: entry.page, intent: entry.intent, indexable, h1Count, forms: formCount, clusterLinks: clusterLinks.length, words: text ? text.split(/\s+/).length : 0, errors, warnings };
}

try {
  const registry = readJson(REGISTRY_PATH);
  const metadata = readJson(METADATA_PATH);
  const sitemap = fs.existsSync(SITEMAP_PATH) ? fs.readFileSync(SITEMAP_PATH, 'utf8') : '';
  const manifestEntries = conversionManifestEntries(registry);
  if (!manifestEntries.length) throw new Error('No conversionManifest entries found in data/cluster-registry.json');
  const allErrors = [];
  const allWarnings = [];
  const summaries = [];
  for (const { cluster, manifestPath } of manifestEntries) {
    const manifest = readJson(manifestPath);
    allErrors.push(...validateManifest(manifest, metadata, manifestPath));
    const clusterPages = new Set((manifest.pages ?? []).map((entry) => entry.page));
    const pageResults = (manifest.pages ?? []).filter((entry) => fs.existsSync(path.join(SITE_ROOT, entry.page))).map((entry) => validatePage(entry, manifest, metadata, sitemap, clusterPages));
    allErrors.push(...pageResults.flatMap((result) => result.errors));
    allWarnings.push(...pageResults.flatMap((result) => result.warnings));
    summaries.push({ cluster, manifestPath, pageResults });
  }
  if (allErrors.length) {
    console.error('❌ Conversion UI check failed:');
    allErrors.forEach((error) => console.error(`- ${error}`));
    if (allWarnings.length) {
      console.error('\nWarnings:');
      allWarnings.forEach((warning) => console.error(`- ${warning}`));
    }
    process.exit(1);
  }
  const count = summaries.reduce((sum, item) => sum + item.pageResults.length, 0);
  console.log(`✅ Conversion UI check passed: ${count} pages across ${summaries.length} clusters`);
  for (const summary of summaries) {
    console.log(`\n[${summary.cluster}] ${summary.manifestPath}`);
    for (const result of summary.pageResults) {
      console.log(`- ${result.page}: forms=${result.forms}, clusterLinks=${result.clusterLinks}, ${result.indexable ? 'indexable' : 'noindex'}`);
    }
  }
  if (allWarnings.length) {
    console.log('\nWarnings:');
    allWarnings.forEach((warning) => console.log(`- ${warning}`));
  }
} catch (error) {
  console.error(`❌ Conversion UI check failed: ${error.message}`);
  process.exit(1);
}
