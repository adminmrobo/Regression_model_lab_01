/* part6.js — 파트 6 실험 (로지스틱 · 소프트맥스 · 포아송 · 분위수 · 여러 층) */
(function(){const {Plot,el,f1,f2,f3,pct}=LAB,R=REG,D=DS;const $=id=>document.getElementById(id);
const P6=D.pass,lin=R.ols1(P6.xtr,P6.ytr),lg=R.logit(P6.xtr.map(v=>[v]),P6.ytr);
const pL=x=>R.sig(lg.b[0]+lg.b[1]*x),pR=x=>lin.b[0]+lin.b[1]*x;
/* 챕터 26 */
(function(){const P=Plot($('p26'),{xr:[0,12],yr:[-0.4,1.4],ticks:1,yticks:0.2,xlab:'공부 시간(시간)',ylab:'합격 확률',aria:'합격 확률'});let mode='lg';
 P.rect('under',0,1,12,1.4,{fill:'rgba(224,83,61,0.07)'});P.rect('under',0,-0.4,12,0,{fill:'rgba(224,83,61,0.07)'});
 function draw(){const x=+$('s26').value;$('v26').textContent=x;P.clear('main');P.clear('over');
  P.line('main',0,0,12,0,{stroke:'#9a97aa','stroke-width':1});P.line('main',0,1,12,1,{stroke:'#9a97aa','stroke-width':1});
  if(mode!=='lin')P.fn('main',pL,{stroke:'#22a45d','stroke-width':3});if(mode!=='lg')P.fn('main',pR,{stroke:'#d98a1c','stroke-width':3,'stroke-dasharray':mode==='both'?'6 4':''});
  P6.xtr.forEach((v,i)=>P.dot('main',v,P6.ytr[i],0,{r:4.5,fill:P6.ytr[i]?'#e0533d':'#3d7bd9'}));
  const a=pL(x),b=pR(x);if(mode!=='lin')P.dot('over',x,a,'star');if(mode!=='lg')P.dot('over',x,b,'star',{fill:'#d98a1c'});
  $('r26').innerHTML=(mode!=='lin'?`로지스틱: z = ${f2(lg.b[0])} + ${f2(lg.b[1])} × ${x} = ${f2(lg.b[0]+lg.b[1]*x)} → <b class="good">${pct(a)}</b><br>`:'')+(mode!=='lg'?`직선: ${f3(lin.b[0])} + ${f3(lin.b[1])} × ${x} = <b class="${b<0||b>1?'badc':''}">${pct(b)}</b>${b<0||b>1?' ← 확률이 될 수 없음':''}<br>`:'')+`<span class="note">빨간 점 = 합격(1), 파란 점 = 불합격(0). 붉은 띠 = 확률이 될 수 없는 곳. 로지스틱 50% 지점 ${f2(-lg.b[0]/lg.b[1])}시간, 승산비 e^${f2(lg.b[1])} ≈ ${f1(Math.exp(lg.b[1]))}배</span>`;}
 const set=(m,id)=>{mode=m;['b26a','b26b','b26c'].forEach(k=>$(k).classList.toggle('on',k===id));draw();};
 $('s26').oninput=draw;$('b26a').onclick=()=>set('lg','b26a');$('b26b').onclick=()=>set('lin','b26b');$('b26c').onclick=()=>set('both','b26c');draw();})();
/* 챕터 27 */
(function(){let tgt=0;const N=['축구부','독서부','음악부'],col=['#22a45d','#3d7bd9','#d9568f'];
 function draw(){const z=['a','b','c'].map(k=>+$('s27'+k).value);['a','b','c'].forEach((k,i)=>$('v27'+k).textContent=f1(z[i]));
  const e=z.map(Math.exp),s=R.sum(e),p=e.map(v=>v/s),am=p.indexOf(Math.max(...p));
  $('r27b').innerHTML=p.map((v,i)=>`<div class="b"><span>${N[i]}${i===tgt?' (정답)':''}</span><div class="t"><span style="left:0;width:${(v*100).toFixed(1)}%;background:${col[i]}"></span></div><span>${f3(v)}</span></div>`).join('');
  $('r27').innerHTML=`e^z = (${e.map(f2).join(', ')}), 합 ${f2(s)}<br>확률의 합 = <b>${f3(R.sum(p))}</b> · 가장 큰 것(argmax) = <b>${N[am]}</b><div class="big">교차 엔트로피 ${f3(-Math.log(p[tgt]))}</div><span class="note">정답 확률이 1에 가까울수록 0, 작을수록 크게 커져요.</span>`;}
 ['a','b','c'].forEach(k=>$('s27'+k).oninput=draw);
 document.querySelectorAll('#ch27-panel [data-t]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ch27-panel [data-t]').forEach(x=>x.classList.toggle('on',x===b));tgt=+b.dataset.t;draw();});
 $('b27').onclick=()=>{['a','b','c'].forEach(k=>{const s=$('s27'+k);s.value=Math.min(5,+s.value+1);});draw();};draw();})();
