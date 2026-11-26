#!/usr/bin/env python3
"""gen.py — 회귀 대회 교육용 예시 데이터 만들기. 결과는 assets/data.js (DS 객체)"""
import numpy as np, json, sys, os
OUT=sys.argv[1] if len(sys.argv)>1 else 'data.js'
DS={}
R=lambda s:np.random.default_rng(s)
L=lambda a:[float(v) for v in a]
LL=lambda a:[[float(v) for v in row] for row in a]

# ── 파트 1 ──
DS['study']={'x':list(range(1,11)),'y':[48,54,58,65,70,75,80,85,90,92]}       # 인포그래픽(선형성) 예제 표
DS['rank']={'x':[10,20,30,40],'y':[80,60,40,20]}                              # 스피어만 예제
r=R(0)
def ice(n):
    t=np.round(r.uniform(15,35,n),1);s=np.round(20+6*t+r.normal(0,18,n));return t,s
t,s=ice(12);tt,st=ice(100)
DS['ice']={'xtr':L(t),'ytr':L(s),'xte':L(tt),'yte':L(st)}

# ── 파트 2 ──
r=R(7)
n=30;w=np.round(r.uniform(0.9,2.2,n),2);hp=np.round(np.clip(-20+105*w+r.normal(0,28,n),70,250));mpg=np.round(26-5*w-0.03*hp+r.normal(0,1.2,n),1)
DS['car']={'X':LL(np.c_[w,hp]),'y':L(mpg)}
r=R(37)
junk=np.round(r.normal(0,1,(30,8)),2);junkt=np.round(r.normal(0,1,(200,8)),2)
wt=np.round(r.uniform(0.9,2.2,200),2);hpt=np.round(np.clip(-20+105*wt+r.normal(0,28,200),70,250));mpgt=np.round(26-5*wt-0.03*hpt+r.normal(0,1.2,200),1)
DS['carjunk']={'J':LL(junk),'Jt':LL(junkt),'Xt':LL(np.c_[wt,hpt]),'yt':L(mpgt)}
r=R(42)
def rent(n):
    area=np.round(r.uniform(8,30,n),1);dist=np.round(r.uniform(1,25,n));floor=r.integers(1,16,n).astype(float)
    junk=np.round(r.normal(0,1,(n,7)),2);y=np.round(15+2.2*area-1.1*dist+0.8*floor+r.normal(0,6,n),1)
    return np.c_[area,dist,floor,junk],y
X,y=rent(20);Xt,yt=rent(200)
DS['rent']={'X':LL(X),'y':L(y),'Xt':LL(Xt),'yt':L(yt),
  'names':['넓이(평)','역까지 거리(분)','층','현관 번호 끝자리','집주인 생일 달','창문 색 번호','우편함 번호','관리인 키','전 세입자 이름 길이','엘리베이터 버튼 색']}

# ── 파트 3 ──
r=R(5)
ad=np.round(r.uniform(2,60,40),1);sales=np.round(100*(1-np.exp(-ad/22))+r.normal(0,4,40),1)
DS['ad']={'x':L(ad),'y':L(sales)}
r=R(8)
sz=np.round(r.uniform(1,10,50),1);fun=np.round(5+3*sz+r.normal(0,1,50)*0.45*sz,1)            # 깔때기
DS['funnel']={'x':L(sz),'y':L(fun)}
r=R(9)
xs=np.round(r.uniform(0,10,50),1);sk=np.round(3+2*xs+(r.exponential(3,50)-3),1)                  # 한쪽으로 치우친 오차
DS['skew']={'x':L(xs),'y':L(sk)}
r=R(10)
day=np.arange(1,51);e=np.zeros(50)
for i in range(50):e[i]=(0.85*e[i-1] if i else 0)+r.normal(0,2)
temp=np.round(20+0.1*day+e,1)                                                                    # 이어지는 오차(날짜 순)
DS['auto']={'x':L(day),'y':L(temp)}
r=R(12)
yr=np.round(r.uniform(0,10,30),1);sub=np.round(50*np.exp(0.35*yr)*np.exp(r.normal(0,0.18,30)))   # 구독자(지수 성장)
DS['grow']={'x':L(yr),'y':L(sub)}
# 심슨: 세 반
r=R(3)
G=[];X=[];Y=[]
for g,(cx,cy) in enumerate([(0,0),(2.5,0.8),(5,4.0)]):
    xx=r.normal(cx,1.0,60);yy=cy-0.5*(xx-cx)+r.normal(0,0.8,60)
    G+= [g]*60;X+=list(np.round(xx,2));Y+=list(np.round(yy,2))
