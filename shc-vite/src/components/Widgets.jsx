import './Widgets.css';

/**
 * AirQualityWidget - 미세먼지 위젯 (Glassmorphism)
 */
export function AirQualityWidget() {
  return (
    <div className="widget widget--green">
      <div className="widget__title">미세먼지 현황</div>
      <div className="widget__main-row">
        <div className="widget__value">보통</div>
        <span className="widget__icon">😐</span>
      </div>
      <div className="widget__grid">
        <div className="widget__cell">
          <div className="widget__cell-label">PM2.5</div>
          <div className="widget__cell-value">18<span className="widget__unit">㎍/㎥</span></div>
        </div>
        <div className="widget__cell">
          <div className="widget__cell-label">PM10</div>
          <div className="widget__cell-value">35<span className="widget__unit">㎍/㎥</span></div>
        </div>
      </div>
    </div>
  );
}

/**
 * WeatherWidget - 날씨 위젯 (Glassmorphism)
 */
export function WeatherWidget() {
  return (
    <div className="widget widget--blue">
      <div className="widget__title">현재 날씨 · 서울</div>
      <div className="widget__main-row">
        <div className="widget__temp">18°</div>
        <span className="widget__icon widget__icon--lg">☀️</span>
      </div>
      <div className="widget__condition">맑음</div>
      <div className="widget__grid">
        <div className="widget__cell">
          <div className="widget__cell-label">체감온도</div>
          <div className="widget__cell-value">16°</div>
        </div>
        <div className="widget__cell">
          <div className="widget__cell-label">습도</div>
          <div className="widget__cell-value">45%</div>
        </div>
      </div>
    </div>
  );
}
