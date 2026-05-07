import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../components/UserContext.jsx';
import register3Img from '../../public/data/registerIMG/register3.png';
import './LoginPage.css';

export default function LoginPage({ navigate }) {
  const { t } = useTranslation();
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError(t('login.error_required'));
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
        <div className="registerIMG">
          <img src={register3Img} alt="register3" />
        </div>
        <div className="login-brand-content">
          <h1 className="login-brand-title" dangerouslySetInnerHTML={{ __html: t('login.brand_title') }} />
          <p className="login-brand-desc" dangerouslySetInnerHTML={{ __html: t('login.brand_desc') }} />
        </div>
      </div>

      {/* 우측 폼 영역 */}
      <div className="login-form-area">
        <div className="login-header">
          <h2 className="login-title">{t('login.title')}</h2>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        <div>
          <label className="login-label">{t('login.label_id')}</label>
          <input
            className="login-input"
            placeholder={t('login.placeholder_id')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <label className="login-label">{t('login.label_pw')}</label>
          <input
            className="login-input"
            type="password"
            placeholder={t('login.placeholder_pw')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          {t('login.btn')}
        </button>

        <div className="login-footer">
          {t('login.no_account')}{' '}
          <button className="login-link" onClick={() => navigate('RegisterPage')}>{t('login.go_register')}</button>
        </div>

        <button className="login-back-btn" onClick={() => navigate('MainPage')}>{t('login.back_to_main')}</button>
      </div>
    </div>
  );
}