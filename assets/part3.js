/* part3.js — 파트 3 실험 (잔차 그림 · 가정 점검 · 변환 · 영향점 · 심슨의 역설) */
(function(){const {Plot,el,f1,f2,f3}=LAB,R=REG,D=DS;const $=id=>document.getElementById(id);
const dw=r=>{let a=0;for(let i=1;i<r.length;i++)a+=R.sq(r[i]-r[i-1]);return a/R.sum(r.map(R.sq));};
const skew=r=>{const m=R.mean(r),s=Math.sqrt(R.mean(r.map(v=>R.sq(v-m))));return R.mean(r.map(v=>Math.pow((v-m)/s,3)));};
function resPlot(Q,fit,res,o){o=o||{};Q.clear('main');Q.clear('under');Q.line('under',Q.o.xr[0],0,Q.o.xr[1],0,{stroke:'#9a97aa','stroke-width':1.5,'stroke-dasharray':'5 4'});
  fit.forEach((v,i)=>Q.dot('main',v,res[i],0,{r:4,fill:o.fill||'#e0533d'}));
  if(o.smooth){const idx=fit.map((v,i)=>i).sort((a,b)=>fit[a]-fit[b]);const k=Math.max(3,Math.round(fit.length/6)),pts=[];
   for(let j=0;j<idx.length;j++){const s=idx.slice(Math.max(0,j-k),Math.min(idx.length,j+k+1));pts.push([fit[idx[j]],R.mean(s.map(i=>res[i]))]);}Q.poly('main',pts,{stroke:'#7b4fd6','stroke-width':2.5});}}
/* 챕터 10 */
(function(){const A=D.ad;let deg=1;const P=Plot($('p10'),{xr:[0,62],yr:[0,110],ticks:10,yticks:20,xlab:'광고비(만 원)',ylab:'매출(만 원)',aria:'광고비와 매출'});
 const Q=Plot($('p10r'),{xr:[20,110],yr:[-15,15],ticks:20,yticks:5,xlab:'예측값 ŷ',ylab:'잔차 e',aria:'잔차-예측값 그림'});
 function draw(){const m=R.ols(R.polyX(A.x,deg),A.y);P.clear('main');P.clear('under');A.x.forEach((v,i)=>P.dot('main',v,A.y[i],0,{r:4.5}));
  P.fn('under',x=>m.predict([R.polyX([x],deg)[0]])[0],{stroke:'#7b4fd6','stroke-width':2.5});resPlot(Q,m.yhat,m.res,{smooth:true});
  $('r10').innerHTML=`${deg===1?'직선':'이차 곡선'} · R² <b>${f3(m.r2)}</b> · 평균 빗나감 <b>${f2(Math.sqrt(m.sse/A.x.length))}만 원</b><br><span class="note">보라 선 = 잔차의 이동 평균. 모양 없이 0 근처에 누우면 통과</span><br>${deg===1?'<b class="badc">잔차가 ∩자: 양 끝은 직선이 너무 높게, 가운데는 너무 낮게 맞힘</b>':'<b class="good">잔차의 모양이 거의 사라짐</b>'}`;}
 $('b10a').onclick=()=>{deg=1;$('b10a').classList.add('on');$('b10b').classList.remove('on');draw();};$('b10b').onclick=()=>{deg=2;$('b10b').classList.add('on');$('b10a').classList.remove('on');draw();};draw();})();
/* 챕터 11 */
(function(){const P=$('p11'),Hh=$('p11h');
 const sets={funnel:{d:D.funnel,lab:['가게 크기(평 ÷ 10)','매출']},skew:{d:D.skew,lab:['대기 인원(명)','대기 시간(분)']},auto:{d:D.auto,lab:['날짜(일)','기온(°C)']},good:{d:D.study,lab:['공부 시간','점수']}};
 function draw(k){const s=sets[k],x=s.d.x,y=s.d.y,m=R.ols1(x,y),res=m.res;
  const lo=Math.min(...m.yhat),hi=Math.max(...m.yhat),pad=(hi-lo)*0.08,mx=Math.max(...res.map(Math.abs))*1.15;
  const Q=Plot(P,{xr:[lo-pad,hi+pad],yr:[-mx,mx],ticks:+((hi-lo)/4).toPrecision(1),yticks:+(mx/2).toPrecision(1),xlab:k==='auto'?'예측값 ŷ (날짜 순서와 같음)':'예측값 ŷ',ylab:'잔차 e',aria:'잔차 그림'});resPlot(Q,m.yhat,res);
  if(k==='auto'){const pts=x.map((v,i)=>[m.yhat[i],res[i]]);Q.poly('under',pts,{stroke:'#e0533d','stroke-width':1,'stroke-opacity':0.5});}
  const nb=9,bw=2*mx/nb,cnt=Array(nb).fill(0);res.forEach(v=>cnt[Math.min(nb-1,Math.floor((v+mx)/bw))]++);
  const H=Plot(Hh,{xr:[-mx,mx],yr:[0,Math.max(...cnt)+1],ticks:+(mx/2).toPrecision(1),yticks:Math.max(1,Math.ceil((Math.max(...cnt)+1)/4)),xlab:'잔차 e',ylab:'개수',aria:'잔차 히스토그램'});
  cnt.forEach((c,j)=>H.rect('main',-mx+j*bw+bw*0.08,0,-mx+(j+1)*bw-bw*0.08,c,{fill:'#a98be8'}));
  const sd=Math.sqrt(R.mean(res.map(R.sq))),nor=v=>res.length*bw*Math.exp(-v*v/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI));H.fn('over',nor,{stroke:'#22a45d','stroke-width':2});
  const med=[...m.yhat].sort((a,b)=>a-b)[Math.floor(res.length/2)],L=res.filter((_,i)=>m.yhat[i]<med),Rr=res.filter((_,i)=>m.yhat[i]>=med),ratio=Math.sqrt(R.mean(Rr.map(R.sq)))/Math.sqrt(R.mean(L.map(R.sq)));
  const d=dw(res),sk=skew(res),bad=(c,t)=>c?`<b class="badc">${t}</b>`:`<b class="good">괜찮음</b>`;
  $('r11').innerHTML=`<div>등분산: 오른쪽 ÷ 왼쪽 흩어짐<b>${f2(ratio)}배</b>${bad(ratio>1.6||ratio<0.62,'깔때기')}</div><div>정규성: 치우침(0이 대칭)<b>${f2(sk)}</b>${bad(Math.abs(sk)>0.8,'한쪽 꼬리')}</div><div>독립: 더빈-왓슨(2가 정상)<b>${f2(d)}</b>${bad(d<1.2||d>2.8,'줄줄이 이어짐')}</div><div>R²<b>${f3(m.r2)}</b>(가정과는 따로)</div>`;}
 document.querySelectorAll('#ch11-panel [data-k]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ch11-panel [data-k]').forEach(x=>x.classList.toggle('on',x===b));draw(b.dataset.k);});draw('funnel');})();
