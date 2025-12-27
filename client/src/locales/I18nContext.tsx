import React, { createContext, useContext, useState, useEffect } from 'react';
import { TranslationResource, Locale, defaultLocale } from './types';
import { frCA } from './fr-CA';
import { hiIN } from './hi-IN';
import { esMX } from './es-MX';
import { esSUR } from './es-SUR';

// Import other locales lazily or statically as needed
const resources: Record<Locale, TranslationResource> = {
  'fr-CA': frCA,
  'en-CA': frCA, // Fallback for now
  'hi-IN': hiIN,
  'es-ES': esMX, // Temporary fallback to Mexico for base Spanish
  'es-MX': esMX,
  'es-SUR': esSUR,
};

interface I18nContextType {
  locale: Locale;
  t: TranslationResource;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('app_locale') as Locale;
    return saved || defaultLocale;
  });

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('app_locale', newLocale);
    setLocaleState(newLocale);
    // document.documentElement.lang = newLocale; // Optional: update HTML lang tag
  };

  const value = {
    locale,
    t: resources[locale] || resources[defaultLocale],
    setLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
