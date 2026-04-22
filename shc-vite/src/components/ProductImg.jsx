import './ProductImg.css';

/**
 * ProductImg - 상품 이미지 플레이스홀더
 * @prop {string} color   - 배경 테마 색상 (hex)
 * @prop {string} emoji   - 대표 이모지
 * @prop {'sm'|'md'|'lg'} size
 */
export default function ProductImg({ color = '#7a9e7e', emoji = '💊', size = 'md' }) {
  return (
    <div className={`product-img product-img--${size}`} style={{ '--img-color': color }}>
      <span className="product-img__emoji">{emoji}</span>
      <span className="product-img__label">상품 이미지</span>
    </div>
  );
}