/* 챕터 12 */
(function(){let k='g0';
 function draw(){const g=k[0]==='g',d=g?D.grow:D.ad,x=d.x,y=d.y;let fit,res,f,r2,txt;
  if(k==='g0'||k==='a0'){const m=R.ols1(x,y);fit=m.yhat;res=m.res;f=v=>m.b[0]+m.b[1]*v;r2=m.r2;txt=`직선 ŷ = ${f1(m.b[0])} + ${f2(m.b[1])}x`;}
  else if(k==='g1'){const m=R.ols1(x,y.map(Math.log));fit=m.yhat;res=m.res;f=v=>Math.exp(m.b[0]+m.b[1]*v);r2=m.r2;txt=`log ŷ = ${f2(m.b[0])} + ${f3(m.b[1])}x → 해마다 ×${f2(Math.exp(m.b[1]))} (약 ${Math.round((Math.exp(m.b[1])-1)*100)}%)<br><span class="note">R²와 잔차는 로그 단위로 잰 값이에요.</span>`;}
  else {const m=R.ols(R.polyX(x,2),y);fit=m.yhat;res=m.res;f=v=>m.b[0]+m.b[1]*v+m.b[2]*v*v;r2=m.r2;txt=`ŷ = ${f1(m.b[0])} + ${f2(m.b[1])}x − ${f3(-m.b[2])}x² → 꼭대기 x ≈ ${f1(-m.b[1]/(2*m.b[2]))}`;}
  const P=Plot($('p12'),g?{xr:[0,10],yr:[-300,1900],ticks:2,yticks:400,xlab:'운영 연수(년)',ylab:'구독자(명)',aria:'구독자 수'}:{xr:[0,62],yr:[0,110],ticks:10,yticks:20,xlab:'광고비(만 원)',ylab:'매출(만 원)',aria:'광고비와 매출'});
  x.forEach((v,i)=>P.dot('main',v,y[i],0,{r:4.5}));P.fn('under',f,{stroke:'#7b4fd6','stroke-width':2.5});if(g)P.line('under',0,0,10,0,{stroke:'#9a97aa','stroke-dasharray':'4 3'});
  const lo=Math.min(...fit),hi=Math.max(...fit),pad=(hi-lo)*0.08,mx=Math.max(...res.map(Math.abs))*1.15;
  const Q=Plot($('p12r'),{xr:[lo-pad,hi+pad],yr:[-mx,mx],ticks:+((hi-lo)/4).toPrecision(1),yticks:+(mx/2).toPrecision(1),xlab:k==='g1'?'예측값(로그 단위)':'예측값 ŷ',ylab:'잔차 e',aria:'잔차 그림'});resPlot(Q,fit,res,{smooth:true});
  const neg=g&&k==='g0'?x.filter(v=>f(v)<0).length:0;
  $('r12').innerHTML=`${txt}<br>R² <b>${f3(r2)}</b>${neg?` · <b class="badc">구독자를 0명 아래로 예측한 데이터 ${neg}개</b>`:''}`;}
 document.querySelectorAll('#ch12-panel [data-k]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ch12-panel [data-k]').forEach(x=>x.classList.toggle('on',x===b));k=b.dataset.k;draw();});draw();})();
