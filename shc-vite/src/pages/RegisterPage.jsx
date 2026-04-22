import { useState } from 'react';

const INTERESTS = ['혈압관리', '당뇨관리', '관절건강', '뼈건강', '눈건강', '수면건강', '치매예방', '다이어트'];

export default function RegisterPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ name: '', id: '', pw: '', pw2: '', age: '' });
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const toggleInterest = (v) => setInterests(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v]);

  const handleRegister = () => {
    if (!form.name || !form.id || !form.pw) { setError('필수 항목을 모두 입력해주세요.'); return; }
    if (form.pw !== form.pw2) { setError('비밀번호가 일치하지 않습니다.'); return; }
    onLogin({ name: form.name, id: form.id });
    navigate('main');
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', fontSize: 16,
    border: '1.5px solid #ddd', borderRadius: 12, outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* 좌측 */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #1e3320, #2d5035, #4a7a50, #6b9e72)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 24 }}>🌿</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 18 }}>시니어헬스케어<br />커뮤니티에<br />오신 것을<br />환영합니다</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>건강한 노후를 위한<br />가장 쉬운 시작</p>
        </div>
      </div>

      {/* 우측 폼 */}
      <div style={{ width: 520, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 52px', background: '#fff', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#2a2a2a', marginBottom: 28 }}>회원가입</h2>

        {[
          ['이름 *', 'name', 'text', '이름을 입력하세요'],
          ['아이디 *', 'id', 'text', '영문+숫자 4-12자'],
          ['비밀번호 *', 'pw', 'password', '8자 이상'],
          ['비밀번호 확인 *', 'pw2', 'password', '비밀번호 재입력'],
          ['나이', 'age', 'number', '나이를 입력하세요'],
        ].map(([label, key, type, ph]) => (
          <div key={key}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#3a3a3a', display: 'block', marginBottom: 5 }}>{label}</label>
            <input
              type={type} value={form[key]} onChange={set(key)} placeholder={ph}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4a7a50'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#3a3a3a', display: 'block', marginBottom: 8 }}>건강 관심사</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {INTERESTS.map(v => (
              <button
                key={v} onClick={() => toggleInterest(v)}
                style={{ padding: '7px 14px', borderRadius: 99, border: '1.5px solid', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderColor: interests.includes(v) ? '#4a7a50' : '#ddd', background: interests.includes(v) ? '#e8f0e9' : '#fff', color: interests.includes(v) ? '#4a7a50' : '#8a8a7a' }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ color: '#e85a5a', fontSize: 14, marginBottom: 10 }}>{error}</div>}

        <button onClick={handleRegister} style={{ padding: '15px', background: '#4a7a50', color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: 'pointer', marginBottom: 14, width: '100%' }}>
          회원가입 완료
        </button>
        <div style={{ textAlign: 'center', fontSize: 15, color: '#8a8a7a' }}>
          이미 계정이 있으신가요?{' '}
          <button onClick={() => navigate('login')} style={{ color: '#4a7a50', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>로그인</button>
        </div>
      </div>
    </div>
  );
}
