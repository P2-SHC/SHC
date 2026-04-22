import './Badge.css';

/**
 * Badge
 * @prop {string} text    - 배지 텍스트
 * @prop {'sage'|'peach'|'gold'|'blue'} variant
 */
export default function Badge({ text, variant = 'sage' }) {
  if (!text) return null;
  return (
    <span className={`badge badge--${variant}`}>{text}</span>
  );
}
