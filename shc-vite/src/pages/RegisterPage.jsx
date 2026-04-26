import { useState, useContext } from 'react';
import { UserContext } from '../components/UserContext.jsx';
import './RegisterPage.css';

const INTERESTS = ['혈압관리', '당뇨관리', '관절건강', '뼈건강', '눈건강', '수면건강', '치매예방', '다이어트'];

export default function RegisterPage({ navigate }) {
  const { register } = useContext(UserContext);
  const [form, setForm] = useState({ name: '', username: '', password: '', passwordConfirm: '', age: '' });
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleInterest = (v) => {
    setInterests(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.username || !form.password) {
      setError('이름, 아이디, 비밀번호는 필수입니다.');
      return;
    }
    if (!/^[a-zA-Z0-9]{4,12}$/.test(form.username)) {
      setError('아이디는 영문+숫자 4~12자여야 합니다.');
      return;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    const result = await register({
      username: form.username,
      password: form.password,
      name: form.name,
      age: form.age ? Number(form.age) : null,
      interests,
    });
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate('LoginPage');
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

        <div>
          <label className="reg-label">이름 *</label>
          <input className="reg-input" name="name" placeholder="이름을 입력하세요" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">아이디 *</label>
          <input className="reg-input" name="username" placeholder="영문+숫자 4-12자" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">비밀번호 *</label>
          <input className="reg-input" type="password" name="password" placeholder="8자 이상" value={form.password} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">비밀번호 확인 *</label>
          <input className="reg-input" type="password" name="passwordConfirm" placeholder="비밀번호 재입력" value={form.passwordConfirm} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">나이</label>
          <input className="reg-input" type="number" name="age" placeholder="나이를 입력하세요" value={form.age} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="reg-interest-label">건강 관심사</label>
          <div className="reg-interest-wrapper">
            {INTERESTS.map(v => (
              <button
                key={v}
                className={`reg-interest-btn${interests.includes(v) ? ' active' : ''}`}
                onClick={() => toggleInterest(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="reg-error">{error}</p>}

        <button className="reg-submit-btn" onClick={handleSubmit}>
          회원가입 완료
        </button>
        <div className="reg-footer">
          이미 계정이 있으신가요?{' '}
          <button className="reg-link" onClick={() => navigate('LoginPage')}>로그인</button>
        </div>
      </div>
    </div>
  );
}