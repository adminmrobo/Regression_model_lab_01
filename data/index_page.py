# index_page.py — 목차 페이지
def build(g):
    spr,say,dialog,nav,scoreboard,cast_html,bigmap,head,footer=[g[k] for k in ['spr','say','dialog','nav','scoreboard','cast_html','bigmap','head','footer']]
    P=dict(slug='index',file='index.html',num='목차',title='회귀 예측·분석 대회 — 직선 하나에서 회귀의 가족까지',
      desc='행렬·벡터를 처음 배우는 분을 위한 회귀 해설 시리즈. 초파리 팀과 주판봇 팀이 최소제곱, 회귀분석 결과표, 잔차분석, 경사 하강·릿지·라쏘, 나무·부스팅·신경망과 SHAP, 로지스틱·포아송·분위수·다층 회귀로 여섯 라운드를 겨룹니다.',og='assets/img/og_index.webp')
    h=head(P)+nav('index.html')
    h+='<figure class="cover"><img src="assets/img/cover_index.webp" alt="픽셀아트 운동장. REGRESSION CUP이라고 적힌 칠판에 파란 점들과 보라색 회귀 직선, 점마다 빨간 잔차 줄이 있다. 가운데 심판석의 박사가 손을 들고, 왼쪽 청록 깃발 아래 초파리 팀(초파리·시아·X1·X2), 오른쪽 주황 깃발 아래 주판봇 팀(주판봇·모아·하루·X3)이 서 있다" width="1600" height="900"></figure>'
    h+=f'''<header class="hero" id="top"><div class="wrap"><div class="kicker">연구실 해설 시리즈 · 목차</div><h1>회귀 예측·분석 대회</h1>
<p class="sub">공부 시간으로 점수를, 기온으로 판매량을, 넓이로 집값을 맞힐 수 있을까? 여섯 라운드 동안 두 팀이 <b>숫자를 맞히고(예측) 이유를 말하는(분석)</b> 회귀로 겨룹니다. 모든 라운드에 공통으로 흐르는 생각은 하나, <b>빗나감(잔차)을 가장 작게, 그리고 정직하게 재기</b>예요.</p>
{scoreboard(0)}<div style="margin-top:24px">{dialog([('doc','smile','어서 와요. 저는 이번 대회의 심판이에요. 판정 기준은 하나, <b>처음 보는 데이터에서 얼마나 덜 빗나갔나</b>입니다.'),('fly','point','초파리 팀(인턴1 시아·X1·X2)은 일단 의심하고 잔차부터 본다.'),('robo','firm','주판봇 팀(인턴2 모아·하루·X3)은 크고 정교한 방법에 건다.'),('haru','smile','저는 주판봇 팀이지만, 수식이 나올 때마다 여러분 대신 물어보는 역할도 해요.'),('x1','happy','X1·X2·X3는 회귀의 단서(설명 변수) x₁, x₂, x₃를 맡아요. 두 팀에 나뉘어 들어갔어요.')])}</div></div></header>'''
    h+='''<section class="sec" id="plain"><div class="wrap stack"><h2>처음 오신 분께 — 이 시리즈를 3줄로</h2>
<div class="three"><div><b>무엇을</b>점들 사이로 빗나감이 가장 작은 선(직선·평면·곡선)을 찾아 모르는 숫자를 맞히고, 단서마다 영향이 얼마인지 말하는 방법(회귀)을 배웁니다.</div><div><b>왜 중요한가</b>"얼마나?"를 묻는 거의 모든 질문(가격·판매량·시간·확률)이 회귀로 시작해요. 통계 보고서의 회귀분석과 머신러닝의 예측 모델이 같은 뿌리에서 나왔어요.</div><div><b>실제로는</b>보고서의 회귀분석 결과표, 집값·수요 예측, 대출 심사의 확률, AI 모델의 설명(SHAP)까지 이 시리즈의 도구들이 그대로 쓰입니다.</div></div>
<p class="note">행렬·벡터를 처음 배우는 분을 기준으로 썼어요. 중학교 수학(좌표평면, 일차함수, 평균, 이차함수, 피타고라스 정리)으로 시작하고, 지수·로그·미분은 나올 때 하루의 질문 상자에서 하나씩 풀어 드려요. 막히면 언제든 아래 기호 사전으로 돌아오세요.</p></div></section>'''
    h+=f'<section class="sec" id="cast"><div class="wrap stack"><h2>두 팀과 심판</h2>{cast_html()}</div></section>'
    h+='''<section class="sec" id="rule"><div class="wrap stack"><h2>대회 규칙</h2><ol style="display:flex;flex-direction:column;gap:10px;margin:0;padding-left:22px">
<li>파트마다 라운드가 하나씩, 모두 6라운드입니다. 마지막 파트 6이 결승이에요.</li><li>두 팀은 같은 <b>훈련 데이터</b>로 모델을 만들고, <b>처음 보는 데이터(시험 데이터)</b>에서의 빗나감으로 겨룹니다. 빗나감은 <b>낮을수록</b> 좋아요.</li>
<li>두 팀 점수 차이가 3% 이내면 무승부예요. 점수는 페이지가 직접 계산하고, 결과는 심판이 "결과 열기"를 눌러야 보입니다. 열기 전에 먼저 맞혀 보세요.</li>
<li>데이터는 이 시리즈를 위해 만든 교육용 예시입니다. 실제 가게·학생·집과 관계없어요.</li></ol></div></section>'''
    cards=[('part1_line.html','part1','파트 1 · 챕터 1~4','선 하나 긋기','회귀란 → 상관(피어슨·스피어만) → 최소제곱 → R²·평균 빗나감. 라운드: 두 점 잇기 대 최소제곱','약 30분 · 실험 4개 · 라운드 1'),
     ('part2_table.html','part2','파트 2 · 챕터 5~9','단서 여러 개와 결과표','다중회귀(평면) → ŷ = Xβ와 그림자 → 결과표(계수·SE·t·p) → 수정 R²·AIC → 다중공선성·PCA. 라운드: 단서 10개 대 AIC 선택','약 40분 · 실험 5개 · 라운드 2'),
     ('part3_resid.html','part3','파트 3 · 챕터 10~14','잔차가 하는 말','잔차 그림 → 가정 점검(등분산·정규성·독립) → 로그·다항식 → 영향점 → 심슨의 역설. 라운드: R² 0.85 직선 대 이차 곡선','약 40분 · 실험 5개 · 라운드 3'),
     ('part4_learn.html','part4','파트 4 · 챕터 15~20','스스로 찾아 내려가기','경사 하강 → 학습률 → SGD·미니배치 → 과적합 → 릿지 → 라쏘·엘라스틱넷. 라운드: 조심스러운 걸음 대 과감한 걸음','약 45분 · 실험 6개 · 라운드 4'),
     ('part5_curve.html','part5','파트 5 · 챕터 21~25','곡선 모델과 설명','결정나무 → 숲·부스팅(XGBoost) → KNN·SVR·신경망 → 샤플리 값 → SHAP 대 회귀계수·잔차. 라운드: 직선 회귀 대 부스팅','약 40분 · 실험 5개 · 라운드 5'),
     ('part6_family.html','part6','파트 6 · 챕터 26~30','회귀의 가족','로지스틱 → 소프트맥스 → 포아송 → 분위수 → 패널·다층·시계열. 결승: 0·1 직선 대 로지스틱','약 40분 · 실험 5개 · 결승'),
     ('practice/index.html','practice','마지막 장','실전 연습장','아이스크림 가게 · 월세 사무소 · 학습 공장 · 합격 상담실에서 손잡이를 직접 돌려 봅니다','사업장 4곳 · 미션 12개 자동 판정')]
    h+=f'''<section class="sec" id="map"><div class="wrap stack"><h2>차례 — 여섯 파트, 서른 챕터</h2><div class="cards">{''.join(f'<a href="{f}"><img src="assets/img/thumb_{k}.webp" alt="" width="960" height="420" loading="lazy"><div class="n">{n}</div><div class="t">{t}</div><div class="d">{d}</div><div class="m">{m}</div></a>' for f,k,n,t,d,m in cards)}</div>
<div class="tbl"><table><tr><th>파트</th><th>무엇을 맞히나 · 무엇을 줄이나</th><th>새로 나오는 수학</th><th>앞 파트의 한계 → 이 파트의 이유</th></tr>
<tr><td>1 선 하나 긋기</td><td>숫자 · 잔차 제곱의 합</td><td>일차함수, 평균, 제곱근</td><td>— (출발점)</td></tr>
<tr><td>2 단서 여러 개와 결과표</td><td>숫자 · 잔차 제곱의 합(평면)</td><td>벡터, 내적, 행렬 표기, 확률</td><td>이유는 하나가 아니고, 계수가 얼마나 확실한지 모른다</td></tr>
<tr><td>3 잔차가 하는 말</td><td>숫자 · (가정 점검)</td><td>히스토그램, 로그, 이차함수</td><td>결과표는 잔차의 가정 위에서만 맞다</td></tr>
<tr><td>4 스스로 찾아 내려가기</td><td>숫자 · 손실 + 벌점</td><td>미분(기울기), 등비수열, 절댓값</td><td>단서가 많으면 공식이 무겁고, 곡선은 외우기 쉽다</td></tr>
<tr><td>5 곡선 모델과 설명</td><td>숫자 · 구역별·잔차 고치기</td><td>부등식, 경우의 수</td><td>모양을 미리 정하기 어렵고, 큰 모델은 설명이 어렵다</td></tr>
<tr><td>6 회귀의 가족</td><td>확률·개수·범위 · 가능도·핀볼 손실</td><td>지수·로그함수</td><td>맞히는 것이 이어지는 숫자가 아닐 때</td></tr></table></div></div></section>'''
    h+='''<section class="sec" id="how"><div class="wrap stack"><h2>읽는 법</h2><div class="three"><div><b>① 그림부터</b>챕터마다 실험 패널이 있어요. 점을 끌고 손잡이를 돌려 본 뒤 설명을 읽으면 훨씬 쉬워요.</div><div><b>② 하루의 질문 상자</b>수식이 나오면 하루가 대신 묻고, 기호 하나씩 읽는 법과 뜻을 붙였어요. 작은 숫자로 한 번 같이 계산합니다.</div><div><b>③ AI 판단 코너</b>주판봇·모아가 가져온 "R² 0.99!" 같은 결과, 인포그래픽의 오류를 그대로 믿어도 되는지 확인하는 연습이에요.</div></div>
<details open><summary>기호 사전 — 막히면 여기로 돌아오세요</summary><div class="tbl"><table><tr><th>기호</th><th>읽는 법</th><th>뜻</th><th>처음 나오는 곳</th></tr>
<tr><td>x, y, ŷ</td><td>엑스, 와이, 와이 햇</td><td>단서, 맞히려는 값, 모델의 예측</td><td><a href="part1_line.html#ch1">챕터 1</a></td></tr>
<tr><td>β₀, β₁, ε</td><td>베타 영, 베타 일, 엡실론</td><td>절편, 기울기, 오차</td><td><a href="part1_line.html#ch1">챕터 1</a></td></tr>
<tr><td>r, ρ</td><td>알, 로</td><td>피어슨 상관, 스피어만 순위 상관</td><td><a href="part1_line.html#ch2">챕터 2</a></td></tr>
<tr><td>x̄, Σ, √</td><td>엑스 바, 시그마, 루트</td><td>평균, 모두 더하기, 제곱 되돌리기</td><td><a href="part1_line.html#ch3">챕터 3</a></td></tr>
<tr><td>SSE, SST, R²</td><td>—, —, 알 스퀘어</td><td>잔차 제곱합, 평균 기준 제곱합, 줄인 비율</td><td><a href="part1_line.html#ch4">챕터 4</a></td></tr>
<tr><td>벡터 (2, 3, 4)</td><td>벡터</td><td>숫자를 한 줄로 묶은 것. 데이터 n개 = n차원의 점 하나</td><td><a href="part2_table.html#ch6">챕터 6</a></td></tr>
<tr><td>행렬, 내적 a·b</td><td>행렬, 내적</td><td>숫자를 표로 묶은 것, 자리끼리 곱해 모두 더하기</td><td><a href="part2_table.html#ch6">챕터 6</a></td></tr>
<tr><td>X, Xβ, Xᵀ, (·)⁻¹</td><td>엑스, —, 엑스 전치, 역행렬</td><td>숫자 표, 표 × 계수 묶음, 행·열 뒤집기, 표의 나눗셈</td><td><a href="part2_table.html#ch6">챕터 6</a></td></tr>
<tr><td>SE, t, p</td><td>표준오차, 티, 피</td><td>흔들림 폭, 계수 ÷ SE, 우연일 확률</td><td><a href="part2_table.html#ch7">챕터 7</a></td></tr>
<tr><td>η, ∂L/∂β</td><td>에타, 델 엘 델 베타</td><td>학습률, 손실의 기울기</td><td><a href="part4_learn.html#ch15">챕터 15</a></td></tr>
<tr><td>λ, α</td><td>람다, 알파</td><td>벌점 크기, 라쏘·릿지 섞는 비율</td><td><a href="part4_learn.html#ch19">챕터 19</a>·<a href="part4_learn.html#ch20">20</a></td></tr>
<tr><td>φᵢ</td><td>파이 아이</td><td>샤플리 값(단서 i의 몫)</td><td><a href="part5_curve.html#ch24">챕터 24</a></td></tr>
<tr><td>σ(z), e</td><td>시그마 제트, 이</td><td>S자 함수, 약 2.718</td><td><a href="part6_family.html#ch26">챕터 26</a></td></tr>
<tr><td>λ(포아송), τ</td><td>람다, 타우</td><td>평균 개수, 선 아래 비율(분위수)</td><td><a href="part6_family.html#ch28">챕터 28</a>·<a href="part6_family.html#ch29">29</a></td></tr></table></div></details>
<details><summary>원자료(인포그래픽)에서 바로잡은 곳</summary><ul>
<li>DataInterview 「Linear Regression」: 정규방정식의 ŷ → <b>y</b>, R²와 수정 R² 식이 서로 바뀜, 2p − 2ln(L)은 수정 R²가 아니라 <b>AIC</b>, 가정 목록의 "Independence" 중복·정규성 누락 → 파트 2 챕터 6·8, 파트 3 챕터 11에서 바로잡음</li>
<li>「Regression Algorithms in Machine Learning」: "Stochastic Regression"은 정식 모델 이름이 아니라 확률적 경사 하강(SGD)으로 맞춘 선들의 모습 → 파트 4 챕터 17. 아래쪽 이름표 세 개가 한 번씩 더 붙어 있음</li>
<li>Insightforge 「OLS」: 판매 예측 개선 수치가 "T5%"로 깨져 있어 쓰지 않음</li>
<li>「Spearman Rank Correlation」: 예제 계산(ρ = −1)은 검산 결과 맞음. "correlaties" 등 오타만 있음</li>
<li>Matt Lee 글: "almost surey" → almost surely(거의 확실히)</li></ul></details>
<details><summary>참고한 자료</summary><ul><li>The Architecture Series 「Types of Regression Models Every Quant Should Know」, DataInterview 「Regression Models」·「Linear Regression」, MLTut 「Regression Models」, @mathemetica 「Logistic & Softmax Regression」, 「Regression Algorithms in Machine Learning」, eeanimation 「Least-Squares Estimation」, 「Spearman Rank Correlation」, 「Multiple Regression Assumption #1 Linearity」, Joshua Salami Peter 「PCA」, Insightforge 「OLS」, Matt Lee 「오늘의 수학적 직관」</li><li>James 외 (2013), Hoerl &amp; Kennard (1970), Tibshirani (1996), Zou &amp; Hastie (2005), Breiman (2001), Friedman (2001), Shapley (1953), Lundberg &amp; Lee (2017), Nelder &amp; Wedderburn (1972), Koenker &amp; Bassett (1978) — 각 파트 꾸러미에 서지가 있어요.</li></ul></details></div></section>'''
    P['nextprev']='<div class="nextprev"><span></span><a href="part1_line.html">→ 파트 1 선 하나 긋기부터 시작</a></div>'
    h+=footer(P)+'</body></html>'
    open('index.html','w').write(h)
    print('index.html')
