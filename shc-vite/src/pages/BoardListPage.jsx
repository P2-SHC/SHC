import Header from '../components/Header.jsx';
import Badge from '../components/Badge.jsx';
import './BoardListPage.css';

/**
 * BoardListPage - 게시판 목록 (SHC-002)
 * @prop {'recipe'|'lifestyle'|'exercise'} category
 * @prop {boolean}  isLoggedIn
 * @prop {Array}    posts       - 게시글 목록
 * @prop {Array}    top5        - 조회수 TOP5
 * @prop {string}   searchValue - 검색어 (controlled)
 * @prop {Function} onSearchChange - (value) => void
 * @prop {Function} onPostClick    - (post) => void
 * @prop {Function} onNavClick
 */

const META = {
  recipe:    { label:'레시피', desc:'건강에 좋은 음식 레시피를 공유해요', icon:'🥗' },
  lifestyle: { label:'라이프', desc:'건강한 생활 습관을 나눠요',          icon:'🌸' },
  exercise:  { label:'운동',   desc:'시니어 맞춤 운동 정보',              icon:'🏃' },
};

export default function BoardListPage({
  category = 'recipe',
  isLoggedIn = false,
  posts = MOCK_POSTS,
  top5  = MOCK_TOP5,
  searchValue = '',
  onSearchChange,
  onPostClick,
  onNavClick,
}) {
  const meta = META[category];

  return (
    <div className="page">
      <Header activePage={category} isLoggedIn={isLoggedIn} onNavClick={onNavClick} cartCount={2} />

      <div className="container--md">
        {/* 페이지 헤더 */}
        <div className="board-header">
          <span className="board-header__icon">{meta.icon}</span>
          <div>
            <h1 className="board-header__title">{meta.label}</h1>
            <p className="board-header__desc">{meta.desc}</p>
          </div>
        </div>

        {/* 검색창 */}
        <div className="board-search">
          <input
            className="input board-search__input"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="게시글 검색..."
          />
        </div>

        <div className="board-layout">
          {/* 게시글 목록 */}
          <div className="board-list">
            {posts.map(post => (
              <button key={post.id} className="board-post-card" onClick={() => onPostClick?.(post)}>
                <div className="board-post-card__img">{meta.icon}</div>
                <div className="board-post-card__body">
                  <Badge text={post.tag} variant="sage" />
                  <p className="board-post-card__title">{post.title}</p>
                  <p className="board-post-card__meta">{post.date} · 조회 {Number(post.views).toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>

          {/* TOP5 사이드바 */}
          <aside className="board-top5">
            <div className="board-top5__title">👑 조회수 TOP 5</div>
            {top5.map((post, idx) => (
              <button key={idx} className="board-top5__item" onClick={() => onPostClick?.(post)}>
                <span className={`board-top5__rank board-top5__rank--${idx + 1}`}>{idx + 1}</span>
                <span className="board-top5__text">{post.title}</span>
              </button>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}

const MOCK_POSTS = [
  { id:1, title:'혈압에 좋은 바나나 스무디 만들기',  date:'2025.04.15', views:1240, tag:'혈압관리' },
  { id:2, title:'관절에 좋은 연어 샐러드 레시피',   date:'2025.04.12', views:890,  tag:'관절건강' },
  { id:3, title:'당뇨 예방 현미밥 짓는 법',         date:'2025.04.10', views:2100, tag:'당뇨관리' },
  { id:4, title:'뼈 건강 두유 미역국',              date:'2025.04.08', views:756,  tag:'뼈건강'   },
  { id:5, title:'눈 건강을 위한 당근 주스',         date:'2025.04.05', views:1580, tag:'눈건강'   },
];
const MOCK_TOP5 = [
  { id:1, category:'exercise',  title:'무릎 통증 없는 실내 스트레칭 5가지' },
  { id:5, category:'lifestyle', title:'혼자서도 즐거운 건강한 노후 만들기' },
  { id:1, category:'lifestyle', title:'봄철 건강 관리 10가지 방법'         },
  { id:4, category:'exercise',  title:'낙상 예방 균형 감각 훈련'           },
  { id:3, category:'lifestyle', title:'사회적 교류가 치매 예방에 미치는 영향' },
];
