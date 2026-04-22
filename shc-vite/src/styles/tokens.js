// 공통 색상/스타일 토큰
export const C = {
  sage: '#4a7a50',
  sageMid: '#6b9e72',
  sageLight: '#e8f0e9',
  beige: '#f7f3ec',
  peach: '#e8956d',
  peachLight: '#fde8dc',
  white: '#ffffff',
  dark: '#2a2a2a',
  mid: '#5a5a5a',
  light: '#8a8a7a',
  border: '#e4dfd6',
};

export const S = {
  card: { background: '#fff', borderRadius: 16, border: '1px solid #e8e4de', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  cardHover: { boxShadow: '0 6px 28px rgba(0,0,0,0.12)' },
  btnPrimary: { background: C.sage, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  btnOutline: { background: '#fff', color: C.sage, border: `1.5px solid ${C.sage}`, borderRadius: 10, padding: '10px 22px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  btnGhost: { background: C.sageLight, color: C.sage, border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  input: { width: '100%', padding: '14px 18px', fontSize: 17, border: '1.5px solid #ddd', borderRadius: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
};
