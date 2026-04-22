# 1. 핵심 디자인 컨셉 및 키워드 (Design Concept)
시니어 대상 서비스(시니어 헬스케어 & 커머스)에서 '혁신적이고 아름다운 디자인'은 단순히 화려한 그래픽을 의미하는 것이 아니라, '압도적인 직관성(Accessibility)과 세련된 모던함(Modernism)의 결합'을 의미합니다. 글자가 크면서도 촌스럽지 않고, 고급 매거진이나 프리미엄 브랜드 앱처럼 느껴지도록 설계하는 것이 핵심입니다.

- **디자인 스타일 (Style):** Neo-minimalism (네오 미니멀리즘), Card-based UI (카드 기반 UI), Soft Glassmorphism (부드러운 글래스모피즘 - 날씨 위젯 등에 활용)
- **색상 팔레트 (Color Palette):** Warm & Nature-inspired (따뜻한 자연의 색상 - Sage Green, Soft Beige, Warm Peach), High-contrast text (고대비 텍스트로 가독성 확보)
- **사용자 경험 (UX):** Senior-friendly (시니어 친화적), Large typography (큰 타이포그래피), AAA accessibility (웹 접근성 준수)

# 2. UI/UX 디자인 원칙 (Accessibility & Guidelines)
- **Typography:** 
  - 기본 폰트 18px 이상 유지.
  - GNB(상단바)에 [A A A] 버튼 배치 (클릭 시 전역 폰트 크기 1x, 1.2x, 1.5x 가변).
- **Visuals:** 
  - 버튼 및 인터랙션 요소 최소 44x44px 확보.
  - 높은 대비(High Contrast)의 테두리와 명확한 아이콘 사용.
- **Components:** 
  - 복잡한 페이지 이동 대신 레이어 팝업(유튜브) 및 스켈레톤 UI(로딩) 활용.

# 3. 페이지 구성 (Page Structure)
웹 사이트는 다음의 페이지들로 구성됩니다:
- **메인 페이지**
- **게시글 페이지** (레시피, 운동, 라이프)
- **게시글 상세페이지**
- **상품 전체 보기 페이지**
- **상품 상세보기 페이지**
- **로그인 / 회원가입 페이지**
- **장바구니 페이지** (로그인 유저 전용)

# 4. 상단 네비게이션 바 (GNB) 구성
상단바(GNB)에는 접근성과 사용성을 고려하여 다음의 메뉴와 기능이 포함됩니다:
- **주요 메뉴:** 홈, 레시피, 운동, 라이프
- **유저 기능:** 장바구니, 로그인
- **접근성 기능:** [A A A] 글자 크기 조절 버튼 (전역 폰트 크기 변경)
