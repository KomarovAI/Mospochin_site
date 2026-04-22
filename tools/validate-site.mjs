import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const CANONICAL_FORM_SCRIPT = 'telegram-form.js';
const LEGACY_FORM_SCRIPT = 'assets/js/telegram-form.js';
const LEGACY_RUNTIME_SCRIPT = 'assets/js/main.js';
const TELEGRAM_API_SCRIPT = 'server/telegram-api.mjs';
const TELEGRAM_API_UNIT = 'deploy/systemd/mospochin-telegram-api.service';
const TELEGRAM_API_ENV_TEMPLATE = 'deploy/env/telegram.env.example';
const TELEGRAM_API_HOOK = 'deploy/post-activate.sh';
const RESTAURANT_BRANCH_DATA = 'data/restaurant-branch.json';
const HOUSEHOLD_BRANCH_DATA = 'data/household-branch.json';
const HOUSEHOLD_SERVICES_DATA = 'data/household-services.json';
const HOUSEHOLD_PAGE_SLOTS_DATA = 'data/household-page-slots.json';
const VALID_BRANCHES = new Set(['restaurant', 'household', 'neutral']);
const CANONICAL_FORM_FIELDS = ['name', 'phone', 'type', 'problem'];
const LEGACY_FORM_FIELDS = ['message'];
const BRANCH_ROUTE_STRIP_CONTRACTS = {
  restaurant: {
    dataFile: RESTAURANT_BRANCH_DATA,
    selectorPrefix: 'data-restaurant-route-strip',
    pages: {
      'index.html': 'index',
      'uslugi.html': 'uslugi',
    },
  },
  household: {
    dataFile: HOUSEHOLD_BRANCH_DATA,
    selectorPrefix: 'data-household-route-strip',
    pages: {
      'bytovaya-index.html': 'index',
      'bytovaya-uslugi.html': 'uslugi',
    },
  },
};
const EXPECTED_BRANCH_BY_PAGE = {
  '404.html': 'neutral',
  'about.html': 'restaurant',
  'bytovaya-about.html': 'household',
  'bytovaya-contact.html': 'household',
  'bytovaya-index.html': 'household',
  'bytovaya-uslugi.html': 'household',
  'contact.html': 'restaurant',
  'grili-mangaly.html': 'restaurant',
  'holodilniki.html': 'household',
  'holodilnoe-oborudovanie.html': 'restaurant',
  'ice-machines.html': 'restaurant',
  'index.html': 'restaurant',
  'kompyutery.html': 'household',
  'microwaves.html': 'household',
  'parokonvektomaty.html': 'restaurant',
  'plity.html': 'household',
  'plity-pechi.html': 'restaurant',
  'posudomoechnye-mashiny.html': 'restaurant',
  'posudomoyki.html': 'household',
  'routery.html': 'household',
  'stiralnye-mashiny.html': 'household',
  'uslugi.html': 'restaurant',
  'water-heaters.html': 'household',
};
const metadata = JSON.parse(
  fs.readFileSync(path.join(SITE_ROOT, 'data/page-metadata.json'), 'utf8')
);
const runtimeConfig = JSON.parse(
  fs.readFileSync(path.join(SITE_ROOT, 'data/runtime-config.json'), 'utf8')
);
const restaurantBranchPath = path.join(SITE_ROOT, RESTAURANT_BRANCH_DATA);
const restaurantBranch = fs.existsSync(restaurantBranchPath)
  ? JSON.parse(fs.readFileSync(restaurantBranchPath, 'utf8'))
  : null;
const householdBranchPath = path.join(SITE_ROOT, HOUSEHOLD_BRANCH_DATA);
const householdBranch = fs.existsSync(householdBranchPath)
  ? JSON.parse(fs.readFileSync(householdBranchPath, 'utf8'))
  : null;
const householdServicesPath = path.join(SITE_ROOT, HOUSEHOLD_SERVICES_DATA);
const householdServicesRegistry = fs.existsSync(householdServicesPath)
  ? JSON.parse(fs.readFileSync(householdServicesPath, 'utf8'))
  : null;
const householdPageSlotsPath = path.join(SITE_ROOT, HOUSEHOLD_PAGE_SLOTS_DATA);
const householdPageSlots = fs.existsSync(householdPageSlotsPath)
  ? JSON.parse(fs.readFileSync(householdPageSlotsPath, 'utf8'))
  : null;
