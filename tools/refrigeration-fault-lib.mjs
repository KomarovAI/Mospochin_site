#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function load(name){return JSON.parse(fs.readFileSync(path.join(ROOT,'data',name),'utf8'))}
export function evidenceMap(){return new Map((load('refrigeration-fault-evidence.json').records||[]).map(x=>[x.id,x]))}
export function taxonomy(){return load('refrigeration-fault-taxonomy.json').symptoms||[]}
export function manifest(){return load('refrigeration-cluster-pages.json').pages||[]}
export function exists(rel){return fs.existsSync(path.join(ROOT,rel))}
export function read(rel){return fs.readFileSync(path.join(ROOT,rel),'utf8')}
export function failIf(errors,success){if(errors.length){console.error(`❌ ${errors.length} refrigeration contract issue(s):`);for(const e of errors)console.error(` - ${e}`);process.exit(1)}console.log(`✅ ${success}`)}
