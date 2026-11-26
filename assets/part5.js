/* part5.js — 파트 5 실험 (나무 · 숲과 부스팅 · KNN·SVR·신경망 · 샤플리 값 · SHAP) */
(function(){const {Plot,el,f1,f2,f3}=LAB,R=REG,D=DS;const $=id=>document.getElementById(id);
const C=D.curve,X=C.xtr.map(v=>[v]),Xt=C.xte.map(v=>[v]);
const base=P=>{C.xte.forEach((v,i)=>P.dot('under',v,C.yte[i],0,{r:2,fill:'#d7d2e8'}));C.xtr.forEach((v,i)=>P.dot('over',v,C.ytr[i],0,{r:3.8}));};
const mk=id=>Plot($(id),{xr:[0,10],yr:[-1,10],ticks:1,yticks:2,xlab:'x',ylab:'y',aria:'곡선 데이터'});
const lin=R.ols(X,C.ytr),linTe=R.rmse(lin.predict(Xt),C.yte);
/* 챕터 21 */
(function(){const P=mk('p21');base(P);
 const describe=(nd,pre,d)=>{if(!nd.l)return `${pre}→ 예측 ${f2(nd.v)}<br>`;if(d>=2)return `${pre}x ≤ ${f2(nd.t)} ? … (더 깊은 질문 생략)<br>`;return `${pre}x ≤ ${f2(nd.t)} 이면<br>`+describe(nd.l,pre+'&nbsp;&nbsp;&nbsp;',d+1)+`${pre}아니면<br>`+describe(nd.r,pre+'&nbsp;&nbsp;&nbsp;',d+1);};
 function draw(){const d=+$('s21').value;$('v21').textContent=d;const t=R.tree(X,C.ytr,d);P.clear('main');P.fn('main',x=>t.f([x]),{stroke:'#d98a1c','stroke-width':2.5},800);
  const te=R.rmse(t.predict(Xt),C.yte),tr=R.rmse(t.predict(X),C.ytr);let leaves=0;(function cnt(n){if(!n.l){leaves++;return;}cnt(n.l);cnt(n.r);})(t.root);
  $('r21').innerHTML=`<div>계단(잎) 수<b>${leaves}</b></div><div>훈련 빗나감<b>${f3(tr)}</b></div><div>처음 보는 200개 빗나감<b>${f3(te)}</b></div><div>참고: 직선<b>${f3(linTe)}</b></div>`;
  $('r21t').innerHTML='<b>나무의 질문(위쪽 두 단계)</b><br>'+describe(t.root,'',0);}
 $('s21').oninput=draw;draw();})();
/* 챕터 22 */
(function(){const P=mk('p22');base(P);const fo=R.forest(X,C.ytr,300,6,7),bo=R.boost(X,C.ytr,300,0.1,2);let mode='rf';
 const ks=[1,2,3,5,8,12,20,30,50,80,120,200,300],cv={rf:ks.map(k=>[k,R.rmse(Xt.map(fo.upto(k)),C.yte)]),gb:ks.map(k=>[k,R.rmse(Xt.map(bo.upto(k)),C.yte)])};
 const Q=Plot($('p22c'),{xr:[0,300],yr:[0.6,1.6],W:360,H:190,ticks:50,yticks:0.2,xlab:'나무 수',ylab:'처음 보는 데이터 빗나감',aria:'나무 수에 따른 빗나감'});
 Q.poly('main',cv.rf,{stroke:'#22a45d'});Q.poly('main',cv.gb,{stroke:'#d98a1c'});Q.text('main',150,1.5,'초록 = 숲 · 주황 = 부스팅',{'font-size':10.5,fill:'#4a475a'});
 function draw(){const k=+$('s22').value;$('v22').textContent=k;const f=mode==='rf'?fo.upto(k):bo.upto(k);P.clear('main');P.fn('main',x=>f([x]),{stroke:mode==='rf'?'#22a45d':'#d98a1c','stroke-width':2.5},600);
  Q.clear('over');Q.line('over',k,0.6,k,1.6,{stroke:'#7b4fd6','stroke-width':1.5});const te=R.rmse(Xt.map(f),C.yte),tr=R.rmse(X.map(f),C.ytr);
  $('r22').innerHTML=`<div>방식<b>${mode==='rf'?'숲(평균)':'부스팅(η = 0.1, 깊이 2)'}</b></div><div>나무 수<b>${k}그루</b></div><div>훈련 빗나감<b>${f3(tr)}</b></div><div>처음 보는 데이터 빗나감<b>${f3(te)}</b></div>`;}
 $('s22').oninput=draw;$('b22a').onclick=()=>{mode='rf';$('b22a').classList.add('on');$('b22b').classList.remove('on');draw();};$('b22b').onclick=()=>{mode='gb';$('b22b').classList.add('on');$('b22a').classList.remove('on');draw();};draw();})();
/* 챕터 23 */
(function(){const P=mk('p23');base(P);let m='knn';const nnCache={};
 const Pf=R.polyX(C.xtr.map(v=>v/5-1),7),sc=R.scaler(Pf),Ps=sc.F(Pf),pf=x=>sc.f(R.polyX([x/5-1],7)[0]);
 const cfg={knn:{lab:'이웃 수 k',min:1,max:40,step:1,val:5},svr:{lab:'관의 반쪽 폭 ε',min:0.1,max:1.5,step:0.1,val:0.5},nn:{lab:'숨은 층 마디 수',min:1,max:12,step:1,val:10}};
 const tbl=$('t23');[['직선 회귀',linTe,'곧은 선'],['나무(깊이 4)',R.rmse(R.tree(X,C.ytr,4).predict(Xt),C.yte),'계단'],['숲(50그루)',R.rmse(R.forest(X,C.ytr,50,6,7).predict(Xt),C.yte),'잔 계단'],['부스팅(100그루)',R.rmse(R.boost(X,C.ytr,100,0.1,2).predict(Xt),C.yte),'잔 계단']].forEach(([a,b,c])=>{const r=tbl.insertRow();r.innerHTML=`<td>${a}</td><td>${f3(b)}</td><td>${c}</td>`;});
 const live=tbl.insertRow();
 function setup(){const c=cfg[m],s=$('s23');s.min=c.min;s.max=c.max;s.step=c.step;s.value=c.val;$('l23').firstChild.textContent=c.lab+' = ';draw();}
 function draw(){const v=+$('s23').value;$('v23').textContent=m==='svr'?f1(v):v;P.clear('main');let f,extra='';
  if(m==='knn'){const k=R.knnReg(X,C.ytr,v);f=x=>k.f([x]);}
  else if(m==='svr'){const t=R.tube(Ps,C.ytr,v,100,2500);f=x=>t.f(pf(x));P.fn('main',x=>f(x)+v,{stroke:'#22a45d','stroke-dasharray':'5 4','stroke-width':1.5},300);P.fn('main',x=>f(x)-v,{stroke:'#22a45d','stroke-dasharray':'5 4','stroke-width':1.5},300);
   const out=C.ytr.filter((y,i)=>Math.abs(y-f(C.xtr[i]))>v).length;extra=`<br>관 밖의 훈련 점: <b>${out}개</b> / 80개 (이 점들만 선을 끌어당김)`;}
  else {const key=v;if(!nnCache[key])nnCache[key]=R.nn(C.xtr,C.ytr,v,1500,3);const n=nnCache[key];f=x=>n.f(x);extra='<br><span class="note">출발점(무작위 씨앗)을 고정해 늘 같은 결과가 나오게 했어요.</span>';}
  P.fn('main',f,{stroke:'#7b4fd6','stroke-width':2.5},500);const te=R.rmse(C.xte.map(f),C.yte);
  const nm={knn:`KNN 회귀 (k = ${v})`,svr:`SVR (ε = ${f1(v)})`,nn:`신경망 (마디 ${v}개)`}[m];
  live.innerHTML=`<td><b>${nm}</b></td><td><b>${f3(te)}</b></td><td>${{knn:'들쭉날쭉',svr:'관 속 곡선',nn:'매끈한 곡선'}[m]}</td>`;
  $('r23').innerHTML=`${nm}<div class="big">처음 보는 데이터 빗나감 ${f3(te)}</div>${extra}`;}
 $('s23').oninput=draw;document.querySelectorAll('#ch23-panel [data-m]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ch23-panel [data-m]').forEach(x=>x.classList.toggle('on',x===b));m=b.dataset.m;setup();});setup();})();
