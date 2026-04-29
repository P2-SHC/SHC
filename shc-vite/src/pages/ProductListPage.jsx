import Badge from '../components/Badge.jsx';
import './ProductListPage.css';
import products from '../../public/data/product.json'
import ProductItem from './ProductItem.jsx'
import { useState } from 'react';

/**
 * ProductListPage - 상품 전체보기 (SHC-004)
 */
export default function ProductListPage({ navigate }) {
  const [count, setCount] = useState(0);
  let length = products.length - (count * 6 + 9);
  if (length < 0) length = 0;

  return (
    <div className="page">

      <div className="container--md">
        <div className="product-list-header">
          <span className="product-list-header__icon">💊</span>
          <div>
            <h1 className="product-list-header__title">건강상품</h1>
            <p className="product-list-header__desc">시니어를 위한 맞춤 건강기능식품</p>
          </div>
        </div>

        <div className="product-grid product-grid--3 product-grid--gap-lg">
          {products.slice(0, 9 + (count * 6)).map((product) => {
            return <ProductItem product={product} navigate={navigate} key={product.id} />
          })}
        </div>

        <div className="product-list-more">
          {length != 0 ? <button onClick={() => { setCount(count + 1) }} className="btn btn--outline btn--lg">상품 더보기</button> : <></>}
        </div>
      </div>
    </div>
  );
}
