import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import products from '../data/product.json';
import articles from '../article/articleData.json';
import './HealthRecommendPage.css';

const HEALTH_CONDITIONS = [
  { id: '고혈압', label: '고혈압', icon: '❤️' },
  { id: '당뇨', label: '당뇨', icon: '🩸' },
  { id: '관절통', label: '관절·무릎 통증', icon: '🦵' },
  { id: '눈건강', label: '눈 건강', icon: '👁️' },
  { id: '수면', label: '수면 장애', icon: '😴' },
  { id: '소화', label: '소화·장 건강', icon: '🌿' },
  { id: '피로', label: '만성 피로', icon: '⚡' },
  { id: '스트레스', label: '스트레스', icon: '🧘' },
  { id: '면역력', label: '면역력 강화', icon: '🛡️' },
  { id: '체중관리', label: '체중 관리', icon: '⚖️' },
  { id: '뼈건강', label: '뼈·골다공증', icon: '🦴' },
  { id: '혈액순환', label: '혈액 순환', icon: '🔄' },
  { id: '미세먼지', label: '미세먼지·호흡기', icon: '😷' },
  { id: '두뇌건강', label: '두뇌·기억력', icon: '🧠' },
  { id: '피부건강', label: '피부 건강', icon: '✨' },
];

// BOARDS 상수가 제거되고 articleData.json 데이터를 사용합니다.

const CATEGORY_LABEL = { recipe: '레시피', life: '라이프', exercise: '운동' };

const API_URL = import.meta.env.VITE_API_URL;

function buildPrompt(conditions, freeText) {
  const productSummary = products
    .map(p => `[${p.id}] ${p.title} (키워드: ${p.keyword.join(', ')})`)
    .join('\n');

  const postSummary = articles
    .filter(article => {
      // 선택된 건강 상태(id)와 게시글의 키워드가 일치하는 것만 필터링 (공백 제거 후 비교)
      if (conditions.length === 0) return true; // 선택된 게 없으면 전체 중 일부 제공
      return article.keyword.some(k =>
        conditions.some(cond => k.replace(/\s/g, '') === cond.replace(/\s/g, ''))
      );
    })
    .slice(0, 20) // 너무 많으면 프롬프트가 길어지므로 최대 20개로 제한
    .map(p => `[${p.category}:${p.id}] ${p.title} (키워드: ${p.keyword.join(', ')})`)
    .join('\n');

  const userInfo = [
    conditions.length > 0 ? `선택된 건강 상태: ${conditions.join(', ')}` : '',
    freeText.trim() ? `추가 입력: "${freeText.trim()}"` : '',
  ].filter(Boolean).join('\n');

  return `당신은 시니어 헬스케어 사이트의 건강 추천 어시스턴트입니다.
사용자의 건강 정보를 분석하여 아래 목록에서만 적합한 상품과 게시글을 추천해주세요.
헬스케어와 연관되지 않은 질문에는 답하면 안됩니다.

[사용자 건강 정보]
${userInfo}

[추천 가능한 상품 목록]
${productSummary}

[추천 가능한 게시글 목록]
${postSummary}

규칙:
- 상품과 게시글 각각 최대 4개까지 추천할 수 있지만, 사용자의 건강 상태와 관련성이 높은 것만 엄선하세요
- 관련성이 낮은 항목은 추천하지 마세요. 관련 항목이 적다면 1~2개만 추천해도 됩니다
- 목록에 없는 항목은 절대 추천하지 마세요
- comment는 사용자 건강 상태에 맞는 따뜻하고 구체적인 조언을 마크다운 형식으로 3~5문장 작성

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "productIds": [숫자 배열],
  "posts": [{"category": "recipe|life|exercise", "id": 숫자} 배열],
  "comment": "마크다운 조언 텍스트"
}`;
}

