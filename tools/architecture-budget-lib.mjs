import { statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeSourceComplexity } from './source-compression-lib.mjs';
import { loadClusterContracts } from './cluster-contract-lib.mjs';
import { PUBLIC_CLI_ROUTES } from './mp-routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function getPath(object, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => value?.[key], object);
}

export function collectArchitectureState(config = readJson('data/architecture-budget.json')) {
  const source = analyzeSourceComplexity().summary;
  source.averageLocalSectionsPerPage = source.builderPages ? source.localSections / source.builderPages : Number.POSITIVE_INFINITY;
  const runtimeBytes = config.runtimeFiles.reduce((total, relativePath) => total + statSync(path.join(ROOT, relativePath)).size, 0);
  const packageJson = readJson('package.json');
  return {
    source,
    runtime: { payloadBytes: runtimeBytes },
    tooling: {
      packageScripts: Object.keys(packageJson.scripts || {}).length,
      publicCliRoutes: PUBLIC_CLI_ROUTES.length,
    },
    clusters: { contracts: loadClusterContracts().length },
  };
}

export function evaluateArchitectureBudget(config, state) {
  const errors = [];
  const results = [];
  for (const check of config.checks || []) {
    const actual = getPath(state, check.metric);
    let passed = Number.isFinite(actual) && Number.isFinite(check.value);
    if (passed && check.operator === 'exact') passed = actual === check.value;
    else if (passed && check.operator === 'min') passed = actual >= check.value;
    else if (passed && check.operator === 'max') passed = actual <= check.value;
    else if (!['exact', 'min', 'max'].includes(check.operator)) passed = false;

    results.push({ ...check, actual, passed });
    if (!passed) errors.push(`${check.metric}: actual=${String(actual)}, expected ${check.operator} ${check.value}`);
  }
  return { errors, results };
}

export function loadArchitectureBudget() {
  return readJson('data/architecture-budget.json');
}
