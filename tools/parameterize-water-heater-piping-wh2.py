#!/usr/bin/env python3
import json, re, hashlib
from pathlib import Path
root=Path('.')
spec=json.load(open(root/'data/water-heater-piping-page-specs.json'))
pages=spec['pages']
base=root/'src/components/parametric/water-heater-wh2-piping'; base.mkdir(parents=True,exist_ok=True)
placeholder=re.compile(r'\{\{\{?\s*([a-zA-Z0-9_.-]+)\s*\}?\}\}')
def render(tpl,props): return placeholder.sub(lambda m:str(props.get(m.group(1),'')),tpl)
def read_json(p): return json.load(open(p))
def section_content(slug,s):
    if s.get('templateRef'):
        tpl=(root/s['templateRef']).read_text(); props=read_json(root/s['propsRef']) if s.get('propsRef') else s.get('props',{})
        return render(tpl,props)
    if s.get('componentRef'): return (root/s['componentRef']).read_text()
    return (root/'src/pages'/slug/s['file']).read_text()
def sha16(s): return hashlib.sha256(s.encode()).hexdigest()[:16]
def replace_exact(text, value, key):
    if value not in text: raise SystemExit(f'missing value for {key}: {value[:80]}')
    return text.replace(value,'{{'+key+'}}',1)
records=[]
for p in pages:
    page=p['page']; slug=p['slug']; pdir=root/'src/pages'/slug; m=read_json(pdir/'page.json')
    contents=[section_content(slug,s) for s in m['sections']]
    if len(contents)!=11: raise SystemExit(f'{page}: expected 11 sections, got {len(contents)}')
    records.append((p,page,slug,pdir,m,contents))
# Build normalized templates for selected sections.
def normalized_for(p,slug,idx,content,key):
    props={}
    t=content
    if key in ('header','footer'):
        props={'page_slug':slug}; t=t.replace(slug,'{{page_slug}}')
    elif key=='boundary':
        props={'boundary':p['boundary']}; t=replace_exact(t,p['boundary'],'boundary')
    elif key=='symptoms':
        for i,v in enumerate(p['symptoms'],1): props[f'item{i}']=v; t=replace_exact(t,v,f'item{i}')
    elif key=='safe_diag':
        for i,v in enumerate(p['safe'],1): props[f'safe{i}']=v; t=replace_exact(t,v,f'safe{i}')
        for i,v in enumerate(p['checks'],1): props[f'diag{i}']=v; t=replace_exact(t,v,f'diag{i}')
    elif key=='stop':
        props={'stop':p['stop']}; t=replace_exact(t,p['stop'],'stop')
    elif key=='works':
        for i,v in enumerate(p['works'],1): props[f'work{i}']=v; t=replace_exact(t,v,f'work{i}')
    return t,props
keys=[('header',0),('boundary',2),('symptoms',3),('safe_diag',4),('stop',5),('works',6),('footer',10)]
templates={}
for key,idx in keys:
    groups={}
    for p,page,slug,pdir,m,contents in records:
        tpl,props=normalized_for(p,slug,idx,contents[idx],key)
        h=hashlib.sha256(tpl.encode()).hexdigest()[:12]; groups[h]=tpl
    for h,tpl in groups.items():
        name=f'{key}-{h}.template.html'; (base/name).write_text(tpl); templates[(key,h)]=name
    print(key,'variants',len(groups))
for p,page,slug,pdir,m,contents in records:
    props_dir=pdir/'props'; props_dir.mkdir(exist_ok=True)
    for key,idx in keys:
        original=contents[idx]; tpl,props=normalized_for(p,slug,idx,original,key); h=hashlib.sha256(tpl.encode()).hexdigest()[:12]
        if render(tpl,props)!=original: raise SystemExit(f'{page}: mismatch {key}')
        sec=m['sections'][idx]; oldfile=sec.get('file')
        props_rel=f'src/pages/{slug}/props/wh2-piping-{key}.json'; (props_dir/f'wh2-piping-{key}.json').write_text(json.dumps(props,ensure_ascii=False,indent=2)+'\n')
        for field in ['file','componentRef','props','componentScope','componentSignature','sourceFile']: sec.pop(field,None)
        sec['componentMode']='parametric'; sec['templateRef']=f'src/components/parametric/water-heater-wh2-piping/{templates[(key,h)]}'; sec['propsRef']=props_rel; sec['bytes']=len(original.encode()); sec['hash']=sha16(original)
        if oldfile:
            f=pdir/oldfile
            if f.exists(): f.unlink()
    (pdir/'page.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print(f'parameterized WH2-PIPING: {len(pages)*len(keys)} section refs')
