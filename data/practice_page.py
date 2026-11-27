# practice_page.py — 마지막 장 실전 연습장 (문구)
from common import *
SCENES=[
 ('ice','ice','여름 아이스크림 가게예요. 지난 20일의 기온과 판매량으로 직선을 정해, 앞으로 올 200일(검증 데이터)의 판매량을 맞혀야 해요. 날씨가 변덕스러울수록(잡음) 판매량이 들쭉날쭉합니다.',
   [('ice-s1','날씨 변덕(잡음 크기, 개)',5,40,1,18,'')],[('ice-s2','기울기 β₁ (기온 1°C마다 몇 개)',2,10,0.1,4,''),('ice-s3','절편 β₀ (개)',-80,120,1,60,'')],'',
   '<a href="../part1_line.html#ch3">챕터 3 최소제곱</a> · <a href="../part1_line.html#ch4">챕터 4 R²·RMSE</a>'),
 ('rent','rent','원룸 월세 사무소예요. 단서 10개(넓이·역까지 거리·층과, 관계없을 단서 7개) 중 무엇을 쓸지 골라 월세를 맞혀요. 모은 기록(훈련 데이터)이 적을 때와 많을 때를 비교해 보세요.',
   [('rent-s1','모은 기록 수 n (곳)',15,80,5,20,'')],[],'<div class="chk" id="rent-chk"></div>',
   '<a href="../part2_table.html#ch8">챕터 8 단서 고르기</a> · <a href="../part2_table.html#ch7">챕터 7 결과표</a>'),
 ('gd','gd','학습 공장이에요. 월세 모델(단서 3개)을 경사 하강으로 학습시켜요. 학습률과 걸음 수를 정하세요. 단서를 표준화했는지에 따라 알맞은 학습률이 크게 달라집니다.',
   [],[('gd-s1','학습률 η (log₁₀)',-4,0.3,0.1,-1.5,''),('gd-s2','걸음 수',5,200,5,30,'')],'',
   '<a href="../part4_learn.html#ch15">챕터 15 경사 하강</a> · <a href="../part4_learn.html#ch16">챕터 16 학습률</a>'),
 ('pass','pass','합격 상담실이에요. 공부 시간으로 합격 확률을 알려 주고, 확률이 기준선을 넘으면 "합격권"이라고 안내해요. 모델과 기준선을 정하세요. 시험이 들쭉날쭉할수록(섞임) 공부 시간만으로 가르기 어려워요.',
   [('pass-s1','시험의 들쭉날쭉함(섞임)',0.5,3,0.1,1,'')],[('pass-s2','합격권 기준선(확률)',0.1,0.9,0.05,0.5,'')],'<div class="btns"><button type="button" id="pass-b1" class="on">로지스틱</button><button type="button" id="pass-b2">0·1 직선</button></div>',
   '<a href="../part6_family.html#ch26">챕터 26 로지스틱</a> · <a href="../part6_family.html#battle">결승 라운드</a>'),
]
def rng(i,lab,mn,mx,st,val,unit):
    return f'<label>{lab} = <span id="{i.replace("-s","-v")}"></span>{unit}<input type="range" id="{i}" min="{mn}" max="{mx}" step="{st}" value="{val}"></label>'