/* 챕터 28 */
(function(){const Cn=D.count,po=R.poisson(Cn.xtr.map(v=>[v]),Cn.ytr),cl=R.ols1(Cn.xtr,Cn.ytr);let mode='po';
 const fP=x=>Math.exp(po.b[0]+po.b[1]*x),fL=x=>cl.b[0]+cl.b[1]*x;
 const P=Plot($('p28'),{xr:[0,35],yr:[-5,40],ticks:5,yticks:5,xlab:'기온(°C)',ylab:'한 시간 손님 수(명)',aria:'기온과 손님 수'});P.rect('under',0,-5,35,0,{fill:'rgba(224,83,61,0.07)'});
 const Q=Plot($('p28c'),{xr:[-0.5,20.5],yr:[0,0.3],W:360,H:180,ticks:2,yticks:0.1,xlab:'손님 수 k',ylab:'확률',aria:'포아송 분포'});
 const teP=R.rmse(Cn.xte.map(fP),Cn.yte),teL=R.rmse(Cn.xte.map(fL),Cn.yte);
 function draw(){const T=+$('s28').value;$('v28').textContent=T;P.clear('main');P.clear('over');P.line('main',0,0,35,0,{stroke:'#9a97aa','stroke-width':1});
  Cn.xtr.forEach((v,i)=>P.dot('main',v,Cn.ytr[i],0,{r:4}));const f=mode==='po'?fP:fL;P.fn('main',f,{stroke:mode==='po'?'#22a45d':'#d98a1c','stroke-width':3});P.dot('over',T,f(T),'star');
  const lam=fP(T);Q.clear('main');let pk=Math.exp(-lam);for(let k=0;k<=20;k++){if(k>0)pk*=lam/k;Q.rect('main',k-0.38,0,k+0.38,Math.min(0.3,pk),{fill:'#a98be8'});}
  const neg=Cn.xtr.filter(x=>fL(x)<0).length;
  $('r28').innerHTML=mode==='po'?`포아송: λ = e^(${f3(po.b[0])} + ${f3(po.b[1])} × ${T}) = <b>${f2(lam)}명</b><br>기온 1°C마다 × ${f3(Math.exp(po.b[1]))} (약 ${f1((Math.exp(po.b[1])-1)*100)}%)<br>처음 보는 300시간 빗나감 <b>${f2(teP)}명</b> (직선 ${f2(teL)}명)`:`직선: ${f2(cl.b[0])} + ${f3(cl.b[1])} × ${T} = <b class="${fL(T)<0?'badc':''}">${f2(fL(T))}명</b>${fL(T)<0?' ← 손님이 음수!':''}<br>훈련 60시간 중 음수 예측 <b>${neg}시간</b><br>처음 보는 300시간 빗나감 <b>${f2(teL)}명</b> (포아송 ${f2(teP)}명)`;
  $('r28').innerHTML+=`<br><span class="note">아래 막대: 이 기온에서 손님이 k명 올 확률(포아송, 평균 ${f2(lam)}명)</span>`;}
 $('s28').oninput=draw;$('b28a').onclick=()=>{mode='po';$('b28a').classList.add('on');$('b28b').classList.remove('on');draw();};$('b28b').onclick=()=>{mode='lin';$('b28b').classList.add('on');$('b28a').classList.remove('on');draw();};draw();})();
