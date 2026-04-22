import { useState } from 'react';
import Header from '../components/Header.jsx';
import { mockCart, fmt } from '../data/index.js';

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
      <div style={{ minHeight: '100vh', background: '#f7f3ec' }}>
        <Header page="" navigate={navigate} isLoggedIn={false} cartCount={0} />
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#2a2a2a', marginBottom: 12 }}>로그인이 필요한 서비스입니다</div>
          <div style={{ fontSize: 17, color: '#8a8a7a', marginBottom: 28 }}>장바구니를 이용하려면 로그인해주세요.</div>
          <button onClick={() => navigate('login')} style={{ background: '#4a7a50', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 44px', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>로그인하기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ec' }}>
      <Header page="" navigate={navigate} isLoggedIn={isLoggedIn} cartCount={items.length} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#2a2a2a', marginBottom: 24 }}>장바구니</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <div style={{ fontSize: 20, color: '#8a8a7a', marginBottom: 24 }}>장바구니가 비어있습니다</div>
            <button onClick={() => navigate('products')} style={{ background: '#4a7a50', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 36px', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>건강상품 보러가기</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, background: '#fff', borderRadius: 16, padding: '18px 20px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <input type="checkbox" checked={selected.includes(idx)} onChange={() => toggleSelect(idx)} style={{ width: 22, height: 22, cursor: 'pointer', accentColor: '#4a7a50' }} />
                  <div style={{ width: 68, height: 68, borderRadius: 12, background: `${item.product.color}15`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                    {item.product.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#2a2a2a', marginBottom: 4 }}>{item.product.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#4a7a50' }}>{fmt(item.product.price)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQty(idx, -1)} style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f7f1', border: '1px solid #ccc', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f7f1', border: '1px solid #ccc', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, minWidth: 96, textAlign: 'right' }}>{fmt(item.product.price * item.qty)}</div>
                  <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 20, cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>

            {/* 합계 + 주문 */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 17, color: '#5a5a5a' }}>선택 상품 합계</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#4a7a50' }}>{fmt(total)}</span>
              </div>
              <button
                onClick={() => alert(`${fmt(total)} 주문이 완료되었습니다! 감사합니다.`)}
                style={{ width: '100%', padding: 18, background: '#4a7a50', color: '#fff', border: 'none', borderRadius: 14, fontSize: 19, fontWeight: 800, cursor: 'pointer' }}
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
