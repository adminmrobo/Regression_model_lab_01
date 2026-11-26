/* part2.js — 파트 2 실험 (다중회귀 · 그림자 · 결과표 · 단서 고르기 · 겹치는 단서) */
(function(){const {Plot,el,f1,f2,f3}=LAB,R=REG,D=DS;const $=id=>document.getElementById(id);
/* 3차원 비스듬히 보기 도우미: 가로 a·b, 높이 c */
function Iso(host,o){o=Object.assign({W:380,H:400,ar:[0,1],br:[0,1],cr:[0,1],yaw:30,pitch:34,lab:['a','b','c']},o);host.innerHTML='';
  const svg=el('svg',{viewBox:`0 0 ${o.W} ${o.H}`,role:'img','aria-label':o.aria||'3차원 그림'},host);const g=el('g',{},svg);
  const nrm=(v,r)=>2*(v-r[0])/(r[1]-r[0])-1;
  function pr(a,b,c){const x=nrm(a,o.ar),y=nrm(b,o.br),z=nrm(c,o.cr),A=o.yaw*Math.PI/180,P=o.pitch*Math.PI/180;
    const u=x*Math.cos(A)-y*Math.sin(A),v=x*Math.sin(A)+y*Math.cos(A),k=o.W*0.25;return [o.W/2+k*u,o.H*0.5-k*(z*Math.cos(P)+v*Math.sin(P))];}
  const I={svg,o,pr,clear(){g.innerHTML='';},
    line(p,q,a){const A=pr(...p),B=pr(...q);return el('line',Object.assign({x1:A[0],y1:A[1],x2:B[0],y2:B[1],stroke:'#333','stroke-width':1.5},a||{}),g);},
    dot(p,a){a=a||{};const A=pr(...p);return el('circle',{cx:A[0],cy:A[1],r:a.r||4.5,fill:a.fill||'#3d7bd9',stroke:'#fff','stroke-width':1.2},g);},
    text(p,s,a){const A=pr(...p);const t=el('text',Object.assign({x:A[0],y:A[1],'font-size':11,fill:'#4a475a','text-anchor':'middle'},a||{}),g);t.textContent=s;return t;},
    poly(pts,a){return el('polygon',Object.assign({points:pts.map(p=>pr(...p).map(v=>v.toFixed(1)).join(',')).join(' '),fill:'rgba(123,79,214,0.10)',stroke:'none'},a||{}),g);},
    box(){const [a0,a1]=o.ar,[b0,b1]=o.br,[c0,c1]=o.cr,E='#d9d6e3';
      [[a0,b0],[a1,b0],[a0,b1],[a1,b1]].forEach(([a,b])=>I.line([a,b,c0],[a,b,c1],{stroke:E,'stroke-width':1}));
      [c0,c1].forEach(c=>{I.line([a0,b0,c],[a1,b0,c],{stroke:E,'stroke-width':1});I.line([a0,b1,c],[a1,b1,c],{stroke:E,'stroke-width':1});I.line([a0,b0,c],[a0,b1,c],{stroke:E,'stroke-width':1});I.line([a1,b0,c],[a1,b1,c],{stroke:E,'stroke-width':1});});
      I.text([(a0+a1)/2,b0-(b1-b0)*0.12,c0],o.lab[0],{'font-weight':700});I.text([a0-(a1-a0)*0.14,(b0+b1)/2,c0],o.lab[1],{'font-weight':700});I.text([a0,b0,c1+(c1-c0)*0.08],o.lab[2],{'font-weight':700});}};
  return I;}
/* 챕터 5: 평면 */
(function(){const C=D.car,m=R.ols(C.X,C.y),w1=R.ols1(C.X.map(r=>r[0]),C.y);let cmp=false;
 const I=Iso($('p5'),{ar:[0.8,2.3],br:[60,260],cr:[4,22],lab:['무게(톤)','마력','연비'],aria:'무게·마력·연비 3차원 그림'});
 function draw(){I.o.yaw=+$('s5r').value;$('v5r').textContent=I.o.yaw;const a=+$('s5a').value,b=+$('s5b').value;$('v5a').textContent=a;$('v5b').textContent=b;
  I.clear();I.box();const f=(x,y)=>m.b[0]+m.b[1]*x+m.b[2]*y;
  I.poly([[0.8,60,f(0.8,60)],[2.3,60,f(2.3,60)],[2.3,260,f(2.3,260)],[0.8,260,f(0.8,260)]]);
  for(let i=0;i<=6;i++){const x=0.8+1.5*i/6,y=60+200*i/6;I.line([x,60,f(x,60)],[x,260,f(x,260)],{stroke:'#b9a6ee','stroke-width':1});I.line([0.8,y,f(0.8,y)],[2.3,y,f(2.3,y)],{stroke:'#b9a6ee','stroke-width':1});}
  C.X.forEach((p,i)=>{I.line([p[0],p[1],C.y[i]],[p[0],p[1],f(p[0],p[1])],{stroke:'#e0533d','stroke-width':1});I.dot([p[0],p[1],C.y[i]],{r:4});});
  if(cmp){const g=x=>w1.b[0]+w1.b[1]*x;I.line([0.8,60,g(0.8)],[2.3,60,g(2.3)],{stroke:'#d98a1c','stroke-width':3,'stroke-dasharray':'6 4'});}
  const yh=f(a,b);I.line([a,b,4],[a,b,yh],{stroke:'#22a45d','stroke-dasharray':'4 3'});const S=I.pr(a,b,yh);el('polygon',{points:[0,1,2,3,4,5,6,7,8,9].map(k=>{const rr=k%2?3.5:8,an=-Math.PI/2+k*Math.PI/5;return (S[0]+rr*Math.cos(an)).toFixed(1)+','+(S[1]+rr*Math.sin(an)).toFixed(1);}).join(' '),fill:'#22a45d',stroke:'#fff'},I.svg.firstChild);
  $('r5').innerHTML=`ŷ = ${f2(m.b[0])} − ${f2(-m.b[1])} × 무게 − ${(-m.b[2]).toFixed(4)} × 마력<div class="big">예측 연비 ${yh.toFixed(1)} km/L</div>R² = ${f3(m.r2)}`+(cmp?`<br><span style="color:#b4600c">주황 점선 = 무게만 쓴 직선: ŷ = ${f2(w1.b[0])} − ${f2(-w1.b[1])} × 무게 (R² ${f3(w1.r2)})<br>무게 기울기 −${f2(-w1.b[1])} 대 평면의 −${f2(-m.b[1])}</span>`:'');}
 ['s5r','s5a','s5b'].forEach(k=>$(k).oninput=draw);$('b5a').onclick=e=>{cmp=!cmp;e.target.classList.toggle('on',cmp);draw();};draw();})();
/* 챕터 6: 그림자(직교 사영) */
(function(){const y=[2,3,4];const I=Iso($('p6'),{ar:[0,5],br:[0,5],cr:[0,5],lab:['1번째 값','2번째 값','3번째 값'],aria:'데이터 세 개를 3차원 점 하나로 본 그림'});
 function draw(){const c=+$('s6').value;I.o.yaw=+$('s6r').value;$('v6').textContent=f1(c);$('v6r').textContent=I.o.yaw;I.clear();I.box();
  I.line([0,0,0],[5,5,5],{stroke:'#9a97aa','stroke-width':2,'stroke-dasharray':'5 4'});I.text([5,5,5.25],'(c, c, c)의 길');
  I.line([0,0,0],y,{stroke:'#7b4fd6','stroke-width':3});I.dot(y,{fill:'#7b4fd6',r:5.5});I.text([2,3,4.35],'y = (2, 3, 4)',{fill:'#7b4fd6','font-weight':700});
  I.line([c,c,c],y,{stroke:'#e0533d','stroke-width':2.5});I.dot([c,c,c],{fill:'#22a45d',r:5.5});
  const r=y.map(v=>v-c),len=Math.sqrt(R.sum(r.map(R.sq))),dt=R.sum(r);
  $('r6').innerHTML=`예측 ŷ = (${f1(c)}, ${f1(c)}, ${f1(c)})<br>잔차 r = (${r.map(f1).join(', ')})<div class="big">잔차 길이 ${f3(len)}</div>수직 확인 r·(1, 1, 1) = <b class="${Math.abs(dt)<0.05?'good':''}">${f2(dt)}</b>${Math.abs(dt)<0.05?' → 수직! 가장 짧은 자리':''}<br><span class="note">가장 짧은 길이는 √2 ≈ 1.414 (c = 3)</span>`;}
 ['s6','s6r'].forEach(k=>$(k).oninput=draw);$('b6a').onclick=()=>{$('s6').value=3;draw();};draw();})();
/* 챕터 7: 결과표 */
(function(){let seed=0;
 function make(n,s,sd){const r=R.mulberry32(1000+sd),X=[],y=[];for(let i=0;i<n;i++){const w=0.9+1.3*r(),hp=Math.max(70,Math.min(250,-20+105*w+28*R.gauss(r)));X.push([w,hp]);y.push(26-5*w-0.03*hp+s*R.gauss(r));}return {X,y};}
 function draw(){const n=+$('s7a').value,s=+$('s7b').value;$('v7a').textContent=n;$('v7b').textContent=f1(s);
  const d=(seed===0&&n===30&&Math.abs(s-1.2)<1e-9)?{X:D.car.X,y:D.car.y}:make(n,s,seed);const m=R.ols(d.X,d.y);
  const nm=['const (절편)','무게','마력'],fp=p=>p<0.001?'0.000':f3(p);
  $('t7').innerHTML='<tr><th></th><th>coef</th><th>std err</th><th>t</th><th>P&gt;|t|</th><th>[0.025</th><th>0.975]</th></tr>'+m.b.map((b,i)=>`<tr><td>${nm[i]}</td><td>${f3(b)}</td><td>${f3(m.se[i])}</td><td>${f2(m.t[i])}</td><td class="${m.p[i]<0.05?'good':'badc'}">${fp(m.p[i])}</td><td>${f3(m.ci[i][0])}</td><td>${f3(m.ci[i][1])}</td></tr>`).join('')+`<tr><td colspan="7" style="text-align:left">R² ${f3(m.r2)} · 수정 R² ${f3(m.adj)} · AIC ${f1(m.aic)} · 데이터 ${n}대 · 자유도 ${m.df}</td></tr>`;
  const hp=m.p[2]<0.05;$('r7').innerHTML=`마력 계수: ${hp?'<b class="good">0과 구별됨</b>':'<b class="badc">이 데이터로는 0과 구별하기 어려움</b>'} (t = ${f2(m.t[2])}, 신뢰구간 ${m.ci[2][0]<0&&m.ci[2][1]>0?'0을 품음':'0을 품지 않음'})<br>무게 계수의 흔들림(std err): ${f3(m.se[1])}${seed===0&&n===30&&Math.abs(s-1.2)<1e-9?' · <span class="note">지금은 이 페이지의 30대 데이터예요</span>':''}`;}
 ['s7a','s7b'].forEach(k=>$(k).oninput=draw);
 $('b7a').onclick=()=>{seed=0;$('s7a').value=30;$('s7b').value=1.2;$('b7a').classList.add('on');draw();};
 $('b7b').onclick=()=>{seed++;$('b7a').classList.remove('on');draw();};draw();})();
/* 챕터 8: 엉뚱한 단서 */
(function(){const C=D.car,J=D.carjunk,ks=[0,1,2,3,4,5,6,7,8];
 const res=ks.map(k=>{const X=C.X.map((r,i)=>r.concat(J.J[i].slice(0,k))),Xt=J.Xt.map((r,i)=>r.concat(J.Jt[i].slice(0,k))),m=R.ols(X,C.y);return {r2:m.r2,adj:m.adj,aic:m.aic,te:R.rmse(m.predict(Xt),J.yt)};});
 const P=Plot($('p8'),{xr:[0,8],yr:[0.86,0.94],ticks:1,yticks:0.02,xlab:'엉뚱한 단서 개수',ylab:'R²·수정 R²',aria:'단서 개수에 따른 R²'});
 const Q=Plot($('p8c'),{xr:[0,8],yr:[1.1,1.3],W:360,H:180,ticks:1,yticks:0.05,xlab:'엉뚱한 단서 개수',ylab:'빗나감',aria:'처음 보는 차의 빗나감'});
 P.poly('main',res.map((r,i)=>[i,r.r2]),{stroke:'#9a97aa','stroke-dasharray':'5 4'});P.poly('main',res.map((r,i)=>[i,r.adj]),{stroke:'#7b4fd6'});Q.poly('main',res.map((r,i)=>[i,r.te]),{stroke:'#e0533d'});
 function draw(){const k=+$('s8').value;$('v8').textContent=k;const r=res[k],r0=res[0];P.clear('over');Q.clear('over');
  P.line('over',k,0.86,k,0.94,{stroke:'#22a45d','stroke-width':2});Q.line('over',k,1.1,k,1.3,{stroke:'#22a45d','stroke-width':2});
  const arrow=(v,v0,up)=>v===v0?'':((v>v0)===up?' <span class="good">▲좋아짐</span>':' <span class="badc">▼나빠짐</span>');
  $('r8').innerHTML=`<div>R² (훈련)<b>${f3(r.r2)}</b>${arrow(r.r2,r0.r2,true)}</div><div>수정 R²<b>${f3(r.adj)}</b>${arrow(r.adj,r0.adj,true)}</div><div>AIC (낮을수록 좋음)<b>${f1(r.aic)}</b>${arrow(r.aic,r0.aic,false)}</div><div>처음 보는 200대 빗나감<b>${f3(r.te)} km/L</b>${arrow(r.te,r0.te,false)}</div>`;}
 $('s8').oninput=draw;draw();})();
/* 챕터 9: 겹치는 단서 */
(function(){let seed=1,hist=[];const P=Plot($('p9'),{xr:[130,190],yr:[130,190],ticks:10,yticks:10,xlab:'키(cm)',ylab:'양팔 벌린 길이(cm)',aria:'키와 양팔 길이'});
 const Q=Plot($('p9c'),{xr:[-1.5,2.5],yr:[-1.5,2.5],W:360,H:220,ticks:0.5,yticks:0.5,xlab:'키 계수',ylab:'양팔 계수',aria:'다시 모을 때마다의 두 계수'});
 function make(rho,sd){const r=R.mulberry32(77+sd*13),X=[],y=[];for(let i=0;i<40;i++){const z1=R.gauss(r),z2=rho*z1+Math.sqrt(1-rho*rho)*R.gauss(r),h=160+8*z1,a=160+8*z2;X.push([h,a]);y.push(-100+0.5*h+0.5*a+4*R.gauss(r));}return {X,y};}
 let pc=false;
 function draw(add){const rho=+$('s9').value;$('v9').textContent=f3(rho);const d=make(rho,seed),m=R.ols(d.X,d.y);if(add)hist.push([m.b[1],m.b[2]]);
  const rr=R.pearson(d.X.map(v=>v[0]),d.X.map(v=>v[1])),vif=1/(1-rr*rr);
  P.clear('main');P.clear('over');d.X.forEach(p=>P.dot('main',p[0],p[1],0,{r:4}));
  const mx=R.mean(d.X.map(v=>v[0])),my=R.mean(d.X.map(v=>v[1]));P.arrow('over',mx,my,mx+18,my+18,'#7b4fd6');P.text('over',mx+19,my+19,'PC1',{fill:'#7b4fd6','font-weight':700});
  Q.clear('main');Q.clear('over');Q.fn('under',x=>1-x,{stroke:'#c9c4da','stroke-dasharray':'5 4','stroke-width':1.5});hist.forEach(h=>Q.dot('main',Math.max(-1.5,Math.min(2.5,h[0])),Math.max(-1.5,Math.min(2.5,h[1])),0,{r:3.5,fill:'#9a97aa'}));Q.dot('over',Math.max(-1.5,Math.min(2.5,m.b[1])),Math.max(-1.5,Math.min(2.5,m.b[2])),'star');
  const pm=R.ols(d.X.map(v=>[(v[0]+v[1])/2]),d.y);
  $('r9').innerHTML=`<div>두 단서의 상관 r<b>${f3(rr)}</b></div><div>VIF<b>${f1(vif)}</b>${vif>10?' <span class="badc">조심</span>':''}</div><div>키 계수 ± SE<b>${f2(m.b[1])} ± ${f2(m.se[1])}</b></div><div>양팔 계수 ± SE<b>${f2(m.b[2])} ± ${f2(m.se[2])}</b></div><div>두 계수의 합<b>${f2(m.b[1]+m.b[2])}</b></div>`+(pc?`<div>PC1(두 단서의 평균) 계수 ± SE<b>${f2(pm.b[1])} ± ${f2(pm.se[1])}</b> 안정적</div>`:`<div>다시 모은 횟수<b>${hist.length}</b></div>`);}
 $('s9').oninput=()=>{hist=[];draw(true);};$('b9a').onclick=()=>{seed++;draw(true);};$('b9b').onclick=e=>{pc=!pc;e.target.classList.toggle('on',pc);draw(false);};draw(true);})();
/* 라운드 2 */
const T=D.rent;
function fwd(X,y){let sel=[],cur=R.ols(X.map(()=>[]),y).aic;for(;;){let best=null;for(let j=0;j<X[0].length;j++){if(sel.includes(j))continue;const a=R.ols(X.map(r=>sel.concat([j]).map(k=>r[k])),y).aic;if(!best||a<best[0])best=[a,j];}if(best&&best[0]<cur){sel.push(best[1]);cur=best[0];}else break;}return sel;}
const sel=fwd(T.X,T.y),pick=(X,s)=>X.map(r=>s.map(k=>r[k]));
const ma=R.ols(T.X,T.y),ms=R.ols(pick(T.X,sel),T.y);
const robo=R.rmse(ma.predict(T.Xt),T.yt),fly=R.rmse(ms.predict(pick(T.Xt,sel)),T.yt);
LAB.battle('arena2',{fly,robo,fmt:v=>f1(v)+'만 원'});
const t=$('t2');[['초파리 팀',sel.map(k=>T.names[k]).join(', '),ms,fly],['주판봇 팀','10개 모두',ma,robo]].forEach(([n,u,m,e])=>{const row=t.insertRow();row.innerHTML=`<th>${n}</th><td>${u}</td><td>${f3(m.r2)}</td><td>${f3(m.adj)}</td><td>${f1(m.aic)}</td><td>${f1(e)}만 원</td>`;});
window.__P2={fly,robo,sel};
})();
