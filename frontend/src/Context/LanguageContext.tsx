'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Language } from '../Types/Language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode; initialLang: Language }> = ({ children, initialLang }) => {
  const [language, setLanguage] = useState<Language>(initialLang || 'bg');
  const [prevInitialLang, setPrevInitialLang] = useState<Language>(initialLang);

  if (initialLang && initialLang !== prevInitialLang) {
    setPrevInitialLang(initialLang);
    setLanguage(initialLang);
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const router = useRouter();
  const pathname = usePathname();

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    
    // Replace the first path segment if it's an existing locale
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'bg') {
      segments[1] = lang;
      router.push(segments.join('/'));
    } else {
      router.push(`/${lang}${pathname}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
