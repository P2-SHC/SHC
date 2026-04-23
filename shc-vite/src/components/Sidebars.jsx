import { AirQualityWidget } from './Widgets.jsx';
import { WeatherWidget } from './Widgets.jsx';
import './Sidebars.css';

function MiniProductCard({ setPage }) {
  return (
    <button className="mini-product-card" onClick={() => { setPage("ProductDetailPage") }}>
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

export function LeftSidebar({ setPage }) {
  return (
    <aside className="sidebar sidebar--left">
      <AirQualityWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          <MiniProductCard setPage={setPage} />
          <MiniProductCard setPage={setPage} />
          <MiniProductCard setPage={setPage} />
        </div>
      </div>
    </aside>
  );
}

export function RightSidebar({ setPage }) {
  return (
    <aside className="sidebar sidebar--right">
      <WeatherWidget />
      <div className="sidebar__section">
        <div className="sidebar__title">추천 건강상품</div>
        <div className="sidebar__product-list">
          <MiniProductCard setPage={setPage} />
          <MiniProductCard setPage={setPage} />
          <MiniProductCard setPage={setPage} />
        </div>
      </div>
    </aside>
  );
}
