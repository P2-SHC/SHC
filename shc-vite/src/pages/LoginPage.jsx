import { useState } from 'react';

export default function LoginPage({ navigate, onLogin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!id || !pw) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    onLogin({ name: id, id });
    navigate('main');
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', fontSize: 17,
    border: '1.5px solid #ddd', borderRadius: 12, outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* 좌측 브랜드 영역 */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #1e3320, #2d5035, #4a7a50, #6b9e72)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 72px', position: 'relative', overflow: 'hidden' }}>
        {/* 배경 원형 장식 */}
        <div style={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', left: -60, bottom: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 24 }}>🌿</div>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 18 }}>건강한 내일을<br />시니어헬스케어와<br />함께 시작하세요</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>레시피, 운동, 라이프스타일까지<br />시니어를 위한 모든 건강 정보</p>
        </div>
      </div>

      {/* 우측 폼 영역 */}
      <div style={{ width: 500, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 52px', background: '#fff' }}>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#2a2a2a', marginBottom: 8 }}>로그인</h2>
          <p style={{ fontSize: 16, color: '#8a8a7a' }}>계정에 로그인하세요</p>
        </div>

        <div>
          <label style={{ fontSize: 15, fontWeight: 600, color: '#3a3a3a', display: 'block', marginBottom: 6 }}>아이디</label>
          <input
            value={id} onChange={e => setId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="아이디를 입력하세요"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#4a7a50'}
            onBlur={e => e.target.style.borderColor = '#ddd'}
          />
          <label style={{ fontSize: 15, fontWeight: 600, color: '#3a3a3a', display: 'block', marginBottom: 6 }}>비밀번호</label>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호를 입력하세요"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#4a7a50'}
            onBlur={e => e.target.style.borderColor = '#ddd'}
          />
          {error && <div style={{ color: '#e85a5a', fontSize: 15, marginBottom: 8 }}>{error}</div>}
        </div>

        <button onClick={handleLogin} style={{ padding: '16px', background: '#4a7a50', color: '#fff', border: 'none', borderRadius: 14, fontSize: 18, fontWeight: 800, cursor: 'pointer', marginBottom: 18, width: '100%' }}>
          로그인
        </button>

        <div style={{ textAlign: 'center', fontSize: 16, color: '#8a8a7a', marginBottom: 20 }}>
          계정이 없으신가요?{' '}
          <button onClick={() => navigate('register')} style={{ color: '#4a7a50', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>회원가입</button>
        </div>

        <button onClick={() => navigate('main')} style={{ background: 'none', border: 'none', color: '#bbb', fontSize: 15, cursor: 'pointer', textAlign: 'center' }}>← 메인으로 돌아가기</button>
      </div>
    </div>
  );
}