/* 챕터 13 */
(function(){const S=D.study,base=R.ols1(S.x,S.y);let pt=[5,7];const P=Plot($('p13'),{xr:[0,22],yr:[0,110],ticks:2,yticks:10,xlab:'공부 시간 x(시간)',ylab:'점수 y',aria:'영향점 실험'});
 function draw(){const x=S.x.concat([pt[0]]),y=S.y.concat([pt[1]]),m=R.ols1(x,y),n=x.length,xm=R.mean(x),sxx=R.sum(x.map(v=>R.sq(v-xm))),h=1/n+R.sq(pt[0]-xm)/sxx,s2=m.sse/(n-2),Dk=R.sq(m.res[n-1])/(2*s2)*h/R.sq(1-h);
  P.clear('under');P.clear('main');P.clear('over');P.lineEq('under',base.b[1],-1,base.b[0],{stroke:'#9a97aa','stroke-width':2,'stroke-dasharray':'6 4'});P.lineEq('under',m.b[1],-1,m.b[0],{stroke:'#7b4fd6','stroke-width':2.5});
  S.x.forEach((v,i)=>P.dot('main',v,S.y[i],0));P.add('over','circle',{cx:P.sx(pt[0]),cy:P.sy(pt[1]),r:8,fill:'#e0533d',stroke:'#fff','stroke-width':2});
  $('r13').innerHTML=`<div>빨간 점<b>(${f1(pt[0])}시간, ${f1(pt[1])}점)</b></div><div>기울기 (점 없을 때 ${f2(base.b[1])})<b>${f2(m.b[1])}</b></div><div>지렛대 h<b>${f2(h)}</b>${h>2*2/n?' <span class="badc">큼</span>':''}</div><div>쿡의 거리 D<b>${f2(Dk)}</b>${Dk>1?' <span class="badc">영향점</span>':Dk>4/n?' <span class="badc">살펴볼 점</span>':' <span class="good">작음</span>'}</div><div>R² (점 없을 때 ${f3(base.r2)})<b>${f3(m.r2)}</b></div>`;}
 P.drag(()=>[pt],(k,x,y)=>{pt=[x,y];draw();});$('b13a').onclick=()=>{pt=[5,7];draw();};$('b13b').onclick=()=>{pt=[20,60];draw();};$('b13c').onclick=()=>{pt=[5,70];draw();};draw();})();
