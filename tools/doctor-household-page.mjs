import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const TAXONOMY_PATH = path.join(SITE_ROOT, 'data/household-taxonomy.json');
const POLICY_PATH = path.join(SITE_ROOT, 'data/household-page-policy.json');
const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const REGISTRY_PATH = path.join(SITE_ROOT, 'data/household-services.json');
const SLOTS_PATH = path.join(SITE_ROOT, 'data/household-page-slots.json');
const CARD_PRESETS_PATH = path.join(SITE_ROOT, 'data/household-card-presets.json');
const PROOF_LAYER_PATH = path.join(SITE_ROOT, 'data/household-proof-layer.json');

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

function countNamedFields(html, fieldName) {
  return (html.match(new RegExp(`name="${fieldName}"`, 'g')) || []).length;
}

function hasSlotAnchor(html, anchor) {
  return html.includes(`data-slot="${anchor}"`);
}

function getPageFromArgs(args) {
  if (args.page && args.page !== true) return String(args.page);
  if (args.slug && args.slug !== true) return `${args.slug}.html`;
  throw new Error('Pass --page <file.html> or --slug <slug>');
}

function runDoctor(page) {
  const metadata = readJson(METADATA_PATH);
  const registry = readJson(REGISTRY_PATH);
  const slots = readJson(SLOTS_PATH);
  const taxonomy = readJson(TAXONOMY_PATH);
  const policy = readJson(POLICY_PATH);
  const cardPresets = readJson(CARD_PRESETS_PATH);
  const proofLayer = readJson(PROOF_LAYER_PATH);

  const filePath = path.join(SITE_ROOT, page);
  const htmlExists = fs.existsSync(filePath);
  const html = htmlExists ? fs.readFileSync(filePath, 'utf8') : '';
  const pageMeta = metadata.pages?.[page] ?? null;
  const registryEntry = (registry.services ?? []).find((entry) => entry.page === page) ?? null;
  const taxonomyEntry = (taxonomy.devices ?? []).find((entry) => entry.page === page) ?? null;
  const slotEntry = slots.pages?.[page] ?? null;
  const sharedCardConfig = policy.sharedCardSlots ?? {};
  const branchCardPages = new Set(sharedCardConfig.branchPages ?? []);
  const isBranchCardPage = branchCardPages.has(page);
  const isServicePage = Boolean(registryEntry);
  const policyKey = registryEntry?.isShadow ? 'shadowPage' : 'publicPage';
  const contract = isServicePage ? policy[policyKey] ?? null : null;
  const proofEntry = proofLayer?.branchPages?.[page] ?? null;
  const serviceProofDefaults = proofLayer?.serviceDefaults ?? null;
  const issues = [];

  if (!htmlExists) issues.push('Missing HTML file');
  if (!pageMeta) issues.push('Missing metadata entry');

  if (!isBranchCardPage && !registryEntry) issues.push('Missing registry entry');
  if (!isBranchCardPage && !taxonomyEntry) issues.push('Missing taxonomy device entry');

  if (pageMeta?.branch && pageMeta.branch !== 'household') {
    issues.push(`Metadata branch is ${pageMeta.branch}, expected household`);
  }

  if (registryEntry && taxonomyEntry) {
    if (registryEntry.slug !== taxonomyEntry.slug) {
      issues.push('Registry slug does not match taxonomy slug');
    }
    if (registryEntry.deviceName !== taxonomyEntry.deviceName) {
      issues.push('Registry deviceName does not match taxonomy deviceName');
    }
    if (registryEntry.isShadow !== taxonomyEntry.isShadow) {
      issues.push('Registry shadow flag does not match taxonomy');
    }
  }

  if (registryEntry && !registryEntry.isShadow && !slotEntry) {
    issues.push('Missing slot entry for public household page');
  }

  if (isBranchCardPage) {
    if (!slotEntry) {
      issues.push('Missing slot entry for branch household page');
    } else if (!slotEntry.cardSections || typeof slotEntry.cardSections !== 'object') {
      issues.push('Branch household page is missing cardSections');
    } else {
      for (const sectionName of Object.keys(slotEntry.cardSections)) {
        const anchor = sharedCardConfig.anchorMap?.[sectionName];
        if (!anchor) {
          issues.push(`Unknown card section ${sectionName}`);
          continue;
        }

        if (!html.includes(`data-slot="${anchor}"`)) {
          issues.push(`Missing data-slot="${anchor}" for ${sectionName}`);
        }
      }
    }

    if (!proofEntry || typeof proofEntry !== 'object') {
      issues.push('Missing proof-layer branch entry');
    } else {
      for (const sectionName of Object.keys(proofEntry)) {
        const anchor = sharedCardConfig.anchorMap?.[sectionName];
        if (!anchor) {
          issues.push(`Unknown proof-layer section ${sectionName}`);
          continue;
        }

        if (!hasSlotAnchor(html, anchor)) {
          issues.push(`Missing data-slot="${anchor}" for proof-layer section ${sectionName}`);
        }
      }
    }
  }

  if (registryEntry && contract) {
    for (const fieldName of contract.requiredRegistryFields ?? []) {
      if (registryEntry[fieldName] == null) {
        issues.push(`Registry missing ${fieldName}`);
      }
    }

    for (const sectionId of registryEntry.sectionIds ?? []) {
      if (!html.includes(`<section id="${sectionId}"`)) {
        issues.push(`Missing section id ${sectionId}`);
      }
    }

    for (const sectionId of contract.requiredSectionIds ?? []) {
      if (!registryEntry.sectionIds?.includes(sectionId)) {
        issues.push(`Registry must include required section id ${sectionId}`);
      }
    }

    if (contract.requiredHtmlMarkers?.requireH1 && !/<h1[\s>]/i.test(html)) {
      issues.push('Missing h1');
    }

    if (isNonEmptyString(contract.requiredHtmlMarkers?.formClass) && !html.includes(contract.requiredHtmlMarkers.formClass)) {
      issues.push(`Missing .${contract.requiredHtmlMarkers.formClass}`);
    }

    if (isNonEmptyString(contract.requiredHtmlMarkers?.faqClass) && !html.includes(contract.requiredHtmlMarkers.faqClass)) {
      issues.push(`Missing .${contract.requiredHtmlMarkers.faqClass}`);
    }

    for (const fieldName of contract.requiredFormFields ?? []) {
      if (countNamedFields(html, fieldName) === 0) {
        issues.push(`Missing form field ${fieldName}`);
      }
    }

    for (const anchor of contract.requiredSlotAnchors ?? []) {
      if (!hasSlotAnchor(html, anchor)) {
        issues.push(`Missing data-slot="${anchor}"`);
      }
    }

    if (!registryEntry.isShadow) {
      if (!serviceProofDefaults?.slaStrip || typeof serviceProofDefaults.slaStrip !== 'object') {
        issues.push('Proof layer missing serviceDefaults.slaStrip');
      }

      if (!serviceProofDefaults?.proofCards || typeof serviceProofDefaults.proofCards !== 'object') {
        issues.push('Proof layer missing serviceDefaults.proofCards');
      }
    }
  }

  const summary = {
    page,
    pageType: isBranchCardPage ? 'branch-card-page' : registryEntry ? 'service-page' : 'unknown',
    htmlExists,
    metadata: pageMeta
      ? { branch: pageMeta.branch, canonical: pageMeta.canonical ?? null, robots: pageMeta.robots ?? null }
      : null,
    registry: registryEntry
      ? {
          slug: registryEntry.slug,
          isShadow: registryEntry.isShadow,
          sectionIds: registryEntry.sectionIds,
          relatedPages: registryEntry.relatedPages,
        }
      : null,
    taxonomy: taxonomyEntry
      ? {
          family: taxonomyEntry.family,
          slug: taxonomyEntry.slug,
          isShadow: taxonomyEntry.isShadow,
        }
      : null,
    slots: slotEntry
      ? {
          faqCount: Array.isArray(slotEntry.faq) ? slotEntry.faq.length : 0,
          hasFormHints: Boolean(slotEntry.formHints),
          cardSections: Object.keys(slotEntry.cardSections ?? {}),
        }
      : null,
    proofLayer: isBranchCardPage
      ? {
          branchSections: Object.keys(proofEntry ?? {}),
          anchorsPresent: Object.keys(proofEntry ?? {}).every((sectionName) => {
            const anchor = sharedCardConfig.anchorMap?.[sectionName];
            return anchor ? hasSlotAnchor(html, anchor) : false;
          }),
        }
      : isServicePage && !registryEntry?.isShadow
        ? {
            hasSlaStrip: Boolean(serviceProofDefaults?.slaStrip),
            hasProofCards: Boolean(serviceProofDefaults?.proofCards),
            requestAnchorPresent: hasSlotAnchor(html, 'request-form'),
          }
        : null,
    cardPresets: isServicePage
      ? {
          icon: cardPresets.pageIcons?.[page] ?? null,
          tone: cardPresets.pageTones?.[page] ?? null,
        }
      : null,
    issues,
  };

  return summary;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const page = getPageFromArgs(args);
  const summary = runDoctor(page);

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Household doctor: ${summary.page}`);
    console.log(`- page type: ${summary.pageType}`);
    console.log(`- html: ${summary.htmlExists ? 'ok' : 'missing'}`);
    console.log(`- metadata: ${summary.metadata ? 'ok' : 'missing'}`);
    console.log(`- registry: ${summary.pageType === 'branch-card-page' ? 'n/a' : summary.registry ? 'ok' : 'missing'}`);
    console.log(`- taxonomy: ${summary.pageType === 'branch-card-page' ? 'n/a' : summary.taxonomy ? `ok (${summary.taxonomy.family})` : 'missing'}`);
    console.log(`- slots: ${summary.slots ? `ok (${summary.slots.cardSections.length} card sections)` : 'missing'}`);
    if (summary.proofLayer) {
      if (summary.pageType === 'branch-card-page') {
        console.log(
          `- proof layer: ${
            summary.proofLayer.branchSections.length
              ? `ok (${summary.proofLayer.branchSections.join(', ')})`
              : 'missing sections'
          }`
        );
      } else {
        console.log(
          `- proof layer: ${
            summary.proofLayer.hasSlaStrip && summary.proofLayer.hasProofCards
              ? 'ok (service defaults ready)'
              : 'missing service defaults'
          }`
        );
      }
    }
    if (summary.cardPresets) {
      console.log(
        `- card presets: ${
          summary.cardPresets.icon && summary.cardPresets.tone
            ? `ok (${summary.cardPresets.icon}, ${summary.cardPresets.tone})`
            : 'missing icon/tone preset'
        }`
      );
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
