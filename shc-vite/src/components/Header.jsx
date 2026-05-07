import './Header.css';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext.jsx';
import { UserContext } from './UserContext.jsx';
import { useFontSize } from './FontSizeContext.jsx';
import { useTranslation } from 'react-i18next';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useClock();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // 페이지 이동 시 메뉴 닫기
  const handleNavigate = (targetPage, params) => {
    navigate(targetPage, params);
    setMenuOpen(false);
  };

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
    <header className={`header ${menuOpen ? 'header--menu-open' : ''}`}>
      {/* 상단 타이틀 행 */}
      <div className="header__top">
        <button className="header__logo" onClick={() => { handleNavigate("MainPage") }}>
          <span className="header__logo-icon">🌿</span>
          <div>
            <div className="header__logo-name">{t('header.logo_name')}</div>
            <div className="header__logo-sub">{t('header.logo_sub')}</div>
          </div>
        </button>

        <div className="header__right">
          <div className="header__font-ctrl">
            <button
              className={`header__font-btn${fontScale === 'small' ? ' header__font-btn--active' : ''}`}
              onClick={() => setFontScale('small')}
            >{t('header.font_small')}</button>
            <button
              className={`header__font-btn${fontScale === 'default' ? ' header__font-btn--active' : ''}`}
              onClick={() => setFontScale('default')}
            >{t('header.font_default')}</button>
            <button
              className={`header__font-btn${fontScale === 'large' ? ' header__font-btn--active' : ''}`}
              onClick={() => setFontScale('large')}
            >{t('header.font_large')}</button>
          </div>

          <div className="header__lang-ctrl">
            <button
              className={`header__lang-btn${i18n.language === 'ko' ? ' header__lang-btn--active' : ''}`}
              onClick={() => changeLanguage('ko')}
            >KO</button>
            <button
              className={`header__lang-btn${i18n.language === 'en' ? ' header__lang-btn--active' : ''}`}
              onClick={() => changeLanguage('en')}
            >EN</button>
            <button
              className={`header__lang-btn${i18n.language === 'ja' ? ' header__lang-btn--active' : ''}`}
              onClick={() => changeLanguage('ja')}
            >JA</button>
          </div>

          <div className="header__auth header__auth--desktop">
            {isLogin && <>
              <span className="header__username">{currentUser?.name}{t('header.user_suffix')}</span>
              <button className="btn btn--ghost header__cart-btn" onClick={() => { handleNavigate("CartPage") }}>
                🛒 {t('header.cart')}
                {cartCount > 0 && <span className="header__cart-badge">{cartCount}</span>}
              </button>
              <button className="btn btn--subtle" onClick={logout}>{t('header.logout')}</button>
            </>}
            {!isLogin && <>
              <button className="btn btn--primary" onClick={() => { handleNavigate("LoginPage") }}>{t('header.login')}</button>
              <button className="btn btn--outline" onClick={() => { handleNavigate("RegisterPage") }}>{t('header.register')}</button>
            </>}
          </div>

          <button className="header__menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* 내비게이션 탭 + 시계 */}
      <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
        <button className={navClassName("MainPage")} onClick={() => { handleNavigate("MainPage") }}>{t('header.home')}</button>
        <button className={navClassName("recipe")} onClick={() => { handleNavigate("BoardListPage", { category: "recipe" }) }}>{t('header.recipe')}</button>
        <button className={navClassName("life")} onClick={() => { handleNavigate("BoardListPage", { category: "life" }) }}>{t('header.life')}</button>
        <button className={navClassName("exercise")} onClick={() => { handleNavigate("BoardListPage", { category: "exercise" }) }}>{t('header.exercise')}</button>
        <button className={navClassName("ProductListPage")} onClick={() => { handleNavigate("ProductListPage") }}>{t('header.products')}</button>
        <button className={`${navClassName("HealthRecommendPage")} header__nav-item--ai`} onClick={() => { handleNavigate("HealthRecommendPage") }}>{t('header.ai_recommend')}</button>
        {isLogin && (
          <button className={`${navClassName("AlarmPage")} header__nav-item--alarm`} onClick={() => { handleNavigate("AlarmPage") }}>🔔 {t('header.alarm')}</button>
        )}

        {/* 모바일용 인증 영역 (메뉴 내부에 위치) */}
        <div className="header__auth header__auth--mobile">
          {isLogin && <>
            <div className="header__user-info-mobile">
              <span className="header__username">{currentUser?.name}{t('header.user_suffix')}</span>
              <button className="btn btn--ghost header__cart-btn" onClick={() => { handleNavigate("CartPage") }}>
                🛒 {t('header.cart')}
                {cartCount > 0 && <span className="header__cart-badge">{cartCount}</span>}
              </button>
            </div>
            <button className="btn btn--subtle btn--full" onClick={logout}>{t('header.logout')}</button>
          </>}
          {!isLogin && <>
            <button className="btn btn--primary btn--full" onClick={() => { handleNavigate("LoginPage") }}>{t('header.login')}</button>
            <button className="btn btn--outline btn--full" onClick={() => { handleNavigate("RegisterPage") }}>{t('header.register')}</button>
          </>}
        </div>

        {/* 메인 페이지에서만 날씨 배경 선택 드롭다운 표시 */}
        {page === "MainPage" && (
          <select
            className="header__weather-select"
            value={weatherIcon}
            onChange={e => onWeatherChange(e.target.value)}
          >
            {WEATHER_OPTIONS.map(o => (
              <option key={o.code} value={o.code}>{t(`weather.${o.code}`)}</option>
            ))}
          </select>
        )}

        <span className="header__clock">
          <span className="header__clock-label">{t('header.current_time')}</span>
          <span className="header__clock-time">
            {time.hours}<span className="header__clock-colon">:</span>{time.minutes}
          </span>
        </span>
      </nav>
    </header >
  );
}
