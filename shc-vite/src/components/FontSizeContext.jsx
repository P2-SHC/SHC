import { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

const BASE_PX = 16;
const SCALES = { small: 0.8, default: 1.0, large: 1.4 };

export function FontSizeProvider({ children }) {
  const [fontScale, setFontScale] = useState(
    () => localStorage.getItem('shc_font_scale') || 'default'
  );

  useEffect(() => {
    document.documentElement.style.fontSize = `${BASE_PX * SCALES[fontScale]}px`;
    localStorage.setItem('shc_font_scale', fontScale);
  }, [fontScale]);

  return (
    <FontSizeContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
