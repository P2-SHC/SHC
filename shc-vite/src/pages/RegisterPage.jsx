import { useState, useContext } from 'react';
import { UserContext } from '../components/UserContext.jsx';
import './RegisterPage.css';

const HEALTH_CONDITIONS = [
  { id: '고혈압', label: '고혈압', icon: '❤️' },
  { id: '당뇨', label: '당뇨', icon: '🩸' },
  { id: '관절통', label: '관절·무릎 통증', icon: '🦵' },
  { id: '눈건강', label: '눈 건강', icon: '👁️' },
  { id: '수면', label: '수면 장애', icon: '😴' },
  { id: '소화', label: '소화·장 건강', icon: '🌿' },
  { id: '피로', label: '만성 피로', icon: '⚡' },
  { id: '스트레스', label: '스트레스', icon: '🧘' },
  { id: '면역력', label: '면역력 강화', icon: '🛡️' },
  { id: '체중관리', label: '체중 관리', icon: '⚖️' },
  { id: '뼈건강', label: '뼈·골다공증', icon: '🦴' },
  { id: '혈액순환', label: '혈액 순환', icon: '🔄' },
  { id: '미세먼지', label: '미세먼지·호흡기', icon: '😷' },
  { id: '두뇌건강', label: '두뇌·기억력', icon: '🧠' },
  { id: '피부건강', label: '피부 건강', icon: '✨' },
];

export default function RegisterPage({ navigate }) {
  const { register } = useContext(UserContext);
  const [form, setForm] = useState({ name: '', username: '', password: '', passwordConfirm: '', age: '' });
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleInterest = (id) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
            {HEALTH_CONDITIONS.map(c => (
              <button
                key={c.id}
                className={`reg-interest-btn${interests.includes(c.id) ? ' active' : ''}`}
                onClick={() => toggleInterest(c.id)}
              >
                {c.label}
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