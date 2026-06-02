#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';
import { analyzeSourceComplexity, renderSourceComplexityMarkdown, SOURCE_COMPLEXITY_JSON, SOURCE_COMPLEXITY_MD, writeSourceComplexityReport } from './source-compression-lib.mjs';
import { parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const report = analyzeSourceComplexity();
const json = `${JSON.stringify(report, null, 2)}\n`;
const md = renderSourceComplexityMarkdown(report);

if (args.check) {
  let ok = true;
  const checks = [
    [SOURCE_COMPLEXITY_JSON, json],
    [SOURCE_COMPLEXITY_MD, md],
  ];
  for (const [file, expected] of checks) {
    let actual = null;
    try { actual = readFileSync(join(ROOT_DIR, file), 'utf8'); } catch {}
    if (actual !== expected) {
      console.error(`❌ ${file} устарел. Запусти npm run analyze:source-complexity.`);
      ok = false;
    }
  }
  if (!ok) process.exit(1);
  console.log('✅ Source complexity report актуален');
  process.exit(0);
}

writeSourceComplexityReport(report);
console.log(`✅ Записано: ${SOURCE_COMPLEXITY_JSON}`);
console.log(`✅ Записано: ${SOURCE_COMPLEXITY_MD}`);
console.log(`Pages: ${report.summary.builderPages}; sections: ${report.summary.totalSections}; shared coverage: ${(report.summary.sharedCoverageRatio * 100).toFixed(1)}%`);
