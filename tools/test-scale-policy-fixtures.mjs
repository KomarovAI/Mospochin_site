#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
import { evaluateScalePolicy } from './scale-policy-lib.mjs';
const root=process.cwd();
const policy=JSON.parse(fs.readFileSync(path.join(root,'data/ai-scale-policy.json'),'utf8'));
const dir=path.join(root,'tests/fixtures/scale-policy');
let errors=0;
for (const name of fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort()) {
 const report=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
 const r=evaluateScalePolicy(policy,report);
 if(r.failures.length){errors++; console.error(`❌ ${name}: ${r.failures.join('; ')}`)} else console.log(`✅ ${name}: ${report.summary.builderPages} pages accepted by quality gates`);
}
if(errors) process.exit(1);
console.log('✅ Scale policy fixtures passed: no numeric page cap');