const sitemapXml = fs.readFileSync(path.join(SITE_ROOT, 'sitemap.xml'), 'utf8');

const errors = [];

function read(fileName) {
  return fs.readFileSync(path.join(SITE_ROOT, fileName), 'utf8');
}

function getMatch(html, regex) {
  return html.match(regex)?.[1] ?? null;
}

function countNormalizedShellComments(html) {
  return (html.match(/<!--\s*Normalized layout shell:[\s\S]*?-->/gi) || []).length;
}

function countNamedFields(html, fieldName) {
  return (html.match(new RegExp(`name="${fieldName}"`, 'g')) || []).length;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isArrayOfNonEmptyStrings(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => isNonEmptyString(item));
}

function getBranchConfigForContract(contract) {
  if (contract.dataFile === RESTAURANT_BRANCH_DATA) return restaurantBranch;
  if (contract.dataFile === HOUSEHOLD_BRANCH_DATA) return householdBranch;
  return null;
}

function isNoindexPage(page) {
  return typeof page.robots === 'string' && page.robots.toLowerCase().includes('noindex');
}

function validateHtmlTarget(target, context, expectedBranch) {
  if (!isNonEmptyString(target)) {
    errors.push(`${context}: target must be a non-empty string`);
    return;
  }

  if (target.startsWith('#')) {
    return;
  }

  const fileName = target.split('#', 1)[0];
  if (!fileName.endsWith('.html')) {
    errors.push(`${context}: target must point to an html file or local anchor`);
    return;
  }

  if (!metadata.pages[fileName]) {
    errors.push(`${context}: target page missing from data/page-metadata.json`);
    return;
  }

  if (expectedBranch && metadata.pages[fileName].branch !== expectedBranch) {
    errors.push(`${context}: target page must belong to ${expectedBranch} branch`);
  }
}

