#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { renderParametricTemplate } from './site-builder-lib.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'..');
const CHECK=process.argv.includes('--check');
const TEMPLATE_REF='src/components/parametric/safe-self-check/default.template.html';
const PROPS_ROOT='src/components/parametric/safe-self-check/props';
const TEMPLATE_PATH=path.join(ROOT,TEMPLATE_REF);
const hash=(s)=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const read=(p)=>fs.readFileSync(path.join(ROOT,p),'utf8');
const write=(p,s)=>{const a=path.join(ROOT,p);fs.mkdirSync(path.dirname(a),{recursive:true});fs.writeFileSync(a,s)};
const writeJson=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');

function extract(html,page){
  const one=(re,label)=>{const m=html.match(re);if(!m)throw new Error(`${page}: ${label} not found`);return m[1]};
  const items=[...html.matchAll(/<li class="rounded-2xl border border-slate-200 bg-white p-5"><span class="text-sm font-extrabold text-brand-orange">(\d+)<\/span><p class="mt-2 leading-relaxed text-slate-700">([\s\S]*?)<\/p><\/li>/g)];
  if(items.length!==3)throw new Error(`${page}: expected 3 self-check items, got ${items.length}`);
  return {
    schemaVersion:1,
    component:'safe-self-check',
    variant:'three-step-external-check',
    page,
    eyebrow:one(/<p class="text-sm font-extrabold uppercase tracking-\[0\.2em\] text-brand-orange">([\s\S]*?)<\/p>/,'eyebrow'),
    title:one(/<h2 class="mt-3 max-w-3xl text-3xl font-display font-extrabold text-brand-blue">([\s\S]*?)<\/h2>/,'title'),
    intro:one(/<p class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">([\s\S]*?)<\/p>/,'intro'),
    items:items.map(m=>({number:m[1],text:m[2]})),
    ctaId:one(/data-cta-id="([^"]+)"/,'ctaId'),
    ctaText:one(/<a class="mt-8 inline-flex rounded-xl bg-brand-blue px-5 py-3 font-extrabold text-white"[^>]*>([\s\S]*?)<\/a>/,'ctaText'),
  };
}
function templateFrom(html,props){
  const pairs=[
    [props.eyebrow,'{{eyebrow}}'],[props.title,'{{title}}'],[props.intro,'{{intro}}'],
    [props.items[0].number,'{{items.0.number}}'],[props.items[0].text,'{{items.0.text}}'],
    [props.items[1].number,'{{items.1.number}}'],[props.items[1].text,'{{items.1.text}}'],
    [props.items[2].number,'{{items.2.number}}'],[props.items[2].text,'{{items.2.text}}'],
    [props.ctaId,'{{ctaId}}'],[props.ctaText,'{{ctaText}}'],
  ].sort((a,b)=>b[0].length-a[0].length);
  let out=html;
  for(const [a,b] of pairs)out=out.split(a).join(b);
  return out;
}

const models=[];
for(const dir of fs.readdirSync(path.join(ROOT,'src/pages'),{withFileTypes:true})){
  if(!dir.isDirectory())continue;
  const rel=`src/pages/${dir.name}/page.json`, abs=path.join(ROOT,rel);
  if(!fs.existsSync(abs))continue;
  const model=JSON.parse(fs.readFileSync(abs,'utf8'));
  models.push({rel,model});
}
let template=fs.existsSync(TEMPLATE_PATH)?fs.readFileSync(TEMPLATE_PATH,'utf8'):null;
let migrated=0,checked=0,errors=[];
for(const {rel,model} of models){
  let changed=false;
  for(const section of model.sections||[]){
    if(section.component!=='safe-self-check')continue;
    checked++;
    if(section.componentMode==='parametric'){
      if(!section.templateRef||!fs.existsSync(path.join(ROOT,section.templateRef)))errors.push(`${model.page}: missing templateRef`);
      if(!section.propsRef||!fs.existsSync(path.join(ROOT,section.propsRef)))errors.push(`${model.page}: missing propsRef`);
      else {
        const props=JSON.parse(read(section.propsRef));
        const rendered=renderParametricTemplate(read(section.templateRef),props);
        if(hash(rendered)!==section.hash)errors.push(`${model.page}: hash mismatch`);
      }
      continue;
    }
    if(CHECK){errors.push(`${model.page}: local safe-self-check remains`);continue;}
    if(!section.file){errors.push(`${model.page}: local safe-self-check missing file`);continue;}
    const sectionPath=path.posix.join(path.posix.dirname(rel),section.file);
    const html=read(sectionPath);
    let props;
    try{props=extract(html,model.page)}catch(e){errors.push(e.message);continue;}
    if(!template)template=templateFrom(html,props);
    const rendered=renderParametricTemplate(template,props);
    if(rendered!==html){errors.push(`${model.page}: template render differs`);continue;}
    const propsRef=`${PROPS_ROOT}/${model.slug}.json`;
    writeJson(propsRef,props);
    section.componentMode='parametric';
    section.componentScope='parametric';
    section.variant='three-step-external-check';
    section.templateRef=TEMPLATE_REF;
    section.propsRef=propsRef;
    section.sourceFile=section.file;
    section.bytes=Buffer.byteLength(rendered,'utf8');
    section.hash=hash(rendered);
    delete section.file; delete section.componentRef;
    fs.rmSync(path.join(ROOT,sectionPath));
    migrated++; changed=true;
  }
  if(changed)writeJson(rel,model);
}
if(!CHECK&&template)write(TEMPLATE_REF,template);
if(errors.length){console.error('❌ safe-self-check parameterization errors');for(const e of errors)console.error('- '+e);process.exit(1)}
console.log(`✅ safe-self-check components: checked=${checked}, migrated=${migrated}, template=${TEMPLATE_REF}`);