/* 챕터 29 */
(function(){const Dl=D.deliv,o=R.ols1(Dl.x,Dl.y),P=Plot($('p29'),{xr:[0,8.5],yr:[0,65],ticks:1,yticks:10,xlab:'거리(km)',ylab:'걸린 시간(분)',aria:'배달 거리와 시간'});let three=false;const cache={};
 const q=t=>{const k=t.toFixed(2);return cache[k]||(cache[k]=R.quantile(Dl.x.map(v=>[v]),Dl.y,t));};
 function draw(){const t=+$('s29').value;$('v29').textContent=f2(t);P.clear('main');P.clear('over');Dl.x.forEach((v,i)=>P.dot('main',v,Dl.y[i],0,{r:3.8}));
  P.lineEq('main',o.b[1],-1,o.b[0],{stroke:'#9a97aa','stroke-width':2,'stroke-dasharray':'6 4'});
  if(three)[[0.1,'#3d7bd9'],[0.5,'#22a45d'],[0.9,'#e0533d']].forEach(([tt,c])=>{const m=q(tt);P.lineEq('over',m.b[1],-1,m.b[0],{stroke:c,'stroke-width':2.5});P.text('over',8,m.b[0]+m.b[1]*8+1.5,'τ='+tt,{fill:c,'font-weight':700,'font-size':11});});
  const m=q(t);P.lineEq('over',m.b[1],-1,m.b[0],{stroke:'#7b4fd6','stroke-width':3.5});const below=R.mean(Dl.y.map((y,i)=>y<=m.b[0]+m.b[1]*Dl.x[i]+1e-9?1:0));
  $('r29').innerHTML=`τ = ${f2(t)} 선: ŷ = ${f2(m.b[0])} + ${f2(m.b[1])} × 거리<br>선 아래 점의 비율 <b>${pct(below)}</b> (목표 ${pct(t)})<div class="big">5km면 ${f1(m.b[0]+5*m.b[1])}분</div>평균(최소제곱) 선: ${f2(o.b[0])} + ${f2(o.b[1])} × 거리 → 5km ${f1(o.b[0]+5*o.b[1])}분<br>핀볼 손실(평균) ${f3(R.pinball(Dl.y,Dl.x.map(x=>m.b[0]+m.b[1]*x),t))}`;}
 $('s29').oninput=draw;$('b29').onclick=e=>{three=!three;e.target.classList.toggle('on',three);draw();};draw();})();
