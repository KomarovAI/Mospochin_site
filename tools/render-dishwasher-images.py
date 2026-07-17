#!/usr/bin/env python3
import json, os, sys
from PIL import Image
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
REG=os.path.join(ROOT,'data','dishwasher-image-library.json')
with open(REG,encoding='utf-8') as f: r=json.load(f)
widths=r.get('rendering',{}).get('widths',[480,768,1080])
for a in r.get('assets',[]):
    src=os.path.join(ROOT,a['source'])
    with Image.open(src) as im:
        im=im.convert('RGB')
        for w in widths:
            h=round(im.height*w/im.width)
            # Preserve even dimensions to match browser/media tooling expectations.
            if h % 2: h += 1
            resized=im.resize((w,h),Image.Resampling.LANCZOS)
            base=os.path.join(ROOT,'assets','images','responsive',f"{a['base']}-{w}w.jpg")
            os.makedirs(os.path.dirname(base),exist_ok=True)
            resized.save(base,'JPEG',quality=86,optimize=True,progressive=True)
            resized.save(base+'.webp','WEBP',quality=80,method=4)
print(f"rendered {len(r.get('assets',[]))*len(widths)*2} files")
