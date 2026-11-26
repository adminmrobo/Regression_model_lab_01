/* practice.js — 실전 연습장: 네 사업장 시뮬레이터 (최소제곱 · 단서 고르기 · 경사 하강 · 로지스틱) */
(function(){const {Plot,f1,f2,f3,pct}=LAB,R=REG;const $=id=>document.getElementById(id);
const say=(who,mood,txt)=>`<div class="say ${who}"><img class="px" data-spr="${who}:${mood}" alt="" aria-hidden="true"><div><span class="who">${SPR.NAMES[who]}</span>${txt}</div></div>`;
function talk(id,lines){const h=$(id);h.innerHTML=lines.map(l=>say(...l)).join('');SPR.paint(h);}
function score(id,items){$(id).innerHTML=items.map(([n,v,good])=>`<div><span>${n}</span><b class="${good===true?'good':(good===false?'badc':'')}">${v}</b></div>`).join('');}
function missions(id,ms,st){$(id).innerHTML=ms.map((m,i)=>{const ok=st.touched&&m.test(st);if(ok)m.done=true;return `<li class="${m.done?'pass':''}"><b>${m.done?'✅ 통과':'⬜ 미션 '+(i+1)}</b> ${m.text}</li>`;}).join('');}
const T={};let cur='';
/* ───── 1. 아이스크림 가게 ───── */
T.ice=(function(){const st={noise:18,b1:4,b0:60,touched:false,lowOK:false,highOK:false};
 const r=R.mulberry32(533),tr=[],va=[];for(let i=0;i<20;i++)tr.push([15+20*r(),R.gauss(r)]);for(let i=0;i<200;i++)va.push([15+20*r(),R.gauss(r)]);
 const ys=(D,n)=>D.map(([t,z])=>20+6*t+n*z);let P,C;
 const ms=[{text:'내 직선의 검증 빗나감을 최소제곱 직선의 <b>3% 안</b>으로 맞추기',test:s=>s.mine<=s.best*1.03},
  {text:'함정 관찰: 날씨 변덕을 <b>30 이상</b>으로 올려 훈련 R²가 0.6 아래로 떨어져도, 최소제곱 기울기는 여전히 6 ± 1.5 안에 있는 것 확인하기',test:s=>s.noise>=30&&s.r2<0.6&&Math.abs(s.olsb1-6)<1.5},
  {text:'조건 바꾸기: 변덕 <b>10 이하</b>와 <b>30 이상</b> 두 경우 모두에서 미션 1을 해내기(기울기 6 근처가 두 경우 모두 맞는지)',test:s=>s.lowOK&&s.highOK}];
 function draw(){const n=st.noise,X=tr.map(d=>d[0]),Y=ys(tr,n),XV=va.map(d=>d[0]),YV=ys(va,n),m=R.ols1(X,Y),f=t=>st.b0+st.b1*t;
  $('ice-v1').textContent=n;$('ice-v2').textContent=f1(st.b1);$('ice-v3').textContent=st.b0;
  const mine=R.rmse(XV.map(f),YV),best=R.rmse(m.predict(XV.map(v=>[v])),YV),sse=R.sum(X.map((t,i)=>R.sq(Y[i]-f(t)))),r2m=1-sse/m.sst;
  Object.assign(st,{mine,best,r2:m.r2,olsb1:m.b[1]});if(st.touched&&mine<=best*1.03){if(n<=10)st.lowOK=true;if(n>=30)st.highOK=true;}
  P.clear('under');P.clear('main');P.clear('over');XV.forEach((t,i)=>P.dot('under',t,YV[i],0,{r:2,fill:'#d7d2e8'}));X.forEach((t,i)=>P.dot('main',t,Y[i],0,{r:4.5}));
  P.lineEq('over',m.b[1],-1,m.b[0],{stroke:'#d98a1c','stroke-width':2,'stroke-dasharray':'6 4'});P.lineEq('over',st.b1,-1,st.b0,{stroke:'#22a45d','stroke-width':3});
  const xm=R.mean(X),ym=R.mean(Y),cv=[];for(let b=2;b<=10.001;b+=0.1)cv.push([b,R.rmse(XV.map(t=>ym+b*(t-xm)),YV)]);
  C.clear('main');C.clear('over');C.poly('main',cv,{stroke:'#7b4fd6'});C.line('over',m.b[1],C.o.yr[0],m.b[1],C.o.yr[1],{stroke:'#d98a1c','stroke-dasharray':'4 3','stroke-width':2});C.line('over',st.b1,C.o.yr[0],st.b1,C.o.yr[1],{stroke:'#22a45d','stroke-width':2.5});
  C.text('over',2.2,C.o.yr[1]-(C.o.yr[1]-C.o.yr[0])*0.08,'초록 = 내 기울기 · 주황 점선 = 최소제곱',{'font-size':10.5,fill:'#4a475a'});
  score('ice-score',[['내 직선 검증 빗나감',f1(mine)+'개',mine<=best*1.03],['최소제곱 검증 빗나감',f1(best)+'개'],['내 직선 훈련 R²',f3(r2m),r2m>0.5?true:(r2m<0?false:null)],['최소제곱 기울기',f2(m.b[1])+'개/°C']]);
  const gap=mine/best-1;
  talk('ice-talk',[['doc',gap<0.03?'happy':'think',gap<0.03?`좋아요. 최소제곱과 거의 같은 직선이에요(손해 ${f1(gap*100)}%).`:`지금 직선은 최소제곱보다 검증 빗나감이 ${f1(gap*100)}% 커요. 기울기와 절편을 함께 맞춰 보세요.`],
   ['haru','smile',`최소제곱 직선: ŷ = ${f1(m.b[0])} + ${f2(m.b[1])} × 기온, 훈련 R² ${f3(m.r2)}.`],
   ['fly','point',n>=30?'R²가 낮다고 직선이 틀린 건 아니야. 기울기가 6 근처에 있는지 봐.':'오른쪽 그래프에서 초록 선을 보라 곡선의 바닥에 맞춰 봐.'],
   ['robo',st.b1>8?'happy':'firm',st.b1>8?'기울기를 크게 잡으면 더운 날 대박이니까 좋은 거 아냐?':'눈대중이면 충분하지. 최소제곱까지 갈 필요가 있나?']]);
  missions('ice-ms',ms,st);}
 return {init(){P=Plot($('ice-p'),{xr:[14,36],yr:[0,350],ticks:2,yticks:50,xlab:'기온(°C)',ylab:'판매량(개)',aria:'아이스크림 가게'});C=Plot($('ice-c'),{xr:[2,10],yr:[0,140],ticks:1,yticks:20,H:260,xlab:'기울기 β₁ (절편은 평균점을 지나게)',ylab:'검증 빗나감(개)',aria:'기울기별 검증 빗나감'});
   [['ice-s1','noise'],['ice-s2','b1'],['ice-s3','b0']].forEach(([id,k])=>{const s=$(id);s.oninput=()=>{st[k]=+s.value;st.touched=true;draw();};});draw();},draw,st,ms};})();
/* ───── 2. 월세 사무소 ───── */
T.rent=(function(){const names=['넓이','역까지 거리','층','현관 번호 끝자리','집주인 생일 달','창문 색 번호','우편함 번호','관리인 키','전 세입자 이름 길이','엘리베이터 버튼 색'];
 const st={n:20,sel:[0,1,2,3,4,5,6,7,8,9],touched:false};const r=R.mulberry32(747);
 const gen=k=>Array.from({length:k},()=>{const a=8+22*r(),d=1+24*r(),fl=1+Math.floor(15*r()),j=Array.from({length:7},()=>R.gauss(r));return {x:[a,d,fl].concat(j),y:15+2.2*a-1.1*d+0.8*fl+6*R.gauss(r)};});
 const pool=gen(80),val=gen(300);let P,C;
 const fit=(sel,n)=>{const D=pool.slice(0,n),pick=x=>sel.map(k=>x[k]),m=R.ols(D.map(d=>pick(d.x)),D.map(d=>d.y));return {m,ev:R.rmse(m.predict(val.map(d=>pick(d.x))),val.map(d=>d.y)),pv:m.predict(val.map(d=>pick(d.x)))};};
 function fwd(n){const D=pool.slice(0,n),X=D.map(d=>d.x),y=D.map(d=>d.y);let sel=[],c=R.ols(X.map(()=>[]),y).aic;for(;;){let b=null;for(let j=0;j<10;j++){if(sel.includes(j))continue;const a=R.ols(X.map(x=>sel.concat([j]).map(k=>x[k])),y).aic;if(!b||a<b[0])b=[a,j];}if(b&&b[0]<c){sel.push(b[1]);c=b[0];}else break;}return {sel,aic:c};}
 const ms=[{text:'단서를 골라 내 조합의 <b>AIC</b>를 단계적 선택이 찾은 가장 낮은 AIC와 같게(±0.01) 만들기',test:s=>s.aic<=s.bestAic+0.01},
  {text:'함정 관찰: 기록 <b>20곳 이하</b>에서 단서 10개를 모두 쓰면, 훈련 R²는 3개 모델보다 높은데 검증 빗나감은 <b>10% 넘게</b> 나쁜 것 확인하기',test:s=>s.sel.length===10&&s.n<=20&&s.r2>s.r2three&&s.ev>1.1*s.evthree},
  {text:'조건 바꾸기: 기록을 <b>70곳 이상</b>으로 늘리면 단서 10개 모델과 3개 모델의 검증 빗나감 차이가 <b>5% 안</b>으로 줄어드는 것 확인하기',test:s=>s.n>=70&&Math.abs(s.evall-s.evthree)/s.evthree<0.05}];
 function draw(){const n=st.n;$('rent-v1').textContent=n;const sel=st.sel.slice().sort((a,b)=>a-b);
  const me=sel.length?fit(sel,n):null,three=fit([0,1,2],n),all=fit([0,1,2,3,4,5,6,7,8,9],n),fb=fwd(n);
  const yv=val.map(d=>d.y),ev=me?me.ev:R.rmse(yv.map(()=>R.mean(pool.slice(0,n).map(d=>d.y))),yv);
  Object.assign(st,{aic:me?me.m.aic:R.ols(pool.slice(0,n).map(()=>[]),pool.slice(0,n).map(d=>d.y)).aic,bestAic:fb.aic,r2:me?me.m.r2:0,r2three:three.m.r2,ev,evthree:three.ev,evall:all.ev});
  P.clear('main');P.clear('over');P.line('under',0,0,110,110,{stroke:'#9a97aa','stroke-dasharray':'5 4','stroke-width':1.5});if(me)val.forEach((d,i)=>P.dot('main',d.y,me.pv[i],0,{r:2.6,fill:'#3d7bd9'}));
  C.clear('main');C.clear('over');const ns=[15,20,25,30,40,50,60,70,80];
  const line=(s,c,d)=>C.poly('main',ns.map(k=>[k,fit(s,k).ev]),{stroke:c,'stroke-dasharray':d||'','stroke-width':2.2});line([0,1,2,3,4,5,6,7,8,9],'#d98a1c','6 4');line([0,1,2],'#22a45d');if(sel.length&&sel.length!==10)line(sel,'#7b4fd6');
  C.line('over',n,C.o.yr[0],n,C.o.yr[1],{stroke:'#7b4fd6','stroke-width':1.5});C.text('over',17,C.o.yr[1]-(C.o.yr[1]-C.o.yr[0])*0.06,'주황 점선 10개 · 초록 3개 · 보라 내 조합',{'font-size':10.5,fill:'#4a475a'});
  score('rent-score',[['훈련 R²',f3(st.r2)],['수정 R²',me?f3(me.m.adj):'—'],['AIC (낮을수록 좋음)',f1(st.aic),st.aic<=fb.aic+0.01?true:null],['검증 빗나감',f1(ev)+'만 원',ev<=three.ev*1.02]]);
  talk('rent-talk',[['doc','smile',`단계적 선택이 고른 단서: ${fb.sel.map(k=>names[k]).join(', ')} (AIC ${f1(fb.aic)}).`],
   ['haru','smile',`3개 모델 검증 ${f1(three.ev)}만 원 · 10개 모델 ${f1(all.ev)}만 원 (기록 ${n}곳).`],
   ['fly','point',n<=25?'기록이 적을수록 엉뚱한 단서 하나하나가 비싸. AIC가 뭘 고르는지 봐.':'기록이 많아지면 엉뚱한 단서의 계수가 0 근처로 가라앉아. 그래도 쓸 이유는 없지.'],
   ['robo',sel.length===10?'happy':'firm',sel.length===10?`단서 10개, 훈련 R² ${f3(st.r2)}! 높을수록 좋다니까.`:'단서를 빼면 정보를 버리는 거 아냐?']]);
  missions('rent-ms',ms,st);}
 return {init(){P=Plot($('rent-p'),{xr:[0,110],yr:[0,110],ticks:20,yticks:20,xlab:'실제 월세(만 원, 검증)',ylab:'예측 월세(만 원)',aria:'예측 대 실제'});C=Plot($('rent-c'),{xr:[15,80],yr:[4,16],ticks:10,yticks:2,H:260,xlab:'모은 기록 수 n',ylab:'검증 빗나감(만 원)',aria:'기록 수에 따른 검증 빗나감'});
   $('rent-chk').innerHTML=names.map((nm,i)=>`<label><input type="checkbox" data-k="${i}" ${st.sel.includes(i)?'checked':''}>${nm}</label>`).join('');
   $('rent-chk').querySelectorAll('input').forEach(c=>c.onchange=()=>{st.sel=[...$('rent-chk').querySelectorAll('input:checked')].map(x=>+x.dataset.k);st.touched=true;draw();});
   const s=$('rent-s1');s.oninput=()=>{st.n=+s.value;st.touched=true;draw();};draw();},draw,st,ms};})();
/* ───── 3. 학습 공장 ───── */
T.gd=(function(){const st={lg:-1.5,steps:30,std:true,touched:false,seenDiv:false};const Dr=DS.rent,X3=Dr.X.map(r=>r.slice(0,3)),y=Dr.y,Xv=Dr.Xt.map(r=>r.slice(0,3)),yv=Dr.yt;
 const sc=R.scaler(X3),A1=R.addOne(sc.F(X3)),V1=R.addOne(sc.F(Xv)),A0=R.addOne(X3),V0=R.addOne(Xv),ols=R.ols(X3,y),best=R.rmse(ols.predict(Xv),yv);let P,C;
 const run=(lr,k,std)=>{const g=R.gd(std?A1:A0,y,lr,k),ev=R.rmse((std?V1:V0).map(r=>R.dot(r,g.b)),yv);return {g,ev:isFinite(ev)?ev:1e9,div:!(g.loss[k]<g.loss[0])};};
 const ms=[{text:'표준화를 켠 채 <b>30걸음 이하</b>로, 검증 빗나감을 공식(정규방정식) 답의 <b>2% 안</b>으로 맞추기',test:s=>s.std&&s.steps<=30&&s.ev<=best*1.02},
  {text:'함정 관찰: 학습률을 너무 크게 해서 손실이 처음보다 <b>커지는(발산)</b> 것 확인하기',test:s=>s.div},
  {text:'조건 바꾸기: 표준화를 <b>끄고</b>, 표준화에서 잘 되던 학습률(0.03 이상)이 이번엔 발산하는 것 확인하기',test:s=>!s.std&&Math.pow(10,s.lg)>=0.03&&s.div}];
 function draw(){const lr=Math.pow(10,st.lg),k=st.steps,o=run(lr,k,st.std);$('gd-v1').textContent=`${f1(st.lg)} → η ≈ ${lr<0.01?lr.toExponential(1):f3(lr)}`;$('gd-v2').textContent=k;
  Object.assign(st,{ev:o.ev,div:o.div});
  P.clear('main');P.clear('over');P.poly('main',o.g.loss.map((l,i)=>[i,Math.max(0,Math.min(8,Math.log10(Math.max(l,1))))]),{stroke:o.div?'#e0533d':'#22a45d','stroke-width':2.5});
  P.line('over',0,Math.log10(ols.sse/(2*y.length)),200,Math.log10(ols.sse/(2*y.length)),{stroke:'#7b4fd6','stroke-dasharray':'4 3','stroke-width':1.5});
  C.clear('main');C.clear('over');const cv=[];for(let g=-4;g<=0.301;g+=0.1){const r=run(Math.pow(10,g),k,st.std);cv.push([g,Math.min(60,r.ev)]);}C.poly('main',cv,{stroke:'#7b4fd6'});C.line('over',st.lg,0,st.lg,60,{stroke:'#22a45d','stroke-width':2.5});
  C.line('over',-4,best,0.3,best,{stroke:'#d98a1c','stroke-dasharray':'4 3','stroke-width':1.5});
  const fin=o.g.loss[k],state=o.div?'발산':(o.ev<=best*1.02?'수렴(공식과 같음)':'아직 내려가는 중');
  score('gd-score',[['마지막 손실',fin>1e6?fin.toExponential(1):f1(fin),!o.div&&o.ev<=best*1.02?true:(o.div?false:null)],['공식 답의 손실',f1(ols.sse/(2*y.length))],['검증 빗나감',o.ev>=1e8?'∞':f1(o.ev)+'만 원',o.ev<=best*1.02],['상태',state,o.div?false:(o.ev<=best*1.02?true:null)]]);
  talk('gd-talk',[['doc',o.div?'shock':'smile',o.div?'손실이 커지고 있어요. 학습률이 골짜기 폭보다 커서 튕겨 나갔어요.':(o.ev<=best*1.02?`${k}걸음 만에 공식의 답과 같은 곳에 닿았어요.`:'아직 바닥에 못 갔어요. 걸음 수나 학습률을 늘려 보세요.')],
   ['haru','smile',st.std?'표준화를 켜면 골짜기가 둥글어서 0.1~1 사이 학습률이 잘 통해요.':'표준화를 끄면 넓이·거리 숫자가 커서 골짜기가 아주 좁고 길어져요. 학습률이 0.003쯤만 넘어도 위험해요.'],
   ['fly','point',lr<0.01&&st.std?'조심스러운 건 좋은데, 정해진 걸음 안에 못 내려가면 소용없어(라운드 4).':'손실 곡선이 꾸준히 내려가는지부터 확인해.'],
   ['robo',lr>1?'happy':'firm',lr>1?'학습률 2! 큰 걸음이 최고다!':'걸음 수를 200으로 늘리면 다 해결되지 않나?']]);
  missions('gd-ms',ms,st);}
 return {init(){P=Plot($('gd-p'),{xr:[0,200],yr:[0,8],ticks:40,yticks:1,H:260,xlab:'걸음',ylab:'log₁₀ 손실',aria:'걸음마다 손실'});C=Plot($('gd-c'),{xr:[-4,0.3],yr:[0,60],ticks:1,yticks:10,H:260,xlab:'log₁₀ 학습률',ylab:'검증 빗나감(만 원)',aria:'학습률별 검증 빗나감'});
   const s1=$('gd-s1'),s2=$('gd-s2');s1.oninput=()=>{st.lg=+s1.value;st.touched=true;draw();};s2.oninput=()=>{st.steps=+s2.value;P.o.xr=[0,200];st.touched=true;draw();};
   $('gd-b').onclick=e=>{st.std=!st.std;e.target.classList.toggle('on',st.std);e.target.textContent='단서 표준화: '+(st.std?'켬':'끔');st.touched=true;draw();};draw();},draw,st,ms};})();
/* ───── 4. 합격 상담실 ───── */
T.pass=(function(){const st={mix:1,th:0.5,model:'lg',touched:false};let P,C;
 const raw=(()=>{const r=R.mulberry32(909),a=[];for(let i=0;i<340;i++)a.push([12*r(),r()]);return a;})();
 const make=mix=>raw.map(([h,u])=>[h,u<1/(1+Math.exp(-(1.6/mix)*(h-6)))?1:0]);
 const ms=[{text:'지금 모델에서 검증 정확도가 가장 높은 기준선(±1%p 안)을 찾기',test:s=>s.acc>=s.bestAcc-0.01},
  {text:'함정 관찰: <b>0·1 직선</b>으로 바꿔 0~1 밖의 "확률"이 나오고, 확률 빗나감 점수가 로지스틱보다 나쁜 것 확인하기',test:s=>s.model==='lin'&&s.out>0&&s.bLin>s.bLg},
  {text:'조건 바꾸기: 시험의 섞임을 <b>2 이상</b>으로 올려도 로지스틱의 확률 빗나감 점수가 직선보다 낮은지 확인하기',test:s=>s.mix>=2&&s.bLg<s.bLin}];
 function draw(){$('pass-v1').textContent=f1(st.mix);$('pass-v2').textContent=f2(st.th);const D=make(st.mix),tr=D.slice(0,40),va=D.slice(40);
  const xs=tr.map(d=>d[0]),ys=tr.map(d=>d[1]),lg=R.logit(xs.map(v=>[v]),ys,60),ln=R.ols1(xs,ys);
  const fL=x=>R.sig(lg.b[0]+lg.b[1]*x),fR=x=>ln.b[0]+ln.b[1]*x,cl=v=>Math.max(0,Math.min(1,v)),f=st.model==='lg'?fL:(x=>cl(fR(x)));
  const br=g=>R.mean(va.map(d=>R.sq(g(d[0])-d[1]))),acc=t=>R.mean(va.map(d=>((f(d[0])>=t)===(d[1]===1))?1:0));
  const bLg=br(fL),bLin=br(x=>cl(fR(x))),out=xs.filter(x=>fR(x)<0||fR(x)>1).length,ths=[];for(let t=0.1;t<=0.901;t+=0.05)ths.push([t,acc(t)]);const bestAcc=Math.max(...ths.map(v=>v[1]));
  const a=acc(st.th),miss=va.filter(d=>d[1]===1&&f(d[0])<st.th).length;Object.assign(st,{acc:a,bestAcc,bLg,bLin,out});
  P.clear('main');P.clear('over');tr.forEach(d=>P.dot('main',d[0],d[1],0,{r:4,fill:d[1]?'#e0533d':'#3d7bd9'}));P.fn('over',st.model==='lg'?fL:fR,{stroke:st.model==='lg'?'#22a45d':'#d98a1c','stroke-width':3});
  P.line('over',0,st.th,12,st.th,{stroke:'#7b4fd6','stroke-dasharray':'5 4','stroke-width':2});
  C.clear('main');C.clear('over');C.poly('main',ths,{stroke:'#7b4fd6'});C.line('over',st.th,0.5,st.th,1,{stroke:'#22a45d','stroke-width':2.5});
  score('pass-score',[['확률 빗나감 점수(검증)',f3(st.model==='lg'?bLg:bLin),st.model==='lg'?bLg<=bLin:bLin<=bLg],['맞힌 비율(기준선)',pct(a),a>=bestAcc-0.01],['놓친 합격자(검증 300명)',miss+'명'],['0~1 밖 예측(훈련, 직선)',out+'명',out?false:null]]);
  talk('pass-talk',[['doc','smile',`로지스틱 ${f3(bLg)} 대 0·1 직선 ${f3(bLin)} (확률 빗나감 점수, 낮을수록 좋음).`],
   ['haru','smile',`기준선 ${f2(st.th)}에서 검증 맞힌 비율 ${pct(a)}, 가장 좋은 기준선의 비율 ${pct(bestAcc)}.`],
   ['fly','point',st.th<0.3?'기준선을 낮추면 놓치는 합격자는 줄지만, 떨어질 학생에게도 "합격권"이라고 말하게 돼.':'맞힌 비율만 보지 말고, 확률 자체가 정확한지(빗나감 점수)도 봐.'],
   ['robo',st.model==='lin'?'happy':'firm',st.model==='lin'?'0·1 직선도 0.5 기준이면 꽤 맞히잖아!':'확률 같은 건 대충 맞아도 되지 않아?']]);
  missions('pass-ms',ms,st);}
 return {init(){P=Plot($('pass-p'),{xr:[0,12],yr:[-0.3,1.3],ticks:2,yticks:0.25,xlab:'공부 시간(시간)',ylab:'합격 확률',aria:'합격 확률 곡선'});C=Plot($('pass-c'),{xr:[0.1,0.9],yr:[0.5,1],ticks:0.1,yticks:0.1,H:260,xlab:'합격권 기준선',ylab:'검증 맞힌 비율',aria:'기준선별 맞힌 비율'});
   const s1=$('pass-s1'),s2=$('pass-s2');s1.oninput=()=>{st.mix=+s1.value;st.touched=true;draw();};s2.oninput=()=>{st.th=+s2.value;st.touched=true;draw();};
   $('pass-b1').onclick=()=>{st.model='lg';$('pass-b1').classList.add('on');$('pass-b2').classList.remove('on');st.touched=true;draw();};
   $('pass-b2').onclick=()=>{st.model='lin';$('pass-b2').classList.add('on');$('pass-b1').classList.remove('on');st.touched=true;draw();};draw();},draw,st,ms};})();
/* 탭 */
const inited={};function open(name){if(!T[name])name='ice';cur=name;document.querySelectorAll('.scene').forEach(s=>s.classList.toggle('hidden',s.id!=='sc-'+name));
 document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===name));if(!inited[name]){T[name].init();inited[name]=true;}if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>open(b.dataset.t));window.addEventListener('hashchange',()=>open(location.hash.slice(1)));
open(location.hash.slice(1)||'ice');window.__PR=T;
})();
