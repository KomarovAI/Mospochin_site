#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const readJson=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const writeJson=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
const cluster=readJson('data/refrigeration-cluster-pages.json');
const graph=readJson('data/refrigeration-link-graph.json');
const byPage=new Map(cluster.pages.map((row)=>[row.page,row]));
const known=new Set(byPage.keys());

function actual(page){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  const out=[];
  for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)){
    const value=match[1].split('#')[0].split('?')[0].replace(/^\//,'');
    if(known.has(value)&&value!==page) out.push(value);
  }
  return [...new Set(out)].sort();
}

for(const node of graph.nodes||[]){
  const row=byPage.get(node.page);
  if(!row) throw new Error(`Unknown refrigeration link-graph node: ${node.page}`);
  node.status=row.status;
  node.indexable=row.indexable;
  node.pageType=row.pageType;
  if(row.status==='published'){
    node.actualOutgoing=actual(node.page);
    if(row.pageType==='direct') node.plannedOutgoing=[...node.actualOutgoing];
  }
}
graph.checkedAt=new Date().toISOString().slice(0,10);
writeJson('data/refrigeration-link-graph.json',graph);
console.log(`Refrigeration link graph synchronized: ${(graph.nodes||[]).length} nodes`);
