import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import './ProductListPage.css';

/**
 * ProductListPage - 상품 전체보기 (SHC-004)
 */
export default function ProductListPage() {
  return (
    <div className="page">
      <Header />

      <div className="container--md">
        <div className="product-list-header">
          <span className="product-list-header__icon">💊</span>
          <div>
            <h1 className="product-list-header__title">건강상품</h1>
            <p className="product-list-header__desc">시니어를 위한 맞춤 건강기능식품</p>
          </div>
        </div>

        <div className="product-grid product-grid--3 product-grid--gap-lg">
          <button className="product-list-card">
            <div className="product-list-card__img">🍃</div>
            <p className="product-list-card__category">건강기능식품</p>
            <p className="product-list-card__name">프리미엄 홍삼정 골드</p>
            <div className="product-list-card__footer">
              <span className="product-list-card__price">89,000원</span>
              <Badge />
            </div>
          </button>
          <button className="product-list-card">
            <div className="product-list-card__img">💪</div>
            <p className="product-list-card__category">관절건강</p>
            <p className="product-list-card__name">관절 영양제 MSM 플러스</p>
            <div className="product-list-card__footer">
              <span className="product-list-card__price">45,000원</span>
              <Badge />
            </div>
          </button>
        </div>

        <div className="product-list-more">
          <button className="btn btn--outline btn--lg">상품 더보기</button>
        </div>
      </div>
    </div>
  );
}
