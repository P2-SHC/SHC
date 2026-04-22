import { useState } from 'react';
import './RegisterPage.css';

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

        {[
          ['이름 *', 'name', 'text', '이름을 입력하세요'],
          ['아이디 *', 'id', 'text', '영문+숫자 4-12자'],
          ['비밀번호 *', 'pw', 'password', '8자 이상'],
          ['비밀번호 확인 *', 'pw2', 'password', '비밀번호 재입력'],
          ['나이', 'age', 'number', '나이를 입력하세요'],
        ].map(([label, key, type, ph]) => (
          <div key={key}>
            <label className="reg-label">{label}</label>
            <input
              type={type} value={form[key]} onChange={set(key)} placeholder={ph}
              className="reg-input"
            />
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <label className="reg-interest-label">건강 관심사</label>
          <div className="reg-interest-wrapper">
            {INTERESTS.map(v => (
              <button
                key={v} onClick={() => toggleInterest(v)}
                className={`reg-interest-btn ${interests.includes(v) ? 'active' : ''}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="reg-error">{error}</div>}

        <button onClick={handleRegister} className="reg-submit-btn">
          회원가입 완료
        </button>
        <div className="reg-footer">
          이미 계정이 있으신가요?{' '}
          <button onClick={() => navigate('login')} className="reg-link">로그인</button>
        </div>
      </div>
    </div>
  );
}
