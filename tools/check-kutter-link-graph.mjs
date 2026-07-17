#!/usr/bin/env node
import fs from 'node:fs';import {load,failIf} from './kutter-fault-lib.mjs';
const graph=load('kutter-link-graph.json'),cluster=load('kutter-cluster-pages.json'),errors=[];
const nodes=new Map((graph.nodes||[]).map(x=>[x.page,x])),clusterMap=new Map((cluster.pages||[]).map(x=>[x.page,x]));
const published=new Set((cluster.pages||[]).filter(x=>x.status==='published').map(x=>x.page));
const indexablePublished=new Set((cluster.pages||[]).filter(x=>x.status==='published'&&x.indexable).map(x=>x.page));
const incoming=new Map(),adj=new Map(),publishedContract=new Set();
for(const p of cluster.pages||[]){const n=nodes.get(p.page);if(!n)errors.push(`${p.page}: missing graph node`);else if(n.status!==p.status)errors.push(`${p.page}: graph status ${n.status} != cluster ${p.status}`)}
for(const e of graph.edges||[]){if(!nodes.has(e.from)||!nodes.has(e.to)){errors.push(`unknown edge ${e.from} -> ${e.to}`);continue}const expected=published.has(e.from)&&published.has(e.to)?'published':'planned';if(e.status!==expected)errors.push(`${e.from} -> ${e.to}: status ${e.status} != ${expected}`);if(e.status==='published'){publishedContract.add(`${e.from}\0${e.to}`);if(!adj.has(e.from))adj.set(e.from,[]);adj.get(e.from).push(e.to);incoming.set(e.to,(incoming.get(e.to)||0)+1)}if(clusterMap.get(e.from)?.indexable&&clusterMap.get(e.to)?.pageType==='direct_landing')errors.push(`indexable -> direct edge ${e.from} -> ${e.to}`)}
const actual=new Set();for(const page of published){const html=fs.readFileSync(page,'utf8');for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+\.html)(?:[?#][^"']*)?["'][^>]*>/gi)){const to=m[1].replace(/^\/+/, '');if(published.has(to)&&to!==page)actual.add(`${page}\0${to}`);if(!fs.existsSync(to))errors.push(`${page}: broken local link ${to}`)}}
for(const key of actual)if(!publishedContract.has(key)){const [a,b]=key.split('\0');errors.push(`actual edge absent from contract ${a} -> ${b}`)}
for(const key of publishedContract)if(!actual.has(key)){const [a,b]=key.split('\0');errors.push(`stale published contract edge ${a} -> ${b}`)}
const q=[[graph.hub,0]],depth=new Map([[graph.hub,0]]);while(q.length){const [p,d]=q.shift();for(const t of adj.get(p)||[])if(!depth.has(t)){depth.set(t,d+1);q.push([t,d+1])}}
const min=graph.quality?.minimumInboundIndexable??3,maxDepth=graph.quality?.maximumDepthFromHub??2;
for(const p of indexablePublished){if(!depth.has(p))errors.push(`${p}: unreachable from hub`);if((depth.get(p)??99)>maxDepth)errors.push(`${p}: depth >${maxDepth}`);if(p!==graph.hub&&(incoming.get(p)||0)<min)errors.push(`${p}: incoming ${incoming.get(p)||0} <${min}`)}
failIf(errors,`Kutter link graph passed: ${nodes.size} nodes, ${published.size} published, ${publishedContract.size} published edges`)
