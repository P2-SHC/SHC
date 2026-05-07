import { useState, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../components/UserContext.jsx';
import registerImg from '../../public/data/registerIMG/register.png';
import './RegisterPage.css';

const HEALTH_CONDITIONS_BASE = [
  { id: 'high_blood_pressure', icon: '❤️' },
  { id: 'diabetes', icon: '🩸' },
  { id: 'joint_pain', icon: '🦵' },
  { id: 'eye_health', icon: '👁️' },
  { id: 'sleep_disorder', icon: '😴' },
  { id: 'digestion', icon: '🌿' },
  { id: 'fatigue', icon: '⚡' },
  { id: 'stress', icon: '🧘' },
  { id: 'immunity', icon: '🛡️' },
  { id: 'weight_management', icon: '⚖️' },
  { id: 'bone_health', icon: '🦴' },
  { id: 'blood_circulation', icon: '🔄' },
  { id: 'respiratory', icon: '😷' },
  { id: 'brain_health', icon: '🧠' },
  { id: 'skin_health', icon: '✨' },
];

export default function RegisterPage({ navigate }) {
  const { t } = useTranslation();
  const { register } = useContext(UserContext);
  const [form, setForm] = useState({ name: '', username: '', password: '', passwordConfirm: '', age: '' });
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');

  const healthConditions = useMemo(() => 
    HEALTH_CONDITIONS_BASE.map(c => ({
      ...c,
      label: t(`ai_recommend.conditions.${c.id}`)
    })), [t]
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleInterest = (id) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.username || !form.password) {
      setError(t('register.error_required'));
      return;
    }
    if (!/^[a-zA-Z0-9]{4,12}$/.test(form.username)) {
      setError(t('register.error_id_format'));
      return;
    }
    if (form.password.length < 8) {
      setError(t('register.error_pw_length'));
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError(t('register.error_pw_mismatch'));
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
        <div className="reg-circle-1" />
        <div className="reg-circle-2" />
        <div className="reg-brand-img-wrapper">
          <img src={registerImg} alt="register" className="reg-brand-img" />
        </div>
        <div className="reg-brand-content">
          <h1 className="reg-brand-title" dangerouslySetInnerHTML={{ __html: t('register.brand_title') }} />
          <p className="reg-brand-desc" dangerouslySetInnerHTML={{ __html: t('register.brand_desc') }} />
        </div>
      </div>

      {/* 우측 폼 */}
      <div className="reg-form-area">
        <h2 className="reg-title">{t('register.title')}</h2>

        <div>
          <label className="reg-label">{t('register.label_name')}</label>
          <input className="reg-input" name="name" placeholder={t('register.placeholder_name')} value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">{t('register.label_id')}</label>
          <input className="reg-input" name="username" placeholder={t('register.placeholder_id')} value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">{t('register.label_pw')}</label>
          <input className="reg-input" type="password" name="password" placeholder={t('register.placeholder_pw')} value={form.password} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">{t('register.label_pw_confirm')}</label>
          <input className="reg-input" type="password" name="passwordConfirm" placeholder={t('register.placeholder_pw_confirm')} value={form.passwordConfirm} onChange={handleChange} />
        </div>
        <div>
          <label className="reg-label">{t('register.label_age')}</label>
          <input className="reg-input" type="number" name="age" placeholder={t('register.placeholder_age')} value={form.age} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="reg-interest-label">{t('register.interest_label')}</label>
          <div className="reg-interest-wrapper">
            {healthConditions.map(c => (
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
          {t('register.submit_btn')}
        </button>
        <div className="reg-footer">
          {t('register.has_account')}{' '}
          <button className="reg-link" onClick={() => navigate('LoginPage')}>{t('register.go_login')}</button>
        </div>
      </div>
    </div>
  );
}