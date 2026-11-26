#!/usr/bin/env python3
"""check.py — 페이지를 브라우저로 열어 콘솔 오류·가로 넘침·빈 그림을 점검한다.  python3 tools/check.py [파일...]"""
import sys,os,glob
from playwright.sync_api import sync_playwright
files=sys.argv[1:] or sorted(glob.glob('*.html'))+['practice/index.html']
root=os.path.abspath('.')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for f in files:
        if not os.path.exists(f): continue
        for w in (1280,390):
            pg=b.new_page(viewport={'width':w,'height':900});errs=[]
            pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None);pg.on('pageerror',lambda e: errs.append(str(e)))
            pg.goto('file://'+root+'/'+f);pg.wait_for_timeout(1500)
            ov=pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
            wide=pg.evaluate("""[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>window.innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.tbl,.topnav,.eqn,details.code,svg,.olst')}).slice(0,5).map(e=>e.tagName+'.'+e.className+':'+Math.round(e.getBoundingClientRect().right))""")
            broken=pg.evaluate("[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')||i.dataset.spr).slice(0,5)")
            print(f,w,'overflow',ov,'errs',errs[:5],'wide',wide,'broken',broken)
            if w==1280 and '--shot' in os.environ.get('CHK',''): pg.screenshot(path=f'/tmp/shot_{os.path.basename(f)}.png',full_page=True)
            pg.close()
    b.close()