/* 챕터 14 */
(function(){const S=D.simpson,X=S.x.map(v=>6+2*v),Y=S.y.map(v=>10+2*v),G=S.g;let mode=0,col=false;const GC=['#3d7bd9','#22a45d','#e0533d'],GN=['쉬운 곡','보통 곡','어려운 곡'];
 const P=Plot($('p14'),{xr:[0,22],yr:[0,24],ticks:2,yticks:4,xlab:'일주일 연습 시간(시간)',ylab:'발표회 실수 횟수',aria:'연습 시간과 실수 횟수'});
 const all=R.ols1(X,Y),wit=R.ols(X.map((v,i)=>[v,G[i]===1?1:0,G[i]===2?1:0]),Y);
 function draw(){P.clear('under');P.clear('main');P.clear('over');X.forEach((v,i)=>P.dot('main',v,Y[i],0,{r:3.8,fill:col||mode?GC[G[i]]:'#3d7bd9'}));
  if(mode===0)P.lineEq('over',all.b[1],-1,all.b[0],{stroke:'#7b4fd6','stroke-width':3});
  else [0,1,2].forEach(g=>{const xs=X.filter((_,i)=>G[i]===g),lo=Math.min(...xs),hi=Math.max(...xs),b0=wit.b[0]+(g===1?wit.b[2]:g===2?wit.b[3]:0);P.line('over',lo,b0+wit.b[1]*lo,hi,b0+wit.b[1]*hi,{stroke:GC[g],'stroke-width':3});P.text('over',hi-1,b0+wit.b[1]*hi+1.4,GN[g],{fill:GC[g],'font-weight':700,'font-size':11});});
  const per=[0,1,2].map(g=>R.ols1(X.filter((_,i)=>G[i]===g),Y.filter((_,i)=>G[i]===g)).b[1]);
  $('r14').innerHTML=`<div>한 직선의 기울기<b class="${all.b[1]>0?'badc':''}">${all.b[1]>0?'+':''}${f2(all.b[1])}회</b>연습 1시간마다</div><div>곡 난이도를 넣은 기울기<b class="good">${f2(wit.b[1])}회</b>연습 1시간마다</div><div>전체 상관 r<b>${f2(R.pearson(X,Y))}</b></div><div>무리별 기울기<b>${per.map(f2).join(' · ')}</b></div>`;}
 $('b14a').onclick=()=>{mode=0;$('b14a').classList.add('on');$('b14b').classList.remove('on');draw();};$('b14b').onclick=()=>{mode=1;$('b14b').classList.add('on');$('b14a').classList.remove('on');draw();};
 $('b14c').onclick=e=>{col=!col;e.target.classList.toggle('on',col);draw();};draw();})();
/* 라운드 3 */
const J=D.jump,l=R.ols1(J.xtr,J.ytr),q=R.ols(R.polyX(J.xtr,2),J.ytr);
const robo=R.rmse(l.predict(J.xte.map(v=>[v])),J.yte),fly=R.rmse(q.predict(R.polyX(J.xte,2)),J.yte);
LAB.battle('arena3',{fly,robo,fmt:v=>f1(v)+'회'});
const t=$('t3');[['초파리 팀 (이차 곡선)',`ŷ = ${f1(q.b[0])} + ${f2(q.b[1])}x − ${f2(-q.b[2])}x²`,q.r2,fly],['주판봇 팀 (직선)',`ŷ = ${f1(l.b[0])} + ${f2(l.b[1])}x`,l.r2,robo]].forEach(([n,e,r2,v])=>{const row=t.insertRow();row.innerHTML=`<th>${n}</th><td>${e}</td><td>${f3(r2)}</td><td>${f1(v)}회</td>`;});
window.__P3={fly,robo};
})();
