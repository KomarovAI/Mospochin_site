import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { ROOT_DIR, readJson, fileExists, buildAiIndex } from './ai-maintenance-lib.mjs';

const VALID_BRANCHES = new Set(['restaurant', 'household', 'neutral']);
const PAGE_RE = /^[a-z0-9][a-z0-9-]*\.html$/;
const SITE_URL = 'https://mospochin.ru';

const CONTRACT_FILES = {
  'data/page-metadata.json': 'schemas/page-metadata.schema.json',
  'data/contact-config.json': 'schemas/contact-config.schema.json',
  'data/runtime-config.json': 'schemas/runtime-config.schema.json',
  'data/household-services.json': 'schemas/service-registry.schema.json',
  'data/restaurant-services.json': 'schemas/service-registry.schema.json',
  'data/household-page-slots.json': 'schemas/page-slots.schema.json',
  'data/restaurant-page-slots.json': 'schemas/page-slots.schema.json',
  'data/household-branch.json': 'schemas/branch-config.schema.json',
  'data/restaurant-branch.json': 'schemas/branch-config.schema.json',
  'data/schema-profile.json': 'schemas/schema-profile.schema.json',
  'data/site-page-contracts.json': 'schemas/site-page-contracts.schema.json',
  'data/ai-project-index.json': 'schemas/ai-project-index.schema.json',
};

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function pushIssue(issues, severity, file, message, page = null) {
  issues.push({ severity, file, message, page });
}

function error(issues, file, message, page = null) {
  pushIssue(issues, 'error', file, message, page);
}

function warn(issues, file, message, page = null) {
  pushIssue(issues, 'warning', file, message, page);
}

function readJsonSafe(path, issues) {
  try {
    return readJson(path);
  } catch (err) {
    error(issues, path, `JSON не читается: ${err.message}`);
    return null;
  }
}

