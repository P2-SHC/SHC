import './Header.css';

const NAV_ITEMS = [
  { key: 'main',      label: '홈' },
  { key: 'recipe',    label: '레시피' },
  { key: 'lifestyle', label: '라이프' },
  { key: 'exercise',  label: '운동' },
  { key: 'products',  label: '건강상품' },
];

/**
 * Header
 * @prop {string}   activePage  - 현재 활성 페이지 키
 * @prop {boolean}  isLoggedIn  - 로그인 여부
 * @prop {string}   userName    - 로그인 사용자 이름
 * @prop {number}   cartCount   - 장바구니 수량
 * @prop {Function} onNavClick  - (key: string) => void
 * @prop {Function} onLogin     - () => void
 * @prop {Function} onRegister  - () => void
 * @prop {Function} onLogout    - () => void
 * @prop {Function} onCart      - () => void
 */
export default function Header({
  activePage = 'main',
  isLoggedIn = false,
  userName = '김영자',
  cartCount = 0,
  onNavClick,
  onLogin,
  onRegister,
  onLogout,
  onCart,
}) {
  return (
    <header className="header">
      {/* 상단 타이틀 행 */}
      <div className="header__top">
        <button className="header__logo" onClick={onNavClick?.bind(null, 'main')}>
          <span className="header__logo-icon">🌿</span>
          <div>
            <div className="header__logo-name">시니어헬스케어</div>
            <div className="header__logo-sub">건강한 노후를 위한 가장 쉬운 방법</div>
          </div>
        </button>

        <div className="header__auth">
          {isLoggedIn ? (
            <>
              <span className="header__username">{userName}님</span>
              <button className="btn btn--ghost header__cart-btn" onClick={onCart}>
                🛒 장바구니
                {cartCount > 0 && (
                  <span className="header__cart-badge">{cartCount}</span>
                )}
              </button>
              <button className="btn btn--subtle" onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn btn--primary" onClick={onLogin}>로그인</button>
              <button className="btn btn--outline" onClick={onRegister}>회원가입</button>
            </>
          )}
        </div>
      </div>

      {/* 내비게이션 탭 */}
      <nav className="header__nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`header__nav-item ${activePage === item.key ? 'header__nav-item--active' : ''}`}
            onClick={() => onNavClick?.(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
