#!/usr/bin/env python3
"""import_covers.py — 생성 도구에서 받은 표지(cover_*.png)를 페이지용 크기로 바꾼다.
python3 tools/import_covers.py <받은 폴더>  →  assets/img/cover_*.webp(1600×900, 220 KB 이하)·png, og_*.webp, thumb_*.webp"""
import sys,os
from PIL import Image
src=sys.argv[1];out='assets/img'
for k in ['index','part1','part2','part3','part4','part5','part6','practice']:
    im=Image.open(os.path.join(src,f'cover_{k}.png')).convert('RGB').resize((1600,900),Image.LANCZOS)
    q=86
    while True:
        im.save(f'{out}/cover_{k}.webp','WEBP',quality=q,method=6)
        if os.path.getsize(f'{out}/cover_{k}.webp')<=220*1024 or q<=50: break
        q-=4
    im.resize((800,450),Image.LANCZOS).save(f'{out}/cover_{k}.png',optimize=True)
    im.resize((1200,675),Image.LANCZOS).crop((0,22,1200,652)).save(f'{out}/og_{k}.webp','WEBP',quality=80)
    im.crop((0,160,1600,860)).resize((960,420),Image.LANCZOS).save(f'{out}/thumb_{k}.webp','WEBP',quality=80)
    print(k,q,os.path.getsize(f'{out}/cover_{k}.webp')//1024,'KB')
