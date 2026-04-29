import { useState, useContext } from 'react';
import { ProductContext } from '../components/ProductContext.jsx';
import { CartContext } from '../components/CartContext.jsx';
import Badge from '../components/Badge.jsx';
import './ProductDetailPage.css';

export default function ProductDetailPage({ navigate, product, from, fromPostId }) {
  const { getStock, decreaseStock } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [selectedQty, setSelectedQty] = useState(1);

  // 실시간 재고 상태 가져오기
  const currentStock = getStock(product.id);
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // 수량 조절 함수
  const handleQtyChange = (amount) => {
    const newQty = selectedQty + amount;
    if (newQty < 1) return;
    if (newQty > currentStock) {
      alert(`현재 주문 가능한 최대 수량은 ${currentStock}개입니다.`);
      return;
    }
    setSelectedQty(newQty);
  };

  // 바로 구매 함수
  const handleBuyNow = () => {
    if (isOutOfStock) return;
    navigate('CheckoutPage', {
      orderItems: [{ ...product, quantity: selectedQty }],
      fromCart: false,
    });
  };

  return (
    <div className="pd-page">
      <div className="pd-container">
        <button className="pd-back-btn" onClick={() => {
          if (from === "BoardDetailPage") {
            navigate("BoardDetailPage", { postId: fromPostId });
          } else if (from === "MainPage") {
            navigate("MainPage");
          } else if (from === "HealthRecommendPage") {
            navigate("HealthRecommendPage");
          } else {
            navigate("ProductListPage");
          }
        }}>
          {from === "BoardDetailPage" ? "← 게시글로 돌아가기" : from === "MainPage" ? "← 메인으로" : from === "HealthRecommendPage" ? "← 추천 결과로 돌아가기" : "← 상품 목록으로"}
        </button>

        <div className="pd-card">
          <div className="pd-image-box">
            <img src={product.image} alt={product.title} />
          </div>

          <div className="pd-info-box">
            <div className="pd-category">{product.keyword.join(", ")}</div>
            <h1 className="pd-title">{product.title}</h1>

            {/* <div className="pd-tag-wrapper"><Badge /></div> */}

            <p className="pd-desc">{product.description}</p>
            <div className="pd-price">{product.price.toLocaleString()}원</div>

            {/* 수량 및 재고 알림 */}
            <div className="pd-qty-wrapper">
              <span className="pd-qty-label">수량</span>
              <div className="pd-qty-controls">
                <button
                  className="pd-qty-btn"
                  onClick={() => handleQtyChange(-1)}
                  disabled={isOutOfStock}
                >−</button>
                <span className="pd-qty-value">{isOutOfStock ? 0 : selectedQty}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => handleQtyChange(1)}
                  disabled={isOutOfStock}
                >+</button>
              </div>
              <span className="pd-total-price">
                총 {(product.price * (isOutOfStock ? 0 : selectedQty)).toLocaleString()}원
              </span>
            </div>

            {/* 재고 경고 메시지 */}
            <div className="pd-stock-status">
              {isOutOfStock ? (
                <span className="stock-alert stock-alert--error">⚠️ 현재 품절된 상품입니다.</span>
              ) : isLowStock ? (
                <span className="stock-alert stock-alert--warn">⚠️ 품절 임박! 현재 {currentStock}개 남았습니다.</span>
              ) : null}
            </div>

            {/* 버튼 */}
            <div className="pd-action-wrapper">
              <button
                className={`pd-buy-btn ${isOutOfStock ? 'btn-disabled' : ''}`}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? '품절' : '바로 구매'}
              </button>
              <button className="pd-cart-btn" onClick={() => {
                addToCart(product, selectedQty);
                navigate("CartPage");
              }}>
                장바구니
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