for (const [fileName, page] of Object.entries(metadata.pages)) {
  const filePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(filePath)) {
    errors.push(`${fileName}: file missing`);
    continue;
  }

  const html = read(fileName);
  const title = getMatch(html, /<title>([\s\S]*?)<\/title>/i);
  const description = getMatch(
    html,
    /<meta[^>]+name="description"[^>]+content="([^"]*)"[^>]*>/i
  );
  const canonical = getMatch(
    html,
    /<link[^>]+rel="canonical"[^>]+href="([^"]*)"[^>]*>/i
  );
  const ogUrl = getMatch(html, /<meta[^>]+property="og:url"[^>]+content="([^"]*)"[^>]*>/i);
  const robots = getMatch(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"[^>]*>/i);
  const normalizedShellCount = countNormalizedShellComments(html);
  const hardcodedPhoneLinks = html.match(/href="tel:89990057172"/g) || [];
  const nonCanonicalPhoneLinks = html.match(/href="tel:79990057172"/g) || [];

  const mainScriptCount = (html.match(/<script[^>]+src="main\.js"/g) || []).length;
  const telegramScriptCount = (
    html.match(/<script[^>]+src="(?:telegram-form\.js|assets\/js\/telegram-form\.js|\/assets\/js\/telegram-form\.js)"/g) || []
  ).length;
  const formCount = (html.match(/class="telegram-form\b/g) || []).length;
  const canonicalFieldCounts = Object.fromEntries(
    CANONICAL_FORM_FIELDS.map((fieldName) => [fieldName, countNamedFields(html, fieldName)])
  );
  const legacyFieldCounts = Object.fromEntries(
    LEGACY_FORM_FIELDS.map((fieldName) => [fieldName, countNamedFields(html, fieldName)])
  );

  if (title !== page.title) {
    errors.push(`${fileName}: title mismatch`);
  }

  if (description !== page.description) {
    errors.push(`${fileName}: description mismatch`);
  }

  if ((page.canonical ?? null) !== canonical) {
    errors.push(`${fileName}: canonical mismatch`);
  }

  if ((page.ogUrl ?? null) !== ogUrl) {
    errors.push(`${fileName}: og:url mismatch`);
  }

  if ((page.robots ?? null) !== robots) {
    errors.push(`${fileName}: robots mismatch`);
  }

  if (!VALID_BRANCHES.has(page.branch)) {
    errors.push(`${fileName}: branch must be one of ${Array.from(VALID_BRANCHES).join(', ')}`);
  }

  if (EXPECTED_BRANCH_BY_PAGE[fileName] && page.branch !== EXPECTED_BRANCH_BY_PAGE[fileName]) {
    errors.push(`${fileName}: branch mismatch, expected ${EXPECTED_BRANCH_BY_PAGE[fileName]}`);
  }

  if (mainScriptCount !== 1) {
    errors.push(`${fileName}: expected exactly one main.js include, found ${mainScriptCount}`);
  }

  if (normalizedShellCount !== 1) {
    errors.push(
      `${fileName}: expected exactly one normalized layout shell comment, found ${normalizedShellCount}`
    );
  }

  if (page.hasForm && formCount === 0) {
    errors.push(`${fileName}: metadata says hasForm=true but no .telegram-form found`);
  }

  if (page.hasForm && telegramScriptCount !== 1) {
    errors.push(
      `${fileName}: expected exactly one telegram-form.js include for form page, found ${telegramScriptCount}`
    );
  }

  if (!page.hasForm && telegramScriptCount !== 0) {
    errors.push(
      `${fileName}: expected no telegram-form.js include for non-form page, found ${telegramScriptCount}`
    );
  }

  if (fileName === '404.html' && robots !== 'noindex,follow') {
    errors.push('404.html: expected robots=noindex,follow');
  }

  if (fileName === '404.html' && hardcodedPhoneLinks.length > 0) {
    errors.push('404.html: should not hardcode tel link, keep phone in shared main.js config');
  }

  if (nonCanonicalPhoneLinks.length > 0) {
    errors.push(`${fileName}: use tel:+79990057172, found legacy tel:79990057172 link`);
  }

  for (const contract of Object.values(BRANCH_ROUTE_STRIP_CONTRACTS)) {
    const routeKey = contract.pages[fileName];
    if (!routeKey) continue;

    const branchConfig = getBranchConfigForContract(contract);
    const routeStrip = branchConfig?.routeStrips?.[routeKey];
    if (!routeStrip) continue;

    if (!html.includes(`${contract.selectorPrefix}="${routeKey}"`)) {
      errors.push(`${fileName}: missing ${contract.selectorPrefix}="${routeKey}"`);
    }

    for (const attr of [
      'data-route-strip-badge',
      'data-route-strip-title',
      'data-route-strip-description',
      'data-route-strip-action',
      'data-route-strip-action-label',
      'data-route-strip-action-icon',
      'data-route-strip-grid',
    ]) {
      if (!html.includes(attr)) {
        errors.push(`${fileName}: missing ${attr} for ${contract.dataFile} router contract`);
      }
    }
  }

  if (page.hasForm) {
    for (const [fieldName, count] of Object.entries(canonicalFieldCounts)) {
      if (count === 0) {
        errors.push(`${fileName}: form contract missing required field "${fieldName}"`);
      }
    }

    for (const [fieldName, count] of Object.entries(legacyFieldCounts)) {
      if (count > 0) {
        errors.push(`${fileName}: form contract uses legacy field "${fieldName}"`);
      }
    }
  }
}

const sitemapLocs = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
);

for (const [fileName, page] of Object.entries(metadata.pages)) {
  if (!page.canonical) continue;
  if (isNoindexPage(page)) continue;
  if (!sitemapLocs.has(page.canonical)) {
    errors.push(`${fileName}: canonical URL missing from sitemap.xml`);
  }
}

const htmlFiles = fs.readdirSync(SITE_ROOT).filter((file) => file.endsWith('.html'));
for (const fileName of htmlFiles) {
  if (!metadata.pages[fileName]) {
    errors.push(`${fileName}: missing metadata entry in data/page-metadata.json`);
  }
}

function validateHouseholdServicesRegistry(registry) {
  if (!registry || typeof registry !== 'object') {
    errors.push(`${HOUSEHOLD_SERVICES_DATA}: top-level object is required`);
    return;
  }

  if (!Array.isArray(registry.services) || registry.services.length === 0) {
    errors.push(`${HOUSEHOLD_SERVICES_DATA}: services must be a non-empty array`);
    return;
  }

  const expectedHouseholdServicePages = new Set(
    Object.entries(metadata.pages)
      .filter(([fileName, page]) => page.branch === 'household' && !fileName.startsWith('bytovaya-'))
      .map(([fileName]) => fileName)
  );
  const branchVisiblePages = new Set([
    ...(householdBranch?.services ?? []).map((service) => service.href),
    ...(householdBranch?.footerLinks ?? []).map((link) => link.href),
  ].filter((href) => isNonEmptyString(href) && href.endsWith('.html') && !href.startsWith('bytovaya-')));

  const registryByPage = new Map();
  const slugSet = new Set();

  registry.services.forEach((service, index) => {
    const context = `${HOUSEHOLD_SERVICES_DATA}: services[${index}]`;

    if (!service || typeof service !== 'object') {
      errors.push(`${context} must be an object`);
      return;
    }

    for (const fieldName of ['page', 'slug', 'uiLabel', 'deviceName', 'serviceName', 'schemaName', 'formExample']) {
      if (!isNonEmptyString(service[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty string`);
      }
    }

    if (typeof service.isShadow !== 'boolean') {
      errors.push(`${context}.isShadow must be a boolean`);
    }

    for (const fieldName of ['primarySymptoms', 'brandCluster', 'sectionIds']) {
      if (!isArrayOfNonEmptyStrings(service[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty array of strings`);
      }
    }

    if (!Array.isArray(service.relatedPages) || !service.relatedPages.every((page) => isNonEmptyString(page))) {
      errors.push(`${context}.relatedPages must be an array of non-empty strings`);
    }

    if (!isNonEmptyString(service.page)) {
      return;
    }

    if (registryByPage.has(service.page)) {
      errors.push(`${context}.page duplicates ${service.page}`);
    } else {
      registryByPage.set(service.page, service);
    }

    if (isNonEmptyString(service.slug)) {
      if (slugSet.has(service.slug)) {
        errors.push(`${context}.slug duplicates ${service.slug}`);
      } else {
        slugSet.add(service.slug);
      }
    }

    if (!expectedHouseholdServicePages.has(service.page)) {
      errors.push(`${context}.page must map to a household service page in data/page-metadata.json`);
      return;
    }

    const pageMeta = metadata.pages[service.page];
    if (!pageMeta || pageMeta.branch !== 'household') {
      errors.push(`${context}.page must belong to the household branch`);
    }

    if (service.isShadow && !isNoindexPage(pageMeta)) {
      errors.push(`${context}.page is shadow but metadata is not noindex`);
    }

    if (!service.isShadow && isNoindexPage(pageMeta)) {
      errors.push(`${context}.page is visible in registry but metadata is noindex`);
    }

    const html = read(service.page);
    const schemaName = getMatch(
      html,
      /"@type"\s*:\s*"Service"[\s\S]*?"name"\s*:\s*"([^"]+)"/i
    );

    if (!schemaName) {
      errors.push(`${context}.page missing top-level Service JSON-LD name`);
    } else if (schemaName !== service.schemaName) {
      errors.push(`${context}.schemaName mismatch with ${service.page}`);
    }

    if (!html.includes('class="telegram-form')) {
      errors.push(`${context}.page must include a .telegram-form`);
    }

    if (!html.includes('faq-item')) {
      errors.push(`${context}.page must include FAQ items`);
    }

    if (!html.match(/<h1[\s>]/i)) {
      errors.push(`${context}.page must include an h1`);
    }

    for (const sectionId of service.sectionIds ?? []) {
      if (!html.includes(`<section id="${sectionId}"`)) {
        errors.push(`${context}.sectionIds references missing section "${sectionId}"`);
      }
    }
  });

  for (const page of expectedHouseholdServicePages) {
    if (!registryByPage.has(page)) {
      errors.push(`${HOUSEHOLD_SERVICES_DATA}: missing registry entry for ${page}`);
    }
  }

  registry.services.forEach((service, index) => {
    const context = `${HOUSEHOLD_SERVICES_DATA}: services[${index}]`;
    if (!Array.isArray(service.relatedPages)) return;

    service.relatedPages.forEach((relatedPage, relatedIndex) => {
      if (!expectedHouseholdServicePages.has(relatedPage)) {
        errors.push(`${context}.relatedPages[${relatedIndex}] must target a household service page`);
        return;
      }

      if (relatedPage === service.page) {
        errors.push(`${context}.relatedPages[${relatedIndex}] must not point to itself`);
      }

      const relatedRegistry = registryByPage.get(relatedPage);
      if (relatedRegistry && !service.isShadow && relatedRegistry.isShadow) {
        errors.push(`${context}.relatedPages[${relatedIndex}] must not point visible pages to shadow pages`);
      }
    });

    if (!service.isShadow && !branchVisiblePages.has(service.page)) {
      errors.push(`${context}.page must be reachable from the household branch navigation sources`);
    }
  });

  branchVisiblePages.forEach((page) => {
    const registryService = registryByPage.get(page);
    if (!registryService) {
      errors.push(`${HOUSEHOLD_SERVICES_DATA}: household branch page ${page} missing in registry`);
      return;
    }

    if (registryService.isShadow) {
      errors.push(`${HOUSEHOLD_SERVICES_DATA}: visible household branch page ${page} must not be marked shadow`);
    }
  });
}

