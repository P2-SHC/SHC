import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import './ProductListPage.css';

/**
 * ProductListPage - 상품 전체보기 (SHC-004)
 * @prop {boolean}  isLoggedIn
 * @prop {Array}    products       - 상품 목록
 * @prop {boolean}  hasMore        - 더보기 버튼 표시 여부
 * @prop {Function} onProductClick - (product) => void
 * @prop {Function} onLoadMore
 * @prop {Function} onNavClick
 */
export default function ProductListPage({
  isLoggedIn = false,
  products = MOCK_PRODUCTS,
  hasMore = false,
  onProductClick,
  onLoadMore,
  onNavClick,
}) {
  const fmt = (n) => Number(n).toLocaleString('ko-KR') + '원';

  return (
    <div className="page">
      <Header activePage="products" isLoggedIn={isLoggedIn} onNavClick={onNavClick} cartCount={2} />

      <div className="container--md">
        <div className="product-list-header">
          <span className="product-list-header__icon">💊</span>
          <div>
            <h1 className="product-list-header__title">건강상품</h1>
            <p className="product-list-header__desc">시니어를 위한 맞춤 건강기능식품</p>
          </div>
        </div>

        <div className="product-grid product-grid--3 product-grid--gap-lg">
          {products.map(p => (
            <button key={p.id} className="product-list-card" onClick={() => onProductClick?.(p)}>
              <div className="product-list-card__img" style={{ background: `${p.color}15` }}>{p.emoji}</div>
              <p className="product-list-card__category">{p.category}</p>
              <p className="product-list-card__name">{p.name}</p>
              <div className="product-list-card__footer">
                <span className="product-list-card__price">{fmt(p.price)}</span>
                {p.tag && <Badge text={p.tag} variant={['베스트','인기'].includes(p.tag) ? 'peach' : 'sage'} />}
              </div>
            </button>
          ))}
        </div>

        {hasMore && (
          <div className="product-list-more">
            <button className="btn btn--outline btn--lg" onClick={onLoadMore}>상품 더보기</button>
          </div>
        )}
      </div>
    </div>
  );
}

const MOCK_PRODUCTS = [
  { id:1, name:'프리미엄 홍삼정 골드',   price:89000, category:'건강기능식품', color:'#c17f5a', emoji:'🍃', tag:'베스트' },
  { id:2, name:'관절 영양제 MSM 플러스', price:45000, category:'관절건강',    color:'#7a9e7e', emoji:'💪', tag:'추천'  },
  { id:3, name:'루테인 눈 영양제',        price:32000, category:'눈건강',      color:'#e8c06d', emoji:'👁️', tag:''     },
  { id:4, name:'혈압 건강 코엔자임Q10',  price:38000, category:'혈압관리',    color:'#e8956d', emoji:'❤️', tag:'신상'  },
  { id:5, name:'칼슘 마그네슘 비타민D3', price:28000, category:'뼈건강',      color:'#7ab5c9', emoji:'🦴', tag:''     },
  { id:6, name:'종합 비타민 시니어',      price:35000, category:'종합비타민',  color:'#9b8ec9', emoji:'✨', tag:'인기'  },
  { id:7, name:'유산균 장 건강',          price:42000, category:'장건강',      color:'#7a9e7e', emoji:'🌿', tag:''     },
  { id:8, name:'오메가3 혈행 개선',       price:36000, category:'혈행관리',    color:'#5a8fc9', emoji:'🐟', tag:'추천' },
  { id:9, name:'프로바이오틱스 12종',     price:55000, category:'장건강',      color:'#c9a85a', emoji:'💊', tag:''     },
];
