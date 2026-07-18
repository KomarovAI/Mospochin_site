#!/usr/bin/env python3
import json,re,hashlib
from pathlib import Path
root=Path('.')
cluster=json.load(open(root/'data/wine-cabinet-cluster-pages.json'))['pages']
pages=[(x.get('page') or x.get('url') or x.get('filename')) for x in cluster]
base=root/'src/components/parametric/wine-rf1'
base.mkdir(parents=True,exist_ok=True)
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

obs_tpl='''\n<section class="bg-slate-50 py-16 lg:py-20"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><span class="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">Как проявляется проблема</span><h2 class="mt-5 text-3xl font-display font-extrabold text-brand-blue">Что важно сообщить мастеру</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item1}}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item2}}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item3}}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item4}}</p></div></div></div></section>'''
safe_tpl='''\n<section class="bg-white py-16 lg:py-20"><div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><div class="rounded-3xl border border-slate-200 bg-slate-50 p-7"><span class="text-sm font-bold text-green-700">Без разборки</span><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Что проверить безопасно</h2><ul class="mt-6 space-y-3 text-slate-600"><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe1}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe2}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe3}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe4}}</span></li></ul></div><div class="rounded-3xl bg-brand-blue p-7 text-white"><span class="text-sm font-bold text-brand-orange">Диагностика</span><h2 class="mt-3 text-3xl font-display font-extrabold">Что проверяет мастер</h2><ul class="mt-6 space-y-3 text-white/80"><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag1}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag2}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag3}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag4}}</span></li></ul></div></div></section>'''
(base/'symptom-observations.template.html').write_text(obs_tpl)
(base/'safe-diagnostics.template.html').write_text(safe_tpl)

# Load all source content first.
records=[]
for page in pages:
    slug=page[:-5]; pdir=root/'src/pages'/slug; m=read_json(pdir/'page.json')
    contents=[section_content(slug,s) for s in m['sections']]
    records.append((page,slug,pdir,m,contents))

# Create shell template variants after normalizing page-specific slug.
shell_defs={}
for key,idx in [('header',0),('footer',9),('mobile_cta',10)]:
    groups={}
    for page,slug,pdir,m,contents in records:
        normalized=contents[idx].replace(slug,'{{page_slug}}')
        h=hashlib.sha256(normalized.encode()).hexdigest()[:12]
        groups[h]=normalized
    for h,tpl in groups.items():
        name=f'{key}-{h}.template.html'; (base/name).write_text(tpl); shell_defs[(key,h)]=name
    print(key,'variants',len(groups))

for page,slug,pdir,m,contents in records:
    props_dir=pdir/'props'; props_dir.mkdir(exist_ok=True)
    changes=[]
    # shell sections
    for key,idx in [('header',0),('footer',9),('mobile_cta',10)]:
        original=contents[idx]; normalized=original.replace(slug,'{{page_slug}}'); h=hashlib.sha256(normalized.encode()).hexdigest()[:12]
        props={'page_slug':slug}; tpl=(base/shell_defs[(key,h)]).read_text()
        assert render(tpl,props)==original,(page,key)
        changes.append((key,idx,props,original,shell_defs[(key,h)]))
    # observations
    original=contents[2]
    items=re.findall(r'<p class="font-bold text-brand-blue">(.*?)</p>',original,flags=re.S)
    if len(items)!=4: raise SystemExit(f'{page}: observation items {len(items)}')
    props={f'item{i+1}':v for i,v in enumerate(items)}
    if render(obs_tpl,props)!=original: raise SystemExit(f'{page}: observation mismatch')
    changes.append(('observations',2,props,original,'symptom-observations.template.html'))
    # safe diagnostics
    original=contents[3]
    items=re.findall(r'<li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>(.*?)</span></li>',original,flags=re.S)
    if len(items)!=8: raise SystemExit(f'{page}: safe items {len(items)}')
    props={**{f'safe{i+1}':v for i,v in enumerate(items[:4])},**{f'diag{i+1}':v for i,v in enumerate(items[4:])}}
    if render(safe_tpl,props)!=original: raise SystemExit(f'{page}: safe mismatch')
    changes.append(('safe',3,props,original,'safe-diagnostics.template.html'))
    for key,idx,props,original,tname in changes:
        sec=m['sections'][idx]
        oldfile=sec.get('file')
        props_rel=f'src/pages/{slug}/props/wine-rf1-{key}.json'
        (props_dir/f'wine-rf1-{key}.json').write_text(json.dumps(props,ensure_ascii=False,indent=2)+'\n')
        for field in ['file','componentRef','props']:
            sec.pop(field,None)
        sec['componentMode']='parametric'; sec['templateRef']=f'src/components/parametric/wine-rf1/{tname}'; sec['propsRef']=props_rel
        sec['bytes']=len(original.encode()); sec['hash']=sha16(original)
        if oldfile:
            f=pdir/oldfile
            if f.exists(): f.unlink()
    (pdir/'page.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print(f'parameterized wine cabinet RF-WINE1 {len(pages)*5} section refs')
