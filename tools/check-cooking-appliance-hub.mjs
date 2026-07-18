#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const read=(f)=>JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8'));
const pages=read('data/cooking-appliance-hub-pages.json');
const graph=read('data/cooking-appliance-link-graph.json');
const evidence=read('data/cooking-appliance-fault-evidence.json');
const taxonomy=read('data/cooking-appliance-fault-taxonomy.json');
const boundaries=read('data/cooking-appliance-intent-boundaries.json');
const failures=[]; const fail=(x)=>failures.push(x);
if(pages.cluster!=='cooking-appliance-hubs'||pages.release!=='COOK2') fail('invalid cluster/release');
if(pages.pages.length!==28||pages.pageCount!==28) fail(`expected 28 pages, got ${pages.pages.length}`);
const set=new Set(pages.pages.map(x=>x.page));
const families=new Set(pages.pages.map(x=>x.family));
for(const expected of ['cooking_hub','electric_oven','electric_hob','induction_hob']) if(!families.has(expected)) fail(`missing family ${expected}`);
for(const item of pages.pages){
 const file=path.join(ROOT,item.page);
 if(!fs.existsSync(file)){fail(`${item.page}: missing root HTML`);continue;}
 const html=fs.readFileSync(file,'utf8');
 const model=path.join(ROOT,'src/pages',item.slug,'page.json');
 if(!fs.existsSync(model)) fail(`${item.page}: missing builder model`);
 for(const needle of ['<h1','telegram-form','name="phone"','name="problem"','telegram-form.js','analytics.js','tel:+79990057172','wa.me/79990057172','data-sync-zone="faq-items"','data-slot="request-form"']) if(!html.includes(needle)) fail(`${item.page}: missing ${needle}`);
 if(!html.includes(`<link rel="canonical" href="https://mospochin.ru/${item.page}">`)) fail(`${item.page}: canonical mismatch`);
 if(/ремонт(?:ируем|ировать)?\s+газов|пахнет\s+газом|газовая\s+(?:плита|панель|духовка)/i.test(html)) fail(`${item.page}: gas repair intent leaked`);
 if(/(?:не\s+греет|не\s+видит\s+посуду|не\s+работает\s+зона)[^<]{0,50}(?:—|-)\s*(?:всегда|точно|обязательно)\s+(?:тэн|плата|катушка|модуль)/i.test(html)) fail(`${item.page}: prohibited certainty`);
 if(/(?:переподключите|замените)\s+(?:силовой\s+)?(?:кабель|перемычк|фаз)|снимите\s+(?:клеммную|заднюю)\s+(?:крышку|панель)/i.test(html)) fail(`${item.page}: unsafe mains instruction`);
 if(/(?:треснул|разбит)[^<]{0,100}(?:можно|продолжайте)\s+(?:пользоваться|работать)/i.test(html)) fail(`${item.page}: unsafe cracked-glass guidance`);
 for(const target of item.clusterLinks||[]){
   if(!set.has(target)) fail(`${item.page}: related target outside cluster ${target}`);
   if(!html.includes(`href="${target}"`)) fail(`${item.page}: missing contextual link ${target}`);
 }
}
if(evidence.sources.length<12) fail(`insufficient official evidence sources: ${evidence.sources.length}`);
if((taxonomy.faults||[]).length!==24) fail(`expected 24 non-hub faults, got ${(taxonomy.faults||[]).length}`);
if(!boundaries.boundaries.some(x=>x.intent.includes('gas')&&x.status==='excluded')) fail('missing gas boundary');
if(!boundaries.boundaries.some(x=>x.intent.includes('mains')&&x.status==='prohibited')) fail('missing mains safety boundary');
if(!boundaries.boundaries.some(x=>x.intent.includes('cracked')&&x.status==='prohibited')) fail('missing cracked glass boundary');
for(const edge of graph.edges){
 if(!set.has(edge.from)||!set.has(edge.to)) fail(`graph edge outside cluster: ${edge.from} -> ${edge.to}`);
}
if(graph.edges.length<100) fail(`expected at least 100 contextual edges, got ${graph.edges.length}`);
const titles=new Map();
for(const p of pages.pages){
 const key=p.title.toLowerCase();
 if(titles.has(key)) fail(`duplicate title: ${p.page} / ${titles.get(key)}`); else titles.set(key,p.page);
}
if(failures.length){
 console.error(`Cooking appliance COOK2 check failed (${failures.length})`);
 for(const x of failures) console.error(`- ${x}`);
 process.exit(1);
}
console.log(`Cooking appliance COOK2 OK: ${pages.pages.length} pages, ${graph.edges.length} links, ${evidence.sources.length} evidence sources.`);