function validateHouseholdPageSlots(slots, registry) {
  if (!slots || typeof slots !== 'object') {
    errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: top-level object is required`);
    return;
  }

  if (!slots.pages || typeof slots.pages !== 'object' || Array.isArray(slots.pages)) {
    errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: pages must be an object keyed by html file`);
    return;
  }

  const publicServices = (registry?.services ?? []).filter((service) => !service.isShadow);
  const expectedPages = new Set(publicServices.map((service) => service.page));
  const slotPages = new Set(Object.keys(slots.pages));

  for (const page of expectedPages) {
    if (!slotPages.has(page)) {
      errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: missing slot entry for ${page}`);
    }
  }

  slotPages.forEach((page) => {
    if (!expectedPages.has(page)) {
      errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: unexpected slot entry ${page}`);
    }
  });

  for (const service of publicServices) {
    const slotEntry = slots.pages[service.page];
    const context = `${HOUSEHOLD_PAGE_SLOTS_DATA}: pages.${service.page}`;

    if (!slotEntry || typeof slotEntry !== 'object') {
      errors.push(`${context} must be an object`);
      continue;
    }

    if (!Array.isArray(slotEntry.faq) || slotEntry.faq.length === 0) {
      errors.push(`${context}.faq must be a non-empty array`);
    } else {
      slotEntry.faq.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`${context}.faq[${index}] must be an object`);
          return;
        }

        if (!isNonEmptyString(item.question) || !isNonEmptyString(item.answer)) {
          errors.push(`${context}.faq[${index}] must define question and answer`);
        }
      });
    }

    if (!slotEntry.formHints || typeof slotEntry.formHints !== 'object') {
      errors.push(`${context}.formHints must be an object`);
    } else {
      if (!isArrayOfNonEmptyStrings(slotEntry.formHints.chips)) {
        errors.push(`${context}.formHints.chips must be a non-empty array of strings`);
      }

      for (const fieldName of ['typePlaceholder', 'problemPlaceholder']) {
        if (!isNonEmptyString(slotEntry.formHints[fieldName])) {
          errors.push(`${context}.formHints.${fieldName} must be a non-empty string`);
        }
      }
    }

    const html = read(service.page);

    if (!/<script[^>]+type="application\/ld\+json"[^>]+data-slot="service-schema"/i.test(html)) {
      errors.push(`${service.page}: missing data-slot="service-schema" on Service JSON-LD script`);
    }

    if (!/<form[^>]+class="telegram-form\b[^"]*"[^>]+data-slot="request-form"/i.test(html)) {
      errors.push(`${service.page}: missing data-slot="request-form" on canonical household form`);
    }
  }
}

