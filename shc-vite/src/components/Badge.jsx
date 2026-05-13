import './Badge.css';
import { useTranslation } from 'react-i18next';

export default function Badge() {
  const { t } = useTranslation();
  return (
    <span className="badge badge--sage">{t('common.popular')}</span>
  );
}
