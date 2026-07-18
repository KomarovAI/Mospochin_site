#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const ROOT=process.cwd(); const read=f=>JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8'));
const pages=read('data/freezer-cluster-pages.json'); const graph=read('data/freezer-link-graph.json'); const ev=read('data/freezer-fault-evidence.json'); const tax=read('data/freezer-fault-taxonomy.json'); const bounds=read('data/freezer-intent-boundaries.json'); const fail=[];
if(pages.cluster!=='household-freezers'||pages.scope!=='domestic-freezers') fail.push('invalid scope');
if(pages.pages.length!==15) fail.push(`expected 15 pages, got ${pages.pages.length}`);
const set=new Set(pages.pages.map(x=>x.page));
for(const p of pages.pages){
 const f=path.join(ROOT,p.page); if(!fs.existsSync(f)){fail.push(`${p.page}: missing`);continue;}
 const h=fs.readFileSync(f,'utf8');
 for(const n of ['<h1','telegram-form','name="phone"','name="problem"','analytics.js','data-sync-zone="faq-items"']) if(!h.includes(n)) fail.push(`${p.page}: missing ${n}`);
 if(!h.includes(`<link rel="canonical" href="https://mospochin.ru/${p.page}">`)) fail.push(`${p.page}: canonical`);
 if(/не морозит[^<]{0,70}(?:точно|всегда)[^<]{0,30}(?:фреон|заправ|утеч)/i.test(h)) fail.push(`${p.page}: prohibited recharge certainty`);
 if(/шумит[^<]{0,70}(?:точно|всегда)[^<]{0,30}компрессор/i.test(h)) fail.push(`${p.page}: prohibited compressor certainty`);
 if(/(?:ножом|отв[её]рткой).{0,50}(?:удал|соскоб|размороз)/i.test(h)) fail.push(`${p.page}: unsafe ice removal`);
 if(/(?:дозаправ|добавить хладагент).{0,60}(?:без|не нужно).{0,30}(?:поиск|утеч)/i.test(h)) fail.push(`${p.page}: recharge without leak search`);
 for(const x of p.clusterLinks||[]) if(!h.includes(`href="${x}"`)) fail.push(`${p.page}: missing link ${x}`);
 if(!fs.existsSync(path.join(ROOT,'src/pages',p.slug,'page.json'))) fail.push(`${p.page}: missing builder model`);
}
if(ev.sources.length<10) fail.push('insufficient evidence');
if(tax.symptoms.length<13) fail.push('insufficient taxonomy');
if(graph.edges.length<58) fail.push(`insufficient edges ${graph.edges.length}`);
if(!bounds.boundaries.some(x=>x.intent==='commercial restaurant freezer'&&x.status==='excluded')) fail.push('missing commercial boundary');
for(const e of graph.edges) if(!set.has(e.from)||!set.has(e.to)) fail.push(`edge outside ${e.from}->${e.to}`);
if(fail.length){console.error(`Freezer cluster failed (${fail.length})`); fail.forEach(x=>console.error('- '+x)); process.exit(1);}
console.log(`Freezer cluster OK: ${pages.pages.length} pages, ${graph.edges.length} links, ${ev.sources.length} sources.`);
