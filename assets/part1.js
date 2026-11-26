/* part1.js — 파트 1 실험 (선 하나 긋기) */
(function(){const {Plot,f1,f2,f3}=LAB,R=REG,D=DS;
const $=id=>document.getElementById(id);
/* 챕터 1: 직선으로 예측, 잔차 */
(function(){const S=D.study,m=R.ols1(S.x,S.y),[b0,b1]=m.b;const P=Plot($('p1'),{xr:[0,12],yr:[30,110],ticks:2,yticks:10,xlab:'공부 시간 x(시간)',ylab:'점수 y',aria:'공부 시간과 점수'});
 let showRes=false,pick=-1;const sl=$('s1');
 function draw(){const x=+sl.value,yh=b0+b1*x;$('v1').textContent=x;P.clear('under');P.clear('main');P.clear('over');
  P.lineEq('under',b1,-1,b0,{stroke:'#7b4fd6','stroke-width':2.5});
  if(showRes)S.x.forEach((v,i)=>P.line('under',v,S.y[i],v,b0+b1*v,{stroke:'#e0533d','stroke-width':2}));
  S.x.forEach((v,i)=>P.dot('main',v,S.y[i],0,{ring:i===pick?'#e0533d':null}));
  P.line('over',x,30,x,yh,{stroke:'#22a45d','stroke-dasharray':'4 3','stroke-width':1.5});P.dot('over',x,yh,'star');
  let h=`<b>예측</b> ŷ = 43.9 + 5.05 × ${x} = <span class="big">${f1(yh)}점</span>`;
  if(x>10)h+=`<br><span class="badc">표의 바깥(10시간 넘음)이에요. 직선을 밖으로 늘인 값이라 믿기 어려워요.</span>`;
  if(pick>=0){const r=S.y[pick]-(b0+b1*S.x[pick]);h+=`<hr style="border:0;border-top:1px solid #ddd"><b>${S.x[pick]}시간 친구</b> 실제 ${S.y[pick]}점 · 예측 ${f1(b0+b1*S.x[pick])}점 → 잔차 <b class="${r>=0?'good':'badc'}">${r>=0?'+':''}${f1(r)}점</b>`;}
  $('r1').innerHTML=h;}
 P.onClick((x,y)=>{let best=1e9,k=-1;S.x.forEach((v,i)=>{const d=Math.hypot(P.sx(v)-P.sx(x),P.sy(S.y[i])-P.sy(y));if(d<best){best=d;k=i;}});pick=best<30?k:-1;draw();},{pick:()=>S.x.map((v,i)=>[v,S.y[i]])});
 sl.oninput=draw;$('b1a').onclick=()=>{showRes=false;$('b1a').classList.add('on');$('b1b').classList.remove('on');draw();};$('b1b').onclick=()=>{showRes=true;$('b1b').classList.add('on');$('b1a').classList.remove('on');draw();};draw();})();
/* 챕터 2: 피어슨 r 대 스피어만 ρ */
(function(){const P=Plot($('p2'),{xr:[0,10],yr:[0,10],ticks:2,yticks:2,xlab:'x',ylab:'y',aria:'상관 비교'});let pts=[],kind='line';
 function make(k){kind=k;const r=R.mulberry32(2026),g=()=>R.gauss(r);pts=[];
  if(k==='rank'){pts=[[1,8],[2,6],[3,4],[4,2]];return;}
  for(let i=0;i<20;i++){const x=0.5+9*i/19;let y;
   if(k==='line')y=1+0.8*x+0.6*g();else if(k==='curve')y=0.5+9*Math.pow(x/10,3)+0.25*g();else if(k==='out')y=2+0.6*x+0.4*g();else if(k==='u')y=1.2+0.32*(x-5)*(x-5)+0.35*g();else y=5+1.8*g();
   pts.push([x,Math.max(0.1,Math.min(9.9,y))]);}
  if(k==='out')pts[18]=[9,0.6];}
 function draw(){P.clear('main');P.clear('under');const x=pts.map(p=>p[0]),y=pts.map(p=>p[1]);const r=R.pearson(x,y),rho=R.spearman(x,y),m=R.ols1(x,y);
  P.lineEq('under',m.b[1],-1,m.b[0],{stroke:'#c9c4da','stroke-width':2,'stroke-dasharray':'6 4'});pts.forEach(p=>P.dot('main',p[0],p[1],0));
  const word=v=>Math.abs(v)>0.9?'아주 강함':Math.abs(v)>0.7?'강함':Math.abs(v)>0.3?'보통':'약함·없음';
  $('r2').innerHTML=`<div>피어슨 r (실제 값)<b>${f3(r)}</b>${word(r)}</div><div>스피어만 ρ (순위)<b>${f3(rho)}</b>${word(rho)}</div><div>점 개수<b>${pts.length}</b></div><div>두 값의 차이<b>${f2(Math.abs(r-rho))}</b></div>`+(kind==='rank'?'<div style="grid-column:1/-1">인포그래픽 예제: 공부 시간 10~40, 점수 80~20을 10으로 나눠 그렸어요. 순위만 보므로 ρ는 그대로 −1입니다.</div>':'');}
 document.querySelectorAll('#ch2-panel [data-k]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ch2-panel [data-k]').forEach(x=>x.classList.toggle('on',x===b));make(b.dataset.k);draw();});
 make('line');P.drag(()=>pts,(k,x,y)=>{pts[k]=[x,y];draw();});draw();})();
