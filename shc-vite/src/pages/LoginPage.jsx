import { useState, useContext } from 'react';
import { UserContext } from '../components/UserContext.jsx';
import './LoginPage.css';

export default function LoginPage({ navigate }) {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate('MainPage');
  };

  return (
    <div className="login-page">
      {/* 좌측 브랜드 영역 */}
      <div className="login-brand">
        <div className="login-circle-1" />
        <div className="login-circle-2" />
        <div className="login-brand-content">
          <div className="login-icon">🌿</div>
          <h1 className="login-brand-title">건강한 내일을<br />시니어헬스케어와<br />함께 시작하세요</h1>
          <p className="login-brand-desc">레시피, 운동, 라이프스타일까지<br />시니어를 위한 모든 건강 정보</p>
        </div>
      </div>

      {/* 우측 폼 영역 */}
      <div className="login-form-area">
        <div className="login-header">
          <h2 className="login-title">로그인</h2>
          <p className="login-subtitle">계정에 로그인하세요</p>
        </div>

        <div>
          <label className="login-label">아이디</label>
          <input
            className="login-input"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <label className="login-label">비밀번호</label>
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-footer">
          계정이 없으신가요?{' '}
          <button className="login-link" onClick={() => navigate('RegisterPage')}>회원가입</button>
        </div>

        <button className="login-back-btn" onClick={() => navigate('MainPage')}>← 메인으로 돌아가기</button>
      </div>
    </div>
  );
}