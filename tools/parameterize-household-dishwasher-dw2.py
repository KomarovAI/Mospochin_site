#!/usr/bin/env python3
import json,re,hashlib
from pathlib import Path
root=Path('.')
spec=json.load(open(root/'data/household-dishwasher-dw2-page-specs.json'))
pages=[x['page'] for x in spec['pages']]
base=root/'src/components/parametric/household-dishwasher-dw2'; base.mkdir(parents=True,exist_ok=True)
ph=re.compile(r'\{\{\{?\s*([\w.-]+)\s*\}?\}\}')
def render(t,p): return ph.sub(lambda m:str(p.get(m.group(1),'')),t)
def readj(p): return json.load(open(p))
def content(slug,s):
    if s.get('templateRef'):
        tpl=(root/s['templateRef']).read_text(); props=readj(root/s['propsRef']) if s.get('propsRef') else s.get('props',{})
        return render(tpl,props)
    if s.get('componentRef'): return (root/s['componentRef']).read_text()
    return (root/'src/pages'/slug/s['file']).read_text()
def h16(s): return hashlib.sha256(s.encode()).hexdigest()[:16]
obs='''<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Как проявляется проблема</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item1}}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item2}}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item3}}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">{{item4}}</p></div></div></div></section>'''
safe='''<section class="bg-white py-16"><div class="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2"><div class="rounded-3xl border bg-slate-50 p-7"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Что проверить безопасно</h2><ul class="mt-6 space-y-3 text-slate-600"><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe1}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe2}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe3}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{safe4}}</span></li></ul></div><div class="rounded-3xl bg-brand-blue p-7 text-white"><h2 class="text-3xl font-display font-extrabold">Что проверяет мастер</h2><ul class="mt-6 space-y-3 text-white/80"><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag1}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag2}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag3}}</span></li><li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>{{diag4}}</span></li></ul></div></div></section>'''
(base/'observations.template.html').write_text(obs); (base/'safe-diagnostics.template.html').write_text(safe)
records=[]
for page in pages:
    slug=page[:-5]; pdir=root/'src/pages'/slug; m=readj(pdir/'page.json'); cs=[content(slug,s) for s in m['sections']]; records.append((page,slug,pdir,m,cs))
shell={}
for key,idx in [('header',0),('footer',9)]:
    groups={}
    for page,slug,pdir,m,cs in records:
        n=cs[idx].replace(slug,'{{page_slug}}'); hh=hashlib.sha256(n.encode()).hexdigest()[:12]; groups[hh]=n
    for hh,t in groups.items(): (base/f'{key}-{hh}.template.html').write_text(t); shell[(key,hh)]=f'{key}-{hh}.template.html'
for page,slug,pdir,m,cs in records:
    propsdir=pdir/'props'; propsdir.mkdir(exist_ok=True); changes=[]
    for key,idx in [('header',0),('footer',9)]:
        orig=cs[idx]; n=orig.replace(slug,'{{page_slug}}'); hh=hashlib.sha256(n.encode()).hexdigest()[:12]; props={'page_slug':slug}; assert render((base/shell[(key,hh)]).read_text(),props)==orig; changes.append((key,idx,props,orig,shell[(key,hh)]))
    orig=cs[2]; items=re.findall(r'<p class="font-bold text-brand-blue">(.*?)</p>',orig,re.S); assert len(items)==4,(page,len(items)); props={f'item{i+1}':v for i,v in enumerate(items)}; assert render(obs,props)==orig; changes.append(('observations',2,props,orig,'observations.template.html'))
    orig=cs[3]; items=re.findall(r'<li class="flex gap-3"><i class="ri-checkbox-circle-line mt-1 text-brand-orange"></i><span>(.*?)</span></li>',orig,re.S); assert len(items)==8,(page,len(items)); props={**{f'safe{i+1}':v for i,v in enumerate(items[:4])},**{f'diag{i+1}':v for i,v in enumerate(items[4:])}}; assert render(safe,props)==orig; changes.append(('safe',3,props,orig,'safe-diagnostics.template.html'))
    for key,idx,props,orig,tname in changes:
        sec=m['sections'][idx]; old=sec.get('file'); rel=f'src/pages/{slug}/props/dw2-{key}.json'; (propsdir/f'dw2-{key}.json').write_text(json.dumps(props,ensure_ascii=False,indent=2)+'\n')
        for fld in ['file','componentRef','props']: sec.pop(fld,None)
        sec['componentMode']='parametric'; sec['templateRef']=f'src/components/parametric/household-dishwasher-dw2/{tname}'; sec['propsRef']=rel; sec['bytes']=len(orig.encode()); sec['hash']=h16(orig)
        if old and (pdir/old).exists(): (pdir/old).unlink()
    (pdir/'page.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print('parameterized',len(pages)*4,'DW2 section refs')
