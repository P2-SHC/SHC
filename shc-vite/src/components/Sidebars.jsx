import { AirQualityWidget } from './Widgets.jsx';
import { WeatherWidget } from './Widgets.jsx';
import './Sidebars.css';

/**
 * MiniProductCard - 사이드바용 소형 상품 카드
 * @prop {{ id, name, price, color, emoji }} product
 * @prop {Function} onClick
 */
function MiniProductCard({ product, onClick }) {
  const fmt = (n) => Number(n).toLocaleString('ko-KR') + '원';
  return (
    <button className="mini-product-card" onClick={onClick}>
      <div className="mini-product-card__img" style={{ background: `${product.color}20` }}>
        {product.emoji}
      </div>
      <div className="mini-product-card__info">
        <div className="mini-product-card__name">{product.name}</div>
        <div className="mini-product-card__price">{fmt(product.price)}</div>
      </div>
    </button>
  );
}

/**
 * LeftSidebar - 좌측 사이드바 (미세먼지 + 추천 상품)
 * @prop {Array}    products    - 상품 목록 (최대 3개)
 * @prop {Function} onProductClick - (product) => void
 */
export function LeftSidebar({ products = [], onProductClick }) {
  return (
    <aside className="sidebar sidebar--left">
      <AirQualityWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          {products.map(p => (
            <MiniProductCard key={p.id} product={p} onClick={() => onProductClick?.(p)} />
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * RightSidebar - 우측 사이드바 (날씨 + 추천 상품)
 * @prop {Array}    products    - 상품 목록 (최대 3개)
 * @prop {Function} onProductClick - (product) => void
 */
export function RightSidebar({ products = [], onProductClick }) {
  return (
    <aside className="sidebar sidebar--right">
      <WeatherWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          {products.map(p => (
            <MiniProductCard key={p.id} product={p} onClick={() => onProductClick?.(p)} />
          ))}
        </div>
      </div>
    </aside>
  );
}
