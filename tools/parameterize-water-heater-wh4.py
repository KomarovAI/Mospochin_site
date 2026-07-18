#!/usr/bin/env python3
import json, re, hashlib
from pathlib import Path
root=Path('.')
visual=json.load(open(root/'data/water-heater-visual-pages.json'))
visual_pages=set(visual['newServicePages']+visual['casePages']+[visual['photoHub']])
cluster=json.load(open(root/'data/water-heater-cluster-pages.json'))
cluster_pages=[x['page'] for x in cluster['pages']]
tpldir=root/'src/components/parametric/water-heater-wh4'
tpldir.mkdir(parents=True,exist_ok=True)
propsbase=root/'content/components/water-heater-wh4'
propsbase.mkdir(parents=True,exist_ok=True)
ph=re.compile(r'\{\{\{?\s*([\w.-]+)\s*\}?\}\}')
def render(t,p): return ph.sub(lambda m:str(p.get(m.group(1),'')),t)
def readj(p): return json.load(open(p))
def section_content(slug,s):
    if s.get('templateRef'):
        t=(root/s['templateRef']).read_text()
        p=readj(root/s['propsRef']) if s.get('propsRef') else s.get('props',{})
        return render(t,p)
    if s.get('componentRef'): return (root/s['componentRef']).read_text()
    if s.get('file'): return (root/'src/pages'/slug/s['file']).read_text()
    return ''
def h16(v): return hashlib.sha256(v.encode()).hexdigest()[:16]
count=0; pages=0
for page in cluster_pages:
    slug=page[:-5]; modelp=root/'src/pages'/slug/'page.json'
    if not modelp.exists(): continue
    m=readj(modelp); touched=False
    for s in m.get('sections',[]):
        if s.get('templateRef') or s.get('componentRef') or not s.get('file'): continue
        html=section_content(slug,s)
        is_photo=('water-heaters-wh4/' in html or 'data-wh4-photo' in html or 'PHOTO_' in html or 'wh4-photo-feature' in html or 'wh4-visual-gallery' in html or 'wh4-services-index' in html)
        if page not in visual_pages and not is_photo: continue
        component=re.sub(r'[^a-z0-9-]+','-',str(s.get('component') or 'fragment').lower()).strip('-') or 'fragment'
        tplrel=f'src/components/parametric/water-heater-wh4/{component}.template.html'
        tplp=root/tplrel
        if not tplp.exists(): tplp.write_text('{{{html}}}')
        propsrel=f'content/components/water-heater-wh4/{slug}-{s["id"]}.json'
        propsp=root/propsrel
        props={'schemaVersion':1,'component':component,'page':page,'sectionId':s['id'],'html':html}
        propsp.write_text(json.dumps(props,ensure_ascii=False,indent=2)+'\n')
        assert render(tplp.read_text(),props)==html
        old=s.get('file')
        for k in ['file','componentRef','props']: s.pop(k,None)
        s['componentMode']='parametric'; s['templateRef']=tplrel; s['propsRef']=propsrel; s['bytes']=len(html.encode()); s['hash']=h16(html)
        if old:
            oldp=root/'src/pages'/slug/old
            if oldp.exists(): oldp.unlink()
        count+=1; touched=True
    if touched:
        modelp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n'); pages+=1
print(f'parameterized refs={count} pages={pages}')
