import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const RESTAURANT_POLICY_PATH = path.join(SITE_ROOT, 'data/restaurant-page-policy.json');
const RESTAURANT_SERVICES_PATH = path.join(SITE_ROOT, 'data/restaurant-services.json');
const RESTAURANT_SLOTS_PATH = path.join(SITE_ROOT, 'data/restaurant-page-slots.json');
const RESTAURANT_PROOF_PATH = path.join(SITE_ROOT, 'data/restaurant-proof-layer.json');
const RESTAURANT_TAXONOMY_PATH = path.join(SITE_ROOT, 'data/restaurant-taxonomy.json');
const RESTAURANT_POLICY_SYNC_HINT = 'Run npm run restaurant:sync-fallbacks after slot changes';
const HOUSEHOLD_DOCTOR_PATH = path.join(SITE_ROOT, 'tools/doctor-household-page.mjs');

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getPageFromArgs(args) {
  if (args.page && args.page !== true) return String(args.page);
  if (args.slug && args.slug !== true) return `${args.slug}.html`;
  throw new Error('Pass --page <file.html> or --slug <slug>');
}

function countNamedFields(html, fieldName) {
  return (html.match(new RegExp(`name="${fieldName}"`, 'g')) || []).length;
}

function hasSlotAnchor(html, anchor) {
  return html.includes(`data-slot="${anchor}"`);
}

function getBodyClasses(html) {
  const className = html.match(/<body[^>]+class="([^"]*)"/i)?.[1] ?? '';
  return new Set(className.split(/\s+/).filter(Boolean));
}

function getExpectedPageClass(page) {
  return `page-${page.replace(/\.html$/, '')}`;
}

