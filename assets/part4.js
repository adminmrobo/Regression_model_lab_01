/* part4.js — 파트 4 실험 (경사 하강 · 학습률 · SGD · 과적합 · 릿지 · 라쏘) */
(function(){const {Plot,el,f1,f2,f3}=LAB,R=REG,D=DS;const $=id=>document.getElementById(id);
const S=D.study,Sxx=82.5,Sxy=416.5,Syy=2114.1,N=10,xm=5.5,ym=71.7;
const L=b=>(Syy-2*b*Sxy+b*b*Sxx)/N, G=b=>(2/N)*(b*Sxx-Sxy);
const ball=(P,b,c,r)=>{const y=Math.min(L(b),P.o.yr[1]);P.add('over','circle',{cx:P.sx(Math.max(P.o.xr[0],Math.min(P.o.xr[1],b))),cy:P.sy(y),r:r||7,fill:c||'#ffd23f',stroke:'#1f1a2e','stroke-width':1.5});};
/* 챕터 15 */
(function(){const P=Plot($('p15'),{xr:[-1,8],yr:[0,260],ticks:1,yticks:50,xlab:'기울기 β₁',ylab:'손실(MSE)',aria:'손실 골짜기'}),Q=Plot($('p15d'),{xr:[0,11],yr:[30,110],ticks:1,yticks:10,xlab:'공부 시간',ylab:'점수',aria:'현재 직선'});
 P.fn('main',L,{stroke:'#7b4fd6'});let path=[0];
 function draw(){const b=path[path.length-1];P.clear('over');for(let i=1;i<path.length;i++)P.line('over',path[i-1],Math.min(L(path[i-1]),260),path[i],Math.min(L(path[i]),260),{stroke:'#d98a1c','stroke-width':1.5,'stroke-dasharray':'3 3'});
  path.forEach((v,i)=>ball(P,v,i===path.length-1?'#e0533d':'#ffd23f',i===path.length-1?8:5));const g=G(b);
  P.line('over',b-1,L(b)-g,b+1,L(b)+g,{stroke:'#22a45d','stroke-width':2});
  Q.clear('main');Q.clear('under');S.x.forEach((v,i)=>Q.dot('main',v,S.y[i],0));Q.lineEq('under',b,-1,ym-b*xm,{stroke:'#7b4fd6','stroke-width':2.5});
  $('r15').innerHTML=`걸음 수 <b>${path.length-1}</b> · 지금 β₁ = <b>${f3(b)}</b><br>손실의 기울기(초록 접선) = 16.5 × ${f3(b)} − 83.3 = <b>${f2(g)}</b> → ${Math.abs(g)<0.05?'<b class="good">거의 0, 바닥이에요!</b>':(g<0?'오른쪽이 내리막':'왼쪽이 내리막')}<div class="big">손실 ${f2(L(b))}</div><span class="note">학습률 η = 0.05 · 공식의 답 β₁ = 5.048, 최소 손실 1.14</span>`;}
 const step=k=>{for(let i=0;i<k;i++){const b=path[path.length-1];path.push(b-0.05*G(b));}draw();};
 $('b15a').onclick=()=>step(1);$('b15b').onclick=()=>step(10);$('b15c').onclick=()=>{path=[0];draw();};draw();})();
/* 챕터 16 */
(function(){const P=Plot($('p16'),{xr:[-1,11],yr:[0,260],ticks:1,yticks:50,xlab:'기울기 β₁',ylab:'손실(MSE)',aria:'학습률에 따른 경로'});P.fn('main',L,{stroke:'#7b4fd6'});
 const C=Plot($('p16c'),{xr:[0,60],yr:[-1,6],W:360,H:190,ticks:10,yticks:1,xlab:'걸음',ylab:'log₁₀ 손실',aria:'걸음마다 손실'});C.line('under',0,Math.log10(1.14),60,Math.log10(1.14),{stroke:'#22a45d','stroke-dasharray':'4 3','stroke-width':1.5});
 function draw(){const eta=+$('s16').value,k=+$('s16b').value;$('v16').textContent=f3(eta);$('v16b').textContent=k;const path=[0];for(let i=0;i<k;i++){const b=path[i];path.push(b-eta*G(b));}
  P.clear('over');for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];if(Math.abs(b)<1e6)P.line('over',Math.max(-1,Math.min(11,a)),Math.min(L(a),260),Math.max(-1,Math.min(11,b)),Math.min(L(b),260),{stroke:'#d98a1c','stroke-width':1.5});}
  path.forEach((v,i)=>ball(P,v,i===path.length-1?'#e0533d':'#ffd23f',i===path.length-1?8:4));
  C.clear('main');C.poly('main',path.map((b,i)=>[i,Math.max(-1,Math.min(6,Math.log10(L(b))))]),{stroke:'#e0533d'});C.clear('over');C.line('over',k,-1,k,6,{stroke:'#9a97aa','stroke-width':1});
  const f=1-16.5*eta,b=path[k],st=Math.abs(f)>1?'<b class="badc">발산 — 걸을수록 멀어져요</b>':f<0?'<b>지그재그로 다가감</b>':Math.abs(b-5.048)<0.01?'<b class="good">바닥 도착</b>':'<b>천천히 미끄러지는 중</b>';
  $('r16').innerHTML=`한 걸음마다 곱해지는 수 1 − 16.5η = <b>${f3(f)}</b><br>${k}걸음 뒤 β₁ = <b>${Math.abs(b)>1e5?b.toExponential(1):f3(b)}</b>, 손실 <b>${L(b)>1e5?L(b).toExponential(1):f2(L(b))}</b><br>${st}`;}
 ['s16','s16b'].forEach(k=>$(k).oninput=draw);draw();})();
