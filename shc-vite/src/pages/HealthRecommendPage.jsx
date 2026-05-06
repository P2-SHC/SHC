import { useState, useContext, useMemo } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleContext } from '../components/ArticleContext.jsx';
import { ProductContext } from '../components/ProductContext.jsx';
import './HealthRecommendPage.css';

// HEALTH_CONDITIONS와 CATEGORY_LABEL이 컴포넌트 내부로 이동되었습니다 (t 함수 사용을 위해).

const API_URL = import.meta.env.VITE_API_URL;

function buildPrompt(conditions, freeText, products, articles) {
  const productSummary = products
    .map(p => `[${p.id}] ${p.title} (키워드: ${p.keyword.join(', ')})`)
    .join('\n');

  const postSummary = articles
    .filter(article => {
      // 선택된 건강 상태(id)와 게시글의 키워드가 일치하는 것만 필터링
      if (conditions.length === 0) return true;
      
      return article.keyword.some(k => {
        const cleanK = k.replace(/\s/g, '');
        return conditions.some(condId => {
          // condId는 'high_blood_pressure' 등 영문 키
          // article.keyword는 현재 언어에 따라 다름 (ko: '고혈압', en: 'High Blood Pressure' 등)
          // i18next를 통해 condId에 해당하는 번역어와 비교
          const localizedLabel = i18next.t(`ai_recommend.conditions.${condId}`).replace(/\s/g, '');
          return cleanK === localizedLabel;
        });
      });
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
  "productIds": [1, 2, 3],
  "posts": [{"category": "recipe", "id": 1}, {"category": "life", "id": 2}],
  "comment": "마크다운 조언 텍스트"
}`;
}

export default function HealthRecommendPage({ navigate, savedState, onSaveState }) {
  const { articles } = useContext(ArticleContext);
  const { products } = useContext(ProductContext);
  const [selected, setSelected] = useState(savedState?.selected ?? []);
  const [freeText, setFreeText] = useState(savedState?.freeText ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(savedState?.result ?? null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const HEALTH_CONDITIONS_BASE = [
    { id: 'high_blood_pressure', icon: '❤️' },
    { id: 'diabetes', icon: '🩸' },
    { id: 'joint_pain', icon: '🦵' },
    { id: 'eye_health', icon: '👁️' },
    { id: 'sleep_disorder', icon: '😴' },
    { id: 'digestion', icon: '🌿' },
    { id: 'fatigue', icon: '⚡' },
    { id: 'stress', icon: '🧘' },
    { id: 'immunity', icon: '🛡️' },
    { id: 'weight_management', icon: '⚖️' },
    { id: 'bone_health', icon: '🦴' },
    { id: 'blood_circulation', icon: '🔄' },
    { id: 'respiratory', icon: '😷' },
    { id: 'brain_health', icon: '🧠' },
    { id: 'skin_health', icon: '✨' },
  ];

  const healthConditions = useMemo(() => 
    HEALTH_CONDITIONS_BASE.map(c => ({
      ...c,
      label: t(`ai_recommend.conditions.${c.id}`)
    })), [t]
  );

  const CATEGORY_LABEL = {
    recipe: t('board.recipe'),
    life: t('board.life'),
    exercise: t('board.exercise')
  };

  const currentUser = JSON.parse(localStorage.getItem('shc_current_user') || '{}');
  const userInterests = currentUser?.interests ?? [];

  const toggleCondition = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0 && !freeText.trim()) {
      setError(t('ai_recommend.error_select'));
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: buildPrompt(selected, freeText, products, articles) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('ai_recommend.error_general'));
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

      // JSON 보정 로직 강화
      let sanitized = jsonStr
        // 1. 문자열 내 줄바꿈/탭 처리
        .replace(/("(?:[^"\\]|\\.)*")/gs, (match) =>
          match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
        )
        // 2. 객체/배열 사이 누락된 쉼표 보정 (예: } { -> } , {)
        .replace(/\}\s*\{/g, '},{')
        .replace(/\]\s*\[/g, '],[')
        // 3. 숫자 배열 내 누락된 쉼표 보정 (예: [1 2 3] -> [1, 2, 3])
        .replace(/(\d)\s+(\d)/g, '$1, $2')
        // 4. 후행 쉼표 제거 (예: [1, 2, ] -> [1, 2])
        .replace(/,\s*([\]\}])/g, '$1');

      let parsed;
      try {
        parsed = JSON.parse(sanitized);
      } catch (parseErr) {
        console.error('AI JSON Parse Error:', parseErr, 'Raw string:', sanitized);
        throw new Error(t('ai_recommend.error_general'));
      }

      const recommendedProducts = (parsed.productIds || [])
        .map(id => products.find(p => p.id === Number(id)))
        .filter(Boolean);

      const recommendedPosts = (parsed.posts || [])
        .map(({ category, id }) => {
          const post = articles.find(p => p.id === Number(id) && p.category === category);
          return post ? { ...post } : null;
        })
        .filter(Boolean);

      setResult({
        comment: parsed.comment || '',
        products: recommendedProducts,
        posts: recommendedPosts,
      });
    } catch (err) {
      console.error('Recommendation Error:', err);
      setError(t('ai_recommend.error_general'));
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
            <h1 className="hr-header__title">{t('ai_recommend.title')}</h1>
            <p className="hr-header__desc">{t('ai_recommend.desc')}</p>
          </div>
        </div>

        {!result && (
          <div className="hr-form card">
            <h2 className="hr-form__section-title">{t('ai_recommend.form_title')}</h2>
            <div className="hr-conditions">
              {healthConditions.map(c => (
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
              {t('ai_recommend.extra_title')} <span className="hr-form__optional">{t('ai_recommend.optional')}</span>
            </h2>
            <textarea
              className="input hr-textarea"
              placeholder={t('ai_recommend.textarea_placeholder')}
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
              {loading ? t('ai_recommend.analyzing') : t('ai_recommend.get_rec')}
            </button>
          </div>
        )}

        {loading && (
          <div className="hr-loading">
            <div className="hr-loading__spinner" />
            <p>{t('ai_recommend.analyzing_desc')}</p>
          </div>
        )}

        {result && (
          <div className="hr-result">
            <div className="hr-comment card">
              <div className="hr-comment__label">{t('ai_recommend.ai_advice')}</div>
              <div className="hr-comment__body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.comment}</ReactMarkdown>
              </div>
            </div>

            {result.products?.length > 0 && (
              <section className="hr-section">
                <h2 className="hr-section__title">{t('ai_recommend.rec_products')}</h2>
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
                        {product.price.toLocaleString('ko-KR')}{t('board.currency')}
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
                <h2 className="hr-section__title">{t('ai_recommend.rec_info')}</h2>
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
              {t('ai_recommend.reset')}
            </button>
          </div>
        )}

        <div className="hr-disclaimer">
          {t('ai_recommend.disclaimer')}
        </div>
      </div>
    </div>
  );
}