function passthroughHouseholdDoctor(page, asJson) {
  const args = [HOUSEHOLD_DOCTOR_PATH, '--page', page];
  if (asJson) args.push('--json');
  const result = spawnSync('node', args, {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const message = result.stderr?.trim() || result.stdout?.trim() || 'Household doctor failed';
    throw new Error(message);
  }

  if (asJson) {
    return JSON.parse(result.stdout);
  }

  process.stdout.write(result.stdout);
  process.exit(0);
}

function getRecommendedEditSurface({ page, pageType, registryEntry }) {
  if (pageType === 'restaurant-branch-page') {
    return {
      branchShell: 'Edit data/restaurant-branch.json for shared branch shell, nav, and route strips',
      metadata: 'Edit data/page-metadata.json for SEO/canonical metadata',
      html: `Edit ${page} only for unique layout or long-form narrative`,
    };
  }

  if (pageType === 'restaurant-service-page' && registryEntry) {
    return {
      slots: `Edit data/restaurant-page-slots.json for ${page} form hints and future service slots`,
      registry: `Edit data/restaurant-services.json for ${page} symptoms, brands, related pages, and service identity`,
      proof: 'Edit data/restaurant-proof-layer.json for shared restaurant proof defaults',
      metadata: `Edit data/page-metadata.json for ${page} SEO and canonical metadata`,
      sync: RESTAURANT_POLICY_SYNC_HINT,
      html: `Edit ${page} only for unique layout or long-form narrative`,
    };
  }

  return {
    metadata: 'Edit data/page-metadata.json',
    html: `Edit ${page} directly`,
  };
}

function runRestaurantDoctor(page) {
  const metadata = readJson(METADATA_PATH);
  const policy = readJson(RESTAURANT_POLICY_PATH);
  const registry = readJson(RESTAURANT_SERVICES_PATH);
  const slots = readJson(RESTAURANT_SLOTS_PATH);
  const proof = readJson(RESTAURANT_PROOF_PATH);
  const taxonomy = readJson(RESTAURANT_TAXONOMY_PATH);

  const htmlPath = path.join(SITE_ROOT, page);
  const htmlExists = fs.existsSync(htmlPath);
  const html = htmlExists ? fs.readFileSync(htmlPath, 'utf8') : '';
  const pageMeta = metadata.pages?.[page] ?? null;
  const branchPages = new Set(policy.branchPages?.pages ?? []);
  const registryEntry = (registry.services ?? []).find((entry) => entry.page === page) ?? null;
  const taxonomyEntry = (taxonomy.devices ?? []).find((entry) => entry.page === page) ?? null;
  const slotEntry = slots.pages?.[page] ?? null;
  const bodyClasses = getBodyClasses(html);
  const pageType = branchPages.has(page)
    ? 'restaurant-branch-page'
    : registryEntry
      ? 'restaurant-service-page'
      : pageMeta?.branch === 'restaurant'
        ? 'restaurant-page'
        : 'unknown';
  const issues = [];

  if (!htmlExists) issues.push('Missing HTML file');
  if (!pageMeta) issues.push('Missing metadata entry');
  if (pageMeta?.branch && pageMeta.branch !== 'restaurant') {
    issues.push(`Metadata branch is ${pageMeta.branch}, expected restaurant`);
  }

  if (pageType === 'restaurant-branch-page') {
    for (const className of policy.branchPages?.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        issues.push(`Missing body class ${className}`);
      }
    }

    if (policy.branchPages?.requirePageSlugClass && !bodyClasses.has(getExpectedPageClass(page))) {
      issues.push(`Missing body class ${getExpectedPageClass(page)}`);
    }

    if (policy.branchPages?.routeStripPages?.includes(page) && !html.includes('data-restaurant-route-strip')) {
      issues.push('Missing restaurant route-strip host');
    }
  }

  if (pageType === 'restaurant-service-page') {
    if (!registryEntry) issues.push('Missing registry entry');
    if (!taxonomyEntry) issues.push('Missing taxonomy entry');
    if (!slotEntry) issues.push('Missing slot entry');

    for (const className of policy.publicPage?.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        issues.push(`Missing body class ${className}`);
      }
    }

    if (policy.publicPage?.requirePageSlugClass && !bodyClasses.has(getExpectedPageClass(page))) {
      issues.push(`Missing body class ${getExpectedPageClass(page)}`);
    }

    for (const fieldName of policy.publicPage?.requiredRegistryFields ?? []) {
      if (registryEntry?.[fieldName] == null) {
        issues.push(`Registry missing ${fieldName}`);
      }
    }

    for (const fieldName of policy.publicPage?.requiredSlotFields ?? []) {
      if (fieldName === 'formHints') {
        if (!slotEntry?.formHints || typeof slotEntry.formHints !== 'object') {
          issues.push('Slot entry missing formHints');
        } else {
          if (!Array.isArray(slotEntry.formHints.chips) || slotEntry.formHints.chips.length === 0) {
            issues.push('formHints.chips must be a non-empty array');
          }
          for (const hintFieldName of ['typePlaceholder', 'problemPlaceholder']) {
            if (!isNonEmptyString(slotEntry.formHints[hintFieldName])) {
              issues.push(`formHints.${hintFieldName} must be a non-empty string`);
            }
          }
        }
      }
    }

    for (const anchor of policy.publicPage?.requiredSlotAnchors ?? []) {
      if (!hasSlotAnchor(html, anchor)) {
        issues.push(`Missing data-slot="${anchor}"`);
      }
    }

    for (const sectionId of policy.publicPage?.requiredSectionIds ?? []) {
      if (!html.includes(`<section id="${sectionId}"`)) {
        issues.push(`Missing section id ${sectionId}`);
      }
    }

    if (policy.publicPage?.requiredHtmlMarkers?.requireH1 && !/<h1[\s>]/i.test(html)) {
      issues.push('Missing h1');
    }

    if (
      isNonEmptyString(policy.publicPage?.requiredHtmlMarkers?.formClass) &&
      !html.includes(policy.publicPage.requiredHtmlMarkers.formClass)
    ) {
      issues.push(`Missing .${policy.publicPage.requiredHtmlMarkers.formClass}`);
    }

    if (
      isNonEmptyString(policy.publicPage?.requiredHtmlMarkers?.faqClass) &&
      !html.includes(policy.publicPage.requiredHtmlMarkers.faqClass)
    ) {
      issues.push(`Missing .${policy.publicPage.requiredHtmlMarkers.faqClass}`);
    }

    for (const fieldName of policy.publicPage?.requiredFormFields ?? []) {
      if (countNamedFields(html, fieldName) === 0) {
        issues.push(`Missing form field ${fieldName}`);
      }
    }
  }

  return {
    page,
    pageType,
    htmlExists,
    metadata: pageMeta
      ? { branch: pageMeta.branch, canonical: pageMeta.canonical ?? null, robots: pageMeta.robots ?? null }
      : null,
    registry: registryEntry
      ? {
          slug: registryEntry.slug,
          sectionIds: registryEntry.sectionIds,
          relatedPages: registryEntry.relatedPages,
        }
      : null,
    taxonomy: taxonomyEntry
      ? {
          family: taxonomyEntry.family,
          slug: taxonomyEntry.slug,
        }
      : null,
    slots: slotEntry
      ? {
          hasFormHints: Boolean(slotEntry.formHints),
          hasFaq: Array.isArray(slotEntry.faq) && slotEntry.faq.length > 0,
          chipCount: slotEntry.formHints?.chips?.length ?? 0,
        }
      : null,
    proofLayer: pageType === 'restaurant-service-page'
      ? {
          hasSlaStrip: Boolean(proof.serviceDefaults?.slaStrip),
          hasProofCards: Boolean(proof.serviceDefaults?.proofCards),
        }
      : null,
    bodyClasses: Array.from(bodyClasses),
    recommendedEditSurface: getRecommendedEditSurface({ page, pageType, registryEntry }),
    issues,
  };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const page = getPageFromArgs(args);
  const metadata = readJson(METADATA_PATH);
  const branch = metadata.pages?.[page]?.branch ?? null;

  if (branch === 'household') {
    passthroughHouseholdDoctor(page, Boolean(args.json));
  }

  const summary = runRestaurantDoctor(page);

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Page doctor: ${summary.page}`);
    console.log(`- page type: ${summary.pageType}`);
    console.log(`- html: ${summary.htmlExists ? 'ok' : 'missing'}`);
    console.log(`- metadata: ${summary.metadata ? 'ok' : 'missing'}`);
    console.log(`- body classes: ${summary.bodyClasses.length ? 'ok' : 'missing'}`);
    console.log(`- registry: ${summary.registry ? 'ok' : 'n/a'}`);
    console.log(`- taxonomy: ${summary.taxonomy ? `ok (${summary.taxonomy.family})` : 'n/a'}`);
    console.log(
      `- slots: ${
        summary.slots ? `ok (formHints=${summary.slots.hasFormHints ? 'yes' : 'no'}, faq=${summary.slots.hasFaq ? 'yes' : 'no'}, chips=${summary.slots.chipCount})` : 'n/a'
      }`
    );
    if (summary.proofLayer) {
      console.log(
        `- proof layer: ${
          summary.proofLayer.hasSlaStrip && summary.proofLayer.hasProofCards
            ? 'ok (service defaults ready)'
            : 'missing service defaults'
        }`
      );
    }
    if (summary.recommendedEditSurface) {
      console.log('- recommended edit surface:');
      Object.entries(summary.recommendedEditSurface).forEach(([label, value]) => {
        console.log(`  - ${label}: ${value}`);
      });
    }
    if (summary.issues.length) {
      console.log('- issues:');
      summary.issues.forEach((issue) => console.log(`  - ${issue}`));
    } else {
      console.log('- issues: none');
    }
  }

  if (summary.issues.length) {
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
