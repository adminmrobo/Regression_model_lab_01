#!/usr/bin/env python3
"""verify_numbers.py — 페이지에 적은 숫자를 statsmodels·scikit-learn으로 따로 계산해 대조한다.
python3 tools/gen.py assets/data.js 를 먼저 돌려 tools/ds.json 을 만든 뒤 실행."""
import json, os, numpy as np, statsmodels.api as sm
from sklearn.linear_model import Lasso, Ridge, LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
D=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'ds.json')))
A=np.array; ok=[0,0]
def chk(name,got,want,tol):
    g=float(got);good=abs(g-want)<=tol;ok[0 if good else 1]+=1
    print(('  OK ' if good else 'FAIL'),f'{name}: {g:.4f} (페이지 {want}, 허용 ±{tol})')
def ols(X,y): return sm.OLS(y,sm.add_constant(X)).fit()
rmse=lambda a,b:np.sqrt(np.mean((np.asarray(a)-np.asarray(b))**2))
# 파트 1
s=D['study'];m=ols(A(s['x']),A(s['y']))
chk('공부 시간 β₀',m.params[0],43.9,0.05);chk('공부 시간 β₁',m.params[1],5.05,0.005);chk('R²',m.rsquared,0.995,0.0006);chk('SSE',m.ssr,11.4,0.05);chk('RMSE',np.sqrt(m.ssr/10),1.07,0.005)
chk('7.5시간 예측',m.params[0]+7.5*m.params[1],81.8,0.05);chk('10시간 잔차',m.resid[9],-2.4,0.05)
m3=ols(A([1,2,3]),A([20,50,50]));chk('손계산 β₁',m3.params[1],15,1e-9);chk('손계산 β₀',m3.params[0],10,1e-9);chk('손계산 SSE',m3.ssr,150,1e-9)
from scipy.stats import spearmanr;chk('스피어만 예제',spearmanr(D['rank']['x'],D['rank']['y'])[0],-1,1e-9)
i=D['ice'];t,y,tt,yt=map(A,(i['xtr'],i['ytr'],i['xte'],i['yte']));m=ols(t,y);lo,hi=t.argmin(),t.argmax();k=(y[hi]-y[lo])/(t[hi]-t[lo]);c=y[lo]-k*t[lo]
chk('라운드1 주판봇(최소제곱)',rmse(m.params[0]+m.params[1]*tt,yt),19,0.1);chk('라운드1 초파리(두 점)',rmse(c+k*tt,yt),27,0.1)
# 파트 2
X=A(D['car']['X']);y=A(D['car']['y']);m=ols(X,y)
chk('연비 β₀',m.params[0],25.57,0.005);chk('무게 β',m.params[1],-5.73,0.005);chk('마력 β',m.params[2],-0.0197,0.00005);chk('무게 SE',m.bse[1],0.98,0.005);chk('무게 t',m.tvalues[1],-5.9,0.06)
chk('무게 CI 아래',m.conf_int()[1][0],-7.74,0.005);chk('무게 CI 위',m.conf_int()[1][1],-3.72,0.005);chk('마력 p',m.pvalues[2],0.015,0.0005);chk('R²',m.rsquared,0.914,0.0005);chk('AIC',m.aic,86.5,0.05)
chk('1.5톤·150마력 예측',m.params@[1,1.5,150],14.0,0.05);chk('무게만 기울기',ols(X[:,0],y).params[1],-7.9,0.05)
J=D['carjunk'];m8=ols(np.c_[X,A(J['J'])],y);chk('엉뚱한 단서 8개 R²',m8.rsquared,0.923,0.0005);chk('수정 R²',m8.rsquared_adj,0.882,0.0005);chk('AIC',m8.aic,99.2,0.05)
chk('처음 보는 200대(0개)',rmse(sm.add_constant(A(J['Xt']))@m.params,J['yt']),1.17,0.005);chk('처음 보는 200대(8개)',rmse(sm.add_constant(np.c_[A(J['Xt']),A(J['Jt'])])@m8.params,J['yt']),1.25,0.005)
R2=D['rent'];X=A(R2['X']);y=A(R2['y']);Xt=A(R2['Xt']);yt=A(R2['yt'])
mall=ols(X,y);m3=ols(X[:,:3],y);chk('라운드2 주판봇(10개)',rmse(sm.add_constant(Xt)@mall.params,yt),9.6,0.05);chk('라운드2 초파리(3개)',rmse(sm.add_constant(Xt[:,:3])@m3.params,yt),5.8,0.05);chk('10개 훈련 R²',mall.rsquared,0.87,0.005)
# 파트 3
a=D['ad'];x=A(a['x']);y=A(a['y']);chk('광고비 직선 R²',ols(x,y).rsquared,0.87,0.005);q=ols(np.c_[x,x**2],y);chk('광고비 이차 R²',q.rsquared,0.98,0.005);chk('꼭대기',-q.params[1]/(2*q.params[2]),51,0.5)
au=D['auto'];r=ols(A(au['x']),A(au['y'])).resid;from statsmodels.stats.stattools import durbin_watson as dw;chk('날짜 기온 DW',dw(r),0.35,0.005)
g=D['grow'];lg=ols(A(g['x']),np.log(A(g['y'])));chk('로그 기울기',lg.params[1],0.35,0.005);chk('×배',np.exp(lg.params[1]),1.42,0.005);chk('로그 R²',lg.rsquared,0.98,0.005)
x=A(D['study']['x']+[5]);y=A(D['study']['y']+[7]);mt=ols(x,y);chk('입력 실수 기울기',mt.params[1],5.39,0.005);chk('입력 실수 R²',mt.rsquared,0.41,0.005)
x=A(D['study']['x']+[20]);y=A(D['study']['y']+[60]);chk('먼 점 기울기',ols(x,y).params[1],0.96,0.005)
S=D['simpson'];x=6+2*A(S['x']);y=10+2*A(S['y']);gg=A(S['g']);chk('심슨 전체 기울기',ols(x,y).params[1],0.50,0.005)
chk('심슨 무리 넣은 기울기',ols(np.c_[x,gg==1,gg==2].astype(float),y).params[1],-0.56,0.005)
j=D['jump'];x,y,xt,yt=map(A,(j['xtr'],j['ytr'],j['xte'],j['yte']));l=ols(x,y);q=ols(np.c_[x,x**2],y)
chk('라운드3 직선 R²',l.rsquared,0.85,0.005);chk('라운드3 주판봇',rmse(l.params[0]+l.params[1]*xt,yt),17.9,0.05);chk('라운드3 초파리',rmse(q.params@np.vstack([np.ones_like(xt),xt,xt**2]),yt),8.2,0.05)
# 파트 4
w=D['wave'];x=2*A(w['xtr'])-1;xt=2*A(w['xte'])-1;P=lambda v,d:np.vstack([v**k for k in range(1,d+1)]).T
for d,want in [(3,0.52),(9,13.1)]:
    m=ols(P(x,d),A(w['ytr']));chk(f'{d}차 처음 보는 데이터',rmse(sm.add_constant(P(xt,d))@m.params,w['yte']),want,0.05)
