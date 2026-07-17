#!/usr/bin/env node
import {load,evidenceMap,failIf} from './kutter-fault-lib.mjs';
const rows=load('kutter-brand-models.json').brands||[], ev=evidenceMap(), errors=[], ids=new Set();
for(const b of rows){if(!b.brandId||ids.has(b.brandId))errors.push(`duplicate/missing brandId ${b.brandId}`);ids.add(b.brandId);if(!/^https:\/\//.test(b.officialUrl||''))errors.push(`${b.brandId}: official URL required`);if((b.series||[]).length<1)errors.push(`${b.brandId}: series required`);for(const s of b.series||[]){if(!s.name||!s.family)errors.push(`${b.brandId}: invalid series`);for(const id of s.evidenceIds||[])if(!ev.has(id))errors.push(`${b.brandId}/${s.name}: unknown evidence ${id}`)}}
failIf(errors,`Kutter brand/model registry passed: ${rows.length} brands, ${rows.flatMap(x=>x.series||[]).length} series groups`)
