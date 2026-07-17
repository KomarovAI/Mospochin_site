#!/usr/bin/env node
import {load,manifest,read,failIf} from './dishwasher-fault-lib.mjs';
const graph=load('dishwasher-link-graph.json'), nodes=graph.nodes||[], pages=manifest(), errors=[];
const known=new Set(pages.map(x=>x.page)), byPage=new Map(pages.map(x=>[x.page,x]));
const published=pages.filter(x=>x.status==='published');
const publishedSet=new Set(published.map(x=>x.page));
const organic=published.filter(x=>x.indexable); const organicSet=new Set(organic.map(x=>x.page));
const direct=published.filter(x=>x.pageType==='direct'); const directSet=new Set(direct.map(x=>x.page));
function actualLinks(page){
 const html=read(page); const out=[];
 for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)){
  const v=m[1].split('#')[0].split('?')[0].replace(/^\//,'');
  if(known.has(v)&&v!==page)out.push(v);
 }
 return [...new Set(out)];
}
if(nodes.length!==pages.length)errors.push(`graph nodes ${nodes.length} != manifest pages ${pages.length}`);
for(const n of nodes){
 if(!known.has(n.page))errors.push(`unknown graph node ${n.page}`);
 const page=byPage.get(n.page);
 if(n.status!==page?.status)errors.push(`${n.page}: graph/manifest status mismatch`);
 if((n.plannedOutgoing||[]).includes('posudomoyki.html'))errors.push(`${n.page}: household page forbidden in cluster graph`);
 for(const target of n.plannedOutgoing||[]){
   if(!known.has(target))errors.push(`${n.page}: unknown target ${target}`);
   const t=byPage.get(target); if(n.indexable&&t?.pageType==='direct')errors.push(`${n.page}: organic -> Direct link forbidden`);
 }
 if(n.page!=='posudomoechnye-mashiny.html'&&n.pageType!=='direct'&&!(n.plannedOutgoing||[]).includes('posudomoechnye-mashiny.html'))errors.push(`${n.page}: planned link to hub required`);
 if(page?.status==='published'){
   const actual=actualLinks(n.page).filter(x=>publishedSet.has(x));
   if(page.pageType==='direct'){
     if(actual.some(x=>directSet.has(x)))errors.push(`${n.page}: Direct-to-Direct link found`);
     if(actual.filter(x=>organicSet.has(x)).length<4)errors.push(`${n.page}: Direct page needs at least 4 organic links`);
   }else{
     const organicActual=actual.filter(x=>organicSet.has(x));
     if(organicActual.length!==organic.length-1)errors.push(`${n.page}: expected ${organic.length-1} organic links, got ${organicActual.length}`);
     if(actual.some(x=>directSet.has(x)))errors.push(`${n.page}: organic -> Direct actual link forbidden`);
   }
   if(n.actualOutgoing&&JSON.stringify([...n.actualOutgoing].sort())!==JSON.stringify([...actual].sort()))errors.push(`${n.page}: actualOutgoing differs from production HTML`);
 }
}
if(graph.rules?.maxDepthFromHub!==1)errors.push('maxDepthFromHub must be 1');
if(graph.rules?.organicToDirectForbidden!==true)errors.push('organicToDirectForbidden must be true');
const inbound=new Map(organic.map(x=>[x.page,0]));
for(const p of organic)for(const t of actualLinks(p.page))if(inbound.has(t))inbound.set(t,inbound.get(t)+1);
for(const [p,n] of inbound)if(n<organic.length-1)errors.push(`${p}: organic inbound ${n} < ${organic.length-1}`);
failIf(errors,`Dishwasher link graph passed: ${nodes.length} nodes, ${organic.length} organic + ${direct.length} Direct, complete DW7 graph`);
