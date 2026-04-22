import { useState } from 'react';
import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import { products, fmt } from '../data/index.js';

export default function ProductDetailPage({ params, navigate, isLoggedIn }) {
  const product = products.find(p => p.id === params?.productId) || products[0];
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ec' }}>
      <Header page="products" navigate={navigate} isLoggedIn={isLoggedIn} cartCount={2} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
        <button onClick={() => navigate('products')} style={{ background: 'none', border: 'none', color: '#4a7a50', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
          ← 상품 목록으로
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, background: '#fff', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          {/* 이미지 */}
          <div style={{ borderRadius: 18, background: `${product.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, fontSize: 100 }}>
            {product.emoji}
          </div>

          {/* 상품 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
            <div style={{ fontSize: 12, color: '#aaa', fontWeight: 500, marginBottom: 8 }}>{product.category}</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#2a2a2a', lineHeight: 1.3, marginBottom: 14 }}>{product.name}</h1>

            {product.tag && <div style={{ marginBottom: 14 }}><Badge text={product.tag} variant={product.tag === '베스트' || product.tag === '인기' ? 'peach' : 'sage'} /></div>}

            <p style={{ fontSize: 16, color: '#5a5a5a', lineHeight: 1.8, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0ece4' }}>
              {product.desc || '시니어를 위한 맞춤 건강기능식품입니다.'}
            </p>

            <div style={{ fontSize: 32, fontWeight: 900, color: '#4a7a50', marginBottom: 22 }}>{fmt(product.price)}</div>

            {/* 수량 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: '#2a2a2a' }}>수량</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f7f3ec', borderRadius: 12, padding: '4px 8px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', border: '1px solid #ddd', fontSize: 20, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', border: '1px solid #ddd', fontSize: 20, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <span style={{ fontSize: 15, color: '#8a8a7a' }}>총 {fmt(product.price * qty)}</span>
            </div>

            {/* 버튼 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button onClick={() => navigate('cart')} style={{ padding: 16, background: '#4a7a50', color: '#fff', border: 'none', borderRadius: 14, fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>
                바로 구매
              </button>
              <button
                onClick={handleAddCart}
                style={{ padding: 16, background: added ? '#e8f0e9' : '#fff', color: '#4a7a50', border: '2px solid #4a7a50', borderRadius: 14, fontSize: 18, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
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
