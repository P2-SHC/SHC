import Header from '../components/Header.jsx';
import { LeftSidebar, RightSidebar } from '../components/Sidebars.jsx';
import Badge from '../components/Badge.jsx';
import './MainPage.css';

/**
 * MainPage - 메인 페이지 (SHC-001)
 */
export default function MainPage({ setPage }) {
  return (
    <div className="page">
      <Header setPage={setPage} />

      <div className="container main-layout">
        <LeftSidebar setPage={setPage} />

        <main className="main-content">
          {/* 건강 이미지 영역 */}
          <div className="health-image-area">
            <svg className="health-image-area__svg" width="120" height="90" viewBox="0 0 120 90" fill="none">
              <rect x="2" y="2" width="116" height="86" rx="12" fill="#e8f0e9" stroke="#7ab87e" strokeWidth="1.5" strokeDasharray="5 3" />
              <circle cx="38" cy="34" r="14" fill="#7ab87e" fillOpacity="0.3" />
              <circle cx="38" cy="34" r="8" fill="#4a7a50" fillOpacity="0.5" />
              <path d="M18 68 Q38 42 56 57 Q74 42 102 68" stroke="#4a7a50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <rect x="62" y="18" width="46" height="9" rx="4.5" fill="#4a7a50" fillOpacity="0.22" />
              <rect x="62" y="34" width="34" height="7" rx="3.5" fill="#4a7a50" fillOpacity="0.16" />
              <rect x="62" y="47" width="40" height="7" rx="3.5" fill="#4a7a50" fillOpacity="0.16" />
              <circle cx="91" cy="73" r="9" fill="#e8956d" fillOpacity="0.22" />
            </svg>
            <div className="health-image-area__text">
              <p className="health-image-area__title">건강 이미지 영역</p>
              <p className="health-image-area__desc">
                시니어 건강 관련 대표 이미지를 삽입하세요<br />
                <code>권장 사이즈: 820 × 220px · WebP</code>
              </p>
            </div>
          </div>

          {/* 최신 건강 정보 */}
          <section className="main-section">
            <h2 className="main-section__title">최신 건강 정보</h2>
            <div className="post-list">
              <button className="post-card" onClick={() => { setPage("BoardDetailPage") }}>
                <div className="post-card__img">🥗</div>
                <div className="post-card__body">
                  <div className="post-card__badges">
                    <Badge />
                    <Badge />
                  </div>
                  <p className="post-card__title">혈압에 좋은 바나나 스무디 만들기</p>
                  <p className="post-card__meta">2025.04.15 · 조회 1,240</p>
                </div>
              </button>
            </div>
          </section>

          {/* 추천 상품 */}
          <section className="main-section">
            <div className="main-section__header">
              <h2 className="main-section__title">추천 건강상품</h2>
              <button className="main-section__more" onClick={() => { setPage("ProductListPage") }}>전체 보기 →</button>
            </div>
            <div className="product-grid product-grid--3">
              <button className="product-card" onClick={() => { setPage("ProductDetailPage") }}>
                <div className="product-card__img">🍃</div>
                <p className="product-card__name">프리미엄 홍삼정 골드</p>
                <div className="product-card__footer">
                  <span className="product-card__price">89,000원</span>
                  <Badge />
                </div>
              </button>
            </div>
          </section>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
