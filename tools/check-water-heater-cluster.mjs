#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const ROOT=process.cwd(); const read=f=>JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8'));
const pages=read('data/water-heater-cluster-pages.json'); const graph=read('data/water-heater-link-graph.json'); const evidence=read('data/water-heater-fault-evidence.json');
const plumbing=read('data/water-heater-plumbing-pages.json'); const piping=read('data/water-heater-piping-taxonomy.json'); const install=read('data/water-heater-installation-specs.json'); const bounds=read('data/water-heater-intent-boundaries.json'); const photoLibrary=read('data/water-heater-photo-library.json'); const visual=read('data/water-heater-visual-pages.json');
const failures=[]; const fail=m=>failures.push(m);
if(pages.cluster!=='water-heaters'||pages.scope!=='electric-only-plus-local-piping-three-phase-and-visual-cases') fail('invalid WH4 visual cluster scope');
if(pages.pages.length!==31||pages.pageCount!==31) fail(`expected 31 pages, got ${pages.pages.length}/${pages.pageCount}`);
if(plumbing.pages.length!==8||plumbing.serviceBoundary!=='local_appliance_piping') fail('invalid local piping subcluster');
const pageSet=new Set(pages.pages.map(x=>x.page)); const plumbingSet=new Set(plumbing.pages.map(x=>x.page));
for(const item of pages.pages){const file=path.join(ROOT,item.page); if(!fs.existsSync(file)){fail(`${item.page}: missing root HTML`);continue} const html=fs.readFileSync(file,'utf8'); const model=path.join(ROOT,'src/pages',item.slug,'page.json'); if(!fs.existsSync(model)) fail(`${item.page}: missing builder model`); for(const needle of ['<h1','telegram-form','name="phone"','name="problem"','telegram-form.js','analytics.js','tel:+79990057172','wa.me/79990057172','data-sync-zone="faq-items"']) if(!html.includes(needle)) fail(`${item.page}: missing ${needle}`); if(!html.includes(`<link rel="canonical" href="https://mospochin.ru/${item.page}">`)) fail(`${item.page}: canonical mismatch`); if(/по согласованию после диагностикиут/i.test(html)) fail(`${item.page}: corrupted legacy phrase`); if(/ремонт(?:ируем)?\s+газов(?:ых|ой)\s+(?:водонагревател|колон)/i.test(html)) fail(`${item.page}: prohibited gas repair claim`); if(/установк[аи]\s+унитаз|ремонт\s+канализац|замен[аи]\s+стояк/i.test(html)) fail(`${item.page}: general plumbing leakage`); for(const target of item.clusterLinks||[]) if(!html.includes(`href="${target}"`)) fail(`${item.page}: missing cluster link ${target}`);}
for(const page of plumbingSet){const html=fs.readFileSync(path.join(ROOT,page),'utf8'); if(!html.includes('WH2-PIPING')) fail(`${page}: missing WH2-PIPING identity`); if(!html.includes('Граница услуги')) fail(`${page}: missing service boundary`);}
for(const edge of graph.edges){if(!pageSet.has(edge.from)||!pageSet.has(edge.to)) fail(`bad graph edge ${edge.from}->${edge.to}`)}
for(const src of evidence.sources||[]){if(!/^https:\/\//.test(src.url||'')) fail(`evidence ${src.id}: invalid url`)}
for(const required of ['safety_valve','drain_valve','shutoff_valve','pressure_reducer','sediment_filter','softening_stage','ppr_joint']) if(!piping.nodes.includes(required)) fail(`piping taxonomy missing ${required}`);
for(const required of ['no shutoff component between safety valve and tank','mechanical filter does not claim hardness removal','scope is limited to the appliance area']) if(!install.rules.includes(required)) fail(`installation rule missing: ${required}`);
const allHtml=pages.pages.map(x=>fs.readFileSync(path.join(ROOT,x.page),'utf8')).join('\n').toLowerCase();
for(const bad of ['можно заглушить сброс предохранительного клапана','устанавливаем кран между клапаном и баком','механический фильтр полностью убирает накипь','включаем пустой бойлер','всем трёхфазным водонагревателям нужен ноль','один автомат подходит всем моделям 380 в']) if(allHtml.includes(bad)) fail(`prohibited claim found: ${bad}`);
if(!bounds.boundaries.some(x=>x.intent==='general plumbing'&&x.status==='excluded')) fail('general plumbing boundary missing');
if(failures.length){console.error(failures.map(x=>`❌ ${x}`).join('\n'));process.exit(1)}
if(!pageSet.has('remont-trehfaznyh-vodonagrevateley-380-400v.html')) fail('three-phase page missing from cluster');
if(photoLibrary.sourceCount!==117||photoLibrary.photos.length!==117) fail(`photo library expected 117, got ${photoLibrary.sourceCount}/${photoLibrary.photos.length}`);
const photoIds=new Set();
for(const photo of photoLibrary.photos){
 if(photoIds.has(photo.sourceId)) fail(`duplicate photo id ${photo.sourceId}`); photoIds.add(photo.sourceId);
 if(!pageSet.has(photo.ownerPage)) fail(`${photo.sourceId}: owner outside cluster ${photo.ownerPage}`);
 const ownerHtml=fs.existsSync(path.join(ROOT,photo.ownerPage))?fs.readFileSync(path.join(ROOT,photo.ownerPage),'utf8'):'';
 const expected=photo.variants.at(-1)?.jpg; if(!expected||!ownerHtml.includes(expected)) fail(`${photo.sourceId}: owner HTML does not reference ${expected}`);
 for(const variant of photo.variants){for(const key of ['jpg','webp']) if(!variant[key]||!fs.existsSync(path.join(ROOT,variant[key]))) fail(`${photo.sourceId}: missing ${key} variant`);}
}
if(visual.photoCount!==117||visual.photoHub!=='fotografii-remonta-vodonagrevateley.html') fail('invalid WH4 visual manifest');
const three=read('data/water-heater-three-phase-page.json'); if(three.scope!=='three_phase_dhw_only') fail('invalid three-phase page scope');
console.log(`Water-heater WH4 OK: ${pages.pages.length} pages, ${photoLibrary.photos.length} photos, ${plumbing.pages.length} piping pages, ${graph.edges.length} contextual links, ${evidence.sources.length} evidence sources`);
