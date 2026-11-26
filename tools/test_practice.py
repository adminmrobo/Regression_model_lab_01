#!/usr/bin/env python3
"""test_practice.py — 실전 연습장 미션을 정답 조작으로 흉내 내 판정이 바뀌는지 확인한다."""
import os
from playwright.sync_api import sync_playwright
root=os.path.abspath('.')
def setv(pg,id,v): pg.evaluate(f"(()=>{{const s=document.getElementById('{id}');s.value={v};s.dispatchEvent(new Event('input'));}})()")
def done(pg,key): return pg.evaluate(f"window.__PR['{key}'].ms.map(m=>!!m.done)")
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome');pg=b.new_page(viewport={'width':1280,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+root+'/practice/index.html#ice');pg.wait_for_timeout(1000)
    print('ice start',done(pg,'ice'))
    # 미션1·3: 낮은 잡음에서 최소제곱 근처로
    for nz in (8,38):
        setv(pg,'ice-s1',nz)
        m=pg.evaluate("(()=>{const st=window.__PR.ice.st;return st;})()")
        best=None
        for b1 in [x/10 for x in range(40,81)]:
            setv(pg,'ice-s2',b1)
            for b0 in range(-20,61,2):
                pass
        # 직접 최소제곱 값으로 맞추기: 가장 가까운 손잡이 값 탐색
        res=pg.evaluate("""(()=>{const T=window.__PR.ice;let bb=null;for(let b1=4;b1<=8.001;b1+=0.1){for(let b0=-40;b0<=80;b0++){T.st.b1=+b1.toFixed(1);T.st.b0=b0;T.st.touched=true;T.draw();const g=T.st.mine/T.st.best;if(!bb||g<bb[0])bb=[g,T.st.b1,b0];}}T.st.b1=bb[1];T.st.b0=bb[2];T.draw();return bb;})()""")
        print('ice noise',nz,'best knob',res,'r2',pg.evaluate("window.__PR.ice.st.r2"),'slope',pg.evaluate("window.__PR.ice.st.olsb1"))
    print('ice done',done(pg,'ice'))
    pg.goto('file://'+root+'/practice/index.html#rent');pg.wait_for_timeout(1000)
    pg.evaluate("(()=>{const s=document.getElementById('rent-s1');s.value=20;s.dispatchEvent(new Event('input'));})()")
    print('rent n20 all',pg.evaluate("JSON.stringify(window.__PR.rent.st)"))
    pg.evaluate("(()=>{document.querySelectorAll('#rent-chk input').forEach((c,i)=>{c.checked=i<3;});document.querySelector('#rent-chk input').dispatchEvent(new Event('change'));})()")
    print('rent n20 three',pg.evaluate("JSON.stringify([window.__PR.rent.st.aic,window.__PR.rent.st.bestAic])"),pg.evaluate("document.getElementById('rent-talk').innerText.split('\\n')[1]"))
    setv(pg,'rent-s1',75);setv(pg,'rent-s1',80)
    print('rent st',pg.evaluate("JSON.stringify(window.__PR.rent.st)"))
    print('rent done',done(pg,'rent'))
    pg.goto('file://'+root+'/practice/index.html#gd');pg.wait_for_timeout(1000)
    setv(pg,'gd-s2',30);setv(pg,'gd-s1',-0.3)
    print('gd st',pg.evaluate("JSON.stringify({ev:window.__PR.gd.st.ev,div:window.__PR.gd.st.div})"))
    setv(pg,'gd-s1',0.3);print('gd big',pg.evaluate("window.__PR.gd.st.div"))
    pg.click('#gd-b');setv(pg,'gd-s1',-1.5);print('gd nostd',pg.evaluate("window.__PR.gd.st.div"))
    print('gd done',done(pg,'gd'))
    pg.goto('file://'+root+'/practice/index.html#pass');pg.wait_for_timeout(1000)
    setv(pg,'pass-s2',0.5)
    r=pg.evaluate("""(()=>{const T=window.__PR.pass;let bb=null;for(let t=0.1;t<=0.901;t+=0.05){T.st.th=+t.toFixed(2);T.draw();if(!bb||T.st.acc>bb[0])bb=[T.st.acc,T.st.th];}T.st.th=bb[1];T.draw();return bb;})()""")
    pg.click('#pass-b2');setv(pg,'pass-s1',2.4);pg.click('#pass-b1');setv(pg,'pass-s1',2.5)
    print('pass st',pg.evaluate("JSON.stringify(window.__PR.pass.st)"),r)
    print('pass done',done(pg,'pass'))
    print('errors',errs)
    b.close()
