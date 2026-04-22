import './Header.css';

export default function Header() {
  return (
    <header className="header">
      {/* 상단 타이틀 행 */}
      <div className="header__top">
        <button className="header__logo">
          <span className="header__logo-icon">🌿</span>
          <div>
            <div className="header__logo-name">시니어헬스케어</div>
            <div className="header__logo-sub">건강한 노후를 위한 가장 쉬운 방법</div>
          </div>
        </button>

        <div className="header__auth">
          <span className="header__username">김영자님</span>
          <button className="btn btn--ghost header__cart-btn">
            🛒 장바구니
            <span className="header__cart-badge">2</span>
          </button>
          <button className="btn btn--subtle">로그아웃</button>
          
          {/* 비로그인 상태 UI (필요시 주석 해제)
          <button className="btn btn--primary">로그인</button>
          <button className="btn btn--outline">회원가입</button>
          */}
        </div>
      </div>

      {/* 내비게이션 탭 */}
      <nav className="header__nav">
        <button className="header__nav-item header__nav-item--active">홈</button>
        <button className="header__nav-item">레시피</button>
        <button className="header__nav-item">라이프</button>
        <button className="header__nav-item">운동</button>
        <button className="header__nav-item">건강상품</button>
      </nav>
    </header>
  );
}
