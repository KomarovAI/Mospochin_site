import fs from 'node:fs'; import path from 'node:path';
export const ROOT=process.cwd();
export function load(name){return JSON.parse(fs.readFileSync(path.join(ROOT,'data',name),'utf8'))}
export function evidenceMap(){return new Map(load('sous-vide-fault-evidence.json').records.map(x=>[x.id,x]))}
export function taxonomy(){return load('sous-vide-fault-taxonomy.json').symptoms}
export function pageRegistry(){return load('sous-vide-symptom-pages.json')}
export function failIf(errors,label){if(errors.length){for(const e of errors) console.error(`❌ ${e}`); console.error(`${label}: ${errors.length} error(s)`); process.exit(1)} console.log(`✅ ${label}`)}