/* 챕터 17 */
(function(){const r=R.mulberry32(17),X=[],Y=[];for(let i=0;i<200;i++){const x=R.gauss(r);X.push(x);Y.push(3+2*x+R.gauss(r));}
 const A=X.map(v=>[1,v]),best=R.ols1(X,Y).b,loss=(b0,b1)=>R.mean(X.map((v,i)=>R.sq(Y[i]-b0-b1*v)))/2;
 const P=Plot($('p17'),{xr:[-1,5],yr:[-1,4],ticks:1,yticks:1,xlab:'절편 β₀',ylab:'기울기 β₁',aria:'손실 지도와 발자국'});
 const res=40,dx=6/res,dy=5/res;for(let i=0;i<res;i++)for(let j=0;j<res;j++){const b0=-1+(i+.5)*dx,b1=-1+(j+.5)*dy,l=Math.log(1+loss(b0,b1));P.add('region','rect',{x:P.sx(b0-dx/2),y:P.sy(b1+dy/2),width:P.sx(b0+dx/2)-P.sx(b0-dx/2)+.6,height:P.sy(b1-dy/2)-P.sy(b1+dy/2)+.6,fill:`rgba(123,79,214,${Math.min(0.55,l/5).toFixed(3)})`});}
 P.dot('top',best[0],best[1],'star');
 const Q=Plot($('p17d'),{xr:[-3,3],yr:[-4,10],ticks:1,yticks:2,xlab:'x',ylab:'y',aria:'걸음마다의 직선'});X.forEach((v,i)=>Q.dot('under',v,Y[i],0,{r:2.5,fill:'#9cb7e6'}));
 let bs=10;
 function draw(){const ep=+$('s17').value,lr=+$('s17b').value;$('v17').textContent=ep;$('v17b').textContent=f2(lr);const run=R.sgd(A,Y,lr,ep,bs,5),path=run.path;
  P.clear('main');P.clear('over');P.poly('main',path.map(b=>[Math.max(-1,Math.min(5,b[0])),Math.max(-1,Math.min(4,b[1]))]),{stroke:'#d98a1c','stroke-width':1.5});P.dot('over',run.b[0],run.b[1],0,{fill:'#e0533d',r:6});
  Q.clear('main');const step=Math.max(1,Math.floor(path.length/25));path.forEach((b,i)=>{if(i%step===0||i===path.length-1)Q.lineEq('main',b[1],-1,b[0],{stroke:i===path.length-1?'#e0533d':'#3d7bd9','stroke-width':i===path.length-1?2.5:0.8,'stroke-opacity':i===path.length-1?1:0.45});});
  $('r17').innerHTML=`묶음 ${bs}개 · ${ep}에포크 → <b>${path.length-1}걸음</b><br>마지막 (β₀, β₁) = (${f2(run.b[0])}, ${f2(run.b[1])}) · 정답 (${f2(best[0])}, ${f2(best[1])})<div class="big">손실 ${f3(loss(...run.b))}</div><span class="note">가장 낮은 손실 ${f3(loss(...best))}</span>`;}
 document.querySelectorAll('#ch17-panel [data-b]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ch17-panel [data-b]').forEach(x=>x.classList.toggle('on',x===b));bs=+b.dataset.b;draw();});
 ['s17','s17b'].forEach(k=>$(k).oninput=draw);draw();})();
