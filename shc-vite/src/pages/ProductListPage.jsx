import Badge from '../components/Badge.jsx';
import './ProductListPage.css';
import ProductItem from './ProductItem.jsx'
import { useState, useContext } from 'react';
import { ProductContext } from '../components/ProductContext.jsx';
import { useTranslation } from 'react-i18next';

/**
 * ProductListPage - 상품 전체보기 (SHC-004)
 */
export default function ProductListPage({ navigate }) {
  const { products } = useContext(ProductContext);
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  
  if (!products) return <div className="page"><div className="container--md">Loading...</div></div>;

  let length = products.length - (count * 6 + 9);
  if (length < 0) length = 0;

  return (
    <div className="page">

      <div className="container--md">
        <div className="product-list-header">
          <span className="product-list-header__icon">💊</span>
          <div>
            <h1 className="product-list-header__title">{t('product_detail.list_title')}</h1>
            <p className="product-list-header__desc">{t('product_detail.list_desc')}</p>
          </div>
        </div>

        <div className="product-grid product-grid--3 product-grid--gap-lg">
          {products.slice(0, 9 + (count * 6)).map((product) => {
            return <ProductItem product={product} navigate={navigate} key={product.id} />
          })}
        </div>

        <div className="product-list-more">
          {length != 0 ? <button onClick={() => { setCount(count + 1) }} className="btn btn--outline btn--lg">{t('product_detail.more')}</button> : <></>}
        </div>
      </div>
    </div>
  );
}
