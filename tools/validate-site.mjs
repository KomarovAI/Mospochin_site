import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeHouseholdSyncState, HOUSEHOLD_SYNC_ZONES } from './household-fallback-sync-lib.mjs';
import { analyzeRestaurantSyncState, RESTAURANT_SYNC_ZONES } from './restaurant-fallback-sync-lib.mjs';
import { getAuditContractSummary } from './screenshot-audit-lib.mjs';

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
const DOCS_ROOT = path.join(SITE_ROOT, 'docs');
const DOCS_CONTRACTS_DATA = 'data/docs-contracts.json';
const RESTAURANT_BRANCH_DATA = 'data/restaurant-branch.json';
const HOUSEHOLD_BRANCH_DATA = 'data/household-branch.json';
const HOUSEHOLD_SERVICES_DATA = 'data/household-services.json';
const HOUSEHOLD_PAGE_SLOTS_DATA = 'data/household-page-slots.json';
const HOUSEHOLD_CARD_PRESETS_DATA = 'data/household-card-presets.json';
const HOUSEHOLD_PROOF_LAYER_DATA = 'data/household-proof-layer.json';
const HOUSEHOLD_TAXONOMY_DATA = 'data/household-taxonomy.json';
const HOUSEHOLD_PAGE_POLICY_DATA = 'data/household-page-policy.json';
const RESTAURANT_SERVICES_DATA = 'data/restaurant-services.json';
const RESTAURANT_PAGE_SLOTS_DATA = 'data/restaurant-page-slots.json';
const RESTAURANT_PROOF_LAYER_DATA = 'data/restaurant-proof-layer.json';
const RESTAURANT_TAXONOMY_DATA = 'data/restaurant-taxonomy.json';
const RESTAURANT_PAGE_POLICY_DATA = 'data/restaurant-page-policy.json';
const SITE_PAGE_CONTRACTS_DATA = 'data/site-page-contracts.json';
const CONTACT_CONFIG_DATA = 'data/contact-config.json';
const SCHEMA_PROFILE_DATA = 'data/schema-profile.json';
const SCREENSHOT_AUDIT_DATA = 'data/screenshot-audit.json';
const RESTAURANT_SCREENSHOT_AUDIT_DATA = 'data/restaurant-screenshot-audit.json';
const OPERATOR_RECIPES_DATA = 'data/operator-recipes.json';
const VALID_BRANCHES = new Set(['restaurant', 'household', 'neutral']);
const VALID_RECIPE_BRANCHES = new Set(['shared', 'household', 'restaurant']);
const VALID_RECIPE_PAGE_KINDS = new Set([
  'branch-page',
  'service-page',
  'shadow-page',
  'representative-audit',
]);
const VALID_RESTAURANT_CARD_LAYOUT_VARIANTS = new Set(['default', 'balanced-four']);
const REQUIRED_RECIPE_IDS = [
  'household-change-faq',
  'restaurant-change-faq',
  'household-change-form-hints',
  'restaurant-change-form-hints',
  'household-change-related',
  'restaurant-change-related',
  'household-change-proof',
  'restaurant-change-proof',
  'household-change-metadata',
  'restaurant-change-metadata',
  'household-change-branch-shell',
  'restaurant-change-branch-shell',
  'household-add-service-page',
  'restaurant-add-service-page',
  'representative-stabilization-audit',
  'restaurant-full-branch-audit',
];
const CANONICAL_FORM_FIELDS = ['name', 'phone', 'type', 'problem'];
const LEGACY_FORM_FIELDS = ['message'];
const RESTAURANT_ROUTE_STRIP_CONTRACT = {
  dataFile: RESTAURANT_BRANCH_DATA,
  selectorPrefix: 'data-restaurant-route-strip',
  pages: {
    'index.html': 'index',
    'uslugi.html': 'uslugi',
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
const contactConfigPath = path.join(SITE_ROOT, CONTACT_CONFIG_DATA);
const contactConfig = fs.existsSync(contactConfigPath)
  ? JSON.parse(fs.readFileSync(contactConfigPath, 'utf8'))
  : null;
const schemaProfilePath = path.join(SITE_ROOT, SCHEMA_PROFILE_DATA);
const schemaProfile = fs.existsSync(schemaProfilePath)
  ? JSON.parse(fs.readFileSync(schemaProfilePath, 'utf8'))
  : null;
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
const householdCardPresetsPath = path.join(SITE_ROOT, HOUSEHOLD_CARD_PRESETS_DATA);
const householdCardPresets = fs.existsSync(householdCardPresetsPath)
  ? JSON.parse(fs.readFileSync(householdCardPresetsPath, 'utf8'))
  : null;
const householdProofLayerPath = path.join(SITE_ROOT, HOUSEHOLD_PROOF_LAYER_DATA);
const householdProofLayer = fs.existsSync(householdProofLayerPath)
  ? JSON.parse(fs.readFileSync(householdProofLayerPath, 'utf8'))
  : null;
const householdTaxonomyPath = path.join(SITE_ROOT, HOUSEHOLD_TAXONOMY_DATA);
const householdTaxonomy = fs.existsSync(householdTaxonomyPath)
  ? JSON.parse(fs.readFileSync(householdTaxonomyPath, 'utf8'))
  : null;
const householdPagePolicyPath = path.join(SITE_ROOT, HOUSEHOLD_PAGE_POLICY_DATA);
const householdPagePolicy = fs.existsSync(householdPagePolicyPath)
  ? JSON.parse(fs.readFileSync(householdPagePolicyPath, 'utf8'))
  : null;
const restaurantServicesPath = path.join(SITE_ROOT, RESTAURANT_SERVICES_DATA);
const restaurantServicesRegistry = fs.existsSync(restaurantServicesPath)
  ? JSON.parse(fs.readFileSync(restaurantServicesPath, 'utf8'))
  : null;
const restaurantPageSlotsPath = path.join(SITE_ROOT, RESTAURANT_PAGE_SLOTS_DATA);
const restaurantPageSlots = fs.existsSync(restaurantPageSlotsPath)
  ? JSON.parse(fs.readFileSync(restaurantPageSlotsPath, 'utf8'))
  : null;
const restaurantProofLayerPath = path.join(SITE_ROOT, RESTAURANT_PROOF_LAYER_DATA);
const restaurantProofLayer = fs.existsSync(restaurantProofLayerPath)
  ? JSON.parse(fs.readFileSync(restaurantProofLayerPath, 'utf8'))
  : null;
const restaurantTaxonomyPath = path.join(SITE_ROOT, RESTAURANT_TAXONOMY_DATA);
const restaurantTaxonomy = fs.existsSync(restaurantTaxonomyPath)
  ? JSON.parse(fs.readFileSync(restaurantTaxonomyPath, 'utf8'))
  : null;
const restaurantPagePolicyPath = path.join(SITE_ROOT, RESTAURANT_PAGE_POLICY_DATA);
const restaurantPagePolicy = fs.existsSync(restaurantPagePolicyPath)
  ? JSON.parse(fs.readFileSync(restaurantPagePolicyPath, 'utf8'))
  : null;
const sitePageContractsPath = path.join(SITE_ROOT, SITE_PAGE_CONTRACTS_DATA);
const sitePageContracts = fs.existsSync(sitePageContractsPath)
  ? JSON.parse(fs.readFileSync(sitePageContractsPath, 'utf8'))
  : null;
const docsContractsPath = path.join(SITE_ROOT, DOCS_CONTRACTS_DATA);
const docsContracts = fs.existsSync(docsContractsPath)
  ? JSON.parse(fs.readFileSync(docsContractsPath, 'utf8'))
  : null;
const operatorRecipesPath = path.join(SITE_ROOT, OPERATOR_RECIPES_DATA);
const operatorRecipes = fs.existsSync(operatorRecipesPath)
  ? JSON.parse(fs.readFileSync(operatorRecipesPath, 'utf8'))
  : null;
const packageJson = JSON.parse(fs.readFileSync(path.join(SITE_ROOT, 'package.json'), 'utf8'));
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getSectionDataAttributeValues(html, attributeName) {
  const escapedAttribute = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<section\\b[^>]*\\s${escapedAttribute}="([^"]+)"`, 'g');
  const values = [];
  let match = regex.exec(html);

  while (match) {
    values.push(match[1]);
    match = regex.exec(html);
  }

  return values;
}

