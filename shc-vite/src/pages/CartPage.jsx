import { useState } from 'react';
import Header from '../components/Header.jsx';
import { mockCart, fmt } from '../data/index.js';
import './CartPage.css';

export default function CartPage({ navigate, isLoggedIn }) {
  const [items, setItems] = useState(mockCart);
  const [selected, setSelected] = useState(mockCart.map((_, i) => i));

  const toggleSelect = (idx) => setSelected(s => s.includes(idx) ? s.filter(i => i !== idx) : [...s, idx]);
  const updateQty = (idx, delta) => setItems(its => its.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  const removeItem = (idx) => {
    setItems(its => its.filter((_, i) => i !== idx));
    setSelected(s => s.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
  };
  const total = items.filter((_, i) => selected.includes(i)).reduce((sum, it) => sum + it.product.price * it.qty, 0);

  if (!isLoggedIn) {
    return (
      <div className="cart-page">
        <Header page="" navigate={navigate} isLoggedIn={false} cartCount={0} />
        <div className="cart-login-req">
          <div className="cart-login-icon">🛒</div>
          <div className="cart-login-title">로그인이 필요한 서비스입니다</div>
          <div className="cart-login-desc">장바구니를 이용하려면 로그인해주세요.</div>
          <button onClick={() => navigate('login')} className="cart-login-btn">로그인하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header page="" navigate={navigate} isLoggedIn={isLoggedIn} cartCount={items.length} />

      <div className="cart-container">
        <h1 className="cart-title">장바구니</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <div className="cart-empty-text">장바구니가 비어있습니다</div>
            <button onClick={() => navigate('products')} className="cart-empty-btn">건강상품 보러가기</button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <input type="checkbox" checked={selected.includes(idx)} onChange={() => toggleSelect(idx)} className="cart-item-checkbox" />
                  <div className="cart-item-img" style={{ background: `${item.product.color}15` }}>
                    {item.product.emoji}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-price">{fmt(item.product.price)}</div>
                  </div>
                  <div className="cart-qty-controls">
                    <button onClick={() => updateQty(idx, -1)} className="cart-qty-btn">−</button>
                    <span className="cart-qty-value">{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="cart-qty-btn">+</button>
                  </div>
                  <div className="cart-item-total">{fmt(item.product.price * item.qty)}</div>
                  <button onClick={() => removeItem(idx)} className="cart-item-remove">✕</button>
                </div>
              ))}
            </div>

            {/* 합계 + 주문 */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span className="cart-summary-label">선택 상품 합계</span>
                <span className="cart-summary-total">{fmt(total)}</span>
              </div>
              <button
                onClick={() => alert(`${fmt(total)} 주문이 완료되었습니다! 감사합니다.`)}
                className="cart-submit-btn"
              >
                {fmt(total)} 주문하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
