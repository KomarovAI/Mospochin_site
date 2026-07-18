#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const read=(f)=>JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8'));
const pages=read('data/microwave-cluster-pages.json');
const graph=read('data/microwave-link-graph.json');
const evidence=read('data/microwave-fault-evidence.json');
const taxonomy=read('data/microwave-fault-taxonomy.json');
const boundaries=read('data/microwave-intent-boundaries.json');
const failures=[]; const fail=(x)=>failures.push(x);
if(pages.cluster!=='microwaves'||pages.scope!=='domestic-microwave-ovens') fail('invalid cluster scope');
if(pages.pages.length!==15||pages.pageCount!==15) fail(`expected 15 pages, got ${pages.pages.length}`);
const set=new Set(pages.pages.map(x=>x.page));
for(const item of pages.pages){
 const file=path.join(ROOT,item.page);
 if(!fs.existsSync(file)){fail(`${item.page}: missing root HTML`);continue;}
 const html=fs.readFileSync(file,'utf8');
 const model=path.join(ROOT,'src/pages',item.slug,'page.json');
 if(!fs.existsSync(model)) fail(`${item.page}: missing builder model`);
 for(const needle of ['<h1','telegram-form','name="phone"','name="problem"','telegram-form.js','analytics.js','tel:+79990057172','wa.me/79990057172','data-sync-zone="faq-items"']) if(!html.includes(needle)) fail(`${item.page}: missing ${needle}`);
 if(!html.includes(`<link rel="canonical" href="https://mospochin.ru/${item.page}">`)) fail(`${item.page}: canonical mismatch`);
 if(/по согласованию после диагностикиут/i.test(html)) fail(`${item.page}: corrupted phrase`);
 if(/не греет[^<]{0,35}(?:—|-)\s*всегда\s+магнетрон[.!<]/i.test(html)) fail(`${item.page}: prohibited magnetron certainty`);
 if(/искрит[^<]{0,35}(?:—|-)\s*всегда\s+слюд[а-я]*[.!<]/i.test(html)) fail(`${item.page}: prohibited mica certainty`);
 if(/снимите\s+(?:внешний\s+)?корпус/i.test(html)) fail(`${item.page}: unsafe casing instruction`);
 if(/(?:обойдите|замкните)\s+(?:дверн\w+\s+)?(?:блокиров|концевик|микропереключ)/i.test(html)) fail(`${item.page}: unsafe interlock instruction`);
 if(/разрядите\s+(?:высоковольтн\w+\s+)?конденсатор/i.test(html)) fail(`${item.page}: unsafe capacitor instruction`);
  for(const target of item.clusterLinks||[]) if(!html.includes(`href="${target}"`)) fail(`${item.page}: missing contextual link ${target}`);
}
if(evidence.sources.length<6) fail('insufficient official evidence sources');
if(taxonomy.symptoms.length<9) fail('insufficient symptom taxonomy');
if(!boundaries.boundaries.some(x=>x.intent.includes('high-voltage')&&x.status==='prohibited')) fail('missing high-voltage boundary');
for(const edge of graph.edges){ if(!set.has(edge.from)||!set.has(edge.to)) fail(`graph edge outside cluster: ${edge.from} -> ${edge.to}`); }
if(graph.edges.length<55) fail(`expected at least 55 contextual edges, got ${graph.edges.length}`);
if(failures.length){console.error(`Microwave cluster check failed (${failures.length})`); for(const x of failures) console.error(`- ${x}`); process.exit(1);}
console.log(`Microwave cluster OK: ${pages.pages.length} pages, ${graph.edges.length} links, ${evidence.sources.length} evidence sources.`);
