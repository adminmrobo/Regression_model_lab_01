/* reg.js — 회귀 계산기. 외부 라이브러리 없이 브라우저에서 직접 계산한다 (node에서도 돈다) */
(function(G){
const sum=a=>a.reduce((s,v)=>s+v,0), mean=a=>sum(a)/a.length;
const sq=v=>v*v;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){const u=r()||1e-12,v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
/* 연립방정식 풀기 (가우스 소거) */
function solve(A,b){const n=A.length,M=A.map((r,i)=>r.slice().concat([b[i]]));
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];
    const d=M[c][c]||1e-12;for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c]/d;if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k];}}
  return M.map((r,i)=>r[n]/(r[i]||1e-12));}
function inv(A){const n=A.length;return A.map((_,j)=>solve(A,A.map((_,i)=>i===j?1:0))).reduce((acc,col,j)=>{col.forEach((v,i)=>{acc[i][j]=v;});return acc;},A.map(()=>Array(n).fill(0)));}
const addOne=X=>X.map(r=>[1].concat(r));
function xtx(A){const p=A[0].length,M=Array.from({length:p},()=>Array(p).fill(0));A.forEach(r=>{for(let i=0;i<p;i++)for(let j=0;j<p;j++)M[i][j]+=r[i]*r[j];});return M;}
function xty(A,y){const p=A[0].length,v=Array(p).fill(0);A.forEach((r,k)=>{for(let i=0;i<p;i++)v[i]+=r[i]*y[k];});return v;}
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
/* t 분포 (불완전 베타함수) */
function lgamma(x){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];let y=x,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(const k of c)s+=k/++y;return -t+Math.log(2.5066282746310005*s/x);}
function betacf(a,b,x){let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<1e-30)d=1e-30;d=1/d;let h=d;
  for(let m=1;m<=200;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-12)break;}return h;}
function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x));
  return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b;}
const tP2=(t,df)=>ibeta(df/(df+t*t),df/2,0.5);              // 양쪽 p값
function tQ(p,df){let lo=0,hi=100;for(let i=0;i<100;i++){const m=(lo+hi)/2;if(tP2(m,df)>2*(1-p))lo=m;else hi=m;}return (lo+hi)/2;}
/* 최소제곱 회귀 + 결과표 */
function ols(X,y){const A=addOne(X),n=y.length,k=A[0].length,M=xtx(A),b=solve(M,xty(A,y));
  const yhat=A.map(r=>dot(r,b)),res=y.map((v,i)=>v-yhat[i]),sse=sum(res.map(sq)),ym=mean(y),sst=sum(y.map(v=>sq(v-ym)));
  const df=n-k,s2=sse/df,Mi=inv(M),se=Mi.map((r,i)=>Math.sqrt(Math.max(s2*r[i],0))),t=b.map((v,i)=>v/se[i]),p=t.map(v=>tP2(Math.abs(v),df)),q=tQ(0.975,df);
  const ll=-n/2*(Math.log(2*Math.PI)+Math.log(sse/n)+1);
  return {b,yhat,res,sse,sst,r2:1-sse/sst,adj:1-(1-(1-sse/sst))*(n-1)/df,aic:-2*ll+2*k,bic:-2*ll+Math.log(n)*k,se,t,p,ci:b.map((v,i)=>[v-q*se[i],v+q*se[i]]),df,n,k,
    predict:Z=>Z.map(r=>dot([1].concat(r),b))};}
const ols1=(x,y)=>ols(x.map(v=>[v]),y);
const rmse=(a,b)=>Math.sqrt(mean(a.map((v,i)=>sq(v-b[i])))), mae=(a,b)=>mean(a.map((v,i)=>Math.abs(v-b[i])));
function pearson(x,y){const mx=mean(x),my=mean(y);let a=0,b=0,c=0;x.forEach((v,i)=>{a+=(v-mx)*(y[i]-my);b+=sq(v-mx);c+=sq(y[i]-my);});return a/Math.sqrt(b*c);}
function ranks(a){const idx=a.map((v,i)=>[v,i]).sort((p,q)=>p[0]-q[0]),r=Array(a.length);for(let i=0;i<idx.length;){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;for(let k=i;k<=j;k++)r[idx[k][1]]=(i+j)/2+1;i=j+1;}return r;}
const spearman=(x,y)=>pearson(ranks(x),ranks(y));
/* 표준화 */
function scaler(X){const p=X[0].length,m=[],s=[];for(let j=0;j<p;j++){const c=X.map(r=>r[j]);m[j]=mean(c);s[j]=Math.sqrt(mean(c.map(v=>sq(v-m[j]))))||1;}
  return {m,s,f:r=>r.map((v,j)=>(v-m[j])/s[j]),F:Z=>Z.map(r=>r.map((v,j)=>(v-m[j])/s[j]))};}
