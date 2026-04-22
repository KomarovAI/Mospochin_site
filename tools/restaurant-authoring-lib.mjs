import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SITE_ROOT = path.resolve(__dirname, '..');
export const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
export const REGISTRY_PATH = path.join(SITE_ROOT, 'data/restaurant-services.json');
export const SLOTS_PATH = path.join(SITE_ROOT, 'data/restaurant-page-slots.json');
export const PROOF_LAYER_PATH = path.join(SITE_ROOT, 'data/restaurant-proof-layer.json');

export function parseArgs(argv) {
  const result = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      result._.push(token);
      continue;
    }

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

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function ensureRequired(value, label) {
  if (!isNonEmptyString(value)) {
    throw new Error(`Missing required argument --${label}`);
  }
  return String(value).trim();
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function readStructuredValue(args, jsonKey, fileKey, label) {
  if (args[jsonKey] && args[fileKey]) {
    throw new Error(`Use either --${jsonKey} or --${fileKey}, not both`);
  }

  if (args[jsonKey]) {
    try {
      return JSON.parse(String(args[jsonKey]));
    } catch (error) {
      throw new Error(`Invalid JSON in --${jsonKey}: ${error.message}`);
    }
  }

  if (args[fileKey]) {
    const filePath = path.resolve(process.cwd(), String(args[fileKey]));
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing file for --${fileKey}: ${filePath}`);
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`Invalid JSON in --${fileKey}: ${error.message}`);
    }
  }

  throw new Error(`Pass --${jsonKey} or --${fileKey} for ${label}`);
}

export function csvToArray(value) {
  if (!value || value === true) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function pipeToArray(value) {
  if (!value || value === true) return [];
  return String(value)
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizePage(args) {
  if (args.page && args.page !== true) return String(args.page).trim();
  if (args.slug && args.slug !== true) return `${String(args.slug).trim()}.html`;
  throw new Error('Pass --page <file.html> or --slug <slug>');
}

export function loadRestaurantState() {
  return {
    metadata: readJson(METADATA_PATH),
    registry: readJson(REGISTRY_PATH),
    slots: readJson(SLOTS_PATH),
    proofLayer: readJson(PROOF_LAYER_PATH),
  };
}

function selectPath(root, selectorPath) {
  if (!Array.isArray(selectorPath) || !selectorPath.length) return root;
  return selectorPath.reduce((current, segment) => {
    if (current == null) return current;
    return current[segment];
  }, root);
}

export function applyJsonWrite({ filePath, root, selectorLabel, dryRun }) {
  if (dryRun) {
    const preview = selectPath(root, selectorLabel);
    console.log(JSON.stringify(preview, null, 2));
    return;
  }
  writeJson(filePath, root);
}

export function getPublicServiceContext(args) {
  const { metadata, registry, slots, proofLayer } = loadRestaurantState();
  const page = normalizePage(args);
  const pageMeta = metadata.pages?.[page] ?? null;
  const registryEntry = (registry.services ?? []).find((entry) => entry.page === page) ?? null;

  if (!pageMeta) {
    throw new Error(`Unknown page in metadata: ${page}`);
  }

  if (pageMeta.branch !== 'restaurant') {
    throw new Error(`${page} is not a restaurant page`);
  }

  if (!registryEntry) {
    throw new Error(`${page} is not a restaurant service page`);
  }

  if (registryEntry.isShadow) {
    throw new Error(`${page} is a shadow restaurant page; helper command supports only public service pages`);
  }

  return { page, pageMeta, registryEntry, metadata, registry, slots, proofLayer };
}
