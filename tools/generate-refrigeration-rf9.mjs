#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root=process.cwd();
const readJson=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const writeJson=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
const specs=readJson('data/refrigeration-rf9-page-specs.json').pages;
const targets=Object.keys(specs);
const direct=readJson('data/direct-landing-pages.json');
const cluster=readJson('data/refrigeration-cluster-pages.json');
const byPage=new Map(cluster.pages.map((x)=>[x.page,x]));
const clean=(value)=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();

const directByFile=new Map((direct.pages||[]).map((x)=>[x.file,x]));
for(const [file,spec] of Object.entries(specs)) directByFile.set(file,spec);
direct.pages=[...directByFile.values()].sort((a,b)=>a.file.localeCompare(b.file,'ru'));

for(const [file,spec] of Object.entries(specs)){
  const row=byPage.get(file);
  if(!row) throw new Error(`Refrigeration manifest entry missing: ${file}`);
  if(row.pageType!=='direct'||row.indexable!==false) throw new Error(`${file}: expected noindex Direct manifest row`);
  row.status='published';
  row.publicationWave='RF9';
  row.title=spec.title;
  row.h1=clean(spec.h1Html);
}
cluster.checkedAt='2026-07-15';
writeJson('data/direct-landing-pages.json',direct);
writeJson('data/refrigeration-cluster-pages.json',cluster);

function run(args){
  const result=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});
  if(result.status!==0) process.exit(result.status??1);
}
for(const file of targets) run(['tools/generate-direct-landings.mjs','--page',file]);
run(['tools/apply-refrigeration-metrics-markup.mjs']);
run(['tools/generate-sitemap.mjs']);

const viewport=[
  {id:'desktop',label:'Desktop',width:1440,height:1080,deviceScaleFactor:1},
  {id:'mobile',label:'Mobile',width:393,height:852,deviceScaleFactor:2,isMobile:true,hasTouch:true},
];
const published=cluster.pages.filter((x)=>x.status==='published');
const shots=readJson('data/refrigeration-screenshot-audit.json');
shots.status='direct-rf9';
shots.checkedAt='2026-07-15';
shots.pages=published.map((x)=>({page:x.page,branch:'restaurant',pageType:'service',fullPage:true}));
writeJson('data/refrigeration-screenshot-audit.json',shots);
writeJson('data/refrigeration-rf9-screenshot-audit.json',{
  schemaVersion:1,cluster:'refrigeration',status:'rf9-direct-pages',runtime:'local-native',
  artifactRoot:'.artifacts/screenshots/refrigeration/rf9',server:{host:'127.0.0.1',port:9999},
  waitStrategy:{networkIdleTimeoutMs:1500,postLoadDelayMs:2200},
  pages:targets.map((page)=>({page,branch:'restaurant',pageType:'service',fullPage:true})),
  checkedAt:'2026-07-15',viewports:viewport,browser:'chromium'
});

const known=new Set(cluster.pages.map((x)=>x.page));
function actual(page){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  const out=[];
  for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)){
    const value=match[1].split('#')[0].split('?')[0].replace(/^\//,'');
    if(known.has(value)&&value!==page) out.push(value);
  }
  return [...new Set(out)].sort();
}
const graph=readJson('data/refrigeration-link-graph.json');
graph.mode='published-direct-rf9';
graph.publicationWave='RF9';
graph.checkedAt='2026-07-15';
for(const node of graph.nodes){
  const row=byPage.get(node.page);
  node.status=row.status;node.indexable=row.indexable;node.pageType=row.pageType;
  if(row.status==='published'){
    node.actualOutgoing=actual(node.page);
    if(row.pageType==='direct') node.plannedOutgoing=node.actualOutgoing;
  }
}
writeJson('data/refrigeration-link-graph.json',graph);

const registry=readJson('data/cluster-registry.json');
const config=registry.clusters.refrigeration;
config.status='direct-rf9';
if(!config.guardCommands.includes('npm run check:refrigeration-direct-pages')){
  const pos=Math.max(0,config.guardCommands.indexOf('npm run check:refrigeration-brand-pages')+1);
  config.guardCommands.splice(pos,0,'npm run check:refrigeration-direct-pages');
}
writeJson('data/cluster-registry.json',registry);
console.log(`Generated RF9: ${targets.length} Direct pages, published=${published.length}.`);
