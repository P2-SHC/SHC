import './RegisterPage.css';

const INTERESTS = ['혈압관리', '당뇨관리', '관절건강', '뼈건강', '눈건강', '수면건강', '치매예방', '다이어트'];

export default function RegisterPage({ setPage }) {
  return (
    <div className="reg-page">
      {/* 좌측 */}
      <div className="reg-brand">
        <div className="reg-circle" />
        <div className="reg-brand-content">
          <div className="reg-icon">🌿</div>
          <h1 className="reg-brand-title">시니어헬스케어<br />커뮤니티에<br />오신 것을<br />환영합니다</h1>
          <p className="reg-brand-desc">건강한 노후를 위한<br />가장 쉬운 시작</p>
        </div>
      </div>

      {/* 우측 폼 */}
      <div className="reg-form-area">
        <h2 className="reg-title">회원가입</h2>

        <div>
          <label className="reg-label">이름 *</label>
          <input className="reg-input" placeholder="이름을 입력하세요" />
        </div>
        <div>
          <label className="reg-label">아이디 *</label>
          <input className="reg-input" placeholder="영문+숫자 4-12자" />
        </div>
        <div>
          <label className="reg-label">비밀번호 *</label>
          <input className="reg-input" type="password" placeholder="8자 이상" />
        </div>
        <div>
          <label className="reg-label">비밀번호 확인 *</label>
          <input className="reg-input" type="password" placeholder="비밀번호 재입력" />
        </div>
        <div>
          <label className="reg-label">나이</label>
          <input className="reg-input" type="number" placeholder="나이를 입력하세요" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="reg-interest-label">건강 관심사</label>
          <div className="reg-interest-wrapper">
            {INTERESTS.map(v => (
              <button
                key={v}
                className="reg-interest-btn"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <button className="reg-submit-btn" onClick={() => { setPage("MainPage") }}>
          회원가입 완료
        </button>
        <div className="reg-footer">
          이미 계정이 있으신가요?{' '}
          <button className="reg-link" onClick={() => { setPage("LoginPage") }}>로그인</button>
        </div>
      </div>
    </div>
  );
}
