#!/usr/bin/env node
import {load,evidenceMap,failIf} from './dishwasher-fault-lib.mjs';
const rows=load('dishwasher-brand-models.json').brands||[], ev=evidenceMap(), errors=[], ids=new Set();
for(const b of rows){
 if(!b.brandId||ids.has(b.brandId))errors.push(`duplicate/missing brandId ${b.brandId}`); ids.add(b.brandId);
 if(!/^https:\/\//.test(b.officialUrl||''))errors.push(`${b.brandId}: official URL required`);
 if((b.series||[]).length<2)errors.push(`${b.brandId}: at least two series groups required`);
 for(const s of b.series||[]){if(!s.name||!s.family)errors.push(`${b.brandId}: invalid series`);if(!(s.evidenceIds||[]).length)errors.push(`${b.brandId}/${s.name}: evidence required`);for(const id of s.evidenceIds||[])if(!ev.has(id))errors.push(`${b.brandId}/${s.name}: unknown evidence ${id}`)}
}
if(rows.length!==6)errors.push(`expected 6 first-wave brands, got ${rows.length}`);
failIf(errors,`Dishwasher brand/model registry passed: ${rows.length} brands, ${rows.flatMap(x=>x.series||[]).length} series groups`)
