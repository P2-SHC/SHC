import Header from '../components/Header.jsx';
import { LeftSidebar, RightSidebar } from '../components/Sidebars.jsx';
import Badge from '../components/Badge.jsx';
import './MainPage.css';

/**
 * MainPage - 메인 페이지 (SHC-001)
 * @prop {boolean}  isLoggedIn
 * @prop {Array}    recentPosts      - 최신 게시글 목록
 * @prop {Array}    recommendProducts - 추천 상품 (3개)
 * @prop {Array}    leftProducts     - 좌측 사이드바 상품 (3개)
 * @prop {Array}    rightProducts    - 우측 사이드바 상품 (3개)
 * @prop {Function} onNavClick
 * @prop {Function} onLogin / onRegister / onLogout / onCart
 * @prop {Function} onPostClick      - (post) => void
 * @prop {Function} onProductClick   - (product) => void
 */
export default function MainPage({
  isLoggedIn = false,
  recentPosts = MOCK_POSTS,
  recommendProducts = MOCK_PRODUCTS.slice(0, 3),
  leftProducts  = MOCK_PRODUCTS.slice(0, 3),
  rightProducts = MOCK_PRODUCTS.slice(6, 9),
  onNavClick,
  onLogin, onRegister, onLogout, onCart,
  onPostClick,
  onProductClick,
}) {
  const fmt = (n) => Number(n).toLocaleString('ko-KR') + '원';

  return (
    <div className="page">
      <Header
        activePage="main"
        isLoggedIn={isLoggedIn}
        cartCount={2}
        onNavClick={onNavClick}
        onLogin={onLogin}
        onRegister={onRegister}
        onLogout={onLogout}
        onCart={onCart}
      />

      <div className="container main-layout">
        <LeftSidebar products={leftProducts} onProductClick={onProductClick} />

        <main className="main-content">
          {/* ⑥ 건강 이미지 영역 */}
          <div className="health-image-area">
            <svg className="health-image-area__svg" width="120" height="90" viewBox="0 0 120 90" fill="none">
              <rect x="2" y="2" width="116" height="86" rx="12" fill="#e8f0e9" stroke="#7ab87e" strokeWidth="1.5" strokeDasharray="5 3"/>
              <circle cx="38" cy="34" r="14" fill="#7ab87e" fillOpacity="0.3"/>
              <circle cx="38" cy="34" r="8"  fill="#4a7a50" fillOpacity="0.5"/>
              <path d="M18 68 Q38 42 56 57 Q74 42 102 68" stroke="#4a7a50" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <rect x="62" y="18" width="46" height="9"  rx="4.5" fill="#4a7a50" fillOpacity="0.22"/>
              <rect x="62" y="34" width="34" height="7"  rx="3.5" fill="#4a7a50" fillOpacity="0.16"/>
              <rect x="62" y="47" width="40" height="7"  rx="3.5" fill="#4a7a50" fillOpacity="0.16"/>
              <circle cx="91" cy="73" r="9" fill="#e8956d" fillOpacity="0.22"/>
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
              {recentPosts.map((post) => (
                <button
                  key={`${post.category}-${post.id}`}
                  className="post-card"
                  onClick={() => onPostClick?.(post)}
                >
                  <div className="post-card__img">{post.icon ?? '🌿'}</div>
                  <div className="post-card__body">
                    <div className="post-card__badges">
                      <Badge text={post.categoryLabel} variant="sage" />
                      {post.tag && <Badge text={post.tag} variant="peach" />}
                    </div>
                    <p className="post-card__title">{post.title}</p>
                    <p className="post-card__meta">{post.date} · 조회 {Number(post.views).toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 추천 상품 */}
          <section className="main-section">
            <div className="main-section__header">
              <h2 className="main-section__title">추천 건강상품</h2>
              <button className="main-section__more" onClick={() => onNavClick?.('products')}>전체 보기 →</button>
            </div>
            <div className="product-grid product-grid--3">
              {recommendProducts.map((p) => (
                <button key={p.id} className="product-card" onClick={() => onProductClick?.(p)}>
                  <div className="product-card__img" style={{ background: `${p.color}15` }}>{p.emoji}</div>
                  <p className="product-card__name">{p.name}</p>
                  <div className="product-card__footer">
                    <span className="product-card__price">{fmt(p.price)}</span>
                    {p.tag && <Badge text={p.tag} variant={['베스트','인기'].includes(p.tag) ? 'peach' : 'sage'} />}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>

        <RightSidebar products={rightProducts} onProductClick={onProductClick} />
      </div>
    </div>
  );
}

/* ── 목업 데이터 (개발 시 props로 교체) ── */
const MOCK_PRODUCTS = [
  { id:1, name:'프리미엄 홍삼정 골드',   price:89000, color:'#c17f5a', emoji:'🍃', tag:'베스트' },
  { id:2, name:'관절 영양제 MSM 플러스', price:45000, color:'#7a9e7e', emoji:'💪', tag:'추천'  },
  { id:3, name:'루테인 눈 영양제',        price:32000, color:'#e8c06d', emoji:'👁️', tag:''     },
  { id:7, name:'유산균 장 건강',          price:42000, color:'#7a9e7e', emoji:'🌿', tag:''     },
  { id:8, name:'오메가3 혈행 개선',       price:36000, color:'#5a8fc9', emoji:'🐟', tag:'추천' },
  { id:9, name:'프로바이오틱스 12종',     price:55000, color:'#c9a85a', emoji:'💊', tag:''     },
];
const MOCK_POSTS = [
  { id:1, category:'recipe',    categoryLabel:'레시피', icon:'🥗', title:'혈압에 좋은 바나나 스무디 만들기',    date:'2025.04.15', views:1240, tag:'혈압관리' },
  { id:1, category:'lifestyle', categoryLabel:'라이프', icon:'🌸', title:'봄철 건강 관리 10가지 방법',          date:'2025.04.14', views:3200, tag:'계절건강' },
  { id:1, category:'exercise',  categoryLabel:'운동',   icon:'🏃', title:'무릎 통증 없는 실내 스트레칭 5가지', date:'2025.04.16', views:5200, tag:'스트레칭' },
];