function getSectionTagByDataAttribute(html, attributeName, attributeValue) {
  const escapedAttribute = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<section\\b[^>]*\\s${escapedAttribute}="${escapedValue}"[^>]*>`, 'i');
  return html.match(regex)?.[0] ?? null;
}

function normalizeCommandName(command) {
  const match = command.match(/^npm run ([a-z0-9:-]+)/i);
  return match?.[1] ?? null;
}

function validateContactConfig(config) {
  if (!isPlainObject(config)) {
    errors.push(`${CONTACT_CONFIG_DATA}: top-level object is required`);
    return;
  }

  for (const fieldName of ['phoneDisplay', 'phoneE164', 'whatsappNumber', 'whatsappDefaultText']) {
    if (!isNonEmptyString(config[fieldName])) {
      errors.push(`${CONTACT_CONFIG_DATA}: ${fieldName} must be a non-empty string`);
    }
  }

  if (isNonEmptyString(config.phoneE164) && !/^\+\d{10,15}$/.test(config.phoneE164.trim())) {
    errors.push(`${CONTACT_CONFIG_DATA}: phoneE164 must be in +79990000000 format`);
  }

  if (isNonEmptyString(config.whatsappNumber) && !/^\d{10,15}$/.test(config.whatsappNumber.trim())) {
    errors.push(`${CONTACT_CONFIG_DATA}: whatsappNumber must contain digits only`);
  }
}

function validateSchemaProfile(profile) {
  if (!isPlainObject(profile)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: top-level object is required`);
    return;
  }

  if (!isPlainObject(profile.global)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: global must be an object`);
    return;
  }

  if (!isPlainObject(profile.global.provider)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: global.provider must be an object`);
  } else {
    for (const fieldName of ['name', 'url', 'addressLocality', 'addressCountry', 'openingHours']) {
      if (!isNonEmptyString(profile.global.provider[fieldName])) {
        errors.push(`${SCHEMA_PROFILE_DATA}: global.provider.${fieldName} must be a non-empty string`);
      }
    }
  }

  if (!isNonEmptyString(profile.global.areaServed)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: global.areaServed must be a non-empty string`);
  }

  if (!isPlainObject(profile.global.offers)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: global.offers must be an object`);
  } else {
    for (const fieldName of ['priceCurrency', 'price', 'availability']) {
      if (!isNonEmptyString(profile.global.offers[fieldName])) {
        errors.push(`${SCHEMA_PROFILE_DATA}: global.offers.${fieldName} must be a non-empty string`);
      }
    }
  }

  if (!isPlainObject(profile.branches)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: branches must be an object`);
  } else {
    for (const branchName of Object.keys(profile.branches)) {
      if (!['restaurant', 'household'].includes(branchName)) {
        errors.push(`${SCHEMA_PROFILE_DATA}: branches.${branchName} is not a supported branch key`);
        continue;
      }

      if (!isPlainObject(profile.branches[branchName])) {
        errors.push(`${SCHEMA_PROFILE_DATA}: branches.${branchName} must be an object`);
      }
    }
  }

  if (!isPlainObject(profile.pages)) {
    errors.push(`${SCHEMA_PROFILE_DATA}: pages must be an object`);
    return;
  }

  for (const [pageName, pageConfig] of Object.entries(profile.pages)) {
    if (!isPlainObject(pageConfig)) {
      errors.push(`${SCHEMA_PROFILE_DATA}: pages.${pageName} must be an object`);
      continue;
    }

    if (!metadata.pages?.[pageName]) {
      errors.push(`${SCHEMA_PROFILE_DATA}: pages.${pageName} points to a page missing from data/page-metadata.json`);
      continue;
    }

    const branch = metadata.pages?.[pageName]?.branch;
    if (branch !== 'restaurant' && branch !== 'household') {
      errors.push(`${SCHEMA_PROFILE_DATA}: pages.${pageName} must map to restaurant or household branch page`);
    }
  }
}

function toRepoPathCandidate(value) {
  if (!isNonEmptyString(value)) return null;
  if (value.startsWith('#')) return null;
  if (value.includes('://')) return null;
  if (value.startsWith('mailto:') || value.startsWith('tel:')) return null;

  const cleanTarget = value.split('#', 1)[0].split('?', 1)[0].trim();
  if (!cleanTarget) return null;

  const normalized = cleanTarget.startsWith('./')
    ? cleanTarget.slice(2)
    : cleanTarget.startsWith('/')
      ? cleanTarget.slice(1)
      : cleanTarget;

  if (!normalized) return null;
  return normalized;
}

function validateDocsIntegrity() {
  if (!docsContracts || typeof docsContracts !== 'object') {
    errors.push(`${DOCS_CONTRACTS_DATA}: docs contract manifest missing or invalid`);
    return;
  }

  for (const docName of [
    ...(docsContracts.canonicalDocs ?? []),
    ...(docsContracts.referenceDocs ?? []),
  ]) {
    const docPath = path.join(DOCS_ROOT, docName);
    if (!fs.existsSync(docPath)) {
      errors.push(`docs/${docName}: required docs file missing`);
    }
  }

  for (const docName of docsContracts.removedHistoricalDocs ?? []) {
    const docPath = path.join(DOCS_ROOT, docName);
    if (fs.existsSync(docPath)) {
      errors.push(`docs/${docName}: historical one-off doc should be removed from the live docs set`);
    }
  }

  const docContents = new Map();
  for (const docName of [
    ...(docsContracts.canonicalDocs ?? []),
    ...(docsContracts.referenceDocs ?? []),
  ]) {
    const docPath = path.join(DOCS_ROOT, docName);
    if (fs.existsSync(docPath)) {
      docContents.set(docName, fs.readFileSync(docPath, 'utf8'));
    }
  }

  for (const docName of docsContracts.canonicalDocs ?? []) {
    const content = docContents.get(docName) ?? '';
    for (const forbidden of docsContracts.forbiddenCanonicalPatterns ?? []) {
      if (content.includes(forbidden)) {
        errors.push(`docs/${docName}: stale reference to ${forbidden}`);
      }
    }
  }

  for (const [docName, requiredLinks] of Object.entries(docsContracts.requiredDocLinks ?? {})) {
    const content = docContents.get(docName) ?? '';
    for (const requiredLink of requiredLinks) {
      if (!content.includes(requiredLink)) {
        errors.push(`docs/${docName}: must reference ${requiredLink}`);
      }

      const repoPathCandidate = toRepoPathCandidate(requiredLink);
      if (!repoPathCandidate) continue;
      if (!fs.existsSync(path.join(SITE_ROOT, repoPathCandidate))) {
        errors.push(`docs/${docName}: linked path missing in repo: ${repoPathCandidate}`);
      }
    }
  }

  for (const [docName, requiredMentions] of Object.entries(docsContracts.requiredDocMentions ?? {})) {
    const content = docContents.get(docName) ?? '';
    for (const requiredMention of requiredMentions) {
      if (!content.includes(requiredMention)) {
        errors.push(`docs/${docName}: must mention ${requiredMention}`);
      }
    }
  }
}

function validateScreenshotAuditContract() {
  for (const manifestPath of [SCREENSHOT_AUDIT_DATA, RESTAURANT_SCREENSHOT_AUDIT_DATA]) {
    const absolutePath = path.join(SITE_ROOT, manifestPath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`${manifestPath}: file missing`);
      continue;
    }

    const { errors: auditErrors } = getAuditContractSummary(manifestPath);
    auditErrors.forEach((error) => errors.push(error));
  }
}

function validateOperatorRecipes() {
  if (!fs.existsSync(operatorRecipesPath)) {
    errors.push(`${OPERATOR_RECIPES_DATA}: file missing`);
    return;
  }

  if (!isPlainObject(operatorRecipes)) {
    errors.push(`${OPERATOR_RECIPES_DATA}: top-level object is required`);
    return;
  }

  if (!Number.isInteger(operatorRecipes.version) || operatorRecipes.version <= 0) {
    errors.push(`${OPERATOR_RECIPES_DATA}: version must be a positive integer`);
  }

  if (!Array.isArray(operatorRecipes.recipes) || operatorRecipes.recipes.length === 0) {
    errors.push(`${OPERATOR_RECIPES_DATA}: recipes must be a non-empty array`);
    return;
  }

  const availableScripts = new Set(Object.keys(packageJson.scripts ?? {}));
  const seenIds = new Set();

  for (const [index, recipe] of operatorRecipes.recipes.entries()) {
    const context = `${OPERATOR_RECIPES_DATA}: recipes[${index}]`;
    if (!isPlainObject(recipe)) {
      errors.push(`${context} must be an object`);
      continue;
    }

    if (!isNonEmptyString(recipe.id)) {
      errors.push(`${context}.id must be a non-empty string`);
    } else if (seenIds.has(recipe.id)) {
      errors.push(`${context}.id duplicates ${recipe.id}`);
    } else {
      seenIds.add(recipe.id);
    }

    if (!VALID_RECIPE_BRANCHES.has(recipe.branch)) {
      errors.push(`${context}.branch must be one of ${Array.from(VALID_RECIPE_BRANCHES).join(', ')}`);
    }

    if (!VALID_RECIPE_PAGE_KINDS.has(recipe.pageKind)) {
      errors.push(`${context}.pageKind must be one of ${Array.from(VALID_RECIPE_PAGE_KINDS).join(', ')}`);
    }

    for (const fieldName of ['intent', 'entryCommand', 'preferredEditSurface', 'validationCommand']) {
      if (!isNonEmptyString(recipe[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty string`);
      }
    }

    if (isNonEmptyString(recipe.preferredEditSurface)) {
      const editSurfacePath = path.join(SITE_ROOT, recipe.preferredEditSurface);
      if (!fs.existsSync(editSurfacePath)) {
        errors.push(`${context}.preferredEditSurface points to missing file ${recipe.preferredEditSurface}`);
      }
    }

    if (!Array.isArray(recipe.allowedCommands) || recipe.allowedCommands.length === 0) {
      errors.push(`${context}.allowedCommands must be a non-empty array`);
    }

    if (!Array.isArray(recipe.forbiddenCommands)) {
      errors.push(`${context}.forbiddenCommands must be an array`);
    }

    if (Array.isArray(recipe.allowedCommands) && Array.isArray(recipe.forbiddenCommands)) {
      const forbiddenSet = new Set(recipe.forbiddenCommands);
      recipe.allowedCommands.forEach((command) => {
        if (forbiddenSet.has(command)) {
          errors.push(`${context}: command appears in both allowedCommands and forbiddenCommands: ${command}`);
        }
      });
    }

    if (typeof recipe.requiresSync !== 'boolean') {
      errors.push(`${context}.requiresSync must be boolean`);
    }

    if (recipe.requiresSync && !isNonEmptyString(recipe.syncCommand)) {
      errors.push(`${context}.syncCommand must be a non-empty string when requiresSync=true`);
    }

    if (!recipe.requiresSync && recipe.syncCommand !== null) {
      errors.push(`${context}.syncCommand must be null when requiresSync=false`);
    }

    const referencedCommands = [
      recipe.entryCommand,
      recipe.validationCommand,
      ...(recipe.allowedCommands ?? []),
      ...(recipe.syncCommand ? [recipe.syncCommand] : []),
      ...(recipe.forbiddenCommands ?? []),
    ];

    referencedCommands.forEach((command, commandIndex) => {
      if (!isNonEmptyString(command)) {
        errors.push(`${context}: command[${commandIndex}] must be a non-empty string`);
        return;
      }

      const scriptName = normalizeCommandName(command);
      if (scriptName && !availableScripts.has(scriptName)) {
        errors.push(`${context}: references unknown npm script ${scriptName}`);
      }
    });

    const joinedAllowed = [recipe.entryCommand, ...(recipe.allowedCommands ?? []), recipe.syncCommand ?? ''].join('\n');
    const joinedForbidden = (recipe.forbiddenCommands ?? []).join('\n');

    if (recipe.branch === 'household') {
      if (joinedAllowed.includes('restaurant:')) {
        errors.push(`${context}: household recipe must not allow restaurant:* commands`);
      }
      if (!joinedForbidden.includes('restaurant:')) {
        errors.push(`${context}: household recipe must explicitly forbid restaurant:* commands`);
      }
    }

    if (recipe.branch === 'restaurant') {
      if (joinedAllowed.includes('household:')) {
        errors.push(`${context}: restaurant recipe must not allow household:* commands`);
      }
      if (!joinedForbidden.includes('household:')) {
        errors.push(`${context}: restaurant recipe must explicitly forbid household:* commands`);
      }
    }

    if (recipe.branch === 'shared' && (joinedAllowed.includes('household:') || joinedAllowed.includes('restaurant:'))) {
      errors.push(`${context}: shared recipe must not route through branch authoring commands`);
    }
  }

  REQUIRED_RECIPE_IDS.forEach((recipeId) => {
    if (!seenIds.has(recipeId)) {
      errors.push(`${OPERATOR_RECIPES_DATA}: missing required recipe ${recipeId}`);
    }
  });
}

function validateHouseholdRoutingHint(value, context) {
  if (!isPlainObject(value)) {
    errors.push(`${context} must be an object`);
    return;
  }

  for (const fieldName of ['badge', 'title', 'description']) {
    if (!isNonEmptyString(value[fieldName])) {
      errors.push(`${context}.${fieldName} must be a non-empty string`);
    }
  }

  if (!Array.isArray(value.cards) || value.cards.length === 0) {
    errors.push(`${context}.cards must be a non-empty array`);
    return;
  }

  value.cards.forEach((card, index) => {
    if (!isPlainObject(card)) {
      errors.push(`${context}.cards[${index}] must be an object`);
      return;
    }

    for (const fieldName of ['title', 'description']) {
      if (!isNonEmptyString(card[fieldName])) {
        errors.push(`${context}.cards[${index}].${fieldName} must be a non-empty string`);
      }
    }
  });
}

function validateHouseholdAdvisoryCards(value, context) {
  if (!isPlainObject(value)) {
    errors.push(`${context} must be an object`);
    return;
  }

  for (const fieldName of ['badge', 'title', 'description']) {
    if (!isNonEmptyString(value[fieldName])) {
      errors.push(`${context}.${fieldName} must be a non-empty string`);
    }
  }

  for (const fieldName of ['safeChecks', 'dontDoList', 'urgencySignals']) {
    if (!isArrayOfNonEmptyStrings(value[fieldName])) {
      errors.push(`${context}.${fieldName} must be a non-empty array of strings`);
    }
  }
}

function validateServiceKpi(value, context) {
  if (!isPlainObject(value)) {
    errors.push(`${context} must be an object`);
    return;
  }

  for (const fieldName of ['badge', 'title', 'description']) {
    if (!isNonEmptyString(value[fieldName])) {
      errors.push(`${context}.${fieldName} must be a non-empty string`);
    }
  }

  if (!Array.isArray(value.items) || value.items.length !== 4) {
    errors.push(`${context}.items must be an array of exactly 4 items`);
    return;
  }

  value.items.forEach((item, index) => {
    if (!isPlainObject(item)) {
      errors.push(`${context}.items[${index}] must be an object`);
      return;
    }

    for (const fieldName of ['value', 'label', 'note']) {
      if (!isNonEmptyString(item[fieldName])) {
        errors.push(`${context}.items[${index}].${fieldName} must be a non-empty string`);
      }
    }
  });
}