function validateBranchConfig(branchConfig, contract, expectedBranch) {
  if (!branchConfig) return;

  if (!isNonEmptyString(branchConfig.subtitle)) {
    errors.push(`${contract.dataFile}: subtitle must be a non-empty string`);
  }

  if (!isNonEmptyString(branchConfig.contactHint)) {
    errors.push(`${contract.dataFile}: contactHint must be a non-empty string`);
  }

  if (!branchConfig.topBarText || typeof branchConfig.topBarText !== 'object') {
    errors.push(`${contract.dataFile}: topBarText object is required`);
  } else {
    for (const fieldName of ['icon', 'text', 'sub']) {
      if (!isNonEmptyString(branchConfig.topBarText[fieldName])) {
        errors.push(`${contract.dataFile}: topBarText.${fieldName} must be a non-empty string`);
      }
    }
  }

  if (!Array.isArray(branchConfig.services) || branchConfig.services.length === 0) {
    errors.push(`${contract.dataFile}: services must be a non-empty array`);
  } else {
    branchConfig.services.forEach((service, index) => {
      if (!service || typeof service !== 'object') {
        errors.push(`${contract.dataFile}: services[${index}] must be an object`);
        return;
      }

      if (!isNonEmptyString(service.name) || !isNonEmptyString(service.icon)) {
        errors.push(`${contract.dataFile}: services[${index}] must define name and icon`);
      }
      validateHtmlTarget(
        service.href,
        `${contract.dataFile}: services[${index}].href`,
        expectedBranch
      );
    });
  }

  if (!Array.isArray(branchConfig.footerLinks) || branchConfig.footerLinks.length === 0) {
    errors.push(`${contract.dataFile}: footerLinks must be a non-empty array`);
  } else {
    branchConfig.footerLinks.forEach((link, index) => {
      if (!link || typeof link !== 'object') {
        errors.push(`${contract.dataFile}: footerLinks[${index}] must be an object`);
        return;
      }

      if (!isNonEmptyString(link.label)) {
        errors.push(`${contract.dataFile}: footerLinks[${index}].label must be a non-empty string`);
      }
      validateHtmlTarget(
        link.href,
        `${contract.dataFile}: footerLinks[${index}].href`,
        expectedBranch
      );
    });
  }

  if (!branchConfig.routeStrips || typeof branchConfig.routeStrips !== 'object') {
    return;
  }

  for (const [fileName, routeKey] of Object.entries(contract.pages)) {
    const routeStrip = branchConfig.routeStrips[routeKey];
    if (!routeStrip || typeof routeStrip !== 'object') {
      continue;
    }

    for (const fieldName of ['badge', 'title', 'description']) {
      if (!isNonEmptyString(routeStrip[fieldName])) {
        errors.push(`${contract.dataFile}: routeStrips.${routeKey}.${fieldName} must be a non-empty string`);
      }
    }

    if (!routeStrip.action || typeof routeStrip.action !== 'object') {
      errors.push(`${contract.dataFile}: routeStrips.${routeKey}.action is required`);
    } else {
      if (!isNonEmptyString(routeStrip.action.label) || !isNonEmptyString(routeStrip.action.icon)) {
        errors.push(`${contract.dataFile}: routeStrips.${routeKey}.action must define label and icon`);
      }

      const actionTarget = routeStrip.action.href;
      if (!isNonEmptyString(actionTarget)) {
        errors.push(`${contract.dataFile}: routeStrips.${routeKey}.action.href must be a non-empty string`);
      } else if (actionTarget.startsWith('#')) {
        const routerHtml = read(fileName);
        if (!routerHtml.includes(`id="${actionTarget.slice(1)}"`)) {
          errors.push(`${contract.dataFile}: routeStrips.${routeKey}.action.href points to missing anchor ${actionTarget} in ${fileName}`);
        }
      } else {
        validateHtmlTarget(
          actionTarget,
          `${contract.dataFile}: routeStrips.${routeKey}.action.href`,
          expectedBranch
        );
      }
    }

    if (!Array.isArray(routeStrip.cards) || routeStrip.cards.length === 0) {
      errors.push(`${contract.dataFile}: routeStrips.${routeKey}.cards must be a non-empty array`);
      continue;
    }

    routeStrip.cards.forEach((card, index) => {
      if (!card || typeof card !== 'object') {
        errors.push(`${contract.dataFile}: routeStrips.${routeKey}.cards[${index}] must be an object`);
        return;
      }

      if (!isNonEmptyString(card.title) || !isNonEmptyString(card.description)) {
        errors.push(`${contract.dataFile}: routeStrips.${routeKey}.cards[${index}] must define title and description`);
      }

      validateHtmlTarget(
        card.href,
        `${contract.dataFile}: routeStrips.${routeKey}.cards[${index}].href`,
        expectedBranch
      );
    });
  }
}

