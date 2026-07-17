#!/usr/bin/env python3
import json, os
from PIL import Image
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
REG=os.path.join(ROOT,'data','refrigeration-image-library.json')
with open(REG,encoding='utf-8') as f: registry=json.load(f)
widths=registry.get('rendering',{}).get('widths',[480,768,1080])
jpeg_quality=registry.get('rendering',{}).get('jpegQuality',86)
webp_quality=registry.get('rendering',{}).get('webpQuality',80)
count=0
for asset in registry.get('assets',[]):
    src=os.path.join(ROOT,asset['source'])
    with Image.open(src) as im:
        if im.mode in ('RGBA','LA'):
            bg=Image.new('RGB',im.size,'white')
            bg.paste(im,mask=im.getchannel('A'))
            im=bg
        else:
            im=im.convert('RGB')
        for width in widths:
            height=round(im.height*width/im.width)
            if height % 2: height += 1
            resized=im.resize((width,height),Image.Resampling.LANCZOS)
            base=os.path.join(ROOT,'assets','images','responsive',f"{asset['base']}-{width}w.jpg")
            os.makedirs(os.path.dirname(base),exist_ok=True)
            resized.save(base,'JPEG',quality=jpeg_quality,optimize=True,progressive=True)
            resized.save(base+'.webp','WEBP',quality=webp_quality,method=4)
            count += 2
print(f"rendered {count} refrigeration image files")
