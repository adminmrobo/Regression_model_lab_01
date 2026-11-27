# 회귀 예측·분석 대회 — 직선 하나에서 회귀의 가족까지

행렬·벡터를 처음 배우는 분을 위한 회귀 해설 시리즈입니다. **초파리 팀**(인턴1 시아 · X1 · X2)과 **주판봇 팀**(인턴2 모아 · 조수 하루 · X3)이 여섯 라운드의 회귀 대회를 벌이고, **박사**가 심판을 봅니다. 모든 라운드에 공통으로 흐르는 생각은 하나, **빗나감(잔차)을 가장 작게, 그리고 정직하게 재기**예요.

| 쪽 | 내용 | 라운드 결과 |
|---|---|---|
| [목차](index.html) | 두 팀, 대회 규칙, 큰 그림, 기호 사전, 원자료에서 바로잡은 곳 | — |
| [파트 1 선 하나 긋기](part1_line.html) | 챕터 1~4: 회귀란, 피어슨·스피어만 상관, 최소제곱, R²·RMSE | 주판봇 승 (최소제곱 19개 : 두 점 잇기 27개) |
| [파트 2 단서 여러 개와 결과표](part2_table.html) | 챕터 5~9: 다중회귀, ŷ = Xβ와 그림자, 결과표(계수·SE·t·p), 수정 R²·AIC, 다중공선성·PCA | 초파리 승 (AIC 선택 5.8만 원 : 단서 10개 9.6만 원) |
| [파트 3 잔차가 하는 말](part3_resid.html) | 챕터 10~14: 잔차 그림, 등분산·정규성·독립, 로그·다항식, 영향점, 심슨의 역설 | 초파리 승 (이차 곡선 8회 : 직선 18회) |
| [파트 4 스스로 찾아 내려가기](part4_learn.html) | 챕터 15~20: 경사 하강, 학습률, SGD, 과적합, 릿지, 라쏘·엘라스틱넷 | 주판봇 승 (학습률 0.5 : 0.03) |
| [파트 5 곡선 모델과 설명](part5_curve.html) | 챕터 21~25: 결정나무, 숲·부스팅, KNN·SVR·신경망, 샤플리 값, SHAP 대 회귀계수·잔차 | 주판봇 승 (부스팅 0.42억 : 직선 0.65억) |
| [파트 6 회귀의 가족](part6_family.html) | 챕터 26~30: 로지스틱, 소프트맥스, 포아송, 분위수, 패널·다층·시계열 | 결승 초파리 승 → **최종 3 : 3** |
| [실전 연습장](practice/index.html) | 아이스크림 가게 · 월세 사무소 · 학습 공장 · 합격 상담실 (미션 12개, 자동 판정) | — |

## 만드는 법
- 문구는 `data/*.py`(파트별 문구, 공통 캐릭터·약어·참고 자료), `python3 build.py`가 HTML을 만듭니다.
- 데이터는 `python3 tools/gen.py assets/data.js`(고정 씨앗의 교육용 예시). 계산은 브라우저가 직접 합니다: `assets/reg.js`(최소제곱·결과표·경사 하강·릿지·라쏘·나무·부스팅·신경망·로지스틱·포아송·분위수·샤플리 값).
- 점검: `python3 tools/verify_numbers.py`(statsmodels·scikit-learn 대조), `python3 tools/check.py`(390·1280px, 콘솔 오류), `python3 tools/test_practice.py`(연습장 미션 판정).
- 표지: Genspark 정식 픽셀아트(지시문 `docs/IMG_PROMPTS.md`, 요청 꾸러미 `docs/genspark_request/`). 받은 그림은 `python3 tools/import_covers.py <폴더>`로 반영합니다. `tools/make_covers.py`는 예전 임시 표지 생성기입니다.
- 지식 색인·꾸러미 원본: `kg/` 폴더. 페르소나 검사: `docs/PERSONA_REVIEW.md`.

## 참고 자료
The Architecture Series 「Types of Regression Models」, DataInterview 「Regression Models」·「Linear Regression」, MLTut 「Regression Models」, @mathemetica 「Logistic & Softmax Regression」, 「Regression Algorithms in Machine Learning」, eeanimation 「Least-Squares Estimation」, 「Spearman Rank Correlation」, 「Multiple Regression Assumption #1 Linearity」, Joshua Salami Peter 「PCA」, Insightforge 「OLS」, Matt Lee 「오늘의 수학적 직관」, James 외 (2013) 등.

숫자는 모두 이 시리즈를 위해 만든 교육용 예시 데이터로 계산했습니다.

글 · 안상선 (https://adminmrobo.github.io/who_am_i/who_am_i.html) · (주)M-Robo 대표