sc=StandardScaler().fit(P(x,9));rg=Ridge(alpha=1e-3).fit(sc.transform(P(x,9)),w['ytr']);chk('릿지 λ=0.001',rmse(rg.predict(sc.transform(P(xt,9))),w['yte']),0.36,0.005)
M=D['many'];sc=StandardScaler().fit(M['X']);la=Lasso(alpha=0.5).fit(sc.transform(M['X']),M['y'])
chk('라쏘 0이 된 단서',int((la.coef_==0).sum()),10,0);chk('라쏘 처음 보는 데이터',rmse(la.predict(sc.transform(M['Xt'])),M['yt']),2.55,0.005)
mo=ols(sc.transform(M['X']),A(M['y']));chk('최소제곱 처음 보는 데이터',rmse(sm.add_constant(sc.transform(M['Xt']))@mo.params,M['yt']),2.96,0.005)
X3=A(R2['X'])[:,:3];s3=StandardScaler().fit(X3);Z=np.c_[np.ones(20),s3.transform(X3)];Zt=np.c_[np.ones(200),s3.transform(A(R2['Xt'])[:,:3])];y=A(R2['y'])
def gd(lr,k=40):
    b=np.zeros(4)
    for _ in range(k): b=b-lr*Z.T@(Z@b-y)/20
    return b
chk('라운드4 초파리(0.03)',rmse(Zt@gd(0.03),R2['yt']),16.6,0.05);chk('라운드4 주판봇(0.5)',rmse(Zt@gd(0.5),R2['yt']),5.76,0.005)
# 파트 5 (부스팅은 이 페이지의 계산기와 sklearn이 조금 다를 수 있어 넓게 대조)
H=D['house'];m=ols(A(H['X']),A(H['y']));chk('라운드5 초파리(직선)',rmse(sm.add_constant(A(H['Xt']))@m.params,H['yt']),0.65,0.005);chk('집값 넓이 계수',m.params[1],0.109,0.0005)
gb=GradientBoostingRegressor(n_estimators=100,learning_rate=0.1,max_depth=2,min_samples_leaf=3,random_state=0).fit(H['X'],H['y']);chk('라운드5 주판봇(sklearn 부스팅)',rmse(gb.predict(H['Xt']),H['yt']),0.42,0.04)
# 파트 6
p=D['pass'];lgm=sm.Logit(A(p['ytr']),sm.add_constant(A(p['xtr']))).fit(disp=0);chk('로지스틱 β₀',lgm.params[0],-10.46,0.005);chk('로지스틱 β₁',lgm.params[1],1.61,0.005)
pl=lgm.predict(sm.add_constant(A(p['xte'])));lp=ols(A(p['xtr']),A(p['ytr']));pr=np.clip(lp.params[0]+lp.params[1]*A(p['xte']),0,1)
chk('결승 초파리(브라이어)',np.mean((pl-A(p['yte']))**2),0.058,0.0005);chk('결승 주판봇(브라이어)',np.mean((pr-A(p['yte']))**2),0.071,0.0005)
c=D['count'];po=sm.GLM(A(c['ytr']),sm.add_constant(A(c['xtr'])),family=sm.families.Poisson()).fit();chk('포아송 β₁',po.params[1],0.0932,0.00005);chk('20°C 평균 손님',np.exp(po.params@[1,20]),7.2,0.05)
chk('포아송 처음 보는 데이터',rmse(po.predict(sm.add_constant(A(c['xte']))),c['yte']),3.1,0.05)
import statsmodels.formula.api as smf, pandas as pd
dd=pd.DataFrame({'x':D['deliv']['x'],'y':D['deliv']['y']});q9=smf.quantreg('y~x',dd).fit(q=0.9).params;chk('90% 선 5km',q9['Intercept']+5*q9['x'],32.6,0.05)
yy=A(au['y']);ml=ols(np.c_[A(au['x'])[1:],yy[:-1]],yy[1:]);chk('어제 기온 넣은 DW',dw(ml.resid),1.70,0.005);chk('어제 기온 넣은 R²',ml.rsquared,0.83,0.005)
print(f'\n통과 {ok[0]}개, 실패 {ok[1]}개')
