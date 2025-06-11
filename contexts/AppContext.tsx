
import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import { Theme, Language, AppContextType } from '../types';
import { LANGUAGE_STRINGS, FALLBACK_LOCAL_CURRENCY, LOCALE_CURRENCY_MAP, SUPPORTED_CURRENCIES } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const defaultContextValue: AppContextType = {
  theme: Theme.LIGHT,
  setTheme: () => {},
  language: Language.EN,
  setLanguage: () => {},
  translations: LANGUAGE_STRINGS[Language.EN],
  t: (key: string) => LANGUAGE_STRINGS[Language.EN][key] || key,
  apiKeyAvailable: typeof process.env.API_KEY === 'string' && process.env.API_KEY.length > 0,
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', Theme.LIGHT);
  const [language, setLanguageState] = useLocalStorage<Language>('language', Language.EN);
  const [initialLocalCurrency, setInitialLocalCurrency] = useState<string>(FALLBACK_LOCAL_CURRENCY);
  const apiKeyAvailable = typeof process.env.API_KEY === 'string' && process.env.API_KEY.length > 0;

  useEffect(() => {
    // Attempt to detect user's language from browser
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar' && language !== Language.AR) {
      setLanguageState(Language.AR);
    } else if (browserLang === 'en' && language !== Language.EN) {
        // Keep stored language if not explicitly browser 'en' or 'ar' matching a different stored one
    }

    // Attempt to detect user's local currency based on locale
    const userLocale = navigator.language; // e.g., 'en-US'
    let detectedCurrency = LOCALE_CURRENCY_MAP[userLocale];
    if (!detectedCurrency) {
        // Fallback to language part if full locale not found e.g. 'en' from 'en-US'
        const langPart = userLocale.split('-')[0];
        const genericLocale = Object.keys(LOCALE_CURRENCY_MAP).find(k => k.startsWith(langPart + '-'));
        if (genericLocale) detectedCurrency = LOCALE_CURRENCY_MAP[genericLocale];
    }
    
    if (detectedCurrency && SUPPORTED_CURRENCIES.find(c => c.code === detectedCurrency)) {
        setInitialLocalCurrency(detectedCurrency);
    } else {
        setInitialLocalCurrency(FALLBACK_LOCAL_CURRENCY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };
  
  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = LANGUAGE_STRINGS[language]?.[key] || LANGUAGE_STRINGS[Language.EN]?.[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translation = translation.replace(`{${placeholder}}`, String(value));
        });
    }
    return translation;
  }, [language]);

  const translations = LANGUAGE_STRINGS[language] || LANGUAGE_STRINGS[Language.EN];

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, translations, t, apiKeyAvailable }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
