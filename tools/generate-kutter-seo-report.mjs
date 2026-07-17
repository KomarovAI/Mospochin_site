#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const CHECK=process.argv.includes('--check');
const OUT_JSON='reports/kutter-seo-cluster-audit.json';
const OUT_MD='reports/kutter-seo-cluster-audit.md';
const cluster=JSON.parse(fs.readFileSync('data/kutter-cluster-pages.json','utf8'));
const graph=JSON.parse(fs.readFileSync('data/kutter-link-graph.json','utf8'));
const publishedEntries=cluster.pages.filter(x=>x.status==='published');
const published=new Set(publishedEntries.map(x=>x.page));
const indexable=new Set(publishedEntries.filter(x=>x.indexable).map(x=>x.page));
const byPage=new Map(cluster.pages.map(x=>[x.page,x]));

function norm(s){return String(s||'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(html,name){return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`,'gi'))].map(m=>norm(m[1]))}
function attr(html,selector,valueAttr){
  const tags=[...html.matchAll(new RegExp(`<${selector}\\b[^>]*>`,'gi'))].map(m=>m[0]);
  for(const t of tags){if(!/name=["']description["']/i.test(t))continue;return t.match(new RegExp(`${valueAttr}=["']([^"']*)["']`,'i'))?.[1]||''}return '';
}
function words(html){const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||html;return norm(main.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ')).split(/\s+/).filter(Boolean).length}
function targets(html,page){const out=new Set();for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)){let h=m[1].split('#')[0].split('?')[0].replace(/^\/+/, '');if(published.has(h)&&h!==page)out.add(h)}return [...out].sort()}
function dups(items){const map=new Map();for(const {page,value} of items){if(!value)continue;if(!map.has(value))map.set(value,[]);map.get(value).push(page)}return [...map.entries()].filter(([,p])=>p.length>1).map(([value,pages])=>({value,pages}))}
function median(v){if(!v.length)return 0;const a=[...v].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:Math.round((a[m-1]+a[m])/2)}
function bfs(adj,hub){const d=new Map([[hub,0]]),q=[hub];while(q.length){const p=q.shift();for(const t of adj.get(p)||[])if(!d.has(t)){d.set(t,d.get(p)+1);q.push(t)}}return d}
function tokens(s){return new Set(norm(s).toLowerCase().match(/[а-яёa-z0-9]{4,}/g)||[])}
function jaccard(a,b){const A=tokens(a),B=tokens(b),u=new Set([...A,...B]);if(!u.size)return 0;let c=0;for(const x of A)if(B.has(x))c++;return c/u.size}

const pages={}; const adj=new Map(); const incoming=new Map([...published].map(p=>[p,new Set()])); const actualEdges=[];
for(const entry of publishedEntries){
  const html=fs.readFileSync(entry.page,'utf8'); const ts=targets(html,entry.page);adj.set(entry.page,ts);
  for(const to of ts){incoming.get(to)?.add(entry.page);actualEdges.push({from:entry.page,to})}
  const faqs=[...html.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map(m=>norm(m[1]));
  const h2=tag(html,'h2');
  pages[entry.page]={page:entry.page,pageType:entry.pageType,indexable:Boolean(entry.indexable),title:tag(html,'title')[0]||'',description:attr(html,'meta','content'),h1:tag(html,'h1')[0]||'',h1Count:tag(html,'h1').length,h2Count:h2.length,duplicateH2:[...new Set(h2.filter((x,i)=>h2.indexOf(x)!==i))],faqQuestions:faqs,words:words(html),outgoingUnique:ts.length,incomingUnique:0,depthFromHub:null};
}
for(const p of published){pages[p].incomingUnique=incoming.get(p)?.size||0}
const depth=bfs(adj,graph.hub);for(const p of published)pages[p].depthFromHub=depth.has(p)?depth.get(p):null;

const faqGroups=new Map();for(const p of Object.values(pages))for(const q of p.faqQuestions){if(!faqGroups.has(q))faqGroups.set(q,[]);faqGroups.get(q).push(p.page)}
const duplicateFaq=[...faqGroups.entries()].filter(([,v])=>new Set(v).size>1).map(([question,v])=>({question,pages:[...new Set(v)]}));
const titleDup=dups(Object.values(pages).map(p=>({page:p.page,value:p.title.toLowerCase()})));
const descDup=dups(Object.values(pages).map(p=>({page:p.page,value:p.description.toLowerCase()})));
const h1Dup=dups(Object.values(pages).map(p=>({page:p.page,value:p.h1.toLowerCase()})));
const lowIncoming=[...indexable].filter(p=>p!==graph.hub&&(pages[p].incomingUnique<3)).map(p=>({page:p,incoming:pages[p].incomingUnique}));
const unreachable=[...indexable].filter(p=>!depth.has(p));
const titleLength=Object.values(pages).filter(p=>p.title.length>70).map(p=>({page:p.page,length:p.title.length,title:p.title}));
const descLength=Object.values(pages).filter(p=>p.description.length<70||p.description.length>180).map(p=>({page:p.page,length:p.description.length}));
const h1Bad=Object.values(pages).filter(p=>p.h1Count!==1).map(p=>({page:p.page,count:p.h1Count}));
const thresholds={cluster_hub:350,commercial_service:280,equipment_family:300,informational_article:300,symptom_service:320,brand_service:320,direct_landing:180};
const thin=Object.values(pages).filter(p=>p.words<(thresholds[p.pageType]||250)).map(p=>({page:p.page,pageType:p.pageType,words:p.words,minimum:thresholds[p.pageType]||250}));
const leaks=[];const leakTerms=['safety chain','interlock','magnetic switch','microswitch','no-voltage protection'];
for(const p of published){const visible=norm(fs.readFileSync(p,'utf8').replace(/<script\b[\s\S]*?<\/script>/gi,' '));for(const term of leakTerms)if(visible.toLowerCase().includes(term))leaks.push({page:p,term})}
const safetyPages=['voda-popala-v-motornyy-blok-kuttera.html','zapah-gari-ili-dym-iz-kuttera.html','posle-moyki-kutter-ne-vklyuchaetsya.html','nozh-kuttera-ne-ostanavlivaetsya.html','kutter-vybivaet-avtomat.html','nozh-kuttera-zaklinilo.html','tupye-ili-povrezhdennye-nozhi-kuttera.html'];
const safetyOrder=[];for(const p of safetyPages){if(!published.has(p))continue;const h=fs.readFileSync(p,'utf8'),a=h.indexOf('Когда нужно остановить оборудование'),b=h.indexOf('Проверка без вскрытия');if(a<0||b<0||a>b)safetyOrder.push(p)}
const similarities=[];const symptoms=publishedEntries.filter(x=>x.pageType==='symptom_service');for(let i=0;i<symptoms.length;i++)for(let j=i+1;j<symptoms.length;j++){const a=fs.readFileSync(symptoms[i].page,'utf8'),b=fs.readFileSync(symptoms[j].page,'utf8'),score=jaccard(a,b);if(score>=.55)similarities.push({score:Number(score.toFixed(3)),a:symptoms[i].page,b:symptoms[j].page})}
const graphNodes=new Map(graph.nodes.map(x=>[x.page,x]));const graphStatus=[];for(const e of cluster.pages){if(graphNodes.get(e.page)?.status!==e.status)graphStatus.push({page:e.page,cluster:e.status,graph:graphNodes.get(e.page)?.status||null})}
const graphPublished=new Set(graph.edges.filter(e=>e.status==='published').map(e=>`${e.from}\0${e.to}`));const actualSet=new Set(actualEdges.map(e=>`${e.from}\0${e.to}`));
const missingGraph=[...actualSet].filter(k=>!graphPublished.has(k)).map(k=>{const [from,to]=k.split('\0');return{from,to}});const staleGraph=[...graphPublished].filter(k=>!actualSet.has(k)).map(k=>{const [from,to]=k.split('\0');return{from,to}});
const warnings=[];for(const [name,list] of Object.entries({titleDuplicates:titleDup,descriptionDuplicates:descDup,h1Duplicates:h1Dup,duplicateFaqQuestions:duplicateFaq,lowIncoming,unreachable,titleLength,descriptionLength:descLength,h1Bad,thinPages:thin,englishLeaks:leaks,safetyOrder,graphStatus,missingGraph,staleGraph}))if(list.length)warnings.push(name);
const report={schemaVersion:1,generatedAt:'2026-07-14',cluster:'kutter',summary:{plannedPages:cluster.pages.length,publishedPages:published.size,indexablePublished:indexable.size,symptomService:symptoms.length,actualUniqueEdges:actualSet.size,maxDepthFromHub:Math.max(0,...[...depth.values()]),minimumIncomingIndexable:Math.min(...[...indexable].filter(p=>p!==graph.hub).map(p=>pages[p].incomingUnique)),medianIncomingIndexable:median([...indexable].filter(p=>p!==graph.hub).map(p=>pages[p].incomingUnique)),medianWordsPublished:median(Object.values(pages).map(p=>p.words)),qualityWarnings:warnings.length},graph:{hub:graph.hub,lowIncoming,unreachable,graphStatusMismatches:graphStatus,actualEdgesMissingFromContract:missingGraph,stalePublishedContractEdges:staleGraph},content:{duplicateTitles:titleDup,duplicateDescriptions:descDup,duplicateH1:h1Dup,duplicateFaqQuestions:duplicateFaq,titleLength,descriptionLength:descLength,h1Bad,thinPages:thin,englishLeaks:leaks,safetyOrderIssues:safetyOrder,similarSymptomPairs:similarities.sort((a,b)=>b.score-a.score),pagesWithDuplicateH2:Object.values(pages).filter(p=>p.duplicateH2.length).map(p=>({page:p.page,duplicates:p.duplicateH2}))},qualityWarnings:warnings,pages:Object.fromEntries(Object.entries(pages).sort(([a],[b])=>a.localeCompare(b)))};
const md=`# Kutter SEO and internal-link audit\n\n| Metric | Value |\n|---|---:|\n| Published pages | ${report.summary.publishedPages} |\n| Symptom-service pages | ${report.summary.symptomService} |\n| Actual unique edges | ${report.summary.actualUniqueEdges} |\n| Maximum depth from hub | ${report.summary.maxDepthFromHub} |\n| Minimum incoming links | ${report.summary.minimumIncomingIndexable} |\n| Median incoming links | ${report.summary.medianIncomingIndexable} |\n| Median words | ${report.summary.medianWordsPublished} |\n| Quality warnings | ${report.summary.qualityWarnings} |\n\n## Result\n\n${warnings.length?`Warnings: ${warnings.join(', ')}.`:'The published kutter cluster passes the generated SEO/content/link-graph report without warnings.'}\n`;
function write(file,content){const full=path.join(ROOT,file),actual=fs.existsSync(full)?fs.readFileSync(full,'utf8'):'';if(CHECK){if(actual!==content){console.error(`STALE: ${file}. Run npm run report:kutter-seo`);process.exitCode=1}}else{fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,content)}}
write(OUT_JSON,JSON.stringify(report,null,2)+'\n');write(OUT_MD,md);if(!process.exitCode)console.log(`✅ Kutter SEO report ${CHECK?'is current':'generated'}: pages=${published.size}, edges=${actualSet.size}, warnings=${warnings.length}`);
