import Badge from '../components/Badge.jsx';
import './BoardListPage.css';
import articles from '../article/articleData.json';
import { useState, useEffect, useRef, useCallback } from 'react';

const PAGE_SIZE = 5;

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
  const [postList] = useState(articles);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);  //최초 값 5개의 글
  const sentinelRef = useRef(null);
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
  //현재 값이 [category]로 값을 설정하되 없으면 레시피로 값이 되도록
  const currentCategory = categoryData[category] || categoryData.recipe;
  //대소문자 구분없이 소문자로 검색
  const query = searchTerm.trim().toLowerCase();
  //현재 카테고리와 일치하는경우 + 검색어와 일치하는 경우
  const filtered = [...postList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(post => post.category === category)
    .filter(post => !query || post.title.toLowerCase().includes(query));
  //0부터 글이 5개 씩 늘어남
  const visiblePosts = filtered.slice(0, visibleCount);
  const isEnd = visibleCount >= filtered.length;

  // 검색어/카테고리 변경 시 초기화 ( 다시 5개)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, category]);

  // IntersectionObserver로 무한 스크롤
  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && !isEnd) {
      setVisibleCount(prev => prev + PAGE_SIZE);
    }
  }, [isEnd]);

  useEffect(() => {
    //리스트 맨아래 빈 박스를 가리킴
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 }); //관찰 대상이 100%화면에 보일때만 handleObserver실행
    observer.observe(sentinel); //관찰 시작
    return () => observer.disconnect(); //컴포넌트가 사라질때 관찰 중단 메모리 정리
  }, [handleObserver]);

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
            {filtered.length === 0 ? (
              <div className="board-empty">
                <p className="board-empty__text">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <>
                {visiblePosts.map(post => (
                  <button key={post.id} className="board-post-card" onClick={() => { navigate("BoardDetailPage", { postId: post.id, from: 'BoardListPage' }) }}>
                    <div className="board-post-card__img">
                      {/* dev 브랜치의 이미지 미리보기 로직 통합 */}
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
                ))}

                {/* feat/boardScroll 브랜치의 무한 스크롤 감지 로직 통합 */}
                <div ref={sentinelRef} className="board-sentinel" />
                {isEnd && (
                  <p className="board-end-text">마지막입니다</p>
                )}
              </>
            )}
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
                  onClick={() => { navigate("BoardDetailPage", { postId: post.id, from: 'BoardListPage' }) }}
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