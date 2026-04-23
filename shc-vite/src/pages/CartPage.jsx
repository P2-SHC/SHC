import './CartPage.css';

export default function CartPage() {
  return (
    <div className="cart-page">

      <div className="cart-container">
        <h1 className="cart-title">장바구니</h1>

        <div className="cart-list">
          <div className="cart-item">
            <input type="checkbox" checked className="cart-item-checkbox" readOnly />
            <div className="cart-item-img">
              🍃
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">프리미엄 홍삼정 골드</div>
              <div className="cart-item-price">89,000원</div>
            </div>
            <div className="cart-qty-controls">
              <button className="cart-qty-btn">−</button>
              <span className="cart-qty-value">1</span>
              <button className="cart-qty-btn">+</button>
            </div>
            <div className="cart-item-total">89,000원</div>
            <button className="cart-item-remove">✕</button>
          </div>
        </div>

        {/* 합계 + 주문 */}
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span className="cart-summary-label">선택 상품 합계</span>
            <span className="cart-summary-total">89,000원</span>
          </div>
          <button className="cart-submit-btn">
            89,000원 주문하기
          </button>
        </div>
      </div>
    </div>
  );
}
