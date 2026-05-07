import { useState, useContext } from 'react';
import { ProductContext } from '../components/ProductContext.jsx';
import { CartContext } from '../components/CartContext.jsx';
import Badge from '../components/Badge.jsx';
import { useTranslation } from 'react-i18next';
import './ProductDetailPage.css';

export default function ProductDetailPage({ navigate, product, from, fromPostId }) {
  const { t } = useTranslation();
  const { getStock, decreaseStock } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [selectedQty, setSelectedQty] = useState(1);

  if (!product) return <div className="pd-page"><div className="pd-container">{t('product_detail.not_found')}</div></div>;

  // 실시간 재고 상태 가져오기
  const currentStock = getStock(product.id);
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // 수량 조절 함수
  const handleQtyChange = (amount) => {
    const newQty = selectedQty + amount;
    if (newQty < 1) return;
    if (newQty > currentStock) {
      alert(t('product_detail.qty_limit', { count: currentStock }));
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

  const getBackBtnLabel = () => {
    if (from === "BoardDetailPage") return t('product_detail.back_to_board');
    if (from === "MainPage") return t('product_detail.back_to_main');
    if (from === "HealthRecommendPage") return t('product_detail.back_to_rec');
    return t('product_detail.back_to_list');
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
          {getBackBtnLabel()}
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
            <div className="pd-price">{product.price.toLocaleString()}{t('board.currency')}</div>

            {/* 수량 및 재고 알림 */}
            <div className="pd-qty-wrapper">
              <span className="pd-qty-label">{t('product_detail.qty')}</span>
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
                {t('product_detail.total_price')} {(product.price * (isOutOfStock ? 0 : selectedQty)).toLocaleString()}{t('board.currency')}
              </span>
            </div>

            {/* 재고 경고 메시지 */}
            <div className="pd-stock-status">
              {isOutOfStock ? (
                <span className="stock-alert stock-alert--error">{t('product_detail.out_of_stock')}</span>
              ) : isLowStock ? (
                <span className="stock-alert stock-alert--warn">{t('product_detail.low_stock', { count: currentStock })}</span>
              ) : null}
            </div>

            {/* 버튼 */}
            <div className="pd-action-wrapper">
              <button
                className={`pd-buy-btn ${isOutOfStock ? 'btn-disabled' : ''}`}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? t('product_detail.sold_out') : t('product_detail.buy_now')}
              </button>
              <button className="pd-cart-btn" onClick={() => {
                addToCart(product, selectedQty);
                navigate("CartPage", { productId: product.id });
              }}>
                {t('product_detail.add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
