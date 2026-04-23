import Badge from '../components/Badge.jsx';
import './ProductDetailPage.css';

export default function ProductDetailPage({ navigate }) {
  return (
    <div className="pd-page">

      <div className="pd-container">
        <button className="pd-back-btn" onClick={() => { navigate("ProductListPage") }}>
          ← 상품 목록으로
        </button>

        <div className="pd-card">
          {/* 이미지 */}
          <div className="pd-image-box">
            🍃
          </div>

          {/* 상품 정보 */}
          <div className="pd-info-box">
            <div className="pd-category">건강기능식품</div>
            <h1 className="pd-title">프리미엄 홍삼정 골드</h1>

            <div className="pd-tag-wrapper"><Badge /></div>

            <p className="pd-desc">
              시니어를 위한 맞춤 건강기능식품입니다.
            </p>

            <div className="pd-price">89,000원</div>

            {/* 수량 */}
            <div className="pd-qty-wrapper">
              <span className="pd-qty-label">수량</span>
              <div className="pd-qty-controls">
                <button className="pd-qty-btn">−</button>
                <span className="pd-qty-value">1</span>
                <button className="pd-qty-btn">+</button>
              </div>
              <span className="pd-total-price">총 89,000원</span>
            </div>

            {/* 버튼 */}
            <div className="pd-action-wrapper">
              <button className="pd-buy-btn">
                바로 구매
              </button>
              <button className="pd-cart-btn" onClick={() => { navigate("CartPage") }}>
                장바구니
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