const polyX=(x,d)=>x.map(v=>Array.from({length:d},(_,j)=>Math.pow(v,j+1)));
/* 릿지(닫힌 식, 표준화한 X, 절편은 벌점 없음): 목표 = Σ잔차² + λΣβ² */
function ridge(Xs,y,lam){const ym=mean(y),yc=y.map(v=>v-ym),M=xtx(Xs);M.forEach((r,i)=>r[i]+=lam);const b=solve(M,xty(Xs,yc));return {b0:ym,b,predict:Z=>Z.map(r=>ym+dot(r,b))};}
/* 엘라스틱넷·라쏘(좌표 하강, sklearn과 같은 목표): (1/2n)Σ잔차² + λ(αΣ|β| + (1−α)/2 Σβ²) */
function enet(Xs,y,lam,alpha,iters){alpha=alpha==null?1:alpha;iters=iters||2000;const n=y.length,p=Xs[0].length,ym=mean(y),r=y.map(v=>v-ym),b=Array(p).fill(0);
  const cn=[];for(let j=0;j<p;j++)cn[j]=sum(Xs.map(x=>sq(x[j])))/n;
  for(let it=0;it<iters;it++){let mx=0;for(let j=0;j<p;j++){let rho=0;for(let i=0;i<n;i++)rho+=Xs[i][j]*(r[i]+Xs[i][j]*b[j]);rho/=n;
      const z=Math.sign(rho)*Math.max(Math.abs(rho)-lam*alpha,0)/(cn[j]+lam*(1-alpha)),d=z-b[j];if(d){for(let i=0;i<n;i++)r[i]-=Xs[i][j]*d;b[j]=z;mx=Math.max(mx,Math.abs(d));}}
    if(mx<1e-9)break;}
  return {b0:ym,b,predict:Z=>Z.map(q=>ym+dot(q,b))};}
/* 경사 하강: 목표 = (1/2n)Σ잔차², 반환은 단계마다 [b0,b...]와 손실 */
function gd(A,y,lr,steps,init){const n=y.length,p=A[0].length;let b=init?init.slice():Array(p).fill(0);const path=[b.slice()],loss=[];
  const L=bb=>sum(A.map((r,i)=>sq(dot(r,bb)-y[i])))/(2*n);loss.push(L(b));
  for(let s=0;s<steps;s++){const g=Array(p).fill(0);A.forEach((r,i)=>{const e=dot(r,b)-y[i];for(let j=0;j<p;j++)g[j]+=e*r[j]/n;});b=b.map((v,j)=>v-lr*g[j]);path.push(b.slice());const l=L(b);loss.push(isFinite(l)?l:1e30);}
  return {b,path,loss};}
function sgd(A,y,lr,epochs,batch,seed){const n=y.length,p=A[0].length,rnd=mulberry32(seed||1);let b=Array(p).fill(0);const path=[b.slice()];
  for(let e=0;e<epochs;e++){const idx=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
    for(let s=0;s<n;s+=batch){const B=idx.slice(s,s+batch),g=Array(p).fill(0);B.forEach(i=>{const er=dot(A[i],b)-y[i];for(let j=0;j<p;j++)g[j]+=er*A[i][j]/B.length;});b=b.map((v,j)=>v-lr*g[j]);path.push(b.slice());}}
  return {b,path};}
/* 회귀 나무 (CART, 제곱오차) */
function tree(X,y,depth,minLeaf,feat){minLeaf=minLeaf||3;const p=X[0].length;
  function build(idx,d){const v=mean(idx.map(i=>y[i]));if(d===0||idx.length<2*minLeaf)return {v};let best=null;
    const fs=feat?feat():[...Array(p).keys()];
    for(const j of fs){const s=idx.slice().sort((a,b)=>X[a][j]-X[b][j]);let ls=0,lq=0,rs=sum(s.map(i=>y[i])),rq=sum(s.map(i=>sq(y[i])));
      for(let k=0;k<s.length-1;k++){const yi=y[s[k]];ls+=yi;lq+=yi*yi;rs-=yi;rq-=yi*yi;const nl=k+1,nr=s.length-nl;if(nl<minLeaf||nr<minLeaf)continue;if(X[s[k]][j]===X[s[k+1]][j])continue;
        const sse=lq-ls*ls/nl+rq-rs*rs/nr;if(!best||sse<best.sse-1e-12)best={sse,j,t:(X[s[k]][j]+X[s[k+1]][j])/2};}}
    if(!best)return {v};const L=idx.filter(i=>X[i][best.j]<=best.t),Rr=idx.filter(i=>X[i][best.j]>best.t);return {j:best.j,t:best.t,l:build(L,d-1),r:build(Rr,d-1),v};}
  const root=build([...Array(y.length).keys()],depth);const pr=x=>{let nd=root;while(nd.l)nd=x[nd.j]<=nd.t?nd.l:nd.r;return nd.v;};
  return {root,f:pr,predict:Z=>Z.map(pr)};}
