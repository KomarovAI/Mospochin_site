#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/site-builder.json'), 'utf8'));
const apply = process.argv.includes('--apply');
const JSON_LD_RE = /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi;

function removeTrailingCommas(value) {
  return String(value).replace(/,\s*([}\]])/g, '$1');
}

const failures = [];
const repairs = [];

function topLevelTypes(value) {
  return [].concat(value?.['@type'] || []);
}

function serviceScore(value) {
  return (value?.['@id'] ? 20 : 0)
    + (value?.serviceType ? 8 : 0)
    + (value?.category ? 4 : 0)
    + (value?.provider ? 3 : 0)
    + Object.keys(value || {}).length;
}

function removePlaceholderOffers(value) {
  if (Array.isArray(value)) return value.reduce((count, item) => count + removePlaceholderOffers(item), 0);
  if (!value || typeof value !== 'object') return 0;
  let removed = 0;
  const offer = value.offers;
  if (offer && typeof offer === 'object' && [].concat(offer['@type'] || []).includes('Offer')) {
    const price = offer.price;
    if (typeof price === 'string' && !/^\s*\d+(?:[.,]\d+)?\s*$/.test(price)) {
      delete value.offers;
      removed += 1;
    }
  }
  for (const child of Object.values(value)) removed += removePlaceholderOffers(child);
  return removed;
}

for (const entry of MANIFEST.pages || []) {
  const modelPath = path.join(ROOT, entry.model);
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const headPath = path.join(path.dirname(modelPath), model.files.head);
  const current = fs.readFileSync(headPath, 'utf8');
  const parsedBlocks = [...current.matchAll(JSON_LD_RE)].map((match, index) => {
    const body = match[2];
    try {
      return { index, schema: JSON.parse(body), body, repairedBody: null };
    } catch {
      const repairedBody = removeTrailingCommas(body);
      try {
        return { index, schema: JSON.parse(repairedBody), body, repairedBody };
      } catch (error) {
        failures.push(`${entry.page}#jsonld-${index + 1}: ${error.message}`);
        return { index, schema: null, body, repairedBody: null };
      }
    }
  });

  const serviceBlocks = parsedBlocks.filter((block) => topLevelTypes(block.schema).includes('Service'));
  const duplicateServiceIndexes = new Set();
  if (serviceBlocks.length > 1) {
    const keep = serviceBlocks.reduce((best, block) => serviceScore(block.schema) > serviceScore(best.schema) ? block : best);
    for (const block of serviceBlocks) if (block.index !== keep.index) duplicateServiceIndexes.add(block.index);
  }

  let scriptIndex = 0;
  let changed = false;

  const next = current.replace(JSON_LD_RE, (match, open, body, close) => {
    const block = parsedBlocks[scriptIndex];
    scriptIndex += 1;
    if (!block?.schema) return match;

    if (duplicateServiceIndexes.has(block.index)) {
      changed = true;
      repairs.push(`${entry.page}#jsonld-${scriptIndex}:duplicate-service`);
      return match.startsWith('\n') ? '\n' : '';
    }

    const placeholderOffers = removePlaceholderOffers(block.schema);
    if (placeholderOffers) {
      changed = true;
      repairs.push(`${entry.page}#jsonld-${scriptIndex}:placeholder-offer`);
      return `${open}\n${JSON.stringify(block.schema, null, 2)}\n${close}`;
    }

    if (block.repairedBody !== null && block.repairedBody !== body) {
      changed = true;
      repairs.push(`${entry.page}#jsonld-${scriptIndex}:syntax`);
      return `${open}${block.repairedBody}${close}`;
    }
    return match;
  });

  if (apply && changed) fs.writeFileSync(headPath, next);
}

if (failures.length) {
  console.error(`❌ JSON-LD repair could not normalize ${failures.length} block(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

if (!apply && repairs.length) {
  console.error(`❌ JSON-LD contains ${repairs.length} repairable or redundant block(s)`);
  console.error('Run: node tools/repair-jsonld.mjs --apply');
  process.exit(1);
}

console.log(`✅ JSON-LD ${apply ? 'repaired' : 'valid'}: ${repairs.length} changed block(s)`);