validateBranchConfig(restaurantBranch, BRANCH_ROUTE_STRIP_CONTRACTS.restaurant, 'restaurant');
validateBranchConfig(householdBranch, BRANCH_ROUTE_STRIP_CONTRACTS.household, 'household');
validateHouseholdServicesRegistry(householdServicesRegistry);
validateHouseholdPageSlots(householdPageSlots, householdServicesRegistry);

const canonicalFormScriptPath = path.join(SITE_ROOT, CANONICAL_FORM_SCRIPT);
const legacyFormScriptPath = path.join(SITE_ROOT, LEGACY_FORM_SCRIPT);
const legacyRuntimeScriptPath = path.join(SITE_ROOT, LEGACY_RUNTIME_SCRIPT);
const runtimeConfigPath = path.join(SITE_ROOT, 'data/runtime-config.json');
const telegramApiScriptPath = path.join(SITE_ROOT, TELEGRAM_API_SCRIPT);
const telegramApiUnitPath = path.join(SITE_ROOT, TELEGRAM_API_UNIT);
const telegramApiEnvTemplatePath = path.join(SITE_ROOT, TELEGRAM_API_ENV_TEMPLATE);
const telegramApiHookPath = path.join(SITE_ROOT, TELEGRAM_API_HOOK);

if (!fs.existsSync(canonicalFormScriptPath)) {
  errors.push(`${CANONICAL_FORM_SCRIPT}: canonical form script missing`);
}

