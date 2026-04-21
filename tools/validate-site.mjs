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
const VALID_BRANCHES = new Set(['restaurant', 'household', 'neutral']);
const CANONICAL_FORM_FIELDS = ['name', 'phone', 'type', 'problem'];
const LEGACY_FORM_FIELDS = ['message'];
const ROUTER_ROUTE_STRIP_PAGES = {
  'index.html': 'index',
  'uslugi.html': 'uslugi',
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

function validateRestaurantHtmlTarget(target, context) {
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

  if (metadata.pages[fileName].branch !== 'restaurant') {
    errors.push(`${context}: target page must belong to restaurant branch`);
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

  if (ROUTER_ROUTE_STRIP_PAGES[fileName]) {
    const routeKey = ROUTER_ROUTE_STRIP_PAGES[fileName];

    if (!html.includes(`data-restaurant-route-strip="${routeKey}"`)) {
      errors.push(`${fileName}: missing data-restaurant-route-strip="${routeKey}"`);
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
        errors.push(`${fileName}: missing ${attr} for restaurant router contract`);
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

if (restaurantBranch) {
  if (!isNonEmptyString(restaurantBranch.subtitle)) {
    errors.push(`${RESTAURANT_BRANCH_DATA}: subtitle must be a non-empty string`);
  }

  if (!isNonEmptyString(restaurantBranch.contactHint)) {
    errors.push(`${RESTAURANT_BRANCH_DATA}: contactHint must be a non-empty string`);
  }

  if (!restaurantBranch.topBarText || typeof restaurantBranch.topBarText !== 'object') {
    errors.push(`${RESTAURANT_BRANCH_DATA}: topBarText object is required`);
  } else {
    for (const fieldName of ['icon', 'text', 'sub']) {
      if (!isNonEmptyString(restaurantBranch.topBarText[fieldName])) {
        errors.push(`${RESTAURANT_BRANCH_DATA}: topBarText.${fieldName} must be a non-empty string`);
      }
    }
  }

  if (!Array.isArray(restaurantBranch.services) || restaurantBranch.services.length === 0) {
    errors.push(`${RESTAURANT_BRANCH_DATA}: services must be a non-empty array`);
  } else {
    restaurantBranch.services.forEach((service, index) => {
      if (!service || typeof service !== 'object') {
        errors.push(`${RESTAURANT_BRANCH_DATA}: services[${index}] must be an object`);
        return;
      }

      if (!isNonEmptyString(service.name) || !isNonEmptyString(service.icon)) {
        errors.push(`${RESTAURANT_BRANCH_DATA}: services[${index}] must define name and icon`);
      }
      validateRestaurantHtmlTarget(service.href, `${RESTAURANT_BRANCH_DATA}: services[${index}].href`);
    });
  }

  if (!Array.isArray(restaurantBranch.footerLinks) || restaurantBranch.footerLinks.length === 0) {
    errors.push(`${RESTAURANT_BRANCH_DATA}: footerLinks must be a non-empty array`);
  } else {
    restaurantBranch.footerLinks.forEach((link, index) => {
      if (!link || typeof link !== 'object') {
        errors.push(`${RESTAURANT_BRANCH_DATA}: footerLinks[${index}] must be an object`);
        return;
      }

      if (!isNonEmptyString(link.label)) {
        errors.push(`${RESTAURANT_BRANCH_DATA}: footerLinks[${index}].label must be a non-empty string`);
      }
      validateRestaurantHtmlTarget(link.href, `${RESTAURANT_BRANCH_DATA}: footerLinks[${index}].href`);
    });
  }

  if (!restaurantBranch.routeStrips || typeof restaurantBranch.routeStrips !== 'object') {
    errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips object is required`);
  } else {
    for (const [fileName, routeKey] of Object.entries(ROUTER_ROUTE_STRIP_PAGES)) {
      const routeStrip = restaurantBranch.routeStrips[routeKey];
      if (!routeStrip || typeof routeStrip !== 'object') {
        errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey} is required`);
        continue;
      }

      for (const fieldName of ['badge', 'title', 'description']) {
        if (!isNonEmptyString(routeStrip[fieldName])) {
          errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.${fieldName} must be a non-empty string`);
        }
      }

      if (!routeStrip.action || typeof routeStrip.action !== 'object') {
        errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.action is required`);
      } else {
        if (!isNonEmptyString(routeStrip.action.label) || !isNonEmptyString(routeStrip.action.icon)) {
          errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.action must define label and icon`);
        }

        const actionTarget = routeStrip.action.href;
        if (!isNonEmptyString(actionTarget)) {
          errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.action.href must be a non-empty string`);
        } else if (actionTarget.startsWith('#')) {
          const routerHtml = read(fileName);
          if (!routerHtml.includes(`id="${actionTarget.slice(1)}"`)) {
            errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.action.href points to missing anchor ${actionTarget} in ${fileName}`);
          }
        } else {
          validateRestaurantHtmlTarget(
            actionTarget,
            `${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.action.href`
          );
        }
      }

      if (!Array.isArray(routeStrip.cards) || routeStrip.cards.length === 0) {
        errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.cards must be a non-empty array`);
        continue;
      }

      routeStrip.cards.forEach((card, index) => {
        if (!card || typeof card !== 'object') {
          errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.cards[${index}] must be an object`);
          return;
        }

        if (!isNonEmptyString(card.title) || !isNonEmptyString(card.description)) {
          errors.push(`${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.cards[${index}] must define title and description`);
        }

        validateRestaurantHtmlTarget(
          card.href,
          `${RESTAURANT_BRANCH_DATA}: routeStrips.${routeKey}.cards[${index}].href`
        );
      });
    }
  }
}

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
