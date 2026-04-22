import { useState } from 'react';
import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import { products, fmt } from '../data/index.js';
import './ProductDetailPage.css';

export default function ProductDetailPage({ params, navigate, isLoggedIn }) {
  const product = products.find(p => p.id === params?.productId) || products[0];
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pd-page">
      <Header page="products" navigate={navigate} isLoggedIn={isLoggedIn} cartCount={2} />

      <div className="pd-container">
        <button onClick={() => navigate('products')} className="pd-back-btn">
          ← 상품 목록으로
        </button>

        <div className="pd-card">
          {/* 이미지 */}
          <div className="pd-image-box" style={{ background: `${product.color}12` }}>
            {product.emoji}
          </div>

          {/* 상품 정보 */}
          <div className="pd-info-box">
            <div className="pd-category">{product.category}</div>
            <h1 className="pd-title">{product.name}</h1>

            {product.tag && <div className="pd-tag-wrapper"><Badge text={product.tag} variant={product.tag === '베스트' || product.tag === '인기' ? 'peach' : 'sage'} /></div>}

            <p className="pd-desc">
              {product.desc || '시니어를 위한 맞춤 건강기능식품입니다.'}
            </p>

            <div className="pd-price">{fmt(product.price)}</div>

            {/* 수량 */}
            <div className="pd-qty-wrapper">
              <span className="pd-qty-label">수량</span>
              <div className="pd-qty-controls">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="pd-qty-btn">−</button>
                <span className="pd-qty-value">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="pd-qty-btn">+</button>
              </div>
              <span className="pd-total-price">총 {fmt(product.price * qty)}</span>
            </div>

            {/* 버튼 */}
            <div className="pd-action-wrapper">
              <button onClick={() => navigate('cart')} className="pd-buy-btn">
                바로 구매
              </button>
              <button
                onClick={handleAddCart}
                className="pd-cart-btn"
                style={{ background: added ? '#e8f0e9' : '#fff' }}
              >
                {added ? '✓ 담겼어요!' : '장바구니'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