if (!fs.existsSync(runtimeConfigPath)) {
  errors.push('data/runtime-config.json: runtime config missing');
}

if (!fs.existsSync(restaurantBranchPath)) {
  errors.push(`${RESTAURANT_BRANCH_DATA}: restaurant branch config missing`);
}

if (!fs.existsSync(householdBranchPath)) {
  errors.push(`${HOUSEHOLD_BRANCH_DATA}: household branch config missing`);
}

if (!fs.existsSync(householdServicesPath)) {
  errors.push(`${HOUSEHOLD_SERVICES_DATA}: household services registry missing`);
}

if (!fs.existsSync(householdPageSlotsPath)) {
  errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: household page slots missing`);
}

if (typeof runtimeConfig.telegramFormEndpoint !== 'string' || !runtimeConfig.telegramFormEndpoint.trim()) {
  errors.push('data/runtime-config.json: telegramFormEndpoint must be a non-empty string');
}

if (!runtimeConfig.telegramFormEndpoint.startsWith('/')) {
  errors.push('data/runtime-config.json: telegramFormEndpoint must be an absolute site path');
}

if (runtimeConfig.telegramFormEndpoint !== '/api/send-telegram') {
  errors.push('data/runtime-config.json: telegramFormEndpoint must stay aligned with repo backend route /api/send-telegram');
}

if (fs.existsSync(legacyFormScriptPath)) {
  errors.push(
    `${LEGACY_FORM_SCRIPT}: legacy duplicate exists; keep a single source of truth at ${CANONICAL_FORM_SCRIPT}`
  );
}

if (fs.existsSync(legacyRuntimeScriptPath)) {
  errors.push(
    `${LEGACY_RUNTIME_SCRIPT}: legacy duplicate exists; keep a single runtime source of truth at main.js`
  );
}

if (!fs.existsSync(telegramApiScriptPath)) {
  errors.push(`${TELEGRAM_API_SCRIPT}: production telegram API script missing`);
}

if (!fs.existsSync(telegramApiUnitPath)) {
  errors.push(`${TELEGRAM_API_UNIT}: systemd unit missing`);
}

if (!fs.existsSync(telegramApiEnvTemplatePath)) {
  errors.push(`${TELEGRAM_API_ENV_TEMPLATE}: environment template missing`);
}

if (!fs.existsSync(telegramApiHookPath)) {
  errors.push(`${TELEGRAM_API_HOOK}: post-activate hook missing`);
}

if (fs.existsSync(telegramApiHookPath)) {
  const hookMode = fs.statSync(telegramApiHookPath).mode & 0o777;
  if ((hookMode & 0o111) === 0) {
    errors.push(`${TELEGRAM_API_HOOK}: must be executable`);
  }
}

if (errors.length) {
  console.error('Site validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${Object.keys(metadata.pages).length} pages successfully.`);
