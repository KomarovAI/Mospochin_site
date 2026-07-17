#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const check=process.argv.includes('--check');
const graphPath=path.join(root,'data/kutter-link-graph.json');
const cluster=JSON.parse(fs.readFileSync(path.join(root,'data/kutter-cluster-pages.json'),'utf8'));
const existing=JSON.parse(fs.readFileSync(graphPath,'utf8'));
const pages=cluster.pages||[];
const byPage=new Map(pages.map(x=>[x.page,x]));
const published=new Set(pages.filter(x=>x.status==='published').map(x=>x.page));
const clusterSet=new Set(pages.map(x=>x.page));

function localTargets(page){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  const out=new Set();
  for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)){
    let href=match[1].split('#')[0].split('?')[0].replace(/^\/+/, '');
    if(href.endsWith('.html')&&clusterSet.has(href)&&href!==page)out.add(href);
  }
  return [...out].sort();
}
function role(from,to){
  const source=byPage.get(from), target=byPage.get(to);
  if(from===existing.hub) return target?.pageType==='symptom_service'?'symptom_navigation':'hub_navigation';
  if(target?.pageType==='cluster_hub')return 'hub_context';
  if(target?.pageType==='commercial_service')return 'service_context';
  if(source?.pageType==='symptom_service'&&target?.pageType==='symptom_service')return 'related_symptom';
  if(target?.pageType==='equipment_family')return 'equipment_context';
  if(target?.pageType==='informational_article')return 'information_context';
  return 'published_internal';
}

const nodes=pages.map(p=>({page:p.page,type:p.pageType,indexable:Boolean(p.indexable),status:p.status}));
const edges=[];
for(const from of [...published].sort()){
  for(const to of localTargets(from)){
    if(!published.has(to))continue;
    edges.push({from,to,role:role(from,to),status:'published'});
  }
}
for(const edge of existing.edges||[]){
  if(published.has(edge.from)&&published.has(edge.to))continue;
  if(!clusterSet.has(edge.from)||!clusterSet.has(edge.to))continue;
  edges.push({...edge,status:'planned'});
}
const dedup=new Map();
for(const e of edges)dedup.set(`${e.from}\u0000${e.to}`,e);
const expected={
  ...existing,
  status:'active',
  updatedAt:'2026-07-14',
  nodes,
  edges:[...dedup.values()].sort((a,b)=>a.from.localeCompare(b.from)||a.to.localeCompare(b.to)),
  quality:{...(existing.quality||{}),minimumInboundIndexable:3,maximumDepthFromHub:2},
};
const serialized=JSON.stringify(expected,null,2)+'\n';
const actual=fs.readFileSync(graphPath,'utf8');
if(check){
  if(actual!==serialized){console.error('STALE: data/kutter-link-graph.json. Run npm run generate:kutter-link-graph');process.exit(1)}
  console.log(`✅ Kutter link graph layer is current: ${expected.nodes.length} nodes, ${expected.edges.length} edges`);
}else{
  fs.writeFileSync(graphPath,serialized);
  console.log(`✅ Kutter link graph generated: ${expected.nodes.length} nodes, ${expected.edges.length} edges`);
}