function forest(X,y,ntree,depth,seed,mtry){const rnd=mulberry32(seed||7),n=y.length,p=X[0].length,T=[];
  for(let t=0;t<ntree;t++){const idx=Array.from({length:n},()=>Math.floor(rnd()*n));const Xb=idx.map(i=>X[i]),yb=idx.map(i=>y[i]);
    const feat=mtry&&mtry<p?()=>{const a=[...Array(p).keys()];for(let i=p-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,mtry);}:null;
    T.push(tree(Xb,yb,depth,2,feat));}
  const f=x=>mean(T.map(t=>t.f(x)));return {T,f,predict:Z=>Z.map(f),upto:k=>(x=>mean(T.slice(0,k).map(t=>t.f(x))))};}
function boost(X,y,rounds,lr,depth){const base=mean(y),T=[];let F=y.map(()=>base);
  for(let m=0;m<rounds;m++){const r=y.map((v,i)=>v-F[i]),t=tree(X,r,depth,3);T.push(t);F=F.map((v,i)=>v+lr*t.f(X[i]));}
  const fk=k=>(x=>base+lr*sum(T.slice(0,k).map(t=>t.f(x))));const f=fk(rounds);return {T,base,f,upto:fk,predict:Z=>Z.map(f)};}
function knnReg(X,y,k){const f=q=>{const d=X.map((x,i)=>[x.reduce((s,v,j)=>s+sq(v-q[j]),0),i]).sort((a,b)=>a[0]-b[0]);return mean(d.slice(0,k).map(v=>y[v[1]]));};return {f,predict:Z=>Z.map(f)};}
/* 관(튜브) 회귀: ε 안의 잔차는 벌점 0. 다항 특징(표준화) + 작은 릿지, 부분기울기 하강 */
function tube(Xs,y,eps,C,steps){const n=y.length,p=Xs[0].length;let b=Array(p).fill(0),b0=mean(y);
  for(let s=0;s<steps;s++){const lr=0.05/Math.sqrt(1+s/50),g=b.map(v=>v/C/n),g0=[0];Xs.forEach((x,i)=>{const e=b0+dot(x,b)-y[i];if(Math.abs(e)>eps){const sg=Math.sign(e)/n;g0[0]+=sg;for(let j=0;j<p;j++)g[j]+=sg*x[j];}});
    b0-=lr*g0[0]*4;b=b.map((v,j)=>v-lr*g[j]*4);}
  return {b0,b,f:x=>b0+dot(x,b),predict:Z=>Z.map(x=>b0+dot(x,b))};}
/* 작은 신경망: 입력 1개 → 숨은 마디 h개(tanh) → 출력 1개, Adam */
function nn(x,y,h,epochs,seed){const rnd=mulberry32(seed||3),mx=mean(x),sx=Math.sqrt(mean(x.map(v=>sq(v-mx)))),my=mean(y),sy=Math.sqrt(mean(y.map(v=>sq(v-my))));
  const X=x.map(v=>(v-mx)/sx),Y=y.map(v=>(v-my)/sy),n=X.length;let W1=Array.from({length:h},()=>gauss(rnd)*1.5),B1=Array.from({length:h},()=>gauss(rnd)*1.5),W2=Array.from({length:h},()=>gauss(rnd)*0.3),B2=0;
  const P=[W1,B1,W2],m=P.map(a=>a.map(()=>0)),v=P.map(a=>a.map(()=>0));let mB=0,vB=0;const lr=0.03,b1=0.9,b2=0.999;const hist=[];
  for(let e=1;e<=epochs;e++){const g=P.map(a=>a.map(()=>0));let gB=0,L=0;
    for(let i=0;i<n;i++){const z=W1.map((w,k)=>Math.tanh(w*X[i]+B1[k])),o=B2+dot(W2,z),d=(o-Y[i])/n;L+=sq(o-Y[i])/n;gB+=d;
      for(let k=0;k<h;k++){g[2][k]+=d*z[k];const dz=d*W2[k]*(1-z[k]*z[k]);g[0][k]+=dz*X[i];g[1][k]+=dz;}}
    for(let a=0;a<3;a++)for(let k=0;k<h;k++){m[a][k]=b1*m[a][k]+(1-b1)*g[a][k];v[a][k]=b2*v[a][k]+(1-b2)*g[a][k]*g[a][k];P[a][k]-=lr*(m[a][k]/(1-Math.pow(b1,e)))/(Math.sqrt(v[a][k]/(1-Math.pow(b2,e)))+1e-8);}
    mB=b1*mB+(1-b1)*gB;vB=b2*vB+(1-b2)*gB*gB;B2-=lr*(mB/(1-Math.pow(b1,e)))/(Math.sqrt(vB/(1-Math.pow(b2,e)))+1e-8);if(e%50===0)hist.push(L);}
  const f=q=>{const t=(q-mx)/sx;return my+sy*(B2+W1.reduce((s,w,k)=>s+W2[k]*Math.tanh(w*t+B1[k]),0));};return {f,predict:Z=>Z.map(f),hist};}
