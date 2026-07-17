#!/usr/bin/env node
import { load,evidenceMap,failIf } from './sous-vide-fault-lib.mjs';
const rows=load('sous-vide-error-codes.json').codes, ev=evidenceMap(), errors=[], keys=new Set();
for(const x of rows){const k=`${x.manufacturer}|${x.modelFamily}|${x.exactCode}`; if(keys.has(k))errors.push(`duplicate ${k}`);keys.add(k);for(const f of ['manufacturer','modelFamily','exactCode','officialMeaning','manufacturerAction','safeSiteWording','evidenceId'])if(!x[f])errors.push(`${k}: ${f} missing`);if(!ev.has(x.evidenceId))errors.push(`${k}: unknown evidence ${x.evidenceId}`)}
failIf(errors,`Sous-vide error codes passed: ${rows.length} model-scoped codes`)