/* 챕터 30 */
(function(){const S=D.simpson,X=S.x.map(v=>6+2*v),Y=S.y.map(v=>10+2*v),G=S.g,GC=['#3d7bd9','#22a45d','#e0533d'],GN=['쉬운 곡','보통 곡','어려운 곡'];
 const fe=R.ols(X.map((v,i)=>[v,G[i]===1?1:0,G[i]===2?1:0]),Y),sl=fe.b[1],a=[fe.b[0],fe.b[0]+fe.b[2],fe.b[0]+fe.b[3]],abar=R.mean(a),ng=[0,1,2].map(g=>G.filter(v=>v===g).length);
 const A=D.auto,m0=R.ols1(A.x,A.y),m1=R.ols(A.x.slice(1).map((d,i)=>[d,A.y[i]]),A.y.slice(1));
 const dw=r=>{let s=0;for(let i=1;i<r.length;i++)s+=R.sq(r[i]-r[i-1]);return s/R.sum(r.map(R.sq));};let mode='ml';
 function draw(){const host=$('p30');
  if(mode==='ml'){const k=+$('s30').value;$('v30').textContent=k;const P=Plot(host,{xr:[0,22],yr:[0,24],ticks:2,yticks:4,xlab:'일주일 연습 시간(시간)',ylab:'발표회 실수 횟수',aria:'다층 회귀'});
   X.forEach((v,i)=>P.dot('main',v,Y[i],0,{r:3.2,fill:GC[G[i]]}));const sh=a.map((v,g)=>(ng[g]*v+k*abar)/(ng[g]+k));
   [0,1,2].forEach(g=>{const xs=X.filter((_,i)=>G[i]===g),lo=Math.min(...xs),hi=Math.max(...xs);P.line('over',lo,sh[g]+sl*lo,hi,sh[g]+sl*hi,{stroke:GC[g],'stroke-width':3});});
   $('r30').innerHTML=`같은 곡 안의 기울기(모든 무리 공통) <b>${f2(sl)}회/시간</b><br>무리 절편: ${sh.map((v,g)=>`${GN[g]} <b>${f1(v)}</b> (따로 ${f1(a[g])})`).join(' · ')}<br>전체 평균 절편 ${f1(abar)} · 무리마다 학생 ${ng[0]}명<br><span class="note">κ = 0이면 무리마다 따로, κ가 클수록 전체 평균 쪽으로 모여요. 무리 학생 수가 κ보다 훨씬 많으면 거의 안 당겨져요.</span>`;}
  else {const P=Plot(host,{xr:[0,51],yr:[14,30],ticks:10,yticks:2,xlab:'날짜(일)',ylab:'기온(°C)',aria:'날짜별 기온'});A.x.forEach((v,i)=>P.dot('main',v,A.y[i],0,{r:3.5}));
   P.lineEq('under',m0.b[1],-1,m0.b[0],{stroke:'#9a97aa','stroke-width':2,'stroke-dasharray':'6 4'});P.poly('over',A.x.slice(1).map((d,i)=>[d,m1.yhat[i]]),{stroke:'#22a45d','stroke-width':2.5});
   $('r30').innerHTML=`<b>날짜만</b>(회색 점선): R² ${f3(m0.r2)}, 더빈-왓슨 <b class="badc">${f2(dw(m0.res))}</b><br><b>날짜 + 어제 기온</b>(초록): 기온ₜ = ${f2(m1.b[0])} + ${f3(m1.b[1])} × 날짜 + ${f3(m1.b[2])} × 어제 기온<br>R² <b>${f3(m1.r2)}</b>, 더빈-왓슨 <b class="good">${f2(dw(m1.res))}</b><br><span class="note">어제 기온 계수 ${f2(m1.b[2])}: 어제가 1°C 따뜻하면 오늘도 평균 ${f2(m1.b[2])}°C 따뜻함</span>`;}}
 $('s30').oninput=draw;$('b30a').onclick=()=>{mode='ml';$('b30a').classList.add('on');$('b30b').classList.remove('on');$('l30').style.display='';draw();};
 $('b30b').onclick=()=>{mode='ts';$('b30b').classList.add('on');$('b30a').classList.remove('on');$('l30').style.display='none';draw();};draw();})();
/* 결승 */
const brier=(p,y)=>R.mean(p.map((v,i)=>R.sq(v-y[i])));
const prL=P6.xte.map(pL),prR=P6.xte.map(x=>Math.max(0,Math.min(1,pR(x))));
const fly=brier(prL,P6.yte),robo=brier(prR,P6.yte),acc=p=>R.mean(p.map((v,i)=>(v>0.5)===(P6.yte[i]===1)?1:0));
LAB.battle('arena6',{fly,robo,fmt:v=>f3(v)});
const t=$('t6');[['초파리 팀','로지스틱',0,prL,fly],['주판봇 팀','0·1 직선(잘라 내기)',P6.xtr.filter(x=>pR(x)<0||pR(x)>1).length,prR,robo]].forEach(([n,m,o,p,b])=>{const row=t.insertRow();row.innerHTML=`<th>${n}</th><td>${m}</td><td>${o}명 / 40명</td><td>${pct(acc(p))}</td><td>${f3(b)}</td>`;});
const C=Plot($('p6b'),{xr:[0,12],yr:[0,1],W:420,H:220,ticks:2,yticks:0.25,xlab:'공부 시간',ylab:'합격 확률',aria:'결승 두 모델'});
C.fn('main',pL,{stroke:'#22a45d','stroke-width':2.5});C.fn('main',x=>Math.max(0,Math.min(1,pR(x))),{stroke:'#d98a1c','stroke-width':2.5});
window.__P6={fly,robo};
})();
