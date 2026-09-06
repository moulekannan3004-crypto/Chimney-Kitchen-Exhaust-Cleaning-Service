import React, { createContext, useContext, useEffect, useState } from 'react';

const RTLContext = createContext();

export const RTLProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  const isRTL = lang === 'ar' || lang === 'he';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    root.setAttribute('lang', lang);
    localStorage.setItem('app_lang', lang);
  }, [lang, isRTL]);

  const toggleRTL = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <RTLContext.Provider value={{ lang, setLang, isRTL, toggleRTL }}>
      {children}
    </RTLContext.Provider>
  );
};

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
};
