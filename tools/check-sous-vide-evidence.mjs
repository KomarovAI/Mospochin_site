#!/usr/bin/env node
import { load,failIf } from './sous-vide-fault-lib.mjs';
const rows=load('sous-vide-fault-evidence.json').records; const errors=[]; const ids=new Set();
for(const x of rows){if(!x.id||ids.has(x.id))errors.push(`duplicate/missing evidence id: ${x.id}`); ids.add(x.id); if(!/^https:\/\//.test(x.url||''))errors.push(`${x.id}: URL must be https`); if(!x.checkedAt)errors.push(`${x.id}: checkedAt missing`); if(!(x.supportedClaims||[]).length)errors.push(`${x.id}: supportedClaims empty`); if(!(x.prohibitedGeneralizations||[]).length)errors.push(`${x.id}: prohibitedGeneralizations empty`)}
failIf(errors,`Sous-vide evidence passed: ${rows.length} official records`)
