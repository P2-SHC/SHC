import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import './BoardDetailPage.css';

/**
 * BoardDetailPage - 게시판 상세 (SHC-003)
 * @prop {'recipe'|'lifestyle'|'exercise'} category
 * @prop {object}   post        - { title, date, views, tag, content }
 * @prop {boolean}  isLoggedIn
 * @prop {Array}    comments    - [{ author, text, date }]
 * @prop {Array}    relatedProducts - 관련 상품 3개
 * @prop {string}   commentValue   - 댓글 입력값 (controlled)
 * @prop {Function} onCommentChange
 * @prop {Function} onCommentSubmit
 * @prop {Function} onBack
 * @prop {Function} onProductClick
 * @prop {Function} onNavClick
 */

const META = {
  recipe:    { label:'레시피', icon:'🥗' },
  lifestyle: { label:'라이프', icon:'🌸' },
  exercise:  { label:'운동',   icon:'🏃' },
};

export default function BoardDetailPage({
  category = 'recipe',
  post = MOCK_POST,
  isLoggedIn = false,
  comments = MOCK_COMMENTS,
  relatedProducts = MOCK_PRODUCTS,
  commentValue = '',
  onCommentChange,
  onCommentSubmit,
  onBack,
  onProductClick,
  onNavClick,
}) {
  const meta = META[category];
  const fmt = (n) => Number(n).toLocaleString('ko-KR') + '원';

  return (
    <div className="page">
      <Header activePage={category} isLoggedIn={isLoggedIn} onNavClick={onNavClick} cartCount={2} />

      <div className="container--sm">
        <button className="detail-back" onClick={onBack}>← {meta.label}으로 돌아가기</button>

        {/* 본문 */}
        <article className="detail-article">
          <div className="detail-article__badge"><Badge text={post.tag} variant="sage" /></div>
          <h1 className="detail-article__title">{post.title}</h1>
          <p className="detail-article__meta">{post.date} · 조회 {Number(post.views).toLocaleString()}</p>
          <div className="detail-article__divider" />
          <p className="detail-article__content">{post.content}</p>
        </article>

        {/* 관련 상품 추천 */}
        <div className="detail-products">
          <h2 className="detail-products__title">관련 건강상품 추천</h2>
          <div className="detail-products__grid">
            {relatedProducts.map(p => (
              <button key={p.id} className="detail-product-card" onClick={() => onProductClick?.(p)}>
                <span className="detail-product-card__emoji">{p.emoji}</span>
                <p className="detail-product-card__name">{p.name}</p>
                <p className="detail-product-card__price">{fmt(p.price)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 댓글 */}
        <div className="detail-comments">
          <h2 className="detail-comments__title">댓글 {comments.length}</h2>
          <div className="detail-comments__list">
            {comments.map((c, i) => (
              <div key={i} className="comment">
                <div className="comment__header">
                  <span className="comment__author">{c.author}</span>
                  <span className="comment__date">{c.date}</span>
                </div>
                <p className="comment__text">{c.text}</p>
              </div>
            ))}
          </div>
          {isLoggedIn ? (
            <div className="comment-form">
              <input
                className="input comment-form__input"
                value={commentValue}
                onChange={e => onCommentChange?.(e.target.value)}
                placeholder="댓글을 입력하세요..."
              />
              <button className="btn btn--primary" onClick={onCommentSubmit}>등록</button>
            </div>
          ) : (
            <p className="comment-login-notice">
              댓글을 달려면 <button className="comment-login-notice__btn" onClick={() => onNavClick?.('login')}>로그인</button>이 필요합니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const MOCK_POST = {
  title:'혈압에 좋은 바나나 스무디 만들기', date:'2025.04.15', views:1240, tag:'혈압관리',
  content:'바나나는 칼륨이 풍부하여 혈압 조절에 도움이 됩니다.\n\n재료: 바나나 1개, 저지방 우유 200ml, 꿀 1큰술\n\n만드는 법:\n1. 바나나를 적당히 썰어 믹서기에 넣습니다.\n2. 차가운 저지방 우유를 붓고 꿀을 추가합니다.\n3. 30초간 곱게 갈아줍니다.\n4. 컵에 담아 즉시 마십니다.',
};
const MOCK_COMMENTS = [
  { author:'김영자', text:'정말 도움이 됩니다. 꼭 실천해볼게요!', date:'2025.04.17' },
  { author:'박정수', text:'좋은 정보 감사합니다.', date:'2025.04.16' },
];
const MOCK_PRODUCTS = [
  { id:1, name:'프리미엄 홍삼정 골드',   price:89000, emoji:'🍃' },
  { id:2, name:'관절 영양제 MSM 플러스', price:45000, emoji:'💪' },
  { id:3, name:'루테인 눈 영양제',        price:32000, emoji:'👁️' },
];