/* 챕터 3: 직선 끌기, 잔차 제곱 네모 */
(function(){const S=D.study,m=R.ols1(S.x,S.y),[B0,B1]=m.b;const P=Plot($('p3'),{xr:[0,12],yr:[30,110],ticks:2,yticks:10,xlab:'공부 시간 x(시간)',ylab:'점수 y',aria:'최소제곱 직선 찾기'});
 const XL=0.5,XR=11.5;let H=[[XL,55],[XR,100]],showSum=false;
 const C=Plot($('p3c'),{xr:[3,7],yr:[0,400],W:360,H:190,ticks:1,yticks:100,xlab:'기울기 β₁ (절편은 평균점을 지나게)',ylab:'제곱합',aria:'기울기에 따른 제곱합'});
 const sseAt=s=>{const b0=R.mean(S.y)-s*R.mean(S.x);return R.sum(S.x.map((v,i)=>R.sq(S.y[i]-b0-s*v)));};
 C.fn('main',s=>sseAt(s),{stroke:'#7b4fd6'});
 function draw(){const b1=(H[1][1]-H[0][1])/(XR-XL),b0=H[0][1]-b1*XL;P.clear('under');P.clear('main');P.clear('over');
  const res=S.x.map((v,i)=>S.y[i]-(b0+b1*v)),sse=R.sum(res.map(R.sq));
  S.x.forEach((v,i)=>{const y0=b0+b1*v,px=Math.abs(P.sy(S.y[i])-P.sy(y0));P.add('under','rect',{x:P.sx(v),y:Math.min(P.sy(S.y[i]),P.sy(y0)),width:px,height:px,fill:'rgba(224,83,61,0.16)',stroke:'#e0533d','stroke-width':1});P.line('under',v,S.y[i],v,y0,{stroke:'#e0533d','stroke-width':1.5});});
  P.lineEq('main',b1,-1,b0,{stroke:'#7b4fd6','stroke-width':2.5});S.x.forEach((v,i)=>P.dot('main',v,S.y[i],0));
  H.forEach(h=>P.add('over','circle',{cx:P.sx(h[0]),cy:P.sy(h[1]),r:9,fill:'#fff',stroke:'#7b4fd6','stroke-width':3,'data-drag':1}));
  C.clear('over');if(b1>3&&b1<7)C.dot('over',b1,Math.min(400,sseAt(b1)),0,{fill:'#22a45d',r:6});C.dot('over',B1,sseAt(B1),'star');
  const gap=sse/m.sse;
  $('r3').innerHTML=`지금 직선: ŷ = ${f1(b0)} + ${f2(b1)}x<div class="big">잔차 제곱합 ${f1(sse)}</div>최소제곱 직선의 제곱합은 <b>${f1(m.sse)}</b>${gap<1.02?' → <b class="good">거의 최소예요!</b>':` → 지금은 그 ${f1(gap)}배`}`+(showSum?`<br>잔차의 합: <b>${f2(R.sum(res))}</b> (최소제곱 직선은 늘 0)`:'')+`<br><span class="note">아래 그래프: 기울기에 따른 제곱합. 초록 점 = 지금 직선(평균점을 지나게 했을 때), 별 = 가장 낮은 곳</span>`;}
 P.drag(()=>H,(k,x,y)=>{H[k]=[k?XR:XL,y];draw();});
 $('b3a').onclick=()=>{H=[[XL,B0+B1*XL],[XR,B0+B1*XR]];draw();};
 $('b3b').onclick=()=>{const r=Math.random;H=[[XL,40+30*r()],[XR,75+30*r()]];draw();};
 $('b3c').onclick=e=>{showSum=!showSum;e.target.classList.toggle('on',showSum);draw();};draw();})();