function getBodyClasses(html) {
  const className = html.match(/<body[^>]+class="([^"]*)"/i)?.[1] ?? '';
  return new Set(className.split(/\s+/).filter(Boolean));
}

function getExpectedPageClass(page) {
  return `page-${page.replace(/\.html$/, '')}`;
}

function getHouseholdPolicyKey(service) {
  return service?.isShadow ? 'shadowPage' : 'publicPage';
}

function getHouseholdPolicy(service) {
  const policyKey = getHouseholdPolicyKey(service);
  return householdPagePolicy?.[policyKey] ?? null;
}

function getHouseholdSharedCardConfig() {
  return householdPagePolicy?.sharedCardSlots ?? null;
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
  const phoneLinksWithoutContract = html.match(
    /<a\b(?=[^>]*href="tel:[^"]+")(?![^>]*data-contact-link="phone")[^>]*>/g
  ) || [];
  const whatsappLinksWithoutContract = html.match(
    /<a\b(?=[^>]*href="https:\/\/wa\.me\/[^"]+")(?![^>]*data-contact-link="whatsapp")[^>]*>/g
  ) || [];

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

  if (phoneLinksWithoutContract.length > 0) {
    errors.push(
      `${fileName}: tel links must include data-contact-link="phone" for centralized contact hydration`
    );
  }

  if (whatsappLinksWithoutContract.length > 0) {
    errors.push(
      `${fileName}: wa.me links must include data-contact-link="whatsapp" for centralized contact hydration`
    );
  }

  const routeKey = RESTAURANT_ROUTE_STRIP_CONTRACT.pages[fileName];
  if (routeKey) {
    const routeStrip = restaurantBranch?.routeStrips?.[routeKey];
    if (routeStrip) {
      if (!html.includes(`${RESTAURANT_ROUTE_STRIP_CONTRACT.selectorPrefix}="${routeKey}"`)) {
        errors.push(
          `${fileName}: missing ${RESTAURANT_ROUTE_STRIP_CONTRACT.selectorPrefix}="${routeKey}"`
        );
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
          errors.push(
            `${fileName}: missing ${attr} for ${RESTAURANT_ROUTE_STRIP_CONTRACT.dataFile} router contract`
          );
        }
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

function validateHouseholdTaxonomy(taxonomy) {
  if (!taxonomy || typeof taxonomy !== 'object') {
    errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: top-level object is required`);
    return;
  }

  if (!Array.isArray(taxonomy.families) || taxonomy.families.length === 0) {
    errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: families must be a non-empty array`);
  }

  if (!Array.isArray(taxonomy.devices) || taxonomy.devices.length === 0) {
    errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: devices must be a non-empty array`);
  }

  const familyMap = new Map();
  (taxonomy.families ?? []).forEach((family, index) => {
    const context = `${HOUSEHOLD_TAXONOMY_DATA}: families[${index}]`;
    if (!family || typeof family !== 'object') {
      errors.push(`${context} must be an object`);
      return;
    }

    if (!isNonEmptyString(family.slug)) {
      errors.push(`${context}.slug must be a non-empty string`);
      return;
    }

    if (familyMap.has(family.slug)) {
      errors.push(`${context}.slug duplicates ${family.slug}`);
      return;
    }

    familyMap.set(family.slug, family);

    for (const fieldName of ['allowedSymptoms', 'brandPool', 'relatedFamilies']) {
      if (!isArrayOfNonEmptyStrings(family[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty array of strings`);
      }
    }
  });

  const devicePageSet = new Set();
  const deviceSlugSet = new Set();
  (taxonomy.devices ?? []).forEach((device, index) => {
    const context = `${HOUSEHOLD_TAXONOMY_DATA}: devices[${index}]`;
    if (!device || typeof device !== 'object') {
      errors.push(`${context} must be an object`);
      return;
    }

    for (const fieldName of ['page', 'slug', 'family', 'deviceName', 'uiLabel']) {
      if (!isNonEmptyString(device[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty string`);
      }
    }

    if (typeof device.isShadow !== 'boolean') {
      errors.push(`${context}.isShadow must be a boolean`);
    }

    if (isNonEmptyString(device.page)) {
      if (devicePageSet.has(device.page)) {
        errors.push(`${context}.page duplicates ${device.page}`);
      } else {
        devicePageSet.add(device.page);
      }
    }

    if (isNonEmptyString(device.slug)) {
      if (deviceSlugSet.has(device.slug)) {
        errors.push(`${context}.slug duplicates ${device.slug}`);
      } else {
        deviceSlugSet.add(device.slug);
      }
    }

    if (isNonEmptyString(device.family) && !familyMap.has(device.family)) {
      errors.push(`${context}.family must point to a known taxonomy family`);
    }
  });

  if (!taxonomy.symptomAliases || typeof taxonomy.symptomAliases !== 'object' || Array.isArray(taxonomy.symptomAliases)) {
    errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: symptomAliases must be an object`);
  } else {
    Object.entries(taxonomy.symptomAliases).forEach(([symptom, aliases]) => {
      if (!isNonEmptyString(symptom) || !isArrayOfNonEmptyStrings(aliases)) {
        errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: symptomAliases.${symptom} must be a non-empty array of strings`);
      }
    });
  }

  if (!taxonomy.relatedRules || typeof taxonomy.relatedRules !== 'object') {
    errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: relatedRules must be an object`);
  } else {
    const { maxLinks, sameBranchOnly, allowSelfLink, publicTargetsMustStayPublic } =
      taxonomy.relatedRules;
    if (!Number.isInteger(maxLinks) || maxLinks < 1) {
      errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: relatedRules.maxLinks must be a positive integer`);
    }
    if (typeof sameBranchOnly !== 'boolean') {
      errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: relatedRules.sameBranchOnly must be a boolean`);
    }
    if (typeof allowSelfLink !== 'boolean') {
      errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: relatedRules.allowSelfLink must be a boolean`);
    }
    if (typeof publicTargetsMustStayPublic !== 'boolean') {
      errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: relatedRules.publicTargetsMustStayPublic must be a boolean`);
    }
  }
}

function validateHouseholdPagePolicy(policy) {
  if (!policy || typeof policy !== 'object') {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}: top-level object is required`);
    return;
  }

  for (const policyKey of ['publicPage', 'shadowPage']) {
    const contract = policy[policyKey];
    const context = `${HOUSEHOLD_PAGE_POLICY_DATA}: ${policyKey}`;
    if (!contract || typeof contract !== 'object') {
      errors.push(`${context} must be an object`);
      continue;
    }

    for (const fieldName of ['requiredRegistryFields', 'defaultSectionIds', 'requiredSectionIds', 'requiredFormFields']) {
      if (!isArrayOfNonEmptyStrings(contract[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty array of strings`);
      }
    }

    if (policyKey === 'publicPage' && !isArrayOfNonEmptyStrings(contract.requiredSlotAnchors)) {
      errors.push(`${context}.requiredSlotAnchors must be a non-empty array of strings`);
    }

    if (policyKey === 'publicPage' && !isArrayOfNonEmptyStrings(contract.requiredSlotFields)) {
      errors.push(`${context}.requiredSlotFields must be a non-empty array of strings`);
    }

    if (policyKey === 'publicPage' && !isArrayOfNonEmptyStrings(contract.requiredSyncZones)) {
      errors.push(`${context}.requiredSyncZones must be a non-empty array of strings`);
    }

    if (!isArrayOfNonEmptyStrings(contract.requiredBodyClasses)) {
      errors.push(`${context}.requiredBodyClasses must be a non-empty array of strings`);
    }

    if (typeof contract.requirePageSlugClass !== 'boolean') {
      errors.push(`${context}.requirePageSlugClass must be a boolean`);
    }

    if (!contract.requiredHtmlMarkers || typeof contract.requiredHtmlMarkers !== 'object') {
      errors.push(`${context}.requiredHtmlMarkers must be an object`);
      continue;
    }

    for (const fieldName of ['formClass', 'faqClass']) {
      if (!isNonEmptyString(contract.requiredHtmlMarkers[fieldName])) {
        errors.push(`${context}.requiredHtmlMarkers.${fieldName} must be a non-empty string`);
      }
    }

    if (typeof contract.requiredHtmlMarkers.requireH1 !== 'boolean') {
      errors.push(`${context}.requiredHtmlMarkers.requireH1 must be a boolean`);
    }
  }

  if (!policy.sharedCardSlots || typeof policy.sharedCardSlots !== 'object') {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots must be an object`);
    return;
  }

  if (!isArrayOfNonEmptyStrings(policy.sharedCardSlots.branchPages)) {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.branchPages must be a non-empty array of strings`);
  }

  if (!isArrayOfNonEmptyStrings(policy.sharedCardSlots.requiredBodyClasses)) {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.requiredBodyClasses must be a non-empty array of strings`);
  }

  if (typeof policy.sharedCardSlots.requirePageSlugClass !== 'boolean') {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.requirePageSlugClass must be a boolean`);
  }

  if (!isArrayOfNonEmptyStrings(policy.sharedCardSlots.allowedSections)) {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.allowedSections must be a non-empty array of strings`);
  }

  if (!policy.sharedCardSlots.anchorMap || typeof policy.sharedCardSlots.anchorMap !== 'object') {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.anchorMap must be an object`);
    return;
  }

  for (const sectionName of policy.sharedCardSlots.allowedSections ?? []) {
    if (!isNonEmptyString(policy.sharedCardSlots.anchorMap[sectionName])) {
      errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.anchorMap.${sectionName} must be a non-empty string`);
    }
  }

  if (!isPlainObject(policy.sharedCardSlots.pageContracts)) {
    errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts must be an object`);
    return;
  }

  for (const page of policy.sharedCardSlots.branchPages ?? []) {
    const contract = policy.sharedCardSlots.pageContracts[page];
    if (!isPlainObject(contract)) {
      errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts.${page} must be an object`);
      continue;
    }

    for (const fieldName of ['requiredCardSections', 'requiredProofSections']) {
      if (!isArrayOfNonEmptyStrings(contract[fieldName])) {
        errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts.${page}.${fieldName} must be a non-empty array of strings`);
        continue;
      }

      for (const sectionName of contract[fieldName]) {
        if (!(policy.sharedCardSlots.allowedSections ?? []).includes(sectionName)) {
          errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts.${page}.${fieldName} contains unknown section ${sectionName}`);
        }
      }
    }
  }
}

function validateHouseholdCardPresets(cardPresets) {
  if (!cardPresets || typeof cardPresets !== 'object') {
    errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}: top-level object is required`);
    return;
  }

  if (!isArrayOfNonEmptyStrings(cardPresets.allowedTones)) {
    errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.allowedTones must be a non-empty array of strings`);
  }

  if (!isArrayOfNonEmptyStrings(cardPresets.ctaVocabulary)) {
    errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.ctaVocabulary must be a non-empty array of strings`);
  }

  if (!cardPresets.variants || typeof cardPresets.variants !== 'object') {
    errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.variants must be an object`);
  } else {
    for (const [variantName, variantConfig] of Object.entries(cardPresets.variants)) {
      const context = `${HOUSEHOLD_CARD_PRESETS_DATA}.variants.${variantName}`;
      if (!variantConfig || typeof variantConfig !== 'object') {
        errors.push(`${context} must be an object`);
        continue;
      }

      if (!isNonEmptyString(variantConfig.cardType)) {
        errors.push(`${context}.cardType must be a non-empty string`);
      }

      if (!isArrayOfNonEmptyStrings(variantConfig.allowedTones)) {
        errors.push(`${context}.allowedTones must be a non-empty array of strings`);
      }
    }
  }

  for (const fieldName of ['pageIcons', 'pageTones']) {
    if (!cardPresets[fieldName] || typeof cardPresets[fieldName] !== 'object' || Array.isArray(cardPresets[fieldName])) {
      errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.${fieldName} must be an object`);
    }
  }
}