/* 챕터 18 */
const W=D.wave,tt=v=>2*v-1;
(function(){const ds=[...Array(11).keys()].map(i=>i+1),fits=ds.map(d=>{const m=R.ols(R.polyX(W.xtr.map(tt),d),W.ytr);return {m,tr:R.rmse(m.yhat,W.ytr),te:R.rmse(m.predict(R.polyX(W.xte.map(tt),d)),W.yte)};});
 const P=Plot($('p18'),{xr:[0,1],yr:[-2.2,2.2],ticks:0.2,yticks:0.5,xlab:'한 해 중 시기(0 = 1월, 1 = 12월)',ylab:'판매 지수',aria:'다항 곡선'});
 W.xte.forEach((v,i)=>P.dot('under',v,W.yte[i],0,{r:2.2,fill:'#d7d2e8'}));
 const C=Plot($('p18c'),{xr:[1,11],yr:[-1,5],W:360,H:190,ticks:1,yticks:1,xlab:'다항 차수',ylab:'log₁₀ 빗나감',aria:'차수에 따른 빗나감'});
 C.poly('main',fits.map((f,i)=>[i+1,Math.log10(f.tr)]),{stroke:'#9a97aa','stroke-dasharray':'5 4'});C.poly('main',fits.map((f,i)=>[i+1,Math.min(5,Math.log10(f.te))]),{stroke:'#7b4fd6'});
 function draw(){const d=+$('s18').value;$('v18').textContent=d;const f=fits[d-1];P.clear('main');P.clear('over');P.fn('main',x=>f.m.predict(R.polyX([tt(x)],d))[0],{stroke:'#7b4fd6','stroke-width':2.5},400);W.xtr.forEach((v,i)=>P.dot('over',v,W.ytr[i],0,{r:5.5}));
  C.clear('over');C.line('over',d,-1,d,5,{stroke:'#22a45d','stroke-width':2});const bestD=fits.reduce((a,b,i)=>b.te<fits[a].te?i:a,0)+1;
  $('r18').innerHTML=`<div>훈련 12개 빗나감<b>${f3(f.tr)}</b></div><div>처음 보는 200개 빗나감<b class="${f.te>1?'badc':''}">${f.te>1000?f.te.toExponential(1):f3(f.te)}</b></div><div>계수 개수<b>${d+1}개</b>(데이터 12개)</div><div>판정<b>${d<=2?'과소적합':f.te>1?'과적합':'알맞은 편'}</b></div>`;}
 $('s18').oninput=draw;draw();})();
/* 챕터 19 */
(function(){const X9=R.polyX(W.xtr.map(tt),9),sc=R.scaler(X9),Xs=sc.F(X9),grid=[];for(let g=-8;g<=2.001;g+=0.25)grid.push(g);
 const fit=g=>R.ridge(Xs,W.ytr,Math.pow(10,g)),feat=x=>sc.f(R.polyX([tt(x)],9)[0]),Xt=sc.F(R.polyX(W.xte.map(tt),9));
 const P=Plot($('p19'),{xr:[0,1],yr:[-2.2,2.2],ticks:0.2,yticks:0.5,xlab:'한 해 중 시기',ylab:'판매 지수',aria:'릿지 곡선'});W.xte.forEach((v,i)=>P.dot('under',v,W.yte[i],0,{r:2.2,fill:'#d7d2e8'}));
 const C=Plot($('p19c'),{xr:[-8,2],yr:[-30,30],W:360,H:200,ticks:2,yticks:10,xlab:'log₁₀ λ',ylab:'계수',aria:'λ에 따른 계수'});const paths=grid.map(g=>fit(g).b);
 const pal=['#3d7bd9','#e0533d','#22a45d','#d98a1c','#7b4fd6','#d9568f','#0f9d8a','#77748a','#b4472a'];for(let j=0;j<9;j++)C.poly('main',paths.map((b,i)=>[grid[i],Math.max(-30,Math.min(30,b[j]))]),{stroke:pal[j],'stroke-width':1.6});
 function draw(){const g=+$('s19').value;$('v19').textContent=g;const m=fit(g);P.clear('main');P.clear('over');P.fn('main',x=>m.b0+R.dot(feat(x),m.b),{stroke:'#7b4fd6','stroke-width':2.5},400);W.xtr.forEach((v,i)=>P.dot('over',v,W.ytr[i],0,{r:5.5}));
  C.clear('over');C.line('over',g,-30,g,30,{stroke:'#22a45d','stroke-width':2});const te=R.rmse(m.predict(Xt),W.yte),tr=R.rmse(m.predict(Xs),W.ytr);
  $('r19').innerHTML=`<div>훈련 빗나감<b>${f3(tr)}</b></div><div>처음 보는 데이터 빗나감<b class="${te>1?'badc':'good'}">${f3(te)}</b></div><div>가장 큰 계수 크기<b>${f1(Math.max(...m.b.map(Math.abs)))}</b></div><div>참고: 벌점 없는 9차<b>13.09</b></div>`;}
 $('s19').oninput=draw;draw();})();
