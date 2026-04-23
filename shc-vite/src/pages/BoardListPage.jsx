import Badge from '../components/Badge.jsx';
import './BoardListPage.css';

/**
 * BoardListPage - 게시판 목록 (SHC-002)
 */
export default function BoardListPage({ setPage }) {
  return (
    <div className="page">

      <div className="container--md">
        {/* 페이지 헤더 */}
        <div className="board-header">
          <span className="board-header__icon">🥗</span>
          <div>
            <h1 className="board-header__title">레시피</h1>
            <p className="board-header__desc">건강에 좋은 음식 레시피를 공유해요</p>
          </div>
        </div>

        {/* 검색창 */}
        <div className="board-search">
          <input
            className="input board-search__input"
            placeholder="게시글 검색..."
          />
        </div>

        <div className="board-layout">
          {/* 게시글 목록 */}
          <div className="board-list">
            <button className="board-post-card" onClick={() => { setPage("BoardDetailPage") }}>
              <div className="board-post-card__img">🥗</div>
              <div className="board-post-card__body">
                <Badge />
                <p className="board-post-card__title">혈압에 좋은 바나나 스무디 만들기</p>
                <p className="board-post-card__meta">2025.04.15 · 조회 1,240</p>
              </div>
            </button>
            <button className="board-post-card" onClick={() => { setPage("BoardDetailPage") }}>
              <div className="board-post-card__img">🥗</div>
              <div className="board-post-card__body">
                <Badge />
                <p className="board-post-card__title">관절에 좋은 연어 샐러드 레시피</p>
                <p className="board-post-card__meta">2025.04.12 · 조회 890</p>
              </div>
            </button>
          </div>

          {/* TOP5 사이드바 */}
          <aside className="board-top5">
            <div className="board-top5__title">👑 조회수 TOP 5</div>
            <button className="board-top5__item" onClick={() => { setPage("BoardDetailPage") }}>
              <span className="board-top5__rank board-top5__rank--1">1</span>
              <span className="board-top5__text">무릎 통증 없는 실내 스트레칭 5가지</span>
            </button>
            <button className="board-top5__item" onClick={() => { setPage("BoardDetailPage") }}>
              <span className="board-top5__rank board-top5__rank--2">2</span>
              <span className="board-top5__text">혼자서도 즐거운 건강한 노후 만들기</span>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
