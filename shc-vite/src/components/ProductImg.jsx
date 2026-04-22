import './ProductImg.css';

export default function ProductImg() {
  return (
    <div className="product-img product-img--md" style={{ '--img-color': '#7a9e7e' }}>
      <span className="product-img__emoji">💊</span>
      <span className="product-img__label">상품 이미지</span>
    </div>
  );
}
