import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import koArticles from '../article/articleData.json';
import enArticles from '../article/articleDataEn.json';
import jaArticles from '../article/articleDataJp.json';

export const ArticleContext = createContext();

export function ArticleProvider({ children }) {
  const { i18n } = useTranslation();
  const [articles, setArticles] = useState(koArticles);

  useEffect(() => {
    const lang = i18n.language.split('-')[0];
    if (lang === 'en') {
      setArticles(enArticles);
    } else if (lang === 'ja') {
      setArticles(jaArticles);
    } else {
      setArticles(koArticles);
    }
  }, [i18n.language]);

  return (
    <ArticleContext.Provider value={{ articles }}>
      {children}
    </ArticleContext.Provider>
  );
}