/* 챕터 20 */
(function(){const M=D.many,sc=R.scaler(M.X),Xs=sc.F(M.X),Xt=sc.F(M.Xt),o=R.ols(Xs,M.y),ote=R.rmse(o.predict(Xt),M.yt);
 const host=$('p20');
 function draw(){const lam=+$('s20').value,a=+$('s20b').value;$('v20').textContent=f2(lam);$('v20b').textContent=f1(a);const m=lam===0?{b:o.b.slice(1),predict:Z=>o.predict(Z)}:R.enet(Xs,M.y,lam,a,3000);
  const mx=4,rows=M.names.map((n,j)=>{const v=m.b[j],w=Math.min(1,Math.abs(v)/mx)*50,real=[0,3,6].includes(j);
   return `<div class="b"><span style="${real?'font-weight:700':''}">${n}${real?' ★':''}</span><div class="t"><span style="${v>=0?'left:50%':'left:'+(50-w)+'%'};width:${w}%;background:${Math.abs(v)<1e-9?'transparent':v>=0?'#7b4fd6':'#e0533d'}"></span><span style="left:50%;width:1px;background:#9a97aa"></span></div><span>${Math.abs(v)<1e-9?'<b>0</b>':f2(v)}</span></div>`;}).join('');
  host.innerHTML=`<div class="bars" role="img" aria-label="단서 15개의 계수 막대">${rows}</div><p class="note">★ = 이 데이터를 만들 때 실제로 영향을 준 단서. 막대 = 표준화한 계수(가운데 선 기준 오른쪽 +, 왼쪽 −)</p>`;
  const te=R.rmse(m.predict(Xt),M.yt),z=m.b.filter(v=>Math.abs(v)<1e-9).length;
  $('r20').innerHTML=`<div>0이 된 단서<b>${z} / 15개</b></div><div>처음 보는 300명 빗나감<b class="${te<ote-0.01?'good':''}">${f3(te)}</b></div><div>최소제곱(15개 모두)<b>${f3(ote)}</b></div><div>방식<b>${lam===0?'최소제곱':a===1?'라쏘':a===0?'릿지':'엘라스틱넷'}</b></div>`;}
 ['s20','s20b'].forEach(k=>$(k).oninput=draw);draw();})();
/* 라운드 4 */
const T=D.rent,X3=T.X.map(r=>r.slice(0,3)),sc=R.scaler(X3),A=R.addOne(sc.F(X3)),At=R.addOne(sc.F(T.Xt.map(r=>r.slice(0,3))));
const gf=R.gd(A,T.y,0.03,40),gr=R.gd(A,T.y,0.5,40);
const fly=R.rmse(At.map(r=>R.dot(r,gf.b)),T.yt),robo=R.rmse(At.map(r=>R.dot(r,gr.b)),T.yt);
LAB.battle('arena4',{fly,robo,fmt:v=>f1(v)+'만 원'});
const t=$('t4');[['초파리 팀','0.03',gf,fly],['주판봇 팀','0.5',gr,robo]].forEach(([n,l,g,v])=>{const row=t.insertRow();row.innerHTML=`<th>${n}</th><td>${l}</td><td>${f1(g.loss[40])}</td><td>${f1(v)}만 원</td>`;});
const C=Plot($('p4b'),{xr:[0,40],yr:[1,3.5],W:420,H:200,ticks:5,yticks:0.5,xlab:'걸음',ylab:'log₁₀ 손실',aria:'라운드 4 손실 곡선'});
C.poly('main',gf.loss.map((v,i)=>[i,Math.log10(v)]),{stroke:'#22a45d'});C.poly('main',gr.loss.map((v,i)=>[i,Math.log10(v)]),{stroke:'#d98a1c'});
window.__P4={fly,robo};
})();
