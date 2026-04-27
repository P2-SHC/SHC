import Badge from '../components/Badge.jsx';
import './BoardListPage.css';
import articles from '../article/articleData.json';
import { useState } from 'react';

/**
 * BoardListPage - 게시판 목록 (SHC-002)
 */
const getFirstImage = (content) => {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  if (match) {
    const src = match[1];
    return src.startsWith('http') ? src : `/src/data/boardIMG/${src}`;
  }
  return null;
};

export default function BoardListPage({ navigate, category }) {
  const [postList, setPostList] = useState(articles);
  const [searchTerm, setSearchTerm] = useState("");
  const categoryData = {
    recipe: {
      title: "레시피",
      desc: "건강에 좋은 음식 레시피를 공유해요",
      icon: "🥗"
    },
    life: {
      title: "라이프",
      desc: "일상 속 건강 관리 팁과 습관을 나누어보세요",
      icon: "🧘"
    },
    exercise: {
      title: "운동",
      desc: "효과적인 운동 루틴과 건강한 몸만들기 정보를 공유합니다",
      icon: "🏃"
    }
  };
  const currentCategory = categoryData[category] || categoryData.recipe;

  return (
    <div className="page">

      <div className="container--md">
        {/* 페이지 헤더 */}

        <div className="board-header">
          <span className="board-header__icon">{currentCategory.icon} </span>
          <div>
            <h1 className="board-header__title">
              {currentCategory.title}
            </h1>
            <p className="board-header__desc">{currentCategory.desc}</p>
          </div>
        </div>

        {/* 검색창 */}
        <div className="board-search">
          <input
            className="input board-search__input"
            placeholder="게시글 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="board-layout">
          {/* 게시글 목록 */}
          <div className="board-list">
            {(() => {
              const query = searchTerm.trim().toLowerCase();
              const filtered = postList
                .filter(post => post.category === category)
                .filter(post =>
                  !query ||
                  post.title.toLowerCase().includes(query)
                );

              if (filtered.length === 0) {
                return (
                  <div className="board-empty">
                    <p className="board-empty__text">검색 결과가 없습니다.</p>
                  </div>
                );
              }

              return filtered.map(post => (
                <button key={post.id} className="board-post-card" onClick={() => { navigate("BoardDetailPage", { postId: post.id }) }}>
                  <div className="board-post-card__img">
                    {getFirstImage(post.content) ? (
                      <img src={getFirstImage(post.content)} alt={post.title} />
                    ) : (
                      currentCategory.icon
                    )}
                  </div>
                  <div className="board-post-card__body">
                    {post.viewCount > 1000 && <Badge />}
                    <p className="board-post-card__title">{post.title}</p>
                    <p className="board-post-card__meta">{post.createdAt} · 조회수 {post.viewCount}</p>
                  </div>
                </button>
              ));
            })()}
          </div>

          {/* TOP5 사이드바 */}
          <aside className="board-top5">
            <div className="board-top5__title">👑 조회수 TOP 5</div>
            {[...postList]
              .sort((a, b) => b.viewCount - a.viewCount)
              .slice(0, 5)
              .map((post, index) => (
                <button
                  key={post.id}
                  className="board-top5__item"
                  onClick={() => { navigate("BoardDetailPage", { postId: post.id }) }}
                >
                  <span className={`board-top5__rank board-top5__rank--${index + 1}`}>
                    {index + 1}
                  </span>
                  <span className="board-top5__text">{post.title}</span>
                </button>
              ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
