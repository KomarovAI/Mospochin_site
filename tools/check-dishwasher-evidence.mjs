#!/usr/bin/env node
import {load,failIf} from './dishwasher-fault-lib.mjs';
const data=load('dishwasher-fault-evidence.json'), rows=data.records||[], errors=[], ids=new Set();
const allowed=new Set(data.policy?.allowedSourceTypes||[]);
for(const x of rows){
 if(!x.id||ids.has(x.id))errors.push(`duplicate/missing id ${x.id}`); ids.add(x.id);
 if(!allowed.has(x.sourceType))errors.push(`${x.id}: unsupported sourceType ${x.sourceType}`);
 if(!/^https:\/\//.test(x.url||''))errors.push(`${x.id}: https URL required`);
 if(!x.checkedAt)errors.push(`${x.id}: checkedAt required`);
 if(!(x.modelScope||[]).length)errors.push(`${x.id}: modelScope required`);
 if((x.supportedClaims||[]).length<2)errors.push(`${x.id}: >=2 supportedClaims required`);
 if(!(x.prohibitedGeneralizations||[]).length)errors.push(`${x.id}: prohibitedGeneralizations required`);
}
failIf(errors,`Dishwasher evidence passed: ${rows.length} official records`)
