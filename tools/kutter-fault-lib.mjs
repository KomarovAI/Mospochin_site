#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const ROOT=process.cwd();
export function load(name){return JSON.parse(fs.readFileSync(path.join(ROOT,'data',name),'utf8'))}
export function evidenceMap(){return new Map((load('kutter-fault-evidence.json').records||[]).map(x=>[x.id,x]))}
export function taxonomy(){return load('kutter-fault-taxonomy.json').symptoms||[]}
export function failIf(errors,ok){if(errors.length){console.error(`❌ ${errors.length} issue(s)`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}console.log(`✅ ${ok}`)}
