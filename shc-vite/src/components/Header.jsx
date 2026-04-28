import './Header.css';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext.jsx';
import { UserContext } from './UserContext.jsx';
import { useFontSize } from './FontSizeContext.jsx';

const WEATHER_OPTIONS = [
  { code: '01d', label: '☀️ 맑음' },
  { code: '02d', label: '🌤 구름 조금' },
  { code: '04d', label: '☁️ 흐림' },
  { code: '10d', label: '🌧 비' },
  { code: '11d', label: '⛈ 천둥번개' },
  { code: '13d', label: '🌨 눈' },
  { code: '50d', label: '🌫 안개' },
];

function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const tick = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return {
    hours: String(time.getHours()).padStart(2, '0'),
    minutes: String(time.getMinutes()).padStart(2, '0')
  };
}

export default function Header({ isLogin, logout, page, category, navigate, weatherIcon, onWeatherChange }) {
  const { cartCount } = useContext(CartContext);
  const { currentUser } = useContext(UserContext);
  const { fontScale, setFontScale } = useFontSize();
  const time = useClock();
  const navClassName = (target) => {
    let isActive = false;
    if (page == "MainPage") isActive = (target == "MainPage")
    else if (page == "ProductListPage") isActive = (target == "ProductListPage")
    else if (page == "HealthRecommendPage") isActive = (target == "HealthRecommendPage")
    else if (page == "AlarmPage") isActive = (target == "AlarmPage")
    else if (page == "BoardListPage") isActive = (category == target);
    return isActive ? "header__nav-item header__nav-item--active" : "header__nav-item"
  }

  return (
    <header className="header">
      {/* 상단 타이틀 행 */}
      <div className="header__top">
        <button className="header__logo" onClick={() => { navigate("MainPage") }}>
          <span className="header__logo-icon">🌿</span>
          <div>
            <div className="header__logo-name">시니어헬스케어</div>
            <div className="header__logo-sub">건강한 노후를 위한 가장 쉬운 방법</div>
          </div>
        </button>

        <div className="header__right">
          <div className="header__font-ctrl">
            <button
              className={`header__font-btn${fontScale === 'small' ? ' header__font-btn--active' : ''}`}
              onClick={() => setFontScale('small')}
            >작게</button>
            <button
              className={`header__font-btn${fontScale === 'default' ? ' header__font-btn--active' : ''}`}
              onClick={() => setFontScale('default')}
            >기본</button>
            <button
              className={`header__font-btn${fontScale === 'large' ? ' header__font-btn--active' : ''}`}
              onClick={() => setFontScale('large')}
            >크게</button>
          </div>

          <div className="header__auth">
            {isLogin && <>
              <span className="header__username">{currentUser?.name}님</span>
              <button className="btn btn--ghost header__cart-btn" onClick={() => { navigate("CartPage") }}>
                🛒 장바구니
                {cartCount > 0 && <span className="header__cart-badge">{cartCount}</span>}
              </button>
              <button className="btn btn--subtle" onClick={logout}>로그아웃</button>
            </>}
            {!isLogin && <>
              <button className="btn btn--primary" onClick={() => { navigate("LoginPage") }}>로그인</button>
              <button className="btn btn--outline" onClick={() => { navigate("RegisterPage") }}>회원가입</button>
            </>}
          </div>
        </div>
      </div>

      {/* 내비게이션 탭 + 시계 */}
      <nav className="header__nav">
        <button className={navClassName("MainPage")} onClick={() => { navigate("MainPage") }}>홈</button>
        <button className={navClassName("recipe")} onClick={() => { navigate("BoardListPage", { category: "recipe" }) }}>레시피</button>
        <button className={navClassName("life")} onClick={() => { navigate("BoardListPage", { category: "life" }) }}>라이프</button>
        <button className={navClassName("exercise")} onClick={() => { navigate("BoardListPage", { category: "exercise" }) }}>운동</button>
        <button className={navClassName("ProductListPage")} onClick={() => { navigate("ProductListPage") }}>상품</button>
        <button className={`${navClassName("HealthRecommendPage")} header__nav-item--ai`} onClick={() => { navigate("HealthRecommendPage") }}>AI 건강추천</button>
        {isLogin && (
          <button className={`${navClassName("AlarmPage")} header__nav-item--alarm`} onClick={() => { navigate("AlarmPage") }}>🔔 건강 알리미</button>
        )}

        {/* 메인 페이지에서만 날씨 배경 선택 드롭다운 표시 */}
        {page === "MainPage" && (
          <select
            className="header__weather-select"
            value={weatherIcon}
            onChange={e => onWeatherChange(e.target.value)}
          >
            {WEATHER_OPTIONS.map(o => (
              <option key={o.code} value={o.code}>{o.label}</option>
            ))}
          </select>
        )}

        <span className="header__clock">
          <span className="header__clock-label">현재 시간</span>
          <span className="header__clock-time">
            {time.hours}<span className="header__clock-colon">:</span>{time.minutes}
          </span>
        </span>
      </nav>
    </header >
  );
}
