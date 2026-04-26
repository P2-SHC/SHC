import Badge from '../components/Badge.jsx';
import './BoardDetailPage.css';
import articles from "../article/articleData.json";
import products from "../data/product.json";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * BoardDetailPage - 게시판 상세 (SHC-003)
 */
export default function BoardDetailPage({ navigate, postId }) {
  const post = articles.find(article => article.id === postId);

  if (!post) {
    return (
      <div className="page">
        <div className="container--sm">
          <p>게시글을 찾을 수 없습니다.</p>
          <button onClick={() => navigate("BoardListPage")}>목록으로 돌아가기</button>
        </div>
      </div>
    );
  }

  // 키워드 교집합 기반 추천 상품 로직 (겹치는 키워드가 많은 순으로 정렬)
  const recommendedProducts = products
    .map(product => {
      const matchCount = product.keyword.filter(k => post.keyword.includes(k)).length;
      return { ...product, matchCount };
    })
    .filter(product => product.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3);

  return (
    <div className="page">
      <div className="container--sm">
        <button className="detail-back" onClick={() => { navigate("BoardListPage", { category: post.category }) }}>← 목록으로 돌아가기</button>

        {/* 본문 */}
        <article className="detail-article">
          <div className="detail-article__badge">{post.viewCount > 1000 && <Badge />}</div>
          <h1 className="detail-article__title">{post.title}</h1>
          <p className="detail-article__meta">{post.createdAt} · 조회 {post.viewCount}</p>
          <div className="detail-article__divider" />
          <div className="detail-article__content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* 관련 상품 추천 */}
        <div className="detail-products">
          <h2 className="detail-products__title">관련 건강상품 추천</h2>
          <div className="detail-products__grid">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map(product => (
                <button
                  key={product.id}
                  className="detail-product-card"
                  onClick={() => { navigate("ProductDetailPage", { productId: product.id, from: "BoardDetailPage", fromPostId: post.id }) }}
                >
                  <img className="detail-product-card__img" src={product.image} alt={product.title} />
                  <p className="detail-product-card__name">{product.title}</p>
                  <p className="detail-product-card__price">{product.price.toLocaleString()}원</p>
                </button>
              ))
            ) : (
              <p className="detail-products__empty">관련 추천 상품이 없습니다.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