function validateHouseholdProofCopy(sectionConfig, context) {
  if (!isPlainObject(sectionConfig)) {
    errors.push(`${context} must be an object`);
    return false;
  }

  for (const fieldName of ['badge', 'title', 'description']) {
    if (!isNonEmptyString(sectionConfig[fieldName])) {
      errors.push(`${context}.${fieldName} must be a non-empty string`);
    }
  }

  return true;
}

function validateHouseholdProofCards(cards, context, allowedTones) {
  if (!Array.isArray(cards) || cards.length === 0) {
    errors.push(`${context}.cards must be a non-empty array`);
    return;
  }

  cards.forEach((card, index) => {
    const cardContext = `${context}.cards[${index}]`;
    if (!isPlainObject(card)) {
      errors.push(`${cardContext} must be an object`);
      return;
    }

    validateCardTone(card.tone, cardContext, allowedTones);

    for (const fieldName of ['badge', 'icon', 'title', 'description', 'outcome']) {
      if (!isNonEmptyString(card[fieldName])) {
        errors.push(`${cardContext}.${fieldName} must be a non-empty string`);
      }
    }
  });
}

function validateHouseholdReviewCards(cards, context, allowedTones) {
  if (!Array.isArray(cards) || cards.length === 0) {
    errors.push(`${context}.cards must be a non-empty array`);
    return;
  }

  cards.forEach((card, index) => {
    const cardContext = `${context}.cards[${index}]`;
    if (!isPlainObject(card)) {
      errors.push(`${cardContext} must be an object`);
      return;
    }

    validateCardTone(card.tone, cardContext, allowedTones);

    for (const fieldName of ['badge', 'quote', 'author', 'meta']) {
      if (!isNonEmptyString(card[fieldName])) {
        errors.push(`${cardContext}.${fieldName} must be a non-empty string`);
      }
    }
  });
}

function validateHouseholdCaseCards(cards, context, allowedTones) {
  if (!Array.isArray(cards) || cards.length === 0) {
    errors.push(`${context}.cards must be a non-empty array`);
    return;
  }

  cards.forEach((card, index) => {
    const cardContext = `${context}.cards[${index}]`;
    if (!isPlainObject(card)) {
      errors.push(`${cardContext} must be an object`);
      return;
    }

    validateCardTone(card.tone, cardContext, allowedTones);

    for (const fieldName of ['badge', 'title', 'description', 'result', 'meta']) {
      if (!isNonEmptyString(card[fieldName])) {
        errors.push(`${cardContext}.${fieldName} must be a non-empty string`);
      }
    }

    if (card.icon != null && !isNonEmptyString(card.icon)) {
      errors.push(`${cardContext}.icon must be a non-empty string when present`);
    }
  });
}

function validateHouseholdProofStrip(sectionConfig, context, allowedTones) {
  if (!validateHouseholdProofCopy(sectionConfig, context)) {
    errors.push(`${context}.items must be a non-empty array`);
    return;
  }

  if (!Array.isArray(sectionConfig.items) || sectionConfig.items.length === 0) {
    errors.push(`${context}.items must be a non-empty array`);
    return;
  }

  sectionConfig.items.forEach((item, index) => {
    const itemContext = `${context}.items[${index}]`;
    if (!isPlainObject(item)) {
      errors.push(`${itemContext} must be an object`);
      return;
    }

    validateCardTone(item.tone, itemContext, allowedTones);
    for (const fieldName of ['value', 'label', 'description']) {
      if (!isNonEmptyString(item[fieldName])) {
        errors.push(`${itemContext}.${fieldName} must be a non-empty string`);
      }
    }
  });
}

