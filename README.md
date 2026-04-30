# SHC (Senior Health Care) — 시니어 헬스케어 통합 플랫폼

> 시니어를 위한 건강 정보, 건강 상품, AI 맞춤 추천, 건강 알리미를 한 곳에서 제공하는 웹 서비스

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [프로젝트 목표](#2-프로젝트-목표)
3. [주요 기능](#3-주요-기능)
4. [기술 스택](#4-기술-스택)
5. [시스템 아키텍처](#5-시스템-아키텍처)
6. [자료구조](#6-자료구조)
7. [핵심 알고리즘](#7-핵심-알고리즘)
8. [프로젝트 구조](#8-프로젝트-구조)
9. [실행 방법](#9-실행-방법)
10. [배포](#10-배포)
11. [개발 문서](#11-개발-문서)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | **SHC (Senior Health Care)** |
| 한 줄 소개 | 시니어를 위한 건강 정보 + 상품 + AI 추천 + 건강 알리미 통합 플랫폼 |
| 대상 사용자 | 건강에 관심이 많은 시니어(고령) 사용자 |
| 라우팅 방식 | URL을 변경하지 않는 **State 기반 SPA** |
| 인증 방식 | localStorage + SHA-256 비밀번호 해싱 |
| 배포 환경 | AWS EC2 + Docker + Nginx + GitHub Actions CI/CD |

---

## 2. 프로젝트 목표

### 2.1 서비스 비전
시니어 사용자가 **건강 정보 탐색 → 맞춤 상품 발견 → 구매 → 일상 건강 관리**까지 하나의 서비스에서 완결할 수 있도록 한다.

### 2.2 핵심 목표

| 목표 | 구현 방향 |
|------|---------|
| **접근성(Accessibility)** | WCAG AAA 수준의 가독성, 큰 폰트, 고대비 UI |
| **직관성(Intuitiveness)** | 카드 기반 UI, 복잡한 페이지 이동 최소화 |
| **개인화(Personalization)** | 회원 건강 관심사 기반 AI 맞춤 추천 |
| **연속성(Continuity)** | 건강 정보 → 상품 추천 → 결제 → 알리미까지 자연스러운 흐름 |
| **신뢰성(Reliability)** | 재고 선검증·일괄 차감, 알람 중복 방지 등 견고한 상태 관리 |

### 2.3 디자인 원칙

- **Typography**: 기본 폰트 18px 이상, 전역 폰트 크기 조절(0.8x / 1.0x / 1.4x) 지원
- **Visuals**: 모든 인터랙션 요소 최소 44×44px, 고대비 테두리·아이콘
- **UX 패턴**: Neo-minimalism, Card-based UI, Soft Glassmorphism(날씨 위젯)
- **컬러 팔레트**: Sage Green, Soft Beige, Warm Peach 기반의 따뜻한 자연 색상

---

## 3. 주요 기능

### 3.1 페이지 구성

| 페이지 | 설명 |
|--------|------|
| **메인 페이지** | 인기글 피처링, 최신 게시글, 날씨/미세먼지 위젯, 위치 기반 상품 추천 |
| **게시판 (목록/상세)** | 레시피 / 라이프 / 운동 카테고리, 무한 스크롤, 키워드 검색, 마크다운 렌더링 |
| **상품 (목록/상세)** | 3열 그리드, 더보기 페이징, 실시간 재고 표시, 바로구매·장바구니 |
| **장바구니** | 사용자별 분리 저장, 체크박스 선택 주문, 수량 조절 |
| **주문/결제** | 배송지·결제수단·약관 동의·재고 선검증, 데스크톱/모바일 반응형 |
| **로그인 / 회원가입** | SHA-256 해싱, 건강 관심사 다중 선택 |
| **AI 건강 맞춤 추천** | Claude API 기반 상품·게시글·조언 추천, 결과 상태 보존 |
| **건강 알리미** | 약 복용 / 혈당 체크 / 혈압 체크 알람 (사용자별 분리) |

### 3.2 공통 기능

- **헤더**: 폰트 크기 조절 [A A A], 메인 네비게이션, 활성 탭 강조, 로그인 상태 표시
- **날씨 배경(WeatherBackground)**: 7가지 날씨 코드별 풀스크린 애니메이션 (Canvas/CSS)
- **건강 알리미 팝업(AlarmNotifier)**: 앱 전역 30초 간격 알람 체크, 큐 기반 모달 표시
- **Zen Mode**: 메인 페이지에서 날씨 아이콘 5회 클릭 시 UI 숨김 모드

---

## 4. 기술 스택

### 4.1 Frontend

| 구분 | 사용 기술 | 용도 |
|------|---------|------|
| **언어** | JavaScript (ES2022) | — |
| **프레임워크** | React 18.3 | UI 라이브러리 |
| **빌드 도구** | Vite 5.4 | 개발 서버 / 번들링 |
| **상태 관리** | React Context API | 전역 상태 (사용자, 장바구니, 상품, 알람, 폰트, 위치) |
| **HTTP 클라이언트** | Axios 1.15 | 외부 API 호출 |
| **마크다운 렌더링** | react-markdown 10 + remark-gfm 4 + rehype-raw 7 | 게시글 본문 / iframe / 표 |
| **암호화** | Web Crypto API (SHA-256) | 비밀번호 해싱 (라이브러리 미사용) |
| **데이터 영속성** | localStorage | 사용자/장바구니/상품/알람/폰트 설정 |

### 4.2 외부 API

| API | 용도 | 환경변수 |
|-----|------|---------|
| **Claude AI (Anthropic)** | AI 건강 맞춤 추천 | `VITE_API_URL` |
| **OpenWeatherMap** | 현재 위치 날씨 정보 | `VITE_WEATHER_API_KEY` |
| **WAQI (World Air Quality Index)** | 미세먼지(AQI) 정보 | `VITE_DUST_API_KEY` |
| **geo.ipify.org** | IP 기반 위치 감지 | `VITE_IP_GEOLOCATION_API_KEY` |

### 4.3 Infra & DevOps

| 구분 | 사용 기술 |
|------|---------|
| **배포 환경** | AWS EC2 (Ubuntu) |
| **컨테이너** | Docker (nginx:alpine) |
| **웹 서버** | Nginx |
| **CI/CD** | GitHub Actions (push to `main` → 자동 배포) |

---

## 5. 시스템 아키텍처

### 5.1 Context 계층 구조

```
main.jsx
└── UserContext.Provider              ← 회원/로그인
    └── CartContext.Provider          ← 사용자별 장바구니
        └── ProductContext.Provider   ← 상품 재고
            └── AlarmContext.Provider ← 약/혈당/혈압 알람
                └── FontSizeContext.Provider ← 전역 폰트
                    └── App
                        ├── Header
                        ├── LocationContext.Provider  (페이지 렌더 시)
                        │   └── renderPage()
                        └── AlarmNotifier             (항상 렌더)
```

### 5.2 전체 데이터 흐름

```
사용자
  │
  ▼
App.jsx (navigate로 페이지 전환)
  │
  ├── Context API (전역 상태)
  │   ├── UserContext     ↔ shc_users / shc_current_user
  │   ├── CartContext     ↔ shc_cart_{username}
  │   ├── ProductContext  ↔ shc_products
  │   ├── AlarmContext    ↔ shc_medicines / blood_sugar / blood_pressure
  │   └── FontSizeContext ↔ shc_font_scale
  │
  ├── 외부 API
  │   ├── geo.ipify.org → { lat, lng }
  │   │       ├──▶ OpenWeatherMap → 날씨 + weatherIcon
  │   │       └──▶ WAQI           → 미세먼지 AQI
  │   └── Claude AI → 맞춤 추천 JSON
  │
  └── 페이지 간 데이터 전달
      ├── ProductDetailPage / CartPage  → CheckoutPage (orderItems)
      ├── HealthRecommendPage           → App.jsx (healthSavedState 보존)
      └── BoardDetailPage               → ProductDetailPage (from, fromPostId)
```

### 5.3 라우팅(State 기반 SPA)

URL을 변경하지 않고 `App.jsx`의 `useState`로 페이지/파라미터를 관리한다.

| state | 용도 |
|-------|------|
| `page` | 현재 페이지명 |
| `category` | 게시판 카테고리 |
| `selectedPostId` | 게시글 상세 ID |
| `productId` | 상품 상세 ID |
| `from` / `fromPostId` | 돌아가기 분기용 출처 정보 |
| `healthSavedState` | AI 추천 결과 보존 |
| `orderItems` / `fromCart` | 결제 페이지 전달용 |
| `weatherIcon` | 위젯 추천 키워드 매핑용 날씨 코드 |

---

## 6. 자료구조

### 6.1 핵심 데이터 타입

```ts
// 사용자
User
├── username         : string
├── name             : string
├── passwordHash     : string    // shc_users 전용 (current_user엔 없음)
├── age?             : number
└── healthInterests? : string[]  // 회원가입 시 선택한 건강 관심사

// 상품 (product.json / shc_products)
Product
├── id          : number
├── category    : "recipe" | "exercise" | "life"
├── title       : string
├── keyword     : string[]
├── description : string
├── price       : number
├── quantity    : number   // 재고
└── image       : string

// 장바구니 항목
CartItem
└── ...Product
    └── quantity : number  // 장바구니 담은 수량 (재고 아님)

// 게시글 (articleData.json)
Article
├── id        : number
├── category  : "recipe" | "exercise" | "life"
├── title     : string
├── keyword   : string[]
├── content   : string     // 마크다운
├── createdAt : "YYYY-MM-DD"
└── viewCount : number

// 약 데이터
Medicine
├── id             : string
├── name           : string
├── dosage         : string
├── alarmTimes     : string[]      // ["08:00", "20:00"]
├── totalCount     : number | null
└── remainingCount : number | null

// 혈당/혈압 알람
TimeAlarm
├── id   : string
└── time : string                  // "HH:MM"
```

### 6.2 localStorage 키 맵

```
localStorage
│
├── [전역 - 계정 무관]
│   ├── shc_users                          → User[]
│   ├── shc_current_user                   → User (passwordHash 제외)
│   ├── shc_products                       → Product[]
│   └── shc_font_scale                     → "small" | "default" | "large"
│
└── [사용자별 - {username} 분리]
    ├── shc_cart_{username}                 → CartItem[]
    ├── shc_medicines_{username}            → Medicine[]
    ├── shc_blood_sugar_{username}          → TimeAlarm[]
    ├── shc_blood_pressure_{username}       → TimeAlarm[]
    └── shc_alarm_fired_{username}_{날짜}   → string[] (알람 발화 키 집합)
```

---

## 7. 핵심 알고리즘

### 7.1 메인 페이지 인기글 선정
날짜 근접도와 조회수를 조합한 점수로 상위 1개 피처링.

```js
const featured = [...articles].sort((a, b) => {
  const dateScore = new Date(b.createdAt) - new Date(a.createdAt);
  const viewScore = (b.viewCount - a.viewCount) * 86400000; // 1일 가중치
  return dateScore + viewScore;
})[0];
```

### 7.2 게시글 상세 상품 추천
키워드 교집합 점수 + 카테고리 우선순위.

```
products[]
└── matchCount = |상품 keyword ∩ 게시글 keyword|
    ├── category == "life"
    │   └── matchCount 내림차순 → 상위 3개
    └── category == "recipe" | "exercise"
        ├── preferred : 같은 category + matchCount > 0
        └── others    : 다른 category + matchCount > 0
            → [...preferred, ...others].slice(0, 3)
```

### 7.3 미세먼지 위젯 상품 추천
`weatherIcon` 코드 → 키워드 매핑 → 미세먼지 1개 + 날씨 2개.

| weatherIcon | 키워드 |
|-------------|--------|
| `01` | 자외선 |
| `09` / `10` / `11` | 비 |
| `13` | 눈 |
| 그 외 | 환절기 |

### 7.4 AI 건강 맞춤 추천 (Claude API)
사용자의 건강 상태와 사이트 내 상품/게시글 목록을 프롬프트로 전달, JSON 응답을 파싱.

- **프롬프트 입력**: 선택 건강 키워드 + 자유 입력 + 전체 상품·게시글 목록
- **규칙**: 관련성 높은 것만 엄선, 개수 강제 없음(1~4개), 목록 외 추천 금지(프롬프트 어택 방지)
- **응답 형식**: `{ productIds: [], posts: [{ category, id }], comment: "..." }`
- **상태 보존**: 추천 결과를 `App.jsx`의 `healthSavedState`로 저장 → 상품 상세 다녀와도 결과 복구

### 7.5 결제 — 재고 선검증 후 일괄 차감
React 18 배칭 환경에서 `setProducts` 콜백 내 클로저 변수의 신뢰성 문제를 회피하기 위해, **검증과 차감을 분리**한다.

```js
// 1단계: 전체 재고 선검증
for (const item of orderItems) {
  const stock = getStock(item.id);
  if (stock < item.quantity) { alert(...); return; }
}
// 2단계: 일괄 차감
orderItems.forEach(item => decreaseStock(item.id, item.quantity));
// 3단계: 장바구니 출처면 항목 제거
if (fromCart) orderItems.forEach(item => removeFromCart(item.id));
```

### 7.6 건강 알리미 — Stale Closure 회피 + 중복 방지
- `setInterval`(30초)로 현재 시각과 알람 시각 비교
- `useRef`로 최신 알람 데이터 동기화 → stale closure 방지
- `shc_alarm_fired_{username}_{날짜}` 키로 같은 날 같은 알람 중복 발화 방지
- 동시 알람 큐(`pendingAlarms`) → 순서대로 모달 표시, 대기 개수 표시

---

## 8. 프로젝트 구조

```
SHC/
├── shc-vite/                          # 메인 애플리케이션
│   ├── public/
│   │   └── data/
│   │       └── product.json           # 상품 데이터
│   ├── src/
│   │   ├── App.jsx                    # State 기반 라우팅
│   │   ├── main.jsx                   # Context Provider 계층
│   │   ├── article/
│   │   │   └── articleData.json       # 게시글 데이터
│   │   ├── components/
│   │   │   ├── Header.jsx             # 전역 GNB
│   │   │   ├── WeatherBackground.jsx  # 날씨 배경 애니메이션
│   │   │   ├── AlarmNotifier.jsx      # 전역 알람 팝업
│   │   │   ├── Widgets.jsx            # 날씨/미세먼지 위젯
│   │   │   ├── UserContext.jsx        # 회원/로그인
│   │   │   ├── CartContext.jsx        # 사용자별 장바구니
│   │   │   ├── ProductContext.jsx     # 상품 재고
│   │   │   ├── AlarmContext.jsx       # 약/혈당/혈압 알람
│   │   │   ├── FontSizeContext.jsx    # 전역 폰트 크기
│   │   │   ├── LocationContext.jsx    # 사용자 위치
│   │   │   ├── Badge.jsx
│   │   │   ├── ProductImg.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── pages/
│   │   │   ├── MainPage.jsx
│   │   │   ├── BoardListPage.jsx
│   │   │   ├── BoardDetailPage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ProductItem.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── HealthRecommendPage.jsx
│   │   │   └── AlarmPage.jsx
│   │   └── styles/
│   │       └── tokens.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── frontend/
│   └── images/                        # 화면 캡처
│
├── .github/
│   └── workflows/
│       └── main.yml                   # EC2 자동 배포
│
├── DESIGN.md                          # 디자인 컨셉 문서
├── 기능명세서.md                        # 기능 명세서
├── 기술구현명세서.md                    # 기술 구현 명세서
├── 발표자료_다이어그램.md                # 자료구조/데이터 흐름 다이어그램
└── README.md
```

---

## 9. 실행 방법

### 9.1 환경변수 설정
`shc-vite/.env` 파일을 다음과 같이 생성한다.

```env
VITE_API_URL=<Claude API endpoint>
VITE_WEATHER_API_KEY=<OpenWeatherMap API Key>
VITE_DUST_API_KEY=<WAQI API Key>
VITE_IP_GEOLOCATION_API_KEY=<geo.ipify.org API Key>
```

### 9.2 개발 서버 실행

```bash
cd shc-vite
npm install
npm run dev
```

기본 포트 `http://localhost:5173`

### 9.3 프로덕션 빌드

```bash
npm run build      # dist/ 폴더 생성
npm run preview    # 빌드 결과 미리보기
```

---

## 10. 배포

### 10.1 배포 파이프라인

```
push to main
   │
   ▼
GitHub Actions (.github/workflows/main.yml)
   │
   ├── ① 소스 코드를 EC2로 SCP 전송
   │
   └── ② EC2에서 SSH로 다음 실행
       ├── npm ci && npm run build
       ├── docker build -t shc-app .
       ├── docker stop / rm shc-app
       └── docker run -d -p 80:80 shc-app
```

### 10.2 컨테이너 구성
`Dockerfile`은 EC2에서 빌드된 `dist/`를 nginx:alpine 이미지에 복사하는 단순 구조.

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 11. 개발 문서

| 문서 | 설명 |
|------|------|
| [DESIGN.md](./DESIGN.md) | 디자인 컨셉, 색상 팔레트, 접근성 가이드라인 |
| [기능명세서.md](./기능명세서.md) | 페이지별 기능 상세 명세 |
| [기술구현명세서.md](./기술구현명세서.md) | 핵심 구현 방식, 데이터 흐름, 알고리즘 (개발자용) |
| [발표자료_다이어그램.md](./발표자료_다이어그램.md) | 자료구조 및 데이터 흐름 다이어그램 |
