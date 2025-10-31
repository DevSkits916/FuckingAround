import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import en from './en.json';
import es from './es.json';

type Locale = 'en' | 'es';

type Messages = Record<string, string>;

type Dictionaries = Record<Locale, Messages>;

const dictionaries: Dictionaries = {
  en,
  es,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Messages | string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'smartSignature.locale';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in dictionaries) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key: string) => dictionaries[locale][key] ?? key,
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

export const useT = () => useI18n().t;

