import Badge from '../components/Badge.jsx';
import './BoardDetailPage.css';
import articles from "../article/articleData.json"
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

  return (
    <div className="page">
      <div className="container--sm">
        <button className="detail-back" onClick={() => { navigate("BoardListPage") }}>← 목록으로 돌아가기</button>

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
            <button className="detail-product-card" onClick={() => { navigate("ProductDetailPage") }}>
              <span className="detail-product-card__emoji">🍃</span>
              <p className="detail-product-card__name">프리미엄 홍삼정 골드</p>
              <p className="detail-product-card__price">89,000원</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