/* 챕터 24 */
(function(){const N=['X1','X2','X3'],orders=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 function draw(){const bon=+$('s24').value;$('v24').textContent=bon;const v={'':0,'0':10,'1':20,'2':30,'01':40,'02':45,'12':50+bon,'012':75+bon};const key=s=>[...s].sort().join('');
  let h='<tr><th>들어오는 순서</th><th>X1이 늘린 몫</th><th>X2가 늘린 몫</th><th>X3가 늘린 몫</th></tr>';const tot=[0,0,0];
  orders.forEach(o=>{const add=[0,0,0];let S=[];o.forEach(i=>{const a=v[key(S)],b=v[key(S.concat([i]))];add[i]=b-a;S=S.concat([i]);});add.forEach((a,i)=>tot[i]+=a);
   h+=`<tr><td>${o.map(i=>N[i]).join(' → ')}</td>${add.map(a=>`<td>${f1(a)}</td>`).join('')}</tr>`;});
  h+=`<tr><th>평균 = 샤플리 값</th>${tot.map(t=>`<th>${f2(t/6)}</th>`).join('')}</tr>`;$('t24').innerHTML=h;
  $('r24').innerHTML=`<div>혼자 번 돈<b>10 · 20 · 30</b></div><div>X2·X3 함께<b>${50+bon}만 원</b></div><div>셋이 함께(전체)<b>${75+bon}만 원</b></div><div>샤플리 값의 합<b>${f1((tot[0]+tot[1]+tot[2])/6)}만 원</b> ✔</div>`;}
 $('s24').oninput=draw;draw();})();