DS['simpson']={'x':L(X),'y':L(Y),'g':G}
r=R(168)
def jump(n):
    w=np.round(r.uniform(0,12,n),1);y=np.round(40+22*w-1.2*w**2+r.normal(0,8,n));return w,y
a,b=jump(15);c,d=jump(150)
DS['jump']={'xtr':L(a),'ytr':L(b),'xte':L(c),'yte':L(d)}

# ── 파트 4 ──
r=R(21)
xw=np.round(np.sort(r.uniform(0,1,12)),3);yw=np.round(np.sin(2*np.pi*xw)+r.normal(0,0.25,12),3)
xv=np.round(r.uniform(0,1,200),3);yv=np.round(np.sin(2*np.pi*xv)+r.normal(0,0.25,200),3)
DS['wave']={'xtr':L(xw),'ytr':L(yw),'xte':L(xv),'yte':L(yv)}
r=R(31)
def many(n):
    z=r.normal(0,1,(n,15));z[:,1]=0.9*z[:,0]+0.44*z[:,1];z[:,4]=0.8*z[:,3]+0.6*z[:,4]
    y=3*z[:,0]+2*z[:,3]-1.5*z[:,6]+r.normal(0,2,n);return np.round(z,2),np.round(y,2)
Z,y=many(30);Zt,yt=many(300)
DS['many']={'X':LL(Z),'y':L(y),'Xt':LL(Zt),'yt':L(yt),'names':['공부 시간','숙제 시간','잠','운동','산책','간식','게임','음악','물 마시기','필기 색깔 수','가방 무게','신발 크기','형제 수','이름 글자 수','통학 버스 번호']}

# ── 파트 5 ──
r=R(4)
def curve(n):
    x=np.round(r.uniform(0,10,n),2);y=np.round(2+0.5*x+2*np.sin(1.2*x)+r.normal(0,0.55,n),2);return x,y
a,b=curve(80);c,d=curve(200)
DS['curve']={'xtr':L(a),'ytr':L(b),'xte':L(c),'yte':L(d)}
r=R(55)
def house(n):
    area=np.round(r.uniform(15,45,n),1);dist=np.round(r.uniform(1,25,n));age=np.round(r.uniform(0,30,n))
    near=np.clip((15-dist)/14,0,1)
    p=np.round(1.0+0.09*area+2.2*near*area/30+1.5*near-0.06*np.maximum(age-12,0)+r.normal(0,0.35,n),2)   # 억 원
    return np.c_[area,dist,age],p
X,y=house(150);Xt,yt=house(300)
DS['house']={'X':LL(X),'y':L(y),'Xt':LL(Xt),'yt':L(yt),'names':['넓이(평)','역까지 거리(분)','지은 지(년)']}

# ── 파트 6 ──
r=R(14)
def pf(n):
    h=np.round(r.uniform(0,12,n),1);p=1/(1+np.exp(-(1.6*(h-6))));return h,(r.uniform(0,1,n)<p).astype(int)
a,b=pf(40);c,d=pf(300)
DS['pass']={'xtr':L(a),'ytr':[int(v) for v in b],'xte':L(c),'yte':[int(v) for v in d]}
r=R(16)
tmp=np.round(r.uniform(0,35,60),1);cnt=r.poisson(np.exp(0.2+0.09*tmp));tmpt=np.round(r.uniform(0,35,300),1);cntt=r.poisson(np.exp(0.2+0.09*tmpt))
DS['count']={'xtr':L(tmp),'ytr':[int(v) for v in cnt],'xte':L(tmpt),'yte':[int(v) for v in cntt]}
r=R(18)
km=np.round(r.uniform(0.5,8,120),1);mins=np.round(10+3*km+r.normal(0,1,120)*(1+0.9*km),1)
DS['deliv']={'x':L(km),'y':L(mins)}
open(OUT,'w').write('/* data.js — 교육용 예시 데이터 (gen.py로 만듦, 실제 가게·학생과 무관) */\nwindow.DS='+json.dumps(DS,ensure_ascii=False,separators=(',',':'))+';\n')
json.dump(DS,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'ds.json'),'w'),ensure_ascii=False)
print('ok',OUT)
