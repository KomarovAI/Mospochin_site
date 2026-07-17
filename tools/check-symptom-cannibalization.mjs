#!/usr/bin/env node
import fs from 'node:fs'; import { pageRegistry,failIf } from './sous-vide-fault-lib.mjs';
const pages=pageRegistry().pages.filter(x=>x.status==='published').map(x=>x.page), errors=[];
function text(page){return fs.readFileSync(page,'utf8').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').toLowerCase().replace(/[^a-zа-яё0-9 ]/gi,' ').split(/\s+/).filter(x=>x.length>4)}
function jac(a,b){const A=new Set(a),B=new Set(b),I=[...A].filter(x=>B.has(x)).length,U=new Set([...A,...B]).size;return U?I/U:0}
for(let i=0;i<pages.length;i++)for(let j=i+1;j<pages.length;j++){const v=jac(text(pages[i]),text(pages[j]));if(v>0.70)errors.push(`${pages[i]} vs ${pages[j]} semantic token overlap ${(v*100).toFixed(1)}%`)}
failIf(errors,`Symptom cannibalization passed: ${pages.length} pages`)
