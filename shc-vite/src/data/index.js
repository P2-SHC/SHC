export const colors = {
  sage: '#4a7a50',
  sageMid: '#6b9e72',
  sageLight: '#e8f0e9',
  beige: '#f7f3ec',
  peach: '#e8956d',
  peachLight: '#fde8dc',
  textDark: '#2a2a2a',
  textMid: '#5a5a5a',
  textLight: '#8a8a7a',
  border: '#e4dfd6',
  white: '#ffffff',
};

export const fmt = (n) => Number(n).toLocaleString('ko-KR') + '원';

export const BOARD_META = {
  recipe:    { label: '레시피',  desc: '건강에 좋은 음식 레시피를 공유해요',  icon: '🥗' },
  lifestyle: { label: '라이프',  desc: '건강한 생활 습관을 나눠요',           icon: '🌸' },
  exercise:  { label: '운동',    desc: '시니어 맞춤 운동 정보',               icon: '🏃' },
};

export const products = [
  { id:1, name:'프리미엄 홍삼정 골드',   price:89000, category:'건강기능식품', tag:'베스트', color:'#c17f5a', emoji:'🍃' },
  { id:2, name:'관절 영양제 MSM 플러스', price:45000, category:'관절건강',    tag:'추천',  color:'#7a9e7e', emoji:'💪' },
  { id:3, name:'루테인 눈 영양제',        price:32000, category:'눈건강',      tag:'',      color:'#e8c06d', emoji:'👁️' },
  { id:4, name:'혈압 건강 코엔자임Q10',  price:38000, category:'혈압관리',    tag:'신상',  color:'#e8956d', emoji:'❤️' },
  { id:5, name:'칼슘 마그네슘 비타민D3', price:28000, category:'뼈건강',      tag:'',      color:'#7ab5c9', emoji:'🦴' },
  { id:6, name:'종합 비타민 시니어',      price:35000, category:'종합비타민',  tag:'인기',  color:'#9b8ec9', emoji:'✨' },
  { id:7, name:'유산균 장 건강',          price:42000, category:'장건강',      tag:'',      color:'#7a9e7e', emoji:'🌿' },
  { id:8, name:'오메가3 혈행 개선',       price:36000, category:'혈행관리',    tag:'추천',  color:'#5a8fc9', emoji:'🐟' },
  { id:9, name:'프로바이오틱스 12종',     price:55000, category:'장건강',      tag:'',      color:'#c9a85a', emoji:'💊' },
];