function listJsonFiles(dir) {
  const abs = join(ROOT_DIR, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((file) => file.endsWith('.json'))
    .map((file) => `${dir}/${file}`)
    .sort((a, b) => a.localeCompare(b));
}

function validateJsonSyntax(issues) {
  const files = [...listJsonFiles('data'), ...listJsonFiles('content'), ...listJsonFiles('schemas')];
  for (const file of files) readJsonSafe(file, issues);
  return files.length;
}

function validateSchemaRegistry(issues) {
  if (!fileExists('schemas/data-files-manifest.json')) {
    error(issues, 'schemas/data-files-manifest.json', 'manifest схем отсутствует');
    return;
  }
  const manifest = readJsonSafe('schemas/data-files-manifest.json', issues);
  if (!manifest) return;
  if (!isObject(manifest.files)) {
    error(issues, 'schemas/data-files-manifest.json', 'поле files должно быть объектом');
    return;
  }
  for (const [dataFile, schemaFile] of Object.entries(CONTRACT_FILES)) {
    if (!fileExists(dataFile)) error(issues, dataFile, 'контрактный data-файл отсутствует');
    if (!fileExists(schemaFile)) error(issues, schemaFile, `schema для ${dataFile} отсутствует`);
    if (manifest.files[dataFile] !== schemaFile) {
      error(issues, 'schemas/data-files-manifest.json', `${dataFile} должен ссылаться на ${schemaFile}`);
    }
  }
  for (const [dataFile, schemaFile] of Object.entries(manifest.files)) {
    if (!fileExists(dataFile)) error(issues, 'schemas/data-files-manifest.json', `manifest ссылается на отсутствующий data-файл ${dataFile}`);
    if (!fileExists(schemaFile)) error(issues, 'schemas/data-files-manifest.json', `manifest ссылается на отсутствующую schema ${schemaFile}`);
  }
}

function collectPages(metadata) {
  return new Set(Object.keys(metadata?.pages || {}));
}

function canonicalFor(page) {
  return page === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${page}`;
}

function validateMetadata(issues, metadata) {
  const file = 'data/page-metadata.json';
  if (!isObject(metadata?.pages)) {
    error(issues, file, 'pages должен быть объектом');
    return new Set();
  }
  const pages = Object.keys(metadata.pages).sort((a, b) => a.localeCompare(b));
  if (!pages.length) error(issues, file, 'pages пустой');

  for (const page of pages) {
    const meta = metadata.pages[page];
    if (!PAGE_RE.test(page)) error(issues, file, `некорректное имя страницы: ${page}`, page);
    if (!fileExists(page)) error(issues, file, `HTML-файл отсутствует: ${page}`, page);
    if (!isObject(meta)) {
      error(issues, file, `${page}: metadata должна быть объектом`, page);
      continue;
    }

    const title = text(meta.title);
    const description = text(meta.description);
    if (title.length < 10) error(issues, file, `${page}: title пустой или короче 10 символов`, page);
    if (title.length > 75) warn(issues, file, `${page}: title длиннее 75 символов (${title.length})`, page);
    if (description.length < 40) error(issues, file, `${page}: description пустой или короче 40 символов`, page);
    if (description.length > 170) warn(issues, file, `${page}: description длиннее 170 символов (${description.length})`, page);

    if (!VALID_BRANCHES.has(meta.branch)) error(issues, file, `${page}: branch должен быть restaurant/household/neutral`, page);
    if (typeof meta.hasForm !== 'boolean') error(issues, file, `${page}: hasForm должен быть boolean`, page);

    if (page === '404.html') {
      if (meta.canonical !== null) error(issues, file, '404.html: canonical должен быть null', page);
      if (meta.ogUrl !== null) error(issues, file, '404.html: ogUrl должен быть null', page);
      if (meta.robots !== 'noindex,follow') warn(issues, file, '404.html: рекомендуется robots="noindex,follow"', page);
    } else {
      const expected = canonicalFor(page);
      if (meta.canonical !== expected) error(issues, file, `${page}: canonical должен быть ${expected}`, page);
      if (meta.ogUrl !== expected) error(issues, file, `${page}: ogUrl должен быть ${expected}`, page);
      if (meta.robots && typeof meta.robots !== 'string') error(issues, file, `${page}: robots должен быть строкой`, page);
    }
  }

  return new Set(pages);
}

function validateContact(issues, contact) {
  const file = 'data/contact-config.json';
  if (!isObject(contact)) return error(issues, file, 'контактный конфиг должен быть объектом');
  if (!text(contact.phoneDisplay)) error(issues, file, 'phoneDisplay обязателен');
  if (!/^\+7\d{10}$/.test(text(contact.phoneE164))) error(issues, file, 'phoneE164 должен быть в формате +7XXXXXXXXXX');
  if (!/^7\d{10}$/.test(text(contact.whatsappNumber))) error(issues, file, 'whatsappNumber должен быть в формате 7XXXXXXXXXX');
  if (!/^(https:\/\/|tg:\/\/)/.test(text(contact.telegramHref))) error(issues, file, 'telegramHref должен быть https или tg:// URL');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(contact.email))) error(issues, file, 'email должен быть валидным email');
  if (!text(contact.whatsappDefaultText)) warn(issues, file, 'whatsappDefaultText пустой');
}

function validateRuntime(issues, runtime) {
  const file = 'data/runtime-config.json';
  if (!isObject(runtime)) return error(issues, file, 'runtime config должен быть объектом');
  const endpoint = text(runtime.telegramFormEndpoint);
  if (!endpoint.startsWith('/')) error(issues, file, 'telegramFormEndpoint должен быть относительным URL от корня, например /api/send-telegram');
}

function validateServices(issues, data, branch, metadataPages, servicePagesGlobal) {
  const file = branch === 'household' ? 'data/household-services.json' : 'data/restaurant-services.json';
  const services = asArray(data?.services);
  if (!services.length) error(issues, file, 'services пустой или отсутствует');

  const pages = new Set();
  const slugs = new Set();
  for (const [index, service] of services.entries()) {
    const prefix = `services[${index}]`;
    if (!isObject(service)) {
      error(issues, file, `${prefix}: запись должна быть объектом`);
      continue;
    }
    const page = text(service.page);
    const slug = text(service.slug);
    if (!PAGE_RE.test(page)) error(issues, file, `${prefix}: некорректный page`, page || null);
    if (!metadataPages.has(page)) error(issues, file, `${page}: отсутствует в data/page-metadata.json`, page);
    if (!fileExists(page)) error(issues, file, `${page}: HTML-файл отсутствует`, page);
    if (pages.has(page)) error(issues, file, `${page}: дублируется в services`, page);
    pages.add(page);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) error(issues, file, `${page}: slug должен быть kebab-case`, page);
    if (slugs.has(slug)) error(issues, file, `${page}: slug дублируется: ${slug}`, page);
    slugs.add(slug);

    for (const key of ['uiLabel', 'deviceName', 'serviceName', 'schemaName', 'formExample']) {
      if (!text(service[key])) error(issues, file, `${page}: ${key} обязателен`, page);
    }
    if (typeof service.isShadow !== 'boolean') error(issues, file, `${page}: isShadow должен быть boolean`, page);
    if (asArray(service.primarySymptoms).length < 3) error(issues, file, `${page}: primarySymptoms должен содержать минимум 3 симптома`, page);
    if (asArray(service.brandCluster).length < 2) warn(issues, file, `${page}: brandCluster содержит меньше 2 брендов`, page);
    if (asArray(service.relatedPages).length < 2) warn(issues, file, `${page}: relatedPages содержит меньше 2 страниц`, page);
    for (const related of asArray(service.relatedPages)) {
      if (related === page) error(issues, file, `${page}: relatedPages не должен ссылаться на себя`, page);
      if (!metadataPages.has(related)) error(issues, file, `${page}: relatedPages содержит неизвестную страницу ${related}`, page);
    }
    if (!Array.isArray(service.sectionIds)) warn(issues, file, `${page}: sectionIds лучше держать массивом`, page);
    if (servicePagesGlobal.has(page)) error(issues, file, `${page}: страница сервиса дублируется между ветками`, page);
    servicePagesGlobal.set(page, branch);
  }
}

function validateKpiBlock(issues, file, block, label) {
  if (!isObject(block)) return error(issues, file, `${label}: блок KPI должен быть объектом`);
  for (const key of ['badge', 'title', 'description']) {
    if (!text(block[key])) error(issues, file, `${label}: ${key} обязателен`);
  }
  const items = asArray(block.items);
  if (!items.length) error(issues, file, `${label}: items пустой`);
  for (const [i, item] of items.entries()) {
    for (const key of ['value', 'label', 'note']) {
      if (!text(item?.[key])) error(issues, file, `${label}.items[${i}]: ${key} обязателен`);
    }
  }
}

function validateSlots(issues, data, branch, metadataPages) {
  const file = branch === 'household' ? 'data/household-page-slots.json' : 'data/restaurant-page-slots.json';
  if (!isObject(data)) return error(issues, file, 'page slots должен быть объектом');
  validateKpiBlock(issues, file, data.serviceKpiDefaults, 'serviceKpiDefaults');
  if (!isObject(data.pages)) return error(issues, file, 'pages должен быть объектом');

  for (const [page, slots] of Object.entries(data.pages || {})) {
    if (!metadataPages.has(page)) error(issues, file, `${page}: слот есть, но страницы нет в metadata`, page);
    if (!isObject(slots)) {
      error(issues, file, `${page}: slots должен быть объектом`, page);
      continue;
    }
    if (slots.faq !== undefined) {
      const faq = asArray(slots.faq);
      if (faq.length < 3) warn(issues, file, `${page}: FAQ содержит меньше 3 вопросов`, page);
      const questions = new Set();
      for (const [i, item] of faq.entries()) {
        const question = text(item?.question);
        const answer = text(item?.answer);
        if (question.length < 10) error(issues, file, `${page}: faq[${i}].question слишком короткий`, page);
        if (answer.length < 20) error(issues, file, `${page}: faq[${i}].answer слишком короткий`, page);
        const key = question.toLowerCase();
        if (questions.has(key)) error(issues, file, `${page}: дублирующийся FAQ-вопрос: ${question}`, page);
        questions.add(key);
      }
    }
    if (slots.formHints !== undefined) {
      const hints = slots.formHints;
      if (!isObject(hints)) error(issues, file, `${page}: formHints должен быть объектом`, page);
      else {
        if (hints.chips !== undefined && !Array.isArray(hints.chips)) error(issues, file, `${page}: formHints.chips должен быть массивом`, page);
        for (const key of ['typePlaceholder', 'problemPlaceholder']) {
          if (hints[key] !== undefined && !text(hints[key])) error(issues, file, `${page}: formHints.${key} пустой`, page);
        }
      }
    }
    if (slots.serviceKpi !== undefined) validateKpiBlock(issues, file, slots.serviceKpi, `${page}.serviceKpi`);
  }
}

function validateBranchConfig(issues, data, branch, metadataPages) {
  const file = branch === 'household' ? 'data/household-branch.json' : 'data/restaurant-branch.json';
  if (!isObject(data)) return error(issues, file, 'branch config должен быть объектом');
  for (const key of ['subtitle', 'contactHint']) {
    if (!text(data[key])) error(issues, file, `${key} обязателен`);
  }
  if (!isObject(data.topBarText)) error(issues, file, 'topBarText должен быть объектом');
  for (const listName of ['services', 'footerLinks']) {
    const list = asArray(data[listName]);
    if (!list.length) error(issues, file, `${listName} пустой`);
    for (const [i, item] of list.entries()) {
      const href = text(item?.href);
      if (!href) error(issues, file, `${listName}[${i}].href обязателен`);
      else if (!href.startsWith('#') && !href.startsWith('http') && !metadataPages.has(href)) {
        error(issues, file, `${listName}[${i}] ссылается на неизвестную страницу ${href}`);
      }
      const label = text(item?.label || item?.name);
      if (!label) error(issues, file, `${listName}[${i}] должен иметь label/name`);
    }
  }
}

function validateSchemaProfile(issues, data) {
  const file = 'data/schema-profile.json';
  if (!isObject(data)) return error(issues, file, 'schema profile должен быть объектом');
  if (!isObject(data.global?.provider)) error(issues, file, 'global.provider обязателен');
  else {
    for (const key of ['name', 'url', 'addressLocality', 'addressCountry']) {
      if (!text(data.global.provider[key])) error(issues, file, `global.provider.${key} обязателен`);
    }
    if (text(data.global.provider.url) !== SITE_URL) warn(issues, file, `global.provider.url отличается от ${SITE_URL}`);
  }
  if (!isObject(data.branches?.restaurant) || !text(data.branches.restaurant.descriptionTemplate)) {
    error(issues, file, 'branches.restaurant.descriptionTemplate обязателен');
  }
  if (!isObject(data.branches?.household) || !text(data.branches.household.descriptionTemplate)) {
    error(issues, file, 'branches.household.descriptionTemplate обязателен');
  }
}

function validateSiteContracts(issues, data) {
  const file = 'data/site-page-contracts.json';
  if (!isObject(data)) return error(issues, file, 'site-page-contracts должен быть объектом');
  if (!isObject(data.sharedLayers)) error(issues, file, 'sharedLayers обязателен');
  if (!isObject(data.pageTypes)) error(issues, file, 'pageTypes обязателен');
}

function validateAiIndex(issues, data, metadataPages) {
  const file = 'data/ai-project-index.json';
  if (!isObject(data?.pages)) return error(issues, file, 'pages должен быть объектом');
  const indexPages = new Set(Object.keys(data.pages));
  for (const page of metadataPages) {
    if (!indexPages.has(page)) error(issues, file, `${page}: отсутствует в AI index`, page);
  }
  for (const page of indexPages) {
    if (!metadataPages.has(page)) error(issues, file, `${page}: есть в AI index, но нет в metadata`, page);
  }
  const expected = buildAiIndex();
  const current = JSON.stringify(data, null, 2);
  const regenerated = JSON.stringify(expected, null, 2);
  if (current !== regenerated) error(issues, file, 'AI index неактуален: запусти npm run generate:ai-index');
}

function validateMetadataBranchMatches(issues, metadata, servicePages) {
  const file = 'data/page-metadata.json';
  for (const [page, branch] of servicePages.entries()) {
    const metaBranch = metadata.pages?.[page]?.branch;
    if (metaBranch !== branch) error(issues, file, `${page}: branch=${metaBranch}, но service registry ветки ${branch}`, page);
  }
}

export function validateDataContracts({ page = null } = {}) {
  const issues = [];
  const stats = { jsonFiles: validateJsonSyntax(issues), checkedFiles: Object.keys(CONTRACT_FILES).length };

  validateSchemaRegistry(issues);

  const metadata = readJsonSafe('data/page-metadata.json', issues);
  const metadataPages = validateMetadata(issues, metadata);

  validateContact(issues, readJsonSafe('data/contact-config.json', issues));
  validateRuntime(issues, readJsonSafe('data/runtime-config.json', issues));

  const servicePages = new Map();
  validateServices(issues, readJsonSafe('data/household-services.json', issues), 'household', metadataPages, servicePages);
  validateServices(issues, readJsonSafe('data/restaurant-services.json', issues), 'restaurant', metadataPages, servicePages);
  if (metadata) validateMetadataBranchMatches(issues, metadata, servicePages);

  validateSlots(issues, readJsonSafe('data/household-page-slots.json', issues), 'household', metadataPages);
  validateSlots(issues, readJsonSafe('data/restaurant-page-slots.json', issues), 'restaurant', metadataPages);
  validateBranchConfig(issues, readJsonSafe('data/household-branch.json', issues), 'household', metadataPages);
  validateBranchConfig(issues, readJsonSafe('data/restaurant-branch.json', issues), 'restaurant', metadataPages);
  validateSchemaProfile(issues, readJsonSafe('data/schema-profile.json', issues));
  validateSiteContracts(issues, readJsonSafe('data/site-page-contracts.json', issues));
  validateAiIndex(issues, readJsonSafe('data/ai-project-index.json', issues), metadataPages);

  const filteredIssues = page ? issues.filter((issue) => issue.page === page) : issues;
  return {
    ok: !filteredIssues.some((issue) => issue.severity === 'error'),
    errors: filteredIssues.filter((issue) => issue.severity === 'error'),
    warnings: filteredIssues.filter((issue) => issue.severity === 'warning'),
    issues: filteredIssues,
    allIssues: issues,
    stats,
  };
}
