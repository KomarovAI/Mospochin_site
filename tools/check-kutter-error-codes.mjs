#!/usr/bin/env node
import {load,evidenceMap,failIf} from './kutter-fault-lib.mjs';
const data=load('kutter-error-codes.json'), ev=evidenceMap(), errors=[], keys=new Set();
for(const x of data.codes||[]){for(const k of ['manufacturer','modelScope','code','officialMeaning','sourceEvidenceId'])if(!x[k])errors.push(`error code missing ${k}`);const key=`${x.manufacturer}|${x.modelScope}|${x.code}`;if(keys.has(key))errors.push(`duplicate ${key}`);keys.add(key);if(x.sourceEvidenceId&&!ev.has(x.sourceEvidenceId))errors.push(`${key}: unknown evidence`)}
failIf(errors,`Kutter error-code registry passed: ${(data.codes||[]).length} model-scoped codes; universal codes forbidden`)