/* 챕터 4: 잡음과 R², RMSE */
(function(){const r=R.mulberry32(44),N=30,X=[],Z=[];for(let i=0;i<N;i++){X.push(Math.round((0.5+r()*10)*10)/10);Z.push(R.gauss(r));}
 const P=Plot($('p4'),{xr:[0,11],yr:[20,120],ticks:1,yticks:20,xlab:'공부 시간 x(시간)',ylab:'점수 y',aria:'잡음과 R²'});let mode=0;const sl=$('s4');
 function draw(){const s=+sl.value;$('v4').textContent=s;const Y=X.map((v,i)=>44+5*v+s*Z[i]),m=R.ols1(X,Y),ym=R.mean(Y);
  P.clear('under');P.clear('main');const b0=mode?ym:m.b[0],b1=mode?0:m.b[1];
  X.forEach((v,i)=>P.line('under',v,Y[i],v,b0+b1*v,{stroke:'#e0533d','stroke-width':1.3}));P.lineEq('main',b1,-1,b0,{stroke:mode?'#d98a1c':'#7b4fd6','stroke-width':2.5});X.forEach((v,i)=>P.dot('main',v,Y[i],0,{r:4.5}));
  const sst=m.sst,sse=m.sse,mx=Math.max(sst,1);
  $('r4b').innerHTML=`<div class="b"><span>평균 찍기 SST</span><div class="t"><span style="left:0;width:100%;background:#f0b46a"></span></div><span>${f1(sst)}</span></div><div class="b"><span>직선 SSE</span><div class="t"><span style="left:0;width:${(100*sse/mx).toFixed(1)}%;background:#a98be8"></span></div><span>${f1(sse)}</span></div>`;
  $('r4').innerHTML=`<div>R² (줄인 비율)<b>${f3(m.r2)}</b></div><div>RMSE (평균 빗나감)<b>${f2(Math.sqrt(sse/N))}점</b></div><div>기울기 β₁<b>${f2(m.b[1])}</b></div><div>평균 찍기의 빗나감<b>${f2(Math.sqrt(sst/N))}점</b></div>`;}
 sl.oninput=draw;$('b4a').onclick=()=>{mode=0;$('b4a').classList.add('on');$('b4b').classList.remove('on');draw();};$('b4b').onclick=()=>{mode=1;$('b4b').classList.add('on');$('b4a').classList.remove('on');draw();};draw();})();
/* 라운드 1 */
const I=D.ice,mo=R.ols1(I.xtr,I.ytr);let lo=0,hi=0;I.xtr.forEach((v,i)=>{if(v<I.xtr[lo])lo=i;if(v>I.xtr[hi])hi=i;});
const m2=(I.ytr[hi]-I.ytr[lo])/(I.xtr[hi]-I.xtr[lo]),c2=I.ytr[lo]-m2*I.xtr[lo];
const pf=x=>c2+m2*x,pr=x=>mo.b[0]+mo.b[1]*x;
const fly=R.rmse(I.xte.map(pf),I.yte),robo=R.rmse(I.xte.map(pr),I.yte);
LAB.battle('arena1',{fly,robo,fmt:v=>f1(v)+'개'});
const t=$('t1');[['초파리 팀 (두 점 잇기)',c2,m2,pf],['주판봇 팀 (최소제곱)',mo.b[0],mo.b[1],pr]].forEach(([n,a,b,f])=>{const row=t.insertRow();row.innerHTML=`<th>${n}</th><td>ŷ = ${f1(a)} + ${f2(b)} × 기온</td><td>${f1(R.rmse(I.xtr.map(f),I.ytr))}개</td><td>${f1(R.rmse(I.xte.map(f),I.yte))}개</td>`;});
window.__P1={fly,robo};
})();
