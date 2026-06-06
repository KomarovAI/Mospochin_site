#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';
import { ROOT_DIR, parseArgs } from './ai-maintenance-lib.mjs';
import { analyzeSourceComplexity } from './source-compression-lib.mjs';

const POLICY_PATH = 'data/ai-scale-policy.json';

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT_DIR, path), 'utf8'));
}

function pct(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function fixed(value, digits = 1) {
  return Number(value || 0).toFixed(digits);
}

function pushFailure(failures, message, details = null) {
  failures.push(details ? `${message} (${details})` : message);
}

function pushWarning(warnings, message, details = null) {
  warnings.push(details ? `${message} (${details})` : message);
}

function checkMetric({ failures, label, actual, limit, direction, gateMessage }) {
  if (limit == null) return;
  const ok = direction === 'min' ? actual >= limit : actual <= limit;
  if (!ok) {
    const sign = direction === 'min' ? '>=' : '<=';
    pushFailure(failures, `${label}: ${actual} должен быть ${sign} ${limit}`, gateMessage);
  }
}

function checkRatio({ failures, label, actual, limit, gateMessage }) {
  if (limit == null) return;
  if (actual < limit) {
    pushFailure(failures, `${label}: ${pct(actual)} должен быть >= ${pct(limit)}`, gateMessage);
  }
}

const args = parseArgs();
const strict = Boolean(args.strict);
const quiet = Boolean(args.quiet);
const asJson = Boolean(args.json);
const policy = readJson(POLICY_PATH);
const report = analyzeSourceComplexity();
const s = report.summary;
const failures = [];
const warnings = [];

if (policy.hardGates?.builderParityRequired && s.rootHtmlPages !== s.builderPages) {
  pushFailure(failures, `Builder parity broken: rootHtmlPages=${s.rootHtmlPages}, builderPages=${s.builderPages}`);
}

const missingAllowed = Number(policy.hardGates?.missingSourceFilesAllowed ?? 0);
if ((report.missingFiles || []).length > missingAllowed) {
  pushFailure(failures, `Missing source files: ${(report.missingFiles || []).length} > ${missingAllowed}`);
}

if (policy.pageBudget?.hardStopAtPages && s.builderPages > Number(policy.pageBudget.hardStopAtPages)) {
  pushFailure(
    failures,
    `Page budget exceeded: ${s.builderPages} > ${policy.pageBudget.hardStopAtPages}`,
    policy.pageBudget.afterHardStop,
  );
}

checkRatio({
  failures,
  label: 'Shared/parametric coverage',
  actual: s.sharedCoverageRatio,
  limit: policy.hardGates?.minimumSharedCoverageRatio,
});
checkMetric({
  failures,
  label: 'Average sections/page',
  actual: Number(fixed(s.averageSectionsPerPage, 2)),
  limit: policy.hardGates?.maxAverageSectionsPerPage,
  direction: 'max',
});
checkMetric({
  failures,
  label: 'Average source files/page',
  actual: Number(fixed(s.averageSourceFilesPerPage, 2)),
  limit: policy.hardGates?.maxAverageSourceFilesPerPage,
  direction: 'max',
});

for (const gate of policy.stageGates || []) {
  if (s.builderPages < Number(gate.minPages || 0)) continue;
  if (gate.block) {
    pushFailure(failures, gate.message || `Stage gate blocks projects with ${gate.minPages}+ pages`);
    continue;
  }
  checkRatio({
    failures,
    label: `Stage ${gate.minPages}+ coverage`,
    actual: s.sharedCoverageRatio,
    limit: gate.minimumSharedCoverageRatio,
    gateMessage: gate.message,
  });
  checkMetric({
    failures,
    label: `Stage ${gate.minPages}+ average sections/page`,
    actual: Number(fixed(s.averageSectionsPerPage, 2)),
    limit: gate.maxAverageSectionsPerPage,
    direction: 'max',
    gateMessage: gate.message,
  });
  checkMetric({
    failures,
    label: `Stage ${gate.minPages}+ average source files/page`,
    actual: Number(fixed(s.averageSourceFilesPerPage, 2)),
    limit: gate.maxAverageSourceFilesPerPage,
    direction: 'max',
    gateMessage: gate.message,
  });
}

if (policy.pageBudget?.softReviewAtPages && s.builderPages >= Number(policy.pageBudget.softReviewAtPages)) {
  pushWarning(warnings, `Soft review point reached: ${s.builderPages} pages >= ${policy.pageBudget.softReviewAtPages}. Review source-complexity before adding more pages.`);
}

const t = policy.warningThresholds || {};
const top = (items, pick, limit) => items.filter((item) => Number(pick(item) || 0) > limit).sort((a, b) => Number(pick(b) || 0) - Number(pick(a) || 0)).slice(0, 8);

if (t.maxSectionsPerPage != null) {
  for (const page of top(report.pages || [], (p) => p.sectionCount, t.maxSectionsPerPage)) {
    pushWarning(warnings, `${page.page}: много секций`, `${page.sectionCount} > ${t.maxSectionsPerPage}`);
  }
}
if (t.maxLocalSectionsPerPage != null) {
  for (const page of top(report.pages || [], (p) => p.localSections, t.maxLocalSectionsPerPage)) {
    pushWarning(warnings, `${page.page}: много локальных секций`, `${page.localSections} > ${t.maxLocalSectionsPerPage}`);
  }
}
if (t.maxRawSectionsPerPage != null) {
  for (const page of top(report.pages || [], (p) => p.rawSections, t.maxRawSectionsPerPage)) {
    pushWarning(warnings, `${page.page}: много raw-секций`, `${page.rawSections} > ${t.maxRawSectionsPerPage}`);
  }
}
if (t.maxSourceFilesPerPage != null) {
  for (const page of top(report.pages || [], (p) => p.sourceFileCount, t.maxSourceFilesPerPage)) {
    pushWarning(warnings, `${page.page}: много source-файлов`, `${page.sourceFileCount} > ${t.maxSourceFilesPerPage}`);
  }
}

const strictFailures = strict ? warnings.map((warning) => `strict warning: ${warning}`) : [];
const allFailures = [...failures, ...strictFailures];
const result = {
  ok: allFailures.length === 0,
  strict,
  policy: POLICY_PATH,
  mode: policy.mode,
  summary: {
    pages: s.builderPages,
    rootHtmlPages: s.rootHtmlPages,
    sharedCoverageRatio: s.sharedCoverageRatio,
    averageSectionsPerPage: s.averageSectionsPerPage,
    averageSourceFilesPerPage: s.averageSourceFilesPerPage,
    localSections: s.localSections,
    compressedSectionRefs: s.compressedSectionRefs,
  },
  failures: allFailures,
  warnings,
};

if (asJson) {
  console.log(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || allFailures.length) {
  console.log(`Scale policy: ${policy.mode}`);
  console.log(`Pages: ${s.builderPages}/${policy.pageBudget?.hardStopAtPages || '∞'}; coverage: ${pct(s.sharedCoverageRatio)}; avg sections/page: ${fixed(s.averageSectionsPerPage)}; avg source files/page: ${fixed(s.averageSourceFilesPerPage)}`);
  if (warnings.length && !quiet) {
    console.log('\nWarnings:');
    for (const warning of warnings) console.log(`⚠️  ${warning}`);
  }
  if (allFailures.length) {
    console.error('\nFailures:');
    for (const failure of allFailures) console.error(`❌ ${failure}`);
  } else {
    console.log('✅ Scale policy passed');
  }
}

if (allFailures.length) process.exit(1);
