#!/usr/bin/env python3
"""make_covers.py — 픽셀아트 표지(400×225 격자를 4배 무손실 확대) + 정식 캐릭터 그림 합성.
python3 tools/make_covers.py   →  assets/img/cover_*.webp·png, og_*.webp, thumb_*.webp
생성 도구로 받은 고해상도 표지가 생기면 같은 이름으로 바꿔 넣으면 된다(docs/IMG_PROMPTS.md)."""
from PIL import Image, ImageDraw, ImageFont
import math, random, os
W,H,S=400,225,4
OUT='assets/img'
CH='assets/chars'
SKY=(170,214,255);SKY2=(205,232,255);GRASS=(108,190,92);GRASS2=(94,172,80);DIRT=(196,150,98)
FONT=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',9) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf') else ImageFont.load_default()
INK=(31,26,46);WHITE=(255,255,255);PURPLE=(123,79,214);RED=(224,83,61);BLUE=(61,123,217);GREEN=(34,164,93);AMBER=(217,138,28);PINK=(217,86,143)
def base(kind='field'):
    im=Image.new('RGB',(W,H),SKY);d=ImageDraw.Draw(im);d.fontmode='1'
    for y in range(0,70):
        c=tuple(int(SKY[i]+(SKY2[i]-SKY[i])*y/70) for i in range(3));d.line([(0,y),(W,y)],fill=c)
    if kind=='room':
        d.rectangle([0,0,W,150],fill=(236,232,246));d.rectangle([0,150,W,H],fill=(206,190,166))
        for x in range(0,W,20):d.line([(x,150),(x,H)],fill=(190,172,148))
        return im,d
    # 구름
    r=random.Random(3)
    for _ in range(5):
        cx,cy=r.randint(10,390),r.randint(8,45)
        for dx,dy,rr in [(0,0,8),(9,2,7),(-9,3,6),(4,-4,6)]:d.ellipse([cx+dx-rr,cy+dy-rr//2,cx+dx+rr,cy+dy+rr//2],fill=WHITE)
    d.rectangle([0,70,W,H],fill=GRASS)
    for y in range(72,H,6):
        for x in range((y//6)%2*6,W,12):d.rectangle([x,y,x+5,y+2],fill=GRASS2)
    # 울타리
    for x in range(0,W,10):d.rectangle([x,62,x+3,74],fill=(150,98,56));
    d.rectangle([0,64,W,66],fill=(178,118,66));d.rectangle([0,70,W,72],fill=(178,118,66))
    return im,d
def board(d,x0,y0,x1,y1,title=''):
    d.rectangle([x0-3,y0-3,x1+3,y1+3],fill=(120,84,52));d.rectangle([x0,y0,x1,y1],fill=(250,250,252),outline=INK)
    if title:
        d.text((x0+4,y0+1),title,fill=INK,font=FONT)
def axes(d,x0,y0,x1,y1):
    d.line([(x0,y1),(x1,y1)],fill=INK);d.line([(x0,y0),(x0,y1)],fill=INK)
def dots(d,pts,c=BLUE,r=2):
    for x,y in pts:d.rectangle([x-r,y-r,x+r,y+r],fill=c,outline=INK)
def star(d,x,y,c=GREEN):
    pts=[]
    for i in range(10):
        rr=6 if i%2==0 else 3;a=-math.pi/2+i*math.pi/5;pts.append((x+rr*math.cos(a),y+rr*math.sin(a)))
    d.polygon(pts,fill=c,outline=INK)
def scatter_line(d,x0,y0,x1,y1,seed=1,res=True,curve=None):
    r=random.Random(seed);axes(d,x0+6,y0+12,x1-4,y1-6);pts=[]
    for i in range(14):
        t=i/13;x=x0+12+t*(x1-x0-24);base=(curve(t) if curve else t)
        y=y1-12-base*(y1-y0-30)+r.uniform(-8,8);pts.append((x,y))
    if curve:
        prev=None
        for i in range(41):
            t=i/40;x=x0+12+t*(x1-x0-24);y=y1-12-curve(t)*(y1-y0-30)
            if prev:d.line([prev,(x,y)],fill=PURPLE,width=2)
            prev=(x,y)
    else:d.line([(x0+12,y1-12),(x1-12,y1-12-(y1-y0-30))],fill=PURPLE,width=2)
    if res:
        for x,y in pts:
            t=(x-x0-12)/(x1-x0-24);ly=y1-12-(curve(t) if curve else t)*(y1-y0-30);d.line([(x,y),(x,ly)],fill=RED)
    dots(d,pts)
def char(name,size):
    im=Image.open(f'{CH}/{name}.webp').convert('RGBA');px=im.load();w,h=im.size
    from collections import deque
    bgc=px[0,0][:3]
    seen=set();q=deque([(x,y) for x in range(w) for y in (0,h-1)]+[(x,y) for y in range(h) for x in (0,w-1)])
    while q:
        x,y=q.popleft()
        if (x,y) in seen or not(0<=x<w and 0<=y<h):continue
        seen.add((x,y));r,g,b,a=px[x,y]
        if abs(r-bgc[0])+abs(g-bgc[1])+abs(b-bgc[2])<36 and a>0:
            px[x,y]=(0,0,0,0);q.extend([(x+1,y),(x-1,y),(x,y+1),(x,y-1)])
    return im.resize((size,size),Image.LANCZOS)
def finish(im,name,chars):
    big=im.resize((W*S,H*S),Image.NEAREST).convert('RGBA')
    for nm,x,y,sz in chars:
        c=char(nm,sz);sh=Image.new('RGBA',c.size,(0,0,0,0));big.alpha_composite(c,(x,y))
    big=big.convert('RGB')
    big.save(f'{OUT}/cover_{name}.webp','WEBP',quality=82,method=6)
    big.resize((800,450),Image.LANCZOS).save(f'{OUT}/cover_{name}.png',optimize=True)
    big.resize((1200,675),Image.LANCZOS).crop((0,22,1200,652)).save(f'{OUT}/og_{name}.webp','WEBP',quality=80)
    big.crop((0,180,1600,880)).resize((960,420),Image.LANCZOS).save(f'{OUT}/thumb_{name}.webp','WEBP',quality=80)
    print(name,os.path.getsize(f'{OUT}/cover_{name}.webp')//1024,'KB')
TEAM_L=[('fly_point',40,330,250),('sia_smile',250,400,210),('x1_smile',30,620,190),('x2_smile',210,640,190)]
TEAM_R=[('robo_firm',1310,330,250),('moa_smile',1140,400,210),('haru_smile',1380,620,190),('x3_smile',1200,640,190)]
def cover(name):
    if name=='practice':im,d=base('room')
    else:im,d=base()
    if name=='index':
        board(d,110,10,290,110,'REGRESSION CUP');scatter_line(d,112,20,288,108,seed=5)
        d.rectangle([180,118,220,134],fill=(123,79,214));d.text((193,121),'VS',fill=WHITE,font=FONT)
        chars=TEAM_L+TEAM_R+[('doc_smile',680,560,240)]
    elif name=='part1':
        d.rectangle([300,80,390,140],fill=(255,240,245),outline=INK);d.rectangle([300,72,390,82],fill=PINK);
        for i in range(5):d.rectangle([304+i*18,72,312+i*18,82],fill=WHITE)
        d.ellipse([330,95,350,115],fill=(255,214,120),outline=INK);d.polygon([(332,110),(348,110),(340,132)],fill=(214,160,90),outline=INK)
        board(d,100,12,300,118,'y = b0 + b1 x');scatter_line(d,102,22,298,116,seed=2)
        chars=[('doc_point',700,560,230),('fly_point',60,420,240),('sia_think',260,520,200),('robo_firm',1300,600,240),('moa_happy',1120,620,200)]
    elif name=='part2':
        board(d,90,10,310,120,'y = Xb  (OLS table)')
        # 기울어진 평면 격자
        for i in range(9):
            d.line([(120+i*12,100-i*3),(200+i*12,60-i*3)],fill=(120,180,200))
            d.line([(120+i*10,100-i*5+i*1),(220+i*0,100-i*5)],fill=(200,220,240))
        dots(d,[(140,70),(170,55),(200,80),(230,60),(250,48),(160,92)],BLUE)
        for j,row in enumerate(['coef  se   t   p','b1  -4.7 0.49 ..','b2  -0.03 ....']):d.text((240,72+j*12),row,fill=INK,font=FONT)
        chars=[('doc_think',700,560,230),('x1_happy',80,420,210),('x2_smile',280,520,200),('x3_smile',1180,520,200),('haru_think',1360,420,210)]
    elif name=='part3':
        board(d,100,12,300,118,'residual plot');axes(d,108,24,292,112);d.line([(108,68),(292,68)],fill=(150,150,170))
        r=random.Random(9);pts=[(115+i*12,68-30*math.sin(math.pi*i/14)+15+r.uniform(-5,5)) for i in range(15)];dots(d,pts,RED)
        d.ellipse([300,90,340,130],outline=INK,width=3);d.line([(334,124),(352,142)],fill=(120,84,52),width=4)
        chars=[('fly_point',80,420,250),('sia_think',300,560,200),('doc_think',700,560,230),('robo_shock',1300,560,240),('moa_think',1120,620,200)]
    elif name=='part4':
        for x in range(W):
            y=int(80+60*(1-((x-200)/200)**2));d.line([(x,y),(x,H)],fill=(150,120,90) if (x//6)%2 else (160,130,98))
            d.point((x,y),fill=INK)
        steps=[30,90,140,175,192,198];
        for i,sx in enumerate(steps):
            y=int(80+60*(1-((sx-200)/200)**2));d.ellipse([sx-5,y-12,sx+5,y-2],fill=RED if i==len(steps)-1 else (255,214,120),outline=INK)
        for a,b in zip(steps,steps[1:]):
            ya=int(80+60*(1-((a-200)/200)**2))-14;yb=int(80+60*(1-((b-200)/200)**2))-14;d.line([(a,ya),(b,yb)],fill=PURPLE,width=1)
        board(d,280,10,390,60,'loss');d.line([(286,20),(300,40),(320,50),(384,54)],fill=PURPLE,width=2)
        chars=[('robo_firm',80,420,240),('haru_spark',300,560,200),('doc_smile',1320,280,220),('fly_think',1300,580,230)]
    elif name=='part5':
        r=random.Random(4)
        for tx in [30,60,320,350,380]:
            d.rectangle([tx-2,95,tx+2,125],fill=(120,84,52));d.ellipse([tx-14,70,tx+14,104],fill=(60,150,70),outline=INK)
        board(d,100,10,300,118,'tree / forest / boost');axes(d,108,22,292,112)
        prev=None
        for i in range(60):
            t=i/59;x=110+t*180;y=95-(0.4*t+0.35*math.sin(7*t))*70
            if prev:d.line([prev,(x,y)],fill=PURPLE,width=2)
            prev=(x,y)
        for i in range(6):d.line([(110+i*30,95-(i%3)*15),(140+i*30,95-(i%3)*15)],fill=AMBER,width=2)
        chars=[('robo_happy',1310,520,240),('fly_think',60,520,240),('doc_point',700,600,220)]
    elif name=='part6':
        board(d,90,10,310,118,'logistic / poisson / quantile');axes(d,98,22,302,112)
        prev=None
        for i in range(60):
            t=i/59;x=100+t*200;y=108-80/(1+math.exp(-10*(t-0.5)))
            if prev:d.line([prev,(x,y)],fill=GREEN,width=2)
            prev=(x,y)
        for i in range(8):d.rectangle([110+i*24,108-(i*i)//2,122+i*24,108],fill=(180,200,240),outline=INK)
        chars=TEAM_L[:2]+TEAM_R[:2]+[('doc_happy',700,560,230),('haru_happy',1380,640,180),('x2_happy',220,640,180)]
    elif name=='practice':
        for i,(t,c) in enumerate([('ICE',BLUE),('RENT',GREEN),('GD',PURPLE),('PASS',AMBER)]):
            x0=20+i*95;d.rectangle([x0,20,x0+85,95],fill=(30,30,50),outline=INK);d.rectangle([x0+4,24,x0+81,91],fill=(18,40,60))
            d.text((x0+8,26),t,fill=c,font=FONT)
            for k in range(6):d.point((x0+12+k*11,80-k*8-(k%2)*4),fill=WHITE)
            d.line([(x0+10,82),(x0+76,30)],fill=c)
        d.rectangle([120,120,280,150],fill=(90,90,110),outline=INK)
        for k in range(6):d.ellipse([130+k*24,128,142+k*24,140],fill=[RED,GREEN,BLUE,AMBER,PINK,WHITE][k],outline=INK)
        chars=[('haru_point',700,560,220),('doc_smile',380,600,200),('sia_smile',100,600,190),('moa_smile',1300,600,190),('fly_point',1080,560,210),('robo_firm',140,320,190)]
    finish(im,name,chars)
if __name__=='__main__':
    os.makedirs(OUT,exist_ok=True)
    for n in ['index','part1','part2','part3','part4','part5','part6','practice']:cover(n)