def build(g):
    dialog,head,nav,footer=g['dialog'],g['head'],g['nav'],g['footer']
    sc=''
    for key,p,situ,env,dec,extra,links in SCENES:
        envh=''.join(rng(*e) for e in env)+('<button type="button" id="gd-b" class="on">단서 표준화: 켬</button>' if key=='gd' else '')
        dech=''.join(rng(*d) for d in dec)+extra
        sc+=f'''<section class="scene" id="sc-{key}"><div class="stack" style="gap:22px">
<div class="situ"><b>상황</b> — {situ}</div>
<div class="board"><div class="env"><div class="lbl">🟢 환경 조건 (바깥 사정)</div>{envh}</div><div class="dec"><div class="lbl">🔵 내 결정</div>{dech}</div></div>
<div class="stat four" id="{p}-score"></div>
<div class="row"><div class="plot" id="{p}-p"></div><div class="plot" id="{p}-c"></div></div>
<div class="dialog" id="{p}-talk"></div>
<div class="missions"><b>미션</b> <span class="note">(손잡이를 움직이면 판정을 시작해요)</span><ol id="{p}-ms"></ol></div>
<div class="review"><b>배운 곳 다시 보기</b> — {links}</div></div></section>'''
    P=dict(slug='practice',file='practice/index.html',num='마지막 장',title='실전 연습장 — 네 사업장에서 손잡이 돌려 보기',
      desc='최소제곱·단서 고르기·경사 하강·로지스틱 회귀를 가상 사업장에서 직접 조작하는 시뮬레이터. 사업장마다 미션 3개, 자동 판정.',og='assets/img/og_practice.webp')
    h=head(P,'../').replace('href="../assets/engine.css?v=2">','href="../assets/engine.css?v=2"><link rel="stylesheet" href="practice.css?v=2">')+nav('practice')
    h+='<figure class="cover"><img src="../assets/img/cover_practice.webp" alt="흰 벽의 연구실 조종실. 화면 네 개에 ICE, RENT, GD, PASS 그래프가 떠 있고, 박사가 색깔 단추가 달린 조종대의 손잡이를 잡고 있으며 주판봇·시아·모아·하루와 X1·X2·X3가 둘러서 있다" width="1600" height="900"></figure>'
    h+=f'''<header class="hero"><div class="wrap"><div class="kicker">{SERIES} · 마지막 장</div><h1>실전 연습장</h1><p class="sub">여섯 파트에서 배운 손잡이를 가상 사업장에서 직접 돌려 봅니다. 숫자는 모두 교육용 예시이며, 실제 가게·집·학생과 관계없어요. 여기서 <b>검증 데이터</b>는 손잡이를 고를 때 쓰는 "처음 보는 데이터"예요. 주소 끝에 #ice, #rent, #gd, #pass를 붙이면 그 사업장이 바로 열려요.</p>
<div style="margin-top:18px">{dialog([('doc','smile','사업장마다 미션이 세 개예요. ① 가장 좋은 손잡이 찾기 ② 함정 직접 보기 ③ 조건을 바꿔도 결론이 유지되는지 확인. 판정은 검증 데이터로만 합니다.')])}</div></div></header>
<main class="wrap stack" style="padding-bottom:40px"><div class="tabs" role="tablist" aria-label="사업장 고르기"><button data-t="ice">① 아이스크림 가게 (최소제곱)</button><button data-t="rent">② 월세 사무소 (단서 고르기)</button><button data-t="gd">③ 학습 공장 (경사 하강)</button><button data-t="pass">④ 합격 상담실 (로지스틱)</button></div>
{sc}
<div class="limit"><b>마무리 질문</b> — 네 사업장 모두에서 "훈련 데이터에서 가장 좋아 보이는 선택"과 "검증 데이터에서 가장 좋은 선택"이 같았나요? 잡음, 기록 수, 단서의 단위, 시험의 섞임이 바뀌면 가장 좋은 방법과 손잡이도 바뀝니다. 그래서 실제 일에서는 늘 따로 떼어 둔 데이터로 확인하고, 잔차를 들여다봐요.<br><span class="note">모형의 한계: 모든 데이터는 단서 몇 개로 단순하게 만든 예시입니다. 숫자는 교육용 예시이며, 실제 경영·투자·진학 판단의 근거가 아닙니다.</span></div></main>'''
    P['nextprev']='<div class="nextprev"><a href="../part6_family.html">← 파트 6 회귀의 가족</a><a href="../index.html">목차로 →</a></div>'
    h+=footer(P,'../')+'<script src="practice.js"></script></body></html>'
    open('practice/index.html','w').write(h);print('practice/index.html')
