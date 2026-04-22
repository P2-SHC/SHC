import './Widgets.css';

/**
 * AirQualityWidget - 미세먼지 위젯 (Glassmorphism)
 * @prop {string} level  - 등급 (좋음·보통·나쁨·매우나쁨)
 * @prop {number} pm25
 * @prop {number} pm10
 */
export function AirQualityWidget({ level = '보통', pm25 = 18, pm10 = 35 }) {
  const emoji = { 좋음: '😊', 보통: '😐', 나쁨: '😷', '매우나쁨': '⚠️' }[level] ?? '😐';
  return (
    <div className="widget widget--green">
      <div className="widget__title">미세먼지 현황</div>
      <div className="widget__main-row">
        <div className="widget__value">{level}</div>
        <span className="widget__icon">{emoji}</span>
      </div>
      <div className="widget__grid">
        <div className="widget__cell">
          <div className="widget__cell-label">PM2.5</div>
          <div className="widget__cell-value">{pm25}<span className="widget__unit">㎍/㎥</span></div>
        </div>
        <div className="widget__cell">
          <div className="widget__cell-label">PM10</div>
          <div className="widget__cell-value">{pm10}<span className="widget__unit">㎍/㎥</span></div>
        </div>
      </div>
    </div>
  );
}

/**
 * WeatherWidget - 날씨 위젯 (Glassmorphism)
 * @prop {number} temp
 * @prop {string} condition
 * @prop {number} feelsLike
 * @prop {number} humidity
 * @prop {string} location
 * @prop {string} icon
 */
export function WeatherWidget({
  temp = 18, condition = '맑음', feelsLike = 16,
  humidity = 45, location = '서울', icon = '☀️',
}) {
  return (
    <div className="widget widget--blue">
      <div className="widget__title">현재 날씨 · {location}</div>
      <div className="widget__main-row">
        <div className="widget__temp">{temp}°</div>
        <span className="widget__icon widget__icon--lg">{icon}</span>
      </div>
      <div className="widget__condition">{condition}</div>
      <div className="widget__grid">
        <div className="widget__cell">
          <div className="widget__cell-label">체감온도</div>
          <div className="widget__cell-value">{feelsLike}°</div>
        </div>
        <div className="widget__cell">
          <div className="widget__cell-label">습도</div>
          <div className="widget__cell-value">{humidity}%</div>
        </div>
      </div>
    </div>
  );
}