export const boards = {
  recipe: [
    { id:1, title:'혈압에 좋은 바나나 스무디 만들기',  date:'2025.04.15', views:1240, tag:'혈압관리', content:'바나나는 칼륨이 풍부하여 혈압 조절에 도움이 됩니다.\n\n재료: 바나나 1개, 저지방 우유 200ml, 꿀 1큰술\n\n만드는 법:\n1. 바나나를 적당히 썰어 믹서기에 넣습니다.\n2. 차가운 저지방 우유를 붓고 꿀을 추가합니다.\n3. 30초간 곱게 갈아줍니다.\n4. 컵에 담아 즉시 마십니다.' },
    { id:2, title:'관절에 좋은 연어 샐러드 레시피',   date:'2025.04.12', views:890,  tag:'관절건강', content:'연어에는 오메가3 지방산이 풍부하여 관절 염증 완화에 도움이 됩니다.\n\n재료: 훈제연어 100g, 양상추, 방울토마토, 올리브오일, 레몬즙' },
    { id:3, title:'당뇨 예방 현미밥 짓는 법',         date:'2025.04.10', views:2100, tag:'당뇨관리', content:'현미는 혈당 지수가 낮아 당뇨 예방에 효과적입니다.\n\n핵심 팁:\n- 현미를 6시간 이상 물에 불리면 소화가 잘 됩니다\n- 현미:백미 = 7:3 비율로 시작하면 먹기 편합니다' },
    { id:4, title:'뼈 건강 두유 미역국',              date:'2025.04.08', views:756,  tag:'뼈건강',   content:'칼슘이 풍부한 두유와 미역을 활용한 건강한 미역국 레시피입니다.' },
    { id:5, title:'눈 건강을 위한 당근 주스',         date:'2025.04.05', views:1580, tag:'눈건강',   content:'당근의 베타카로틴이 눈 건강에 도움을 줍니다.' },
  ],
  lifestyle: [
    { id:1, title:'봄철 건강 관리 10가지 방법',           date:'2025.04.14', views:3200, tag:'계절건강', content:'봄이 되면서 기온 변화가 심해집니다. 환절기 건강 관리를 위한 10가지 생활 습관을 알려드립니다.' },
    { id:2, title:'수면의 질을 높이는 저녁 루틴',         date:'2025.04.11', views:1890, tag:'수면건강', content:'숙면은 건강의 기본입니다. 잠들기 전 실천할 수 있는 수면 개선 루틴을 소개합니다.' },
    { id:3, title:'사회적 교류가 치매 예방에 미치는 영향', date:'2025.04.09', views:2450, tag:'치매예방', content:'치매 예방에는 사회적 활동이 중요합니다.' },
    { id:4, title:'스트레스 해소에 좋은 취미 생활',       date:'2025.04.07', views:1100, tag:'취미생활', content:'원예, 그림 그리기, 음악 등 스트레스 해소에 효과적인 취미 활동을 소개합니다.' },
    { id:5, title:'혼자서도 즐거운 건강한 노후 만들기',   date:'2025.04.03', views:4100, tag:'노후생활', content:'혼자 생활하더라도 건강하고 즐겁게 일상을 보내는 방법을 공유합니다.' },
  ],
  exercise: [
    { id:1, title:'무릎 통증 없는 실내 스트레칭 5가지', date:'2025.04.16', views:5200, tag:'스트레칭',  content:'무릎이 아파도 할 수 있는 실내 스트레칭 동작입니다.\n\n동작 1. 의자에 앉아 발목 돌리기 (좌우 각 10회)\n동작 2. 앉아서 무릎 폈다 굽히기 (10회)\n동작 3. 어깨 앞뒤로 돌리기 (10회)' },
    { id:2, title:'아침 10분 혈액순환 체조',             date:'2025.04.13', views:3800, tag:'혈액순환',  content:'하루를 활기차게 시작하는 아침 혈액순환 체조를 소개합니다.' },
    { id:3, title:'노르딕 워킹으로 전신 운동하기',       date:'2025.04.10', views:2200, tag:'유산소운동', content:'두 개의 폴을 이용한 노르딕 워킹은 상하체를 동시에 운동할 수 있는 유산소 운동입니다.' },
    { id:4, title:'낙상 예방 균형 감각 훈련',           date:'2025.04.08', views:4500, tag:'낙상예방',  content:'낙상은 어르신들에게 매우 위험할 수 있습니다. 간단한 균형 훈련으로 낙상을 예방하세요.' },
    { id:5, title:'수중 운동의 효과와 방법',             date:'2025.04.05', views:1650, tag:'수중운동',  content:'관절에 부담 없는 수중 운동은 시니어에게 최적의 운동입니다.' },
  ],
};

export const allPosts = [
  ...boards.recipe.map(p => ({ ...p, category: 'recipe', categoryLabel: '레시피' })),
  ...boards.lifestyle.map(p => ({ ...p, category: 'lifestyle', categoryLabel: '라이프' })),
  ...boards.exercise.map(p => ({ ...p, category: 'exercise', categoryLabel: '운동' })),
];

export const top5 = [...allPosts].sort((a, b) => b.views - a.views).slice(0, 5);

export const mockCart = [
  { product: products[0], qty: 1 },
  { product: products[1], qty: 2 },
];

export const mockComments = [
  { author: '김영자', text: '정말 도움이 됩니다. 꼭 실천해볼게요!', date: '2025.04.17' },
  { author: '박정수', text: '좋은 정보 감사합니다.', date: '2025.04.16' },
];