export default function HealthRecommendPage({ navigate, savedState, onSaveState }) {
  const [selected, setSelected] = useState(savedState?.selected ?? []);
  const [freeText, setFreeText] = useState(savedState?.freeText ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(savedState?.result ?? null);
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('shc_current_user') || '{}');
  const userInterests = currentUser?.interests ?? [];

  const toggleCondition = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0 && !freeText.trim()) {
      setError('건강 상태를 하나 이상 선택하거나 직접 입력해주세요.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: buildPrompt(selected, freeText) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '서버 오류가 발생했습니다.');
      }

      const data = await res.json();

      // AWS Guardrail이 차단한 경우 처리
      if (data.blocked || data.guardrailAction === 'BLOCKED') {
        setError(data.message || '헬스케어와 관련 없는 질문에는 답변드리기 어렵습니다. 건강 관련 질문을 입력해주세요.');
        return;
      }

      const raw = (data.response ?? '').trim();
      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}');

      // JSON 구조가 없는 경우 → Guardrail 거절 메시지이거나 빈 응답
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
        setError(raw || '헬스케어와 관련 없는 질문에는 답변드리기 어렵습니다. 건강 관련 질문을 입력해주세요.');
        return;
      }

      const jsonStr = raw.slice(jsonStart, jsonEnd + 1);

      // Claude가 JSON 문자열 값 안에 literal 줄바꿈을 넣는 경우 처리
      const sanitized = jsonStr.replace(/("(?:[^"\\]|\\.)*")/gs, (match) =>
        match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
      );
      const parsed = JSON.parse(sanitized);

      const recommendedProducts = (parsed.productIds || [])
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);

      const recommendedPosts = (parsed.posts || [])
        .map(({ category, id }) => {
          const post = articles.find(p => p.id === id && p.category === category);
          return post ? { ...post } : null;
        })
        .filter(Boolean);

      setResult({
        comment: parsed.comment || '',
        products: recommendedProducts,
        posts: recommendedPosts,
      });
    } catch (err) {
      setError('추천을 불러오는 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelected([]);
    setFreeText('');
    setResult(null);
    setError('');
    onSaveState(null);
  };

  return (
    <div className="page">
      <div className="container--sm">
        <div className="hr-header">
          <div className="hr-header__icon">💊</div>
          <div>
            <h1 className="hr-header__title">건강 맞춤 추천</h1>
            <p className="hr-header__desc">건강 상태를 알려주시면 맞춤 상품과 건강 정보를 추천해드려요</p>
          </div>
        </div>

        {!result && (
          <div className="hr-form card">
            <h2 className="hr-form__section-title">현재 건강 상태를 선택해주세요</h2>
            <div className="hr-conditions">
              {HEALTH_CONDITIONS.map(c => (
                <button
                  key={c.id}
                  className={`hr-condition-btn${selected.includes(c.id) ? ' hr-condition-btn--active' : ''}`}
                  onClick={() => toggleCondition(c.id)}
                >
                  <span className="hr-condition-btn__icon">{c.icon}</span>
                  <span>{c.label}</span>
                  {userInterests.includes(c.id) && <span className="hr-condition-btn__star">★</span>}
                </button>
              ))}
            </div>

            <h2 className="hr-form__section-title hr-form__section-title--mt">
              추가로 알려주실 내용이 있나요? <span className="hr-form__optional">(선택)</span>
            </h2>
            <textarea
              className="input hr-textarea"
              placeholder="예) 무릎이 자주 붓고 아파요. 소화도 잘 안 되는 편입니다."
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={4}
            />

            {error && <p className="hr-error">{error}</p>}

            <button
              className="btn btn--primary btn--lg btn--full hr-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '🔍 분석 중...' : '맞춤 추천 받기'}
            </button>
          </div>
        )}

        {loading && (
          <div className="hr-loading">
            <div className="hr-loading__spinner" />
            <p>건강 정보를 분석하고 있어요…</p>
          </div>
        )}

        {result && (
          <div className="hr-result">
            <div className="hr-comment card">
              <div className="hr-comment__label">🤖 AI 건강 조언</div>
              <div className="hr-comment__body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.comment}</ReactMarkdown>
              </div>
            </div>

            {result.products?.length > 0 && (
              <section className="hr-section">
                <h2 className="hr-section__title">추천 상품</h2>
                <div className="hr-product-grid">
                  {result.products.map(product => (
                    <button
                      key={product.id}
                      className="hr-product-card card"
                      onClick={() => {
                        onSaveState({ selected, freeText, result });
                        navigate('ProductDetailPage', { productId: product.id, from: 'HealthRecommendPage' });
                      }}
                    >
                      <div className="hr-product-card__img">
                        <img src={product.image} alt={product.title} />
                      </div>
                      <div className="hr-product-card__name">{product.title}</div>
                      <div className="hr-product-card__price">
                        {product.price.toLocaleString('ko-KR')}원
                      </div>
                      <div className="hr-product-card__tags">
                        {product.keyword.slice(0, 2).map(k => (
                          <span key={k} className="hr-tag">{k}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {result.posts?.length > 0 && (
              <section className="hr-section">
                <h2 className="hr-section__title">추천 건강 정보</h2>
                <div className="hr-post-list">
                  {result.posts.map(post => (
                    <button
                      key={`${post.category}-${post.id}`}
                      className="hr-post-card card"
                      onClick={() => {
                        onSaveState({ selected, freeText, result });
                        navigate('BoardDetailPage', { postId: post.id, category: post.category, from: 'HealthRecommendPage' });
                      }}
                    >
                      <span className="hr-post-card__category">{CATEGORY_LABEL[post.category]}</span>
                      <span className="hr-post-card__title">{post.title}</span>
                      <span className="hr-post-card__tag hr-tag">{post.keyword[0]}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <button className="btn btn--outline btn--full hr-reset" onClick={handleReset}>
              다시 추천받기
            </button>
          </div>
        )}

        <div className="hr-disclaimer">
          본 답변은 AI가 생성한 것으로, 사실과 다를 수 있습니다.<br />
          의료 답변에 대한 판단은 전문가 또는 공식 자료를 확인해 주세요.
        </div>
      </div>
    </div>
  );
}
