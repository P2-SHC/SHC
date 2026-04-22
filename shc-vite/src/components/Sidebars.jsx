import { AirQualityWidget } from './Widgets.jsx';
import { WeatherWidget } from './Widgets.jsx';
import './Sidebars.css';

function MiniProductCard() {
  return (
    <button className="mini-product-card">
      <div className="mini-product-card__img">
        💊
      </div>
      <div className="mini-product-card__info">
        <div className="mini-product-card__name">건강상품</div>
        <div className="mini-product-card__price">50,000원</div>
      </div>
    </button>
  );
}

export function LeftSidebar() {
  return (
    <aside className="sidebar sidebar--left">
      <AirQualityWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          <MiniProductCard />
          <MiniProductCard />
          <MiniProductCard />
        </div>
      </div>
    </aside>
  );
}

export function RightSidebar() {
  return (
    <aside className="sidebar sidebar--right">
      <WeatherWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          <MiniProductCard />
          <MiniProductCard />
          <MiniProductCard />
        </div>
      </div>
    </aside>
  );
}