/* 로지스틱 회귀 (뉴턴법) */
const sig=z=>1/(1+Math.exp(-z));
function logit(X,y,iters){const A=addOne(X),p=A[0].length;let b=Array(p).fill(0);
  for(let it=0;it<(iters||50);it++){const H=Array.from({length:p},()=>Array(p).fill(0)),g=Array(p).fill(0);
    A.forEach((r,i)=>{const q=sig(dot(r,b)),w=q*(1-q);for(let j=0;j<p;j++){g[j]+=(y[i]-q)*r[j];for(let k=0;k<p;k++)H[j][k]+=w*r[j]*r[k];}});
    const d=solve(H,g);b=b.map((v,j)=>v+d[j]);if(Math.max(...d.map(Math.abs))<1e-10)break;}
  return {b,prob:Z=>Z.map(r=>sig(dot([1].concat(r),b)))};}
/* 포아송 회귀 (IRLS) */
function poisson(X,y,iters){const A=addOne(X),p=A[0].length;let b=Array(p).fill(0);b[0]=Math.log(mean(y)||1);
  for(let it=0;it<(iters||60);it++){const H=Array.from({length:p},()=>Array(p).fill(0)),g=Array(p).fill(0);
    A.forEach((r,i)=>{const mu=Math.exp(dot(r,b));for(let j=0;j<p;j++){g[j]+=(y[i]-mu)*r[j];for(let k=0;k<p;k++)H[j][k]+=mu*r[j]*r[k];}});
    const d=solve(H,g);b=b.map((v,j)=>v+d[j]);if(Math.max(...d.map(Math.abs))<1e-10)break;}
  return {b,predict:Z=>Z.map(r=>Math.exp(dot([1].concat(r),b)))};}
/* 분위수 회귀 (가중 최소제곱 되풀이) */
function quantile(X,y,tau,iters){const A=addOne(X);let b=ols(X,y).b;
  for(let it=0;it<(iters||300);it++){const w=A.map((r,i)=>{const e=y[i]-dot(r,b);return (e>=0?tau:1-tau)/Math.max(Math.abs(e),1e-6);});
    const M=xtx(A.map((r,i)=>r.map(v=>v*Math.sqrt(w[i])))),v=xty(A.map((r,i)=>r.map(v=>v*Math.sqrt(w[i]))),y.map((v,i)=>v*Math.sqrt(w[i])));const nb=solve(M,v);
    const ch=Math.max(...nb.map((v,j)=>Math.abs(v-b[j])));b=nb;if(ch<1e-9)break;}
  return {b,predict:Z=>Z.map(r=>dot([1].concat(r),b))};}
const pinball=(y,q,tau)=>mean(y.map((v,i)=>{const e=v-q[i];return e>=0?tau*e:(tau-1)*e;}));
/* 샤플리 값 (정확 계산, 끼지 않은 특징은 배경 데이터 값으로 채워 평균) */
function shap(f,x,bg){const M=x.length,fact=k=>k<=1?1:k*fact(k-1),cache={};
  const v=S=>{const key=S.join(',');if(key in cache)return cache[key];const val=mean(bg.map(r=>f(r.map((u,j)=>S.includes(j)?x[j]:u))));return cache[key]=val;};
  const phi=Array(M).fill(0);for(let mask=0;mask<(1<<M);mask++){const S=[];for(let j=0;j<M;j++)if(mask&(1<<j))S.push(j);
    for(let i=0;i<M;i++){if(S.includes(i))continue;const w=fact(S.length)*fact(M-S.length-1)/fact(M);phi[i]+=w*(v(S.concat([i]).sort((a,b)=>a-b))-v(S));}}
  return {phi,base:v([]),out:v([...Array(M).keys()])};}
G.REG={sum,mean,sq,mulberry32,gauss,solve,inv,dot,ols,ols1,rmse,mae,pearson,spearman,ranks,scaler,polyX,ridge,enet,gd,sgd,tree,forest,boost,knnReg,tube,nn,sig,logit,poisson,quantile,pinball,shap,tP2,tQ,addOne};
})(typeof window!=='undefined'?window:globalThis);
