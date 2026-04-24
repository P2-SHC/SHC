import { AirQualityWidget } from './Widgets.jsx';
import { WeatherWidget } from './Widgets.jsx';
import './Sidebars.css';

export function MiniProductCard({ navigate, product }) {
  return (
    <button className="mini-product-card" onClick={() => { navigate("ProductDetailPage", "", product.id) }}>
      <div className="mini-product-card__img">
        💊
      </div>
      <div className="mini-product-card__info">
        <div className="mini-product-card__name">{product.title}</div>
        <div className="mini-product-card__price">{product.price.toLocaleString()}원</div>
      </div>
    </button>
  );
}

export function LeftSidebar({ navigate }) {
  return (
    <aside className="sidebar sidebar--left">
      <AirQualityWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          <MiniProductCard navigate={navigate} />
          <MiniProductCard navigate={navigate} />
          <MiniProductCard navigate={navigate} />
        </div>
      </div>
    </aside>
  );
}

export function RightSidebar({ navigate }) {
  return (
    <aside className="sidebar sidebar--right">
      <WeatherWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          <MiniProductCard navigate={navigate} />
          <MiniProductCard navigate={navigate} />
          <MiniProductCard navigate={navigate} />
        </div>
      </div>
    </aside>
  );
}