function validateHouseholdProofLayer(proofLayer) {
  if (!isPlainObject(proofLayer)) {
    errors.push(`${HOUSEHOLD_PROOF_LAYER_DATA}: top-level object is required`);
    return;
  }

  const allowedTones = new Set(householdCardPresets?.allowedTones ?? []);
  const branchPages = new Set(getHouseholdSharedCardConfig()?.branchPages ?? []);
  const anchorMap = getHouseholdSharedCardConfig()?.anchorMap ?? {};
  const allowedBranchSections = new Set(['proofCards', 'reviewCards', 'caseCards', 'objectionCards']);

  if (!isPlainObject(proofLayer.serviceDefaults)) {
    errors.push(`${HOUSEHOLD_PROOF_LAYER_DATA}.serviceDefaults must be an object`);
  } else {
    const defaults = proofLayer.serviceDefaults;
    const slaContext = `${HOUSEHOLD_PROOF_LAYER_DATA}.serviceDefaults.slaStrip`;
    const priceClarityContext = `${HOUSEHOLD_PROOF_LAYER_DATA}.serviceDefaults.priceClarity`;
    const cardsContext = `${HOUSEHOLD_PROOF_LAYER_DATA}.serviceDefaults.proofCards`;
    const objectionContext = `${HOUSEHOLD_PROOF_LAYER_DATA}.serviceDefaults.objectionCards`;

    validateHouseholdProofStrip(defaults.slaStrip, slaContext, allowedTones);
    validateHouseholdProofStrip(defaults.priceClarity, priceClarityContext, allowedTones);

    if (validateHouseholdProofCopy(defaults.proofCards, cardsContext)) {
      validateHouseholdProofCards(defaults.proofCards.cards, cardsContext, allowedTones);
    }

    if (validateHouseholdProofCopy(defaults.objectionCards, objectionContext)) {
      validateHouseholdProofCards(defaults.objectionCards.cards, objectionContext, allowedTones);
    }
  }

  if (!isPlainObject(proofLayer.branchPages)) {
    errors.push(`${HOUSEHOLD_PROOF_LAYER_DATA}.branchPages must be an object`);
    return;
  }

  branchPages.forEach((page) => {
    const context = `${HOUSEHOLD_PROOF_LAYER_DATA}.branchPages.${page}`;
    const entry = proofLayer.branchPages[page];
    const pageMeta = metadata.pages[page];
    const html = pageMeta ? read(page) : '';

    if (!pageMeta || pageMeta.branch !== 'household') {
      errors.push(`${context} must point to an existing household branch page`);
      return;
    }

    if (!isPlainObject(entry)) {
      errors.push(`${context} must be an object`);
      return;
    }

    const sectionNames = Object.keys(entry);
    if (!sectionNames.length) {
      errors.push(`${context} must define at least one branch proof section`);
      return;
    }

    sectionNames.forEach((sectionName) => {
      const sectionContext = `${context}.${sectionName}`;
      if (!allowedBranchSections.has(sectionName)) {
        errors.push(`${sectionContext} is not an allowed proof-layer branch section`);
        return;
      }

      const slotAnchor = anchorMap[sectionName];
      if (slotAnchor && !html.includes(`data-slot="${slotAnchor}"`)) {
        errors.push(`${page}: missing data-slot="${slotAnchor}" for proof-layer section ${sectionName}`);
      }

      if (!validateHouseholdProofCopy(entry[sectionName], sectionContext)) {
        return;
      }

      if (sectionName === 'proofCards') {
        validateHouseholdProofCards(entry[sectionName].cards, sectionContext, allowedTones);
      }

      if (sectionName === 'reviewCards') {
        validateHouseholdReviewCards(entry[sectionName].cards, sectionContext, allowedTones);
      }

      if (sectionName === 'caseCards') {
        validateHouseholdCaseCards(entry[sectionName].cards, sectionContext, allowedTones);
      }

      if (sectionName === 'objectionCards') {
        validateHouseholdProofCards(entry[sectionName].cards, sectionContext, allowedTones);
      }
    });
  });
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
  const familyMap = new Map((householdTaxonomy?.families ?? []).map((family) => [family.slug, family]));
  const taxonomyByPage = new Map((householdTaxonomy?.devices ?? []).map((device) => [device.page, device]));
  const relatedRules = householdTaxonomy?.relatedRules ?? {};

  const registryByPage = new Map();
  const slugSet = new Set();

  registry.services.forEach((service, index) => {
    const context = `${HOUSEHOLD_SERVICES_DATA}: services[${index}]`;
    const policy = getHouseholdPolicy(service);

    if (!service || typeof service !== 'object') {
      errors.push(`${context} must be an object`);
      return;
    }

    const requiredRegistryFields = policy?.requiredRegistryFields ?? [
      'page',
      'slug',
      'uiLabel',
      'deviceName',
      'serviceName',
      'schemaName',
      'isShadow',
      'primarySymptoms',
      'brandCluster',
      'relatedPages',
      'formExample',
      'sectionIds',
    ];

    for (const fieldName of requiredRegistryFields) {
      if (fieldName === 'isShadow') continue;
      if (fieldName === 'primarySymptoms' || fieldName === 'brandCluster' || fieldName === 'sectionIds') {
        if (!isArrayOfNonEmptyStrings(service[fieldName])) {
          errors.push(`${context}.${fieldName} must be a non-empty array of strings`);
        }
        continue;
      }
      if (fieldName === 'relatedPages') {
        if (!Array.isArray(service.relatedPages) || !service.relatedPages.every((page) => isNonEmptyString(page))) {
          errors.push(`${context}.relatedPages must be an array of non-empty strings`);
        }
        continue;
      }
      if (!isNonEmptyString(service[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty string`);
      }
    }

    if (typeof service.isShadow !== 'boolean') {
      errors.push(`${context}.isShadow must be a boolean`);
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

    const taxonomyDevice = taxonomyByPage.get(service.page);
    if (!taxonomyDevice) {
      errors.push(`${context}.page missing in ${HOUSEHOLD_TAXONOMY_DATA}`);
    } else {
      if (taxonomyDevice.slug !== service.slug) {
        errors.push(`${context}.slug must match taxonomy device ${taxonomyDevice.slug}`);
      }
      if (taxonomyDevice.deviceName !== service.deviceName) {
        errors.push(`${context}.deviceName must match taxonomy device ${taxonomyDevice.deviceName}`);
      }
      if (taxonomyDevice.uiLabel !== service.uiLabel) {
        errors.push(`${context}.uiLabel must match taxonomy device ${taxonomyDevice.uiLabel}`);
      }
      if (taxonomyDevice.isShadow !== service.isShadow) {
        errors.push(`${context}.isShadow must match taxonomy device state`);
      }

      const family = familyMap.get(taxonomyDevice.family);
      if (!family) {
        errors.push(`${context}.taxonomy family ${taxonomyDevice.family} is missing`);
      } else {
        for (const symptom of service.primarySymptoms ?? []) {
          if (!family.allowedSymptoms.includes(symptom)) {
            errors.push(`${context}.primarySymptoms contains ${symptom}, outside taxonomy family ${taxonomyDevice.family}`);
          }
        }

        for (const brand of service.brandCluster ?? []) {
          if (!family.brandPool.includes(brand)) {
            errors.push(`${context}.brandCluster contains ${brand}, outside taxonomy family ${taxonomyDevice.family}`);
          }
        }
      }
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

    if (policy?.requiredHtmlMarkers?.requireH1 && !html.match(/<h1[\s>]/i)) {
      errors.push(`${context}.page must include an h1`);
    }

    for (const requiredSectionId of policy?.requiredSectionIds ?? []) {
      if (!service.sectionIds?.includes(requiredSectionId)) {
        errors.push(`${context}.sectionIds must include policy-required section "${requiredSectionId}"`);
      }
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

      if (
        relatedRegistry &&
        relatedRules.sameBranchOnly &&
        metadata.pages[relatedPage]?.branch !== metadata.pages[service.page]?.branch
      ) {
        errors.push(`${context}.relatedPages[${relatedIndex}] must stay in the same branch`);
      }
    });

    if (
      Number.isInteger(relatedRules.maxLinks) &&
      Array.isArray(service.relatedPages) &&
      service.relatedPages.length > relatedRules.maxLinks
    ) {
      errors.push(`${context}.relatedPages exceeds taxonomy maxLinks=${relatedRules.maxLinks}`);
    }

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

function validateCardTone(tone, context, allowedTones) {
  if (!isNonEmptyString(tone)) {
    errors.push(`${context}.tone must be a non-empty string`);
    return;
  }

  if (!allowedTones.has(tone)) {
    errors.push(`${context}.tone must be one of ${Array.from(allowedTones).join(', ')}`);
  }
}

function validateCardAction(action, context, html, ctaVocabulary) {
  if (!action || typeof action !== 'object') {
    errors.push(`${context} must be an object`);
    return;
  }

  if (!isNonEmptyString(action.label)) {
    errors.push(`${context}.label must be a non-empty string`);
  } else if (!ctaVocabulary.has(action.label)) {
    errors.push(`${context}.label must belong to household CTA vocabulary`);
  }

  if (!isNonEmptyString(action.href)) {
    errors.push(`${context}.href must be a non-empty string`);
    return;
  }

  if (action.href.startsWith('#')) {
    const anchorId = action.href.slice(1);
    if (!anchorId || !html.includes(`id="${anchorId}"`)) {
      errors.push(`${context}.href points to missing anchor ${action.href}`);
    }
    return;
  }

  if (action.href.startsWith('tel:')) {
    return;
  }

  if (
    action.href === '@contact-phone' ||
    /^@contact-whatsapp(?:\?text=.*)?$/.test(action.href)
  ) {
    return;
  }

  if (/^https?:\/\//.test(action.href)) {
    return;
  }

  validateHtmlTarget(action.href, `${context}.href`, 'household');
  const fileName = action.href.split('#', 1)[0];
  if (metadata.pages[fileName] && isNoindexPage(metadata.pages[fileName])) {
    errors.push(`${context}.href must not point to noindex household pages`);
  }
}

function validateHouseholdCardSections(cardSections, page, publicServicePages, html) {
  const sharedCardConfig = getHouseholdSharedCardConfig();
  const allowedSections = new Set(sharedCardConfig?.allowedSections ?? []);
  const anchorMap = sharedCardConfig?.anchorMap ?? {};
  const allowedTones = new Set(householdCardPresets?.allowedTones ?? []);
  const ctaVocabulary = new Set(householdCardPresets?.ctaVocabulary ?? []);
  const pageIcons = householdCardPresets?.pageIcons ?? {};
  const pageTones = householdCardPresets?.pageTones ?? {};
  const context = `${HOUSEHOLD_PAGE_SLOTS_DATA}: pages.${page}.cardSections`;

  if (!cardSections || typeof cardSections !== 'object' || Array.isArray(cardSections)) {
    errors.push(`${context} must be an object`);
    return;
  }

  for (const [sectionName, sectionConfig] of Object.entries(cardSections)) {
    if (!allowedSections.has(sectionName)) {
      errors.push(`${context}.${sectionName} is not allowed by shared card policy`);
      continue;
    }

    const slotAnchor = anchorMap[sectionName];
    if (slotAnchor && !html.includes(`data-slot="${slotAnchor}"`)) {
      errors.push(`${page}: missing data-slot="${slotAnchor}" for ${sectionName}`);
    }

    if (!sectionConfig || typeof sectionConfig !== 'object' || Array.isArray(sectionConfig)) {
      errors.push(`${context}.${sectionName} must be an object`);
      continue;
    }

    for (const fieldName of ['badge', 'title', 'description']) {
      if (!isNonEmptyString(sectionConfig[fieldName])) {
        errors.push(`${context}.${sectionName}.${fieldName} must be a non-empty string`);
      }
    }

    if (sectionConfig.action) {
      validateCardAction(
        sectionConfig.action,
        `${context}.${sectionName}.action`,
        html,
        ctaVocabulary
      );
    }

    if (sectionName === 'categoryCards') {
      if (!Array.isArray(sectionConfig.pages) || sectionConfig.pages.length === 0) {
        errors.push(`${context}.${sectionName}.pages must be a non-empty array`);
      } else {
        sectionConfig.pages.forEach((targetPage, index) => {
          if (!publicServicePages.has(targetPage)) {
            errors.push(`${context}.${sectionName}.pages[${index}] must target a visible household service page`);
            return;
          }

          if (!isNonEmptyString(pageIcons[targetPage])) {
            errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.pageIcons.${targetPage} must exist for category cards`);
          }

          if (!isNonEmptyString(pageTones[targetPage])) {
            errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.pageTones.${targetPage} must exist for category cards`);
          } else if (!allowedTones.has(pageTones[targetPage])) {
            errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}.pageTones.${targetPage} must use an allowed tone`);
          }
        });
      }
    }

    if (sectionName === 'trustCards' || sectionName === 'contactChannels') {
      if (!Array.isArray(sectionConfig.cards) || sectionConfig.cards.length === 0) {
        errors.push(`${context}.${sectionName}.cards must be a non-empty array`);
        continue;
      }

      sectionConfig.cards.forEach((card, index) => {
        const cardContext = `${context}.${sectionName}.cards[${index}]`;
        if (!card || typeof card !== 'object') {
          errors.push(`${cardContext} must be an object`);
          return;
        }

        validateCardTone(card.tone, cardContext, allowedTones);

        for (const fieldName of ['title', 'description']) {
          if (!isNonEmptyString(card[fieldName])) {
            errors.push(`${cardContext}.${fieldName} must be a non-empty string`);
          }
        }

        if (!isNonEmptyString(card.icon)) {
          errors.push(`${cardContext}.icon must be a non-empty string`);
        }

        if (sectionName === 'trustCards') {
          if (!isNonEmptyString(card.outcome)) {
            errors.push(`${cardContext}.outcome must be a non-empty string`);
          }
        }

        if (sectionName === 'contactChannels') {
          if (!isNonEmptyString(card.badge)) {
            errors.push(`${cardContext}.badge must be a non-empty string`);
          }

          if (!isArrayOfNonEmptyStrings(card.bullets)) {
            errors.push(`${cardContext}.bullets must be a non-empty array of strings`);
          }

          if (!isNonEmptyString(card.note)) {
            errors.push(`${cardContext}.note must be a non-empty string`);
          }

          if (!Array.isArray(card.actions) || card.actions.length === 0) {
            errors.push(`${cardContext}.actions must be a non-empty array`);
          } else {
            card.actions.forEach((action, actionIndex) => {
              validateCardAction(
                action,
                `${cardContext}.actions[${actionIndex}]`,
                html,
                ctaVocabulary
              );
            });
          }
        }
      });
    }
  }
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

  if (!isPlainObject(slots.serviceKpiDefaults)) {
    errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: serviceKpiDefaults must be an object`);
  } else {
    validateServiceKpi(slots.serviceKpiDefaults, `${HOUSEHOLD_PAGE_SLOTS_DATA}: serviceKpiDefaults`);
  }

  const publicServices = (registry?.services ?? []).filter((service) => !service.isShadow);
  const publicServicePages = new Set(publicServices.map((service) => service.page));
  const sharedCardConfig = getHouseholdSharedCardConfig() ?? {};
  const branchCardPages = new Set(sharedCardConfig.branchPages ?? []);
  const expectedPages = new Set([...publicServicePages, ...branchCardPages]);
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
    const policy = getHouseholdPolicy(service);

    if (!slotEntry || typeof slotEntry !== 'object') {
      errors.push(`${context} must be an object`);
      continue;
    }

    for (const fieldName of policy?.requiredSlotFields ?? []) {
      if (fieldName === 'faq') {
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
      }

      if (fieldName === 'formHints') {
        if (!slotEntry.formHints || typeof slotEntry.formHints !== 'object') {
          errors.push(`${context}.formHints must be an object`);
        } else {
          if (!isArrayOfNonEmptyStrings(slotEntry.formHints.chips)) {
            errors.push(`${context}.formHints.chips must be a non-empty array of strings`);
          }

          for (const hintFieldName of ['typePlaceholder', 'problemPlaceholder']) {
            if (!isNonEmptyString(slotEntry.formHints[hintFieldName])) {
              errors.push(`${context}.formHints.${hintFieldName} must be a non-empty string`);
            }
          }
        }
      }
    }

    if (slotEntry.advisoryCards) {
      validateHouseholdAdvisoryCards(
        slotEntry.advisoryCards,
        `${context}.advisoryCards`
      );
    }

    const html = read(service.page);
    const bodyClasses = getBodyClasses(html);

    for (const className of policy?.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        errors.push(`${service.page}: missing body class ${className}`);
      }
    }

    if (policy?.requirePageSlugClass && !bodyClasses.has(getExpectedPageClass(service.page))) {
      errors.push(`${service.page}: missing body class ${getExpectedPageClass(service.page)}`);
    }

    for (const anchor of policy?.requiredSlotAnchors ?? []) {
      if (anchor === 'service-schema') {
        if (!/<script[^>]+type="application\/ld\+json"[^>]+data-slot="service-schema"/i.test(html)) {
          errors.push(`${service.page}: missing data-slot="service-schema" on Service JSON-LD script`);
        }
      }

      if (anchor === 'request-form') {
        if (!/<form[^>]+class="telegram-form\b[^"]*"[^>]+data-slot="request-form"/i.test(html)) {
          errors.push(`${service.page}: missing data-slot="request-form" on canonical household form`);
        }
      }
    }

    if (slotEntry.advisoryCards && !html.includes('data-slot="service-advisory"')) {
      errors.push(`${service.page}: missing data-slot="service-advisory" for advisoryCards`);
    }

    if (Object.hasOwn(slotEntry, 'serviceKpi')) {
      validateServiceKpi(slotEntry.serviceKpi, `${context}.serviceKpi`);
    }

    for (const zone of policy?.requiredSyncZones ?? []) {
      if (zone === 'service-schema') {
        if (!html.includes('data-sync-zone="service-schema"')) {
          errors.push(`${service.page}: missing data-sync-zone="service-schema"`);
        }
        continue;
      }

      if (!HOUSEHOLD_SYNC_ZONES.includes(zone)) {
        errors.push(`${service.page}: unknown household sync zone ${zone}`);
        continue;
      }

      if (!html.includes(`data-sync-zone="${zone}"`)) {
        errors.push(`${service.page}: missing data-sync-zone="${zone}"`);
      }
    }

    const syncState = analyzeHouseholdSyncState(html, {
      pageMeta: metadata.pages[service.page],
      service,
      slotEntry,
      slotsRoot: slots,
      registry,
      cardPresets: householdCardPresets,
      proofLayer: householdProofLayer,
    });

    for (const issue of syncState.issues) {
      errors.push(`${service.page}: ${issue}`);
    }

    if (slotEntry.cardSections) {
      validateHouseholdCardSections(slotEntry.cardSections, service.page, publicServicePages, html);
    }
  }

  for (const page of branchCardPages) {
    const slotEntry = slots.pages[page];
    const context = `${HOUSEHOLD_PAGE_SLOTS_DATA}: pages.${page}`;
    const pageMeta = metadata.pages[page];
    const html = metadata.pages[page] ? read(page) : '';
    const bodyClasses = getBodyClasses(html);
    const branchContract = sharedCardConfig.pageContracts?.[page];

    if (!pageMeta || pageMeta.branch !== 'household') {
      errors.push(`${context}: branch card page must exist in metadata and belong to household branch`);
      continue;
    }

    if (!slotEntry || typeof slotEntry !== 'object') {
      errors.push(`${context} must be an object`);
      continue;
    }

    if (slotEntry.routingHint) {
      validateHouseholdRoutingHint(slotEntry.routingHint, `${context}.routingHint`);
      const routingAnchor = sharedCardConfig.routingHint?.anchor;
      if (
        sharedCardConfig.routingHint?.pages?.includes(page) &&
        routingAnchor &&
        !html.includes(`data-slot="${routingAnchor}"`)
      ) {
        errors.push(`${page}: missing data-slot="${routingAnchor}" for routingHint`);
      }
    }

    for (const className of sharedCardConfig.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        errors.push(`${page}: missing body class ${className}`);
      }
    }

    if (sharedCardConfig.requirePageSlugClass && !bodyClasses.has(getExpectedPageClass(page))) {
      errors.push(`${page}: missing body class ${getExpectedPageClass(page)}`);
    }

    validateHouseholdCardSections(slotEntry.cardSections, page, publicServicePages, html);

    const routingConfig = sharedCardConfig.routingHint ?? null;
    if (routingConfig?.pages?.includes(page)) {
      if (!slotEntry.routingHint) {
        errors.push(`${context}: missing required routingHint`);
      } else if (routingConfig.anchor && !html.includes(`data-slot="${routingConfig.anchor}"`)) {
        errors.push(`${page}: missing data-slot="${routingConfig.anchor}" for routingHint`);
      }
    }

    for (const sectionName of branchContract?.requiredCardSections ?? []) {
      if (!slotEntry.cardSections?.[sectionName]) {
        errors.push(`${context}: missing required card section ${sectionName}`);
        continue;
      }

      const anchor = sharedCardConfig.anchorMap?.[sectionName];
      if (anchor && !html.includes(`data-slot="${anchor}"`)) {
        errors.push(`${page}: missing data-slot="${anchor}" for required card section ${sectionName}`);
      }
    }

    const proofEntry = householdProofLayer?.branchPages?.[page] ?? null;
    if (!isPlainObject(proofEntry)) {
      errors.push(`${HOUSEHOLD_PROOF_LAYER_DATA}: missing branch proof entry for ${page}`);
      continue;
    }

    for (const sectionName of branchContract?.requiredProofSections ?? []) {
      if (!proofEntry[sectionName]) {
        errors.push(`${HOUSEHOLD_PROOF_LAYER_DATA}: ${page} missing required proof section ${sectionName}`);
        continue;
      }

      const anchor = sharedCardConfig.anchorMap?.[sectionName];
      if (anchor && !html.includes(`data-slot="${anchor}"`)) {
        errors.push(`${page}: missing data-slot="${anchor}" for required proof section ${sectionName}`);
      }
    }
  }
}

function validateSitePageContracts(contracts) {
  if (!isPlainObject(contracts)) {
    errors.push(`${SITE_PAGE_CONTRACTS_DATA}: top-level object is required`);
    return;
  }

  if (!isPlainObject(contracts.sharedLayers)) {
    errors.push(`${SITE_PAGE_CONTRACTS_DATA}.sharedLayers must be an object`);
  } else {
    if (!isNonEmptyString(contracts.sharedLayers.metadata)) {
      errors.push(`${SITE_PAGE_CONTRACTS_DATA}.sharedLayers.metadata must be a non-empty string`);
    }

    if (!isNonEmptyString(contracts.sharedLayers.runtime)) {
      errors.push(`${SITE_PAGE_CONTRACTS_DATA}.sharedLayers.runtime must be a non-empty string`);
    }

    if (!isArrayOfNonEmptyStrings(contracts.sharedLayers.branchConfigs)) {
      errors.push(`${SITE_PAGE_CONTRACTS_DATA}.sharedLayers.branchConfigs must be a non-empty array of strings`);
    }
  }

  if (!isPlainObject(contracts.pageTypes)) {
    errors.push(`${SITE_PAGE_CONTRACTS_DATA}.pageTypes must be an object`);
    return;
  }

  for (const typeName of ['restaurantBranch', 'restaurantService', 'householdBranch', 'householdService', 'neutral']) {
    const pageType = contracts.pageTypes[typeName];
    if (!isPlainObject(pageType)) {
      errors.push(`${SITE_PAGE_CONTRACTS_DATA}.pageTypes.${typeName} must be an object`);
      continue;
    }

    if (!VALID_BRANCHES.has(pageType.branch)) {
      errors.push(`${SITE_PAGE_CONTRACTS_DATA}.pageTypes.${typeName}.branch must be a valid branch`);
    }

    if (!isNonEmptyString(pageType.role)) {
      errors.push(`${SITE_PAGE_CONTRACTS_DATA}.pageTypes.${typeName}.role must be a non-empty string`);
    }
  }
}

function validateRestaurantTaxonomy(taxonomy) {
  if (!isPlainObject(taxonomy)) {
    errors.push(`${RESTAURANT_TAXONOMY_DATA}: top-level object is required`);
    return;
  }

  if (!Array.isArray(taxonomy.families) || taxonomy.families.length === 0) {
    errors.push(`${RESTAURANT_TAXONOMY_DATA}.families must be a non-empty array`);
  }

  const familySlugs = new Set();
  for (const [index, family] of (taxonomy.families ?? []).entries()) {
    const context = `${RESTAURANT_TAXONOMY_DATA}.families[${index}]`;
    if (!isPlainObject(family)) {
      errors.push(`${context} must be an object`);
      continue;
    }
    if (!isNonEmptyString(family.slug) || !isNonEmptyString(family.label)) {
      errors.push(`${context} must define slug and label`);
      continue;
    }
    familySlugs.add(family.slug);
  }

  if (!Array.isArray(taxonomy.devices) || taxonomy.devices.length === 0) {
    errors.push(`${RESTAURANT_TAXONOMY_DATA}.devices must be a non-empty array`);
  } else {
    taxonomy.devices.forEach((device, index) => {
      const context = `${RESTAURANT_TAXONOMY_DATA}.devices[${index}]`;
      if (!isPlainObject(device)) {
        errors.push(`${context} must be an object`);
        return;
      }

      for (const fieldName of ['page', 'slug', 'deviceName', 'family']) {
        if (!isNonEmptyString(device[fieldName])) {
          errors.push(`${context}.${fieldName} must be a non-empty string`);
        }
      }

      if (typeof device.isShadow !== 'boolean') {
        errors.push(`${context}.isShadow must be a boolean`);
      }

      if (isNonEmptyString(device.family) && !familySlugs.has(device.family)) {
        errors.push(`${context}.family references unknown family ${device.family}`);
      }
    });
  }

  if (!isPlainObject(taxonomy.relatedRules)) {
    errors.push(`${RESTAURANT_TAXONOMY_DATA}.relatedRules must be an object`);
  } else {
    if (!Number.isInteger(taxonomy.relatedRules.maxLinks) || taxonomy.relatedRules.maxLinks < 1) {
      errors.push(`${RESTAURANT_TAXONOMY_DATA}.relatedRules.maxLinks must be a positive integer`);
    }
    if (typeof taxonomy.relatedRules.sameFamilyFirst !== 'boolean') {
      errors.push(`${RESTAURANT_TAXONOMY_DATA}.relatedRules.sameFamilyFirst must be a boolean`);
    }
    if (typeof taxonomy.relatedRules.excludeShadow !== 'boolean') {
      errors.push(`${RESTAURANT_TAXONOMY_DATA}.relatedRules.excludeShadow must be a boolean`);
    }
  }
}

function validateRestaurantPagePolicy(policy) {
  if (!isPlainObject(policy)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}: top-level object is required`);
    return;
  }

  if (!isPlainObject(policy.publicPage)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage must be an object`);
  } else {
    for (const fieldName of ['requiredRegistryFields', 'requiredSectionIds', 'requiredSlotAnchors', 'requiredSlotFields', 'requiredBodyClasses', 'requiredFormFields', 'requiredSyncZones']) {
      if (!isArrayOfNonEmptyStrings(policy.publicPage[fieldName])) {
        errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.${fieldName} must be a non-empty array of strings`);
      }
    }

    if (typeof policy.publicPage.requirePageSlugClass !== 'boolean') {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.requirePageSlugClass must be a boolean`);
    }

    if (!isNonEmptyString(policy.publicPage.mobileSectionAttribute)) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.mobileSectionAttribute must be a non-empty string`);
    }

    if (!Array.isArray(policy.publicPage.allowedMobileHiddenSectionIds) || !policy.publicPage.allowedMobileHiddenSectionIds.every((value) => isNonEmptyString(value))) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.allowedMobileHiddenSectionIds must be an array of non-empty strings`);
    }

    if (!isPlainObject(policy.publicPage.requiredHtmlMarkers)) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.requiredHtmlMarkers must be an object`);
    } else {
      for (const fieldName of ['formClass', 'faqClass']) {
        if (!isNonEmptyString(policy.publicPage.requiredHtmlMarkers[fieldName])) {
          errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.requiredHtmlMarkers.${fieldName} must be a non-empty string`);
        }
      }

      if (typeof policy.publicPage.requiredHtmlMarkers.requireH1 !== 'boolean') {
        errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.publicPage.requiredHtmlMarkers.requireH1 must be a boolean`);
      }
    }
  }

  if (!isPlainObject(policy.branchPages)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.branchPages must be an object`);
    return;
  }

  for (const fieldName of ['pages', 'requiredBodyClasses', 'routeStripPages']) {
    if (!isArrayOfNonEmptyStrings(policy.branchPages[fieldName])) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.branchPages.${fieldName} must be a non-empty array of strings`);
    }
  }

  if (typeof policy.branchPages.requirePageSlugClass !== 'boolean') {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.branchPages.requirePageSlugClass must be a boolean`);
  }

  if (!isPlainObject(policy.sharedCardSlots)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots must be an object`);
    return;
  }

  for (const fieldName of ['branchPages', 'requiredBodyClasses', 'allowedSections']) {
    if (!isArrayOfNonEmptyStrings(policy.sharedCardSlots[fieldName])) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.${fieldName} must be a non-empty array of strings`);
    }
  }

  if (typeof policy.sharedCardSlots.requirePageSlugClass !== 'boolean') {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.requirePageSlugClass must be a boolean`);
  }

  if (!isPlainObject(policy.sharedCardSlots.anchorMap)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.anchorMap must be an object`);
  }

  if (!isPlainObject(policy.sharedCardSlots.pageContracts)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts must be an object`);
  }

  for (const sectionName of policy.sharedCardSlots.allowedSections ?? []) {
    if (!isNonEmptyString(policy.sharedCardSlots.anchorMap?.[sectionName])) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.anchorMap.${sectionName} must be a non-empty string`);
    }
  }

  for (const page of policy.sharedCardSlots.branchPages ?? []) {
    const contract = policy.sharedCardSlots.pageContracts?.[page];
    if (!isPlainObject(contract)) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts.${page} must be an object`);
      continue;
    }

    for (const fieldName of ['requiredCardSections', 'requiredProofSections']) {
      if (!isArrayOfNonEmptyStrings(contract[fieldName])) {
        errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts.${page}.${fieldName} must be a non-empty array of strings`);
        continue;
      }

      contract[fieldName].forEach((sectionName) => {
        if (!(policy.sharedCardSlots.allowedSections ?? []).includes(sectionName)) {
          errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.pageContracts.${page}.${fieldName} contains unknown section ${sectionName}`);
        }
      });
    }
  }

  if (!isPlainObject(policy.sharedCardSlots.routingHint)) {
    errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.routingHint must be an object`);
  } else {
    if (!isArrayOfNonEmptyStrings(policy.sharedCardSlots.routingHint.pages)) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.routingHint.pages must be a non-empty array of strings`);
    }
    if (!isNonEmptyString(policy.sharedCardSlots.routingHint.anchor)) {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}.sharedCardSlots.routingHint.anchor must be a non-empty string`);
    }
  }
}

function validateRestaurantProofLayer(proofLayer) {
  if (!isPlainObject(proofLayer)) {
    errors.push(`${RESTAURANT_PROOF_LAYER_DATA}: top-level object is required`);
    return;
  }

  const defaults = proofLayer.serviceDefaults;
  if (!isPlainObject(defaults)) {
    errors.push(`${RESTAURANT_PROOF_LAYER_DATA}.serviceDefaults must be an object`);
    return;
  }

  for (const sectionName of ['slaStrip', 'proofCards']) {
    const section = defaults[sectionName];
    const context = `${RESTAURANT_PROOF_LAYER_DATA}.serviceDefaults.${sectionName}`;
    if (!isPlainObject(section)) {
      errors.push(`${context} must be an object`);
      continue;
    }

    for (const fieldName of ['badge', 'title', 'description']) {
      if (!isNonEmptyString(section[fieldName])) {
        errors.push(`${context}.${fieldName} must be a non-empty string`);
      }
    }

    const listField = sectionName === 'slaStrip' ? 'items' : 'cards';
    if (!Array.isArray(section[listField]) || section[listField].length === 0) {
      errors.push(`${context}.${listField} must be a non-empty array`);
    }
  }

  if (!isPlainObject(proofLayer.branchPages)) {
    errors.push(`${RESTAURANT_PROOF_LAYER_DATA}.branchPages must be an object`);
    return;
  }

  for (const page of restaurantPagePolicy?.sharedCardSlots?.branchPages ?? []) {
    const entry = proofLayer.branchPages[page];
    if (!isPlainObject(entry)) {
      errors.push(`${RESTAURANT_PROOF_LAYER_DATA}.branchPages.${page} must be an object`);
      continue;
    }

    for (const [sectionName, section] of Object.entries(entry)) {
      const context = `${RESTAURANT_PROOF_LAYER_DATA}.branchPages.${page}.${sectionName}`;
      if (!isPlainObject(section)) {
        errors.push(`${context} must be an object`);
        continue;
      }

      for (const fieldName of ['badge', 'title', 'description']) {
        if (!isNonEmptyString(section[fieldName])) {
          errors.push(`${context}.${fieldName} must be a non-empty string`);
        }
      }

      if (sectionName === 'proofCards') {
        if (!Array.isArray(section.cards) || section.cards.length === 0) {
          errors.push(`${context}.cards must be a non-empty array`);
        }
      }

      if (sectionName === 'reviewCards' || sectionName === 'caseCards') {
        if (!Array.isArray(section.cards) || section.cards.length === 0) {
          errors.push(`${context}.cards must be a non-empty array`);
        }
      }
    }
  }
}

function validateRestaurantServicesRegistry(registry) {
  if (!isPlainObject(registry) || !Array.isArray(registry.services)) {
    errors.push(`${RESTAURANT_SERVICES_DATA}: services must be a non-empty array`);
    return;
  }

  if (registry.services.length === 0) {
    errors.push(`${RESTAURANT_SERVICES_DATA}: services must be a non-empty array`);
    return;
  }

  const registryByPage = new Map();
  const taxonomyByPage = new Map((restaurantTaxonomy?.devices ?? []).map((device) => [device.page, device]));
  const familyBySlug = new Map((restaurantTaxonomy?.families ?? []).map((family) => [family.slug, family]));
  const relatedRules = restaurantTaxonomy?.relatedRules ?? {};
  const allowedMobileHiddenSectionIds = new Set(
    restaurantPagePolicy?.publicPage?.allowedMobileHiddenSectionIds ?? []
  );
  const visibleRestaurantPages = new Set(
    (restaurantBranch?.services ?? [])
      .map((service) => service?.href?.split('#', 1)[0])
      .concat((restaurantBranch?.footerLinks ?? []).map((link) => link?.href?.split('#', 1)[0]))
      .filter((href) => typeof href === 'string' && href.endsWith('.html') && metadata.pages[href]?.branch === 'restaurant')
  );

  registry.services.forEach((service, index) => {
    const context = `${RESTAURANT_SERVICES_DATA}.services[${index}]`;
    if (!isPlainObject(service)) {
      errors.push(`${context} must be an object`);
      return;
    }

    for (const fieldName of restaurantPagePolicy?.publicPage?.requiredRegistryFields ?? []) {
      if (service[fieldName] == null) {
        errors.push(`${context}.${fieldName} is required`);
      }
    }

    if (registryByPage.has(service.page)) {
      errors.push(`${context}.page duplicates ${service.page}`);
    }
    registryByPage.set(service.page, service);

    const pageMeta = metadata.pages[service.page];
    if (!pageMeta || pageMeta.branch !== 'restaurant') {
      errors.push(`${context}.page must belong to the restaurant branch`);
    }

    if (service.isShadow) {
      errors.push(`${context}.restaurant public registry must not mark pages as shadow`);
    }

    if (service.mobileHiddenSectionIds != null) {
      if (!Array.isArray(service.mobileHiddenSectionIds) || !service.mobileHiddenSectionIds.every((value) => isNonEmptyString(value))) {
        errors.push(`${context}.mobileHiddenSectionIds must be an array of non-empty strings`);
      } else {
        const seenMobileHiddenSectionIds = new Set();
        service.mobileHiddenSectionIds.forEach((sectionId, sectionIndex) => {
          if (!allowedMobileHiddenSectionIds.has(sectionId)) {
            errors.push(`${context}.mobileHiddenSectionIds[${sectionIndex}] must be one of ${Array.from(allowedMobileHiddenSectionIds).join(', ')}`);
          }

          if (seenMobileHiddenSectionIds.has(sectionId)) {
            errors.push(`${context}.mobileHiddenSectionIds[${sectionIndex}] duplicates ${sectionId}`);
          } else {
            seenMobileHiddenSectionIds.add(sectionId);
          }
        });
      }
    }

    const taxonomyDevice = taxonomyByPage.get(service.page);
    if (!taxonomyDevice) {
      errors.push(`${context}.page missing in ${RESTAURANT_TAXONOMY_DATA}`);
    } else {
      if (taxonomyDevice.slug !== service.slug) {
        errors.push(`${context}.slug must match taxonomy device ${taxonomyDevice.slug}`);
      }
      if (taxonomyDevice.deviceName !== service.deviceName) {
        errors.push(`${context}.deviceName must match taxonomy device ${taxonomyDevice.deviceName}`);
      }
      if (taxonomyDevice.isShadow !== service.isShadow) {
        errors.push(`${context}.isShadow must match taxonomy device state`);
      }
      if (!familyBySlug.has(taxonomyDevice.family)) {
        errors.push(`${context}.taxonomy family ${taxonomyDevice.family} is missing`);
      }
    }

    if (!Array.isArray(service.relatedPages)) return;

    service.relatedPages.forEach((relatedPage, relatedIndex) => {
      if (!metadata.pages[relatedPage] || metadata.pages[relatedPage].branch !== 'restaurant') {
        errors.push(`${context}.relatedPages[${relatedIndex}] must target a restaurant page`);
        return;
      }

      if (relatedPage === service.page) {
        errors.push(`${context}.relatedPages[${relatedIndex}] must not point to itself`);
      }
    });

    if (Number.isInteger(relatedRules.maxLinks) && service.relatedPages.length > relatedRules.maxLinks) {
      errors.push(`${context}.relatedPages exceeds taxonomy maxLinks=${relatedRules.maxLinks}`);
    }

    if (!visibleRestaurantPages.has(service.page)) {
      errors.push(`${context}.page must be reachable from the restaurant branch navigation sources`);
    }
  });
}

function validateRestaurantPageSlots(slots, registry) {
  if (!isPlainObject(slots) || !isPlainObject(slots.pages)) {
    errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}: pages must be an object keyed by html file`);
    return;
  }

  if (!isPlainObject(slots.serviceKpiDefaults)) {
    errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}: serviceKpiDefaults must be an object`);
  } else {
    validateServiceKpi(slots.serviceKpiDefaults, `${RESTAURANT_PAGE_SLOTS_DATA}: serviceKpiDefaults`);
  }

  const publicServices = registry?.services ?? [];
  const branchCardPages = new Set(restaurantPagePolicy?.sharedCardSlots?.branchPages ?? []);
  const expectedPages = new Set([...publicServices.map((service) => service.page), ...branchCardPages]);
  const slotPages = new Set(Object.keys(slots.pages));

  expectedPages.forEach((page) => {
    if (!slotPages.has(page)) {
      errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}: missing slot entry for ${page}`);
    }
  });

  slotPages.forEach((page) => {
    if (!expectedPages.has(page)) {
      errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}: unexpected slot entry ${page}`);
    }
  });

  publicServices.forEach((service) => {
    const context = `${RESTAURANT_PAGE_SLOTS_DATA}.pages.${service.page}`;
    const slotEntry = slots.pages[service.page];
    const html = read(service.page);
    const bodyClasses = getBodyClasses(html);

    if (!isPlainObject(slotEntry)) {
      errors.push(`${context} must be an object`);
      return;
    }

    const formHints = slotEntry.formHints;
    if (!isPlainObject(formHints)) {
      errors.push(`${context}.formHints must be an object`);
    } else {
      if (!isArrayOfNonEmptyStrings(formHints.chips)) {
        errors.push(`${context}.formHints.chips must be a non-empty array of strings`);
      }
      for (const fieldName of ['typePlaceholder', 'problemPlaceholder']) {
        if (!isNonEmptyString(formHints[fieldName])) {
          errors.push(`${context}.formHints.${fieldName} must be a non-empty string`);
        }
      }
    }

    if (!Array.isArray(slotEntry.faq) || slotEntry.faq.length === 0) {
      errors.push(`${context}.faq must be a non-empty array`);
    } else {
      slotEntry.faq.forEach((item, index) => {
        if (!isPlainObject(item)) {
          errors.push(`${context}.faq[${index}] must be an object`);
          return;
        }
        if (!isNonEmptyString(item.question) || !isNonEmptyString(item.answer)) {
          errors.push(`${context}.faq[${index}] must define question and answer`);
        }
      });
    }

    if (!isPlainObject(slotEntry.requestOverview)) {
      errors.push(`${context}.requestOverview must be an object`);
    } else {
      for (const fieldName of ['badge', 'title', 'description']) {
        if (!isNonEmptyString(slotEntry.requestOverview[fieldName])) {
          errors.push(`${context}.requestOverview.${fieldName} must be a non-empty string`);
        }
      }

      if (!isArrayOfNonEmptyStrings(slotEntry.requestOverview.chips)) {
        errors.push(`${context}.requestOverview.chips must be a non-empty array of strings`);
      }
    }

    if (Object.hasOwn(slotEntry, 'serviceKpi')) {
      validateServiceKpi(slotEntry.serviceKpi, `${context}.serviceKpi`);
    }

    for (const className of restaurantPagePolicy?.publicPage?.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        errors.push(`${service.page}: missing body class ${className}`);
      }
    }

    if (
      restaurantPagePolicy?.publicPage?.requirePageSlugClass &&
      !bodyClasses.has(getExpectedPageClass(service.page))
    ) {
      errors.push(`${service.page}: missing body class ${getExpectedPageClass(service.page)}`);
    }

    for (const anchor of restaurantPagePolicy?.publicPage?.requiredSlotAnchors ?? []) {
      if (!html.includes(`data-slot="${anchor}"`)) {
        errors.push(`${service.page}: missing data-slot="${anchor}"`);
      }
    }

    for (const sectionId of restaurantPagePolicy?.publicPage?.requiredSectionIds ?? []) {
      if (!html.includes(`<section id="${sectionId}"`)) {
        errors.push(`${service.page}: missing section id ${sectionId}`);
      }
    }

    for (const zone of restaurantPagePolicy?.publicPage?.requiredSyncZones ?? []) {
      if (!html.includes(`data-sync-zone="${zone}"`)) {
        errors.push(`${service.page}: missing data-sync-zone="${zone}"`);
      }
    }

    if (
      restaurantPagePolicy?.publicPage?.requiredHtmlMarkers?.requireH1 &&
      !html.match(/<h1[\s>]/i)
    ) {
      errors.push(`${service.page}: page must include an h1`);
    }

    if (
      isNonEmptyString(restaurantPagePolicy?.publicPage?.requiredHtmlMarkers?.formClass) &&
      !html.includes(`class="${restaurantPagePolicy.publicPage.requiredHtmlMarkers.formClass}`)
    ) {
      errors.push(`${service.page}: page must include a .${restaurantPagePolicy.publicPage.requiredHtmlMarkers.formClass}`);
    }

    if (
      isNonEmptyString(restaurantPagePolicy?.publicPage?.requiredHtmlMarkers?.faqClass) &&
      !html.includes(restaurantPagePolicy.publicPage.requiredHtmlMarkers.faqClass)
    ) {
      errors.push(`${service.page}: page must include FAQ items`);
    }

    for (const fieldName of restaurantPagePolicy?.publicPage?.requiredFormFields ?? []) {
      if (countNamedFields(html, fieldName) === 0) {
        errors.push(`${service.page}: missing form field ${fieldName}`);
      }
    }

    const mobileSectionAttribute = restaurantPagePolicy?.publicPage?.mobileSectionAttribute ?? 'data-mobile-section';
    const actualMobileSectionIds = getSectionDataAttributeValues(html, mobileSectionAttribute);
    const expectedMobileSectionIds = Array.isArray(service.mobileHiddenSectionIds)
      ? service.mobileHiddenSectionIds
      : [];

    for (const sectionId of expectedMobileSectionIds) {
      if (!actualMobileSectionIds.includes(sectionId)) {
        errors.push(`${service.page}: missing ${mobileSectionAttribute}="${sectionId}" for registry-declared mobile hidden section`);
        continue;
      }

      const sectionTag = getSectionTagByDataAttribute(html, mobileSectionAttribute, sectionId);
      if (!sectionTag?.includes('restaurant-mobile-optional')) {
        errors.push(`${service.page}: ${mobileSectionAttribute}="${sectionId}" must keep the restaurant-mobile-optional fallback class`);
      }
    }

    for (const sectionId of actualMobileSectionIds) {
      if (!expectedMobileSectionIds.includes(sectionId)) {
        errors.push(`${service.page}: ${mobileSectionAttribute}="${sectionId}" must be declared in ${RESTAURANT_SERVICES_DATA}`);
      }
    }

    const syncState = analyzeRestaurantSyncState(html, {
      pageMeta: metadata.pages[service.page],
      service,
      slotEntry,
      slotsRoot: slots,
      registry: restaurantServicesRegistry,
      proofLayer: restaurantProofLayer,
    });

    for (const issue of syncState.issues) {
      errors.push(`${service.page}: ${issue}`);
    }
  });

  for (const page of restaurantPagePolicy?.branchPages?.pages ?? []) {
    const pageMeta = metadata.pages[page];
    const html = pageMeta ? read(page) : '';
    const bodyClasses = getBodyClasses(html);
    const slotEntry = slots.pages?.[page];
    const proofEntry = restaurantProofLayer?.branchPages?.[page];
    const branchContract = restaurantPagePolicy?.sharedCardSlots?.pageContracts?.[page];
    const anchorMap = restaurantPagePolicy?.sharedCardSlots?.anchorMap ?? {};

    if (!pageMeta || pageMeta.branch !== 'restaurant') {
      errors.push(`${RESTAURANT_PAGE_POLICY_DATA}: branch page ${page} must exist in metadata and belong to restaurant branch`);
      continue;
    }

    for (const className of restaurantPagePolicy?.branchPages?.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        errors.push(`${page}: missing body class ${className}`);
      }
    }

    if (
      restaurantPagePolicy?.branchPages?.requirePageSlugClass &&
      !bodyClasses.has(getExpectedPageClass(page))
    ) {
      errors.push(`${page}: missing body class ${getExpectedPageClass(page)}`);
    }

    if (
      restaurantPagePolicy?.branchPages?.routeStripPages?.includes(page) &&
      !html.includes('data-restaurant-route-strip')
    ) {
      errors.push(`${page}: missing restaurant route-strip host`);
    }

    if (!isPlainObject(slotEntry)) {
      errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page} must be an object`);
      continue;
    }

    for (const className of restaurantPagePolicy?.sharedCardSlots?.requiredBodyClasses ?? []) {
      if (!bodyClasses.has(className)) {
        errors.push(`${page}: missing body class ${className}`);
      }
    }

    if (
      restaurantPagePolicy?.sharedCardSlots?.requirePageSlugClass &&
      !bodyClasses.has(getExpectedPageClass(page))
    ) {
      errors.push(`${page}: missing body class ${getExpectedPageClass(page)}`);
    }

    if (!isPlainObject(slotEntry.cardSections)) {
      errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections must be an object`);
    } else {
      for (const [sectionName, sectionConfig] of Object.entries(slotEntry.cardSections)) {
        if (!(restaurantPagePolicy?.sharedCardSlots?.allowedSections ?? []).includes(sectionName)) {
          errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName} is not allowed by shared card policy`);
          continue;
        }

        if (!isPlainObject(sectionConfig)) {
          errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName} must be an object`);
          continue;
        }

        for (const fieldName of ['badge', 'title', 'description']) {
          if (!isNonEmptyString(sectionConfig[fieldName])) {
            errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName}.${fieldName} must be a non-empty string`);
          }
        }

        if (Object.hasOwn(sectionConfig, 'layoutVariant')) {
          if (sectionName !== 'trustCards') {
            errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName}.layoutVariant is allowed only for trustCards`);
          } else if (!VALID_RESTAURANT_CARD_LAYOUT_VARIANTS.has(sectionConfig.layoutVariant)) {
            errors.push(
              `${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName}.layoutVariant must be one of: ${Array.from(VALID_RESTAURANT_CARD_LAYOUT_VARIANTS).join(', ')}`
            );
          }
        }

        if (sectionName === 'categoryCards' && !isArrayOfNonEmptyStrings(sectionConfig.pages)) {
          errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName}.pages must be a non-empty array of strings`);
        }

        if ((sectionName === 'trustCards' || sectionName === 'contactChannels') && !Array.isArray(sectionConfig.cards)) {
          errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.cardSections.${sectionName}.cards must be an array`);
        }
      }
    }

    if (restaurantPagePolicy?.sharedCardSlots?.routingHint?.pages?.includes(page)) {
      if (!isPlainObject(slotEntry.routingHint)) {
        errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.routingHint must be an object`);
      } else {
        validateHouseholdRoutingHint(
          slotEntry.routingHint,
          `${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}.routingHint`
        );
      }

      const routingAnchor = restaurantPagePolicy?.sharedCardSlots?.routingHint?.anchor;
      if (routingAnchor && !html.includes(`data-slot="${routingAnchor}"`)) {
        errors.push(`${page}: missing data-slot="${routingAnchor}" for routingHint`);
      }
    }

    for (const sectionName of branchContract?.requiredCardSections ?? []) {
      if (!slotEntry.cardSections?.[sectionName]) {
        errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}.pages.${page}: missing required card section ${sectionName}`);
        continue;
      }

      const anchor = anchorMap[sectionName];
      if (anchor && !html.includes(`data-slot="${anchor}"`)) {
        errors.push(`${page}: missing data-slot="${anchor}" for required card section ${sectionName}`);
      }
    }

    if (!isPlainObject(proofEntry)) {
      errors.push(`${RESTAURANT_PROOF_LAYER_DATA}: missing branch proof entry for ${page}`);
      continue;
    }

    for (const sectionName of branchContract?.requiredProofSections ?? []) {
      if (!proofEntry[sectionName]) {
        errors.push(`${RESTAURANT_PROOF_LAYER_DATA}: ${page} missing required proof section ${sectionName}`);
        continue;
      }

      const anchor = anchorMap[sectionName];
      if (anchor && !html.includes(`data-slot="${anchor}"`)) {
        errors.push(`${page}: missing data-slot="${anchor}" for required proof section ${sectionName}`);
      }
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

validateBranchConfig(restaurantBranch, RESTAURANT_ROUTE_STRIP_CONTRACT, 'restaurant');
validateBranchConfig(householdBranch, { dataFile: HOUSEHOLD_BRANCH_DATA, pages: {} }, 'household');
validateSitePageContracts(sitePageContracts);
validateRestaurantTaxonomy(restaurantTaxonomy);
validateRestaurantPagePolicy(restaurantPagePolicy);
validateRestaurantProofLayer(restaurantProofLayer);
validateRestaurantServicesRegistry(restaurantServicesRegistry);
validateRestaurantPageSlots(restaurantPageSlots, restaurantServicesRegistry);
validateHouseholdTaxonomy(householdTaxonomy);
validateHouseholdPagePolicy(householdPagePolicy);
validateHouseholdCardPresets(householdCardPresets);
validateHouseholdProofLayer(householdProofLayer);
validateHouseholdServicesRegistry(householdServicesRegistry);
validateHouseholdPageSlots(householdPageSlots, householdServicesRegistry);
validateDocsIntegrity();
validateScreenshotAuditContract();
validateOperatorRecipes();
validateContactConfig(contactConfig);
validateSchemaProfile(schemaProfile);

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

if (!fs.existsSync(contactConfigPath)) {
  errors.push(`${CONTACT_CONFIG_DATA}: contact config missing`);
}

if (!fs.existsSync(schemaProfilePath)) {
  errors.push(`${SCHEMA_PROFILE_DATA}: schema profile missing`);
}

if (!fs.existsSync(restaurantBranchPath)) {
  errors.push(`${RESTAURANT_BRANCH_DATA}: restaurant branch config missing`);
}

if (!fs.existsSync(householdBranchPath)) {
  errors.push(`${HOUSEHOLD_BRANCH_DATA}: household branch config missing`);
}

if (!fs.existsSync(sitePageContractsPath)) {
  errors.push(`${SITE_PAGE_CONTRACTS_DATA}: site page contracts missing`);
}

if (!fs.existsSync(restaurantServicesPath)) {
  errors.push(`${RESTAURANT_SERVICES_DATA}: restaurant services registry missing`);
}

if (!fs.existsSync(restaurantPageSlotsPath)) {
  errors.push(`${RESTAURANT_PAGE_SLOTS_DATA}: restaurant page slots missing`);
}

if (!fs.existsSync(restaurantProofLayerPath)) {
  errors.push(`${RESTAURANT_PROOF_LAYER_DATA}: restaurant proof layer missing`);
}

if (!fs.existsSync(restaurantTaxonomyPath)) {
  errors.push(`${RESTAURANT_TAXONOMY_DATA}: restaurant taxonomy missing`);
}

if (!fs.existsSync(restaurantPagePolicyPath)) {
  errors.push(`${RESTAURANT_PAGE_POLICY_DATA}: restaurant page policy missing`);
}

if (!fs.existsSync(householdServicesPath)) {
  errors.push(`${HOUSEHOLD_SERVICES_DATA}: household services registry missing`);
}

if (!fs.existsSync(householdPageSlotsPath)) {
  errors.push(`${HOUSEHOLD_PAGE_SLOTS_DATA}: household page slots missing`);
}

if (!fs.existsSync(householdCardPresetsPath)) {
  errors.push(`${HOUSEHOLD_CARD_PRESETS_DATA}: household card presets missing`);
}

if (!fs.existsSync(householdProofLayerPath)) {
  errors.push(`${HOUSEHOLD_PROOF_LAYER_DATA}: household proof layer missing`);
}

if (!fs.existsSync(householdTaxonomyPath)) {
  errors.push(`${HOUSEHOLD_TAXONOMY_DATA}: household taxonomy missing`);
}

if (!fs.existsSync(householdPagePolicyPath)) {
  errors.push(`${HOUSEHOLD_PAGE_POLICY_DATA}: household page policy missing`);
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