/* 챕터 25 */
const H=D.house,lm=R.ols(H.X,H.y),gb=R.boost(H.X,H.y,100,0.1,2),bg=H.X.filter((_,i)=>i%3===0);
const fl=x=>lm.predict([x])[0],fg=gb.f;
(function(){const NM=['넓이','역까지 거리','지은 지'];
 function water(host,res,title,pred,actual){const P=Plot($(host),{xr:[-0.5,4.5],yr:[2,8],W:380,H:300,ticks:1,yticks:1,xlab:'',ylab:'억 원',aria:title});
  P.clear('grid');const lab=['평균 예측',...NM,'이 집 예측'];let cur=res.base;
  P.rect('main',-0.3,0,0.3,cur,{fill:'#c9c4da'});P.text('over',0,cur+0.15,f2(cur),{'text-anchor':'middle','font-size':10.5});
  res.phi.forEach((p,j)=>{const a=cur,b=cur+p;P.rect('main',j+1-0.3,Math.min(a,b),j+1+0.3,Math.max(a,b),{fill:p>=0?'#7b4fd6':'#e0533d'});P.text('over',j+1,Math.max(a,b)+0.15,(p>=0?'+':'')+f2(p),{'text-anchor':'middle','font-size':10.5,fill:p>=0?'#4a2aa0':'#b4472a'});cur=b;});
  P.rect('main',3.7,0,4.3,pred,{fill:'#22a45d'});P.text('over',4,pred+0.15,f2(pred),{'text-anchor':'middle','font-size':10.5});P.line('over',3.6,actual,4.4,actual,{stroke:'#1f1a2e','stroke-width':2,'stroke-dasharray':'4 2'});
  lab.forEach((l,i)=>{const t=P.add('grid','text',{x:P.sx(i),y:P.H-20,'text-anchor':'middle','font-size':10.5,fill:'#4a475a'});t.textContent=l;});
  const tt=P.add('grid','text',{x:P.W/2,y:14,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#1f1a2e'});tt.textContent=title;
  P.line('grid',-0.5,2,4.5,2,{stroke:'#d9d6e3','stroke-width':1});}
 const imp=H.Xt.slice(0,40).map(x=>R.shap(fg,x,bg).phi.map(Math.abs)),impL=H.Xt.slice(0,40).map(x=>R.shap(fl,x,bg).phi.map(Math.abs));
 const Q=Plot($('p25c'),{xr:[0,2.6],yr:[0,3],W:480,H:170,ticks:0.4,yticks:1,xlab:'평균 |SHAP| (억 원) — 처음 보는 집 40채',ylab:'',aria:'단서별 전체 중요도'});Q.clear('grid');
 NM.forEach((n,j)=>{const a=R.mean(imp.map(r=>r[j])),b=R.mean(impL.map(r=>r[j]));Q.rect('main',0,2.55-j+0.02,b,2.55-j+0.3,{fill:'#9cb7e6'});Q.rect('main',0,2.55-j-0.3,a,2.55-j-0.02,{fill:'#d98a1c'});
  const t=Q.add('over','text',{x:Q.sx(Math.max(a,b))+6,y:Q.sy(2.55-j)+4,'font-size':11,fill:'#1f1a2e'});t.textContent=`${n}  직선 ${f2(b)} · 부스팅 ${f2(a)}`;});
 Q.line('grid',0,0,0,3,{stroke:'#9a97aa'});
 const tb=$('t25');tb.innerHTML='<tr><th>설명 도구</th><th>답하는 질문</th><th>이 데이터에서</th><th>한계</th></tr>'+
  `<tr><td>회귀계수·표준오차·p값</td><td>평균적으로 이 단서가 얼마나, 얼마나 확실하게?</td><td>넓이 +${f3(lm.b[1])}억/평 (p ${lm.p[1]<0.001?'&lt; 0.001':f3(lm.p[1])}), 거리 ${f3(lm.b[2])}억/분, 지은 지 ${f3(lm.b[3])}억/년</td><td>모든 집에 같은 효과. 얽힘·꺾임을 못 봄</td></tr>`+
  `<tr><td>SHAP (샤플리 몫)</td><td>이 한 집의 예측에 단서마다 얼마씩?</td><td>집마다 다름 (위 폭포 그림)</td><td>모델의 설명일 뿐 원인은 아님. 불확실성 없음</td></tr>`+
  `<tr><td>잔차</td><td>모델이 어디서, 얼마나 틀리나?</td><td>직선 평균 빗나감 ${f3(R.rmse(lm.predict(H.Xt),H.yt))}억 · 부스팅 ${f3(R.rmse(gb.predict(H.Xt),H.yt))}억</td><td>왜 틀렸는지는 직접 말하지 않음</td></tr>`;
 function draw(){const k=+$('s25').value;$('v25').textContent=k;const x=H.Xt[k-1],y=H.yt[k-1],sL=R.shap(fl,x,bg),sG=R.shap(fg,x,bg),pL=fl(x),pG=fg(x);
  water('p25a',sL,'직선 회귀의 SHAP',pL,y);water('p25b',sG,'부스팅의 SHAP',pG,y);
  $('r25h').innerHTML=`이 집: 넓이 <b>${f1(x[0])}평</b> · 역까지 <b>${x[1]}분</b> · 지은 지 <b>${x[2]}년</b> · 실제 <b>${f2(y)}억</b> (점선)<br>직선 예측 ${f2(pL)}억 (잔차 ${y-pL>=0?'+':''}${f2(y-pL)}) · 부스팅 예측 ${f2(pG)}억 (잔차 ${y-pG>=0?'+':''}${f2(y-pG)})`;}
 $('s25').oninput=draw;draw();})();
/* 라운드 5 */
const fly=R.rmse(lm.predict(H.Xt),H.yt),robo=R.rmse(gb.predict(H.Xt),H.yt);
LAB.battle('arena5',{fly,robo,fmt:v=>f2(v)+'억'});
const ix=r=>[r[0],r[1],r[2],r[0]*Math.max(0,(15-r[1])/14),Math.max(0,r[2]-12)],li=R.ols(H.X.map(ix),H.y);
const t=$('t5');[['초파리 팀','직선 회귀 (단서 3개)',R.rmse(lm.yhat,H.y),fly],['주판봇 팀','부스팅 (100그루)',R.rmse(gb.predict(H.X),H.y),robo],['참고','직선 회귀 + 얽힘·꺾임 단서 2개',R.rmse(li.yhat,H.y),R.rmse(li.predict(H.Xt.map(ix)),H.yt)]].forEach(([n,m,a,b])=>{const row=t.insertRow();row.innerHTML=`<th>${n}</th><td>${m}</td><td>${f2(a)}억</td><td>${f2(b)}억</td>`;});
window.__P5={fly,robo};
})();
