#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';
import { ROOT_DIR, parseArgs } from './ai-maintenance-lib.mjs';
import { analyzeSourceComplexity } from './source-compression-lib.mjs';
import { evaluateScalePolicy } from './scale-policy-lib.mjs';
const args=parseArgs();
const policy=JSON.parse(readFileSync(join(ROOT_DIR,'data/ai-scale-policy.json'),'utf8'));
const report=analyzeSourceComplexity();
const result=evaluateScalePolicy(policy,report,{strict:Boolean(args.strict)});
if (args.json) console.log(JSON.stringify({mode:policy.mode,...result},null,2));
else {
  const s=result.summary;
  console.log(`# Scale policy: ${policy.mode}`);
  console.log(`Pages: ${s.builderPages} (no hard limit)`);
  console.log(`Builder parity: ${s.builderPages}/${s.rootHtmlPages}`);
  console.log(`Shared/parametric coverage: ${(Number(s.sharedCoverageRatio||0)*100).toFixed(1)}%`);
  for (const w of result.warnings.slice(0,12)) console.log(`⚠️ ${w}`);
  for (const f of result.failures) console.error(`❌ ${f}`);
  if (!result.failures.length) console.log('✅ Scale policy passed');
}
if (result.failures.length) process.exit(1);
