import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import './BoardDetailPage.css';

/**
 * BoardDetailPage - 게시판 상세 (SHC-003)
 */
export default function BoardDetailPage() {
  return (
    <div className="page">
      <Header />

      <div className="container--sm">
        <button className="detail-back">← 레시피으로 돌아가기</button>

        {/* 본문 */}
        <article className="detail-article">
          <div className="detail-article__badge"><Badge /></div>
          <h1 className="detail-article__title">혈압에 좋은 바나나 스무디 만들기</h1>
          <p className="detail-article__meta">2025.04.15 · 조회 1,240</p>
          <div className="detail-article__divider" />
          <p className="detail-article__content">바나나는 칼륨이 풍부하여 혈압 조절에 도움이 됩니다.</p>
        </article>

        {/* 관련 상품 추천 */}
        <div className="detail-products">
          <h2 className="detail-products__title">관련 건강상품 추천</h2>
          <div className="detail-products__grid">
            <button className="detail-product-card">
              <span className="detail-product-card__emoji">🍃</span>
              <p className="detail-product-card__name">프리미엄 홍삼정 골드</p>
              <p className="detail-product-card__price">89,000원</p>
            </button>
          </div>
        </div>

        {/* 댓글 */}
        <div className="detail-comments">
          <h2 className="detail-comments__title">댓글 2</h2>
          <div className="detail-comments__list">
            <div className="comment">
              <div className="comment__header">
                <span className="comment__author">김영자</span>
                <span className="comment__date">2025.04.17</span>
              </div>
              <p className="comment__text">정말 도움이 됩니다. 꼭 실천해볼게요!</p>
            </div>
          </div>
          <div className="comment-form">
            <input
              className="input comment-form__input"
              placeholder="댓글을 입력하세요..."
            />
            <button className="btn btn--primary">등록</button>
          </div>
        </div>
      </div>
    </div>
  );
}
