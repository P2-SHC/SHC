import './Header.css';

export default function Header({ isLogin, logout, page, category, navigate }) {
  const navClassName = (target) => {
    let isActive = false;
    if (page == "MainPage") isActive = (target == "MainPage")
    else if (page == "ProductListPage") isActive = (target == "ProductListPage")
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

        <div className="header__auth">
          {isLogin && <>
            <span className="header__username">김영자님</span>
            <button className="btn btn--ghost header__cart-btn" onClick={() => { navigate("CartPage") }}>
              🛒 장바구니
              <span className="header__cart-badge">2</span>
            </button>
            <button className="btn btn--subtle" onClick={() => { logout(); navigate("MainPage") }}>로그아웃</button>
          </>}
          {!isLogin && <>
            <button className="btn btn--primary" onClick={() => { navigate("LoginPage") }}>로그인</button>
            <button className="btn btn--outline" onClick={() => { navigate("RegisterPage") }}>회원가입</button>
          </>}
        </div>
      </div>

      {/* 내비게이션 탭 */}
      <nav className="header__nav">
        <button className={navClassName("MainPage")} onClick={() => { navigate("MainPage") }}>홈</button>
        <button className={navClassName("recipe")} onClick={() => { navigate("BoardListPage", { category: "recipe" }) }}>레시피</button>
        <button className={navClassName("life")} onClick={() => { navigate("BoardListPage", { category: "life" }) }}>라이프</button>
        <button className={navClassName("exercise")} onClick={() => { navigate("BoardListPage", { category: "exercise" }) }}>운동</button>
        <button className={navClassName("ProductListPage")} onClick={() => { navigate("ProductListPage") }}>상품</button>
      </nav>
    </header >
  );
}
