import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const CLUSTER_REGISTRY_PATH = 'data/cluster-registry.json';
export const CLUSTER_SCHEMA_PATH = 'data/cluster-contract.schema.json';

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

export function normalizeClusterContract(id, cluster) {
  const pages = cluster.manifest;
  return {
    ...cluster,
    id,
    pages,
    ownerData: cluster.conversionManifest || pages,
    visualManifest: cluster.screenshotManifest,
    claimsScope: cluster.conversionManifest || pages,
    releaseTier: cluster.status || 'active',
  };
}

export function loadClusterContracts() {
  const registry = readJson(CLUSTER_REGISTRY_PATH);
  return Object.entries(registry.clusters || {})
    .map(([id, cluster]) => normalizeClusterContract(id, cluster))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function isType(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

function validateValue(value, definition, field, contractId, errors) {
  if (!isType(value, definition.type)) {
    errors.push(`${contractId}.${field}: expected ${definition.type}`);
    return;
  }
  if (definition.type === 'string') {
    if (definition.minLength && value.length < definition.minLength) errors.push(`${contractId}.${field}: empty value`);
    if (definition.pattern && !(new RegExp(definition.pattern).test(value))) errors.push(`${contractId}.${field}: invalid format`);
  }
  if (definition.type === 'array') {
    if (definition.minItems && value.length < definition.minItems) errors.push(`${contractId}.${field}: expected at least ${definition.minItems} item(s)`);
    for (const [index, item] of value.entries()) validateValue(item, definition.items, `${field}[${index}]`, contractId, errors);
  }
}

function npmScriptFromCommand(command) {
  return String(command).match(/^npm run ([a-zA-Z0-9:_-]+)$/)?.[1] || null;
}

export function validateClusterContracts(contracts, options = {}) {
  const schema = options.schema || readJson(CLUSTER_SCHEMA_PATH);
  const packageScripts = options.packageScripts || readJson('package.json').scripts || {};
  const errors = [];
  const seen = new Set();

  for (const contract of contracts) {
    if (seen.has(contract.id)) errors.push(`${contract.id}: duplicate id`);
    seen.add(contract.id);

    for (const field of schema.required || []) {
      if (contract[field] === undefined || contract[field] === null) {
        errors.push(`${contract.id}.${field}: required field is missing`);
      }
    }
    for (const [field, definition] of Object.entries(schema.properties || {})) {
      if (contract[field] === undefined || contract[field] === null) continue;
      validateValue(contract[field], definition, field, contract.id, errors);
    }

    for (const field of ['pages', 'ownerData', 'visualManifest', 'claimsScope']) {
      const relativePath = contract[field];
      if (relativePath && !existsSync(path.join(ROOT, relativePath))) errors.push(`${contract.id}.${field}: file not found (${relativePath})`);
    }
    for (const command of [...(contract.guardCommands || []), ...(contract.visualCommand ? [contract.visualCommand] : [])]) {
      const script = npmScriptFromCommand(command);
      if (script && !Object.hasOwn(packageScripts, script)) errors.push(`${contract.id}: npm script not found (${script})`);
    }
  }

  return errors;
}

export function getClusterContract(id) {
  return loadClusterContracts().find((contract) => contract.id === id) || null;
}
