
import Badge from '../components/Badge.jsx';
import './MainPage.css';
import { AirQualityWidget, WeatherWidget } from '../components/Widgets.jsx';
import { useState } from "react";
import articles from '../article/articleData.json';

const CATEGORY_ICON = { recipe: "🥗", life: "🧘", exercise: "🏃" };

/**
 * MainPage - 메인 페이지 (SHC-001)
 */
const today = new Date();

const getFirstImage = (content) => {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  if (match) {
    const src = match[1];
    return src.startsWith('http') ? src : `/src/data/boardIMG/${src}`;
  }
  return null;
};

const cleanContent = (content, maxLength = 100) => {
  const cleaned = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 제거
    .replace(/<iframe.*?<\/iframe>/g, '') // iframe 제거
    .replace(/[#*`>\-|!\[\]()]/g, '') // 마크다운 기호 제거
    .replace(/\s+/g, ' ') // 연속된 공백 하나로 축소
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength) + "...";
};

export default function MainPage({ navigate }) {
  const [postList, setPostList] = useState(articles);
  // 현재 날짜와 비교하여 가장 최신 날짜로 비교
  const featuredPost = [...postList].sort((a, b) => {
    const diffA = Math.abs(today - new Date(a.createdAt));
    const diffB = Math.abs(today - new Date(b.createdAt));
    //날짜 비교 및 조회수 높은 것
    return diffA !== diffB ? diffA - diffB : b.viewCount - a.viewCount;
  })[0];

  return (
    <div className="page">

      <div className="container main-layout">
        <AirQualityWidget navigate={navigate} />

        <main className="main-content">
          {/* 최신 인기글 */}
          <div className="featured-card">
            <p className="featured-card__label">최신 인기글</p>
            {featuredPost ? (
              <div className="featured-card__body">
                <div className="featured-card__img" onClick={() => navigate("BoardDetailPage", { postId: featuredPost.id })} style={{ cursor: 'pointer' }}>
                  {getFirstImage(featuredPost.content) ? (
                    <img src={getFirstImage(featuredPost.content)} alt={featuredPost.title} />
                  ) : (
                    CATEGORY_ICON[featuredPost.category] ?? "📄"
                  )}
                </div>
                <div className="featured-card__info">
                  <p className="featured-card__title">{featuredPost.title}</p>
                  <p className="featured-card__content">
                    {cleanContent(featuredPost.content, 250)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="featured-card__empty">게시글이 없습니다.</p>
            )}
          </div>

          {/* 최신 건강 정보 */}
          <section className="main-section">
            <h2 className="main-section__title">최신 건강 정보</h2>
            <div className="board-list">
              {[...postList]
                //   글 가장 최신순으로 정렬
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(post => (
                  <button key={post.id} className="board-post-card" onClick={() => {
                    navigate("BoardDetailPage", { postId: post.id });
                  }}>
                    <div className="board-post-card__img">
                      {getFirstImage(post.content) ? (
                        <img src={getFirstImage(post.content)} alt={post.title} />
                      ) : (
                        CATEGORY_ICON[post.category] ?? "📄"
                      )}
                    </div>
                    <div className="board-post-card__body">
                      {post.viewCount > 1000 && <Badge />}
                      <p className="board-post-card__title">{post.title}</p>
                      <p className="board-post-card__meta">{post.createdAt} · 조회수 {post.viewCount}</p>
                    </div>
                  </button>
                ))}
            </div>
          </section>
        </main>

        <WeatherWidget navigate={navigate} />
      </div>
    </div>
  );
}
