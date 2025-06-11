
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Theme, Language, Tab } from '../types';
import { SunIcon, MoonIcon, LanguageIcon } from './icons'; // Assuming icons are in ./icons

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, tabs }) => {
  const { theme, setTheme, language, setLanguage, t } = useAppContext();

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const toggleLanguage = () => {
    setLanguage(language === Language.EN ? Language.AR : Language.EN);
  };

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-3 sm:mb-0 text-center sm:text-start">
            <h1 className="text-2xl font-bold text-primary dark:text-primary-light">{t('appName')}</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('tagline')}</p>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label={theme === Theme.LIGHT ? t('darkMode') : t('lightMode')}
            >
              {theme === Theme.LIGHT ? <MoonIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" /> : <SunIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label={t('language')}
            >
              <LanguageIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              <span className="ms-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {language === Language.EN ? 'AR' : 'EN'}
              </span>
            </button>
          </div>
        </div>
        
        <nav className="mt-3 -mb-3 sm:mt-4 border-t border-neutral-200 dark:border-neutral-700 sm:border-none">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-neutral-500 dark:text-neutral-400">
            {tabs.map((tab) => (
              <li key={tab.id} className="me-2 rtl:me-0 rtl:ms-2">
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg group ${
                    activeTab === tab.id
                      ? 'text-primary dark:text-primary-light border-primary dark:border-primary-light'
                      : 'border-transparent hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 me-2 rtl:me-0 rtl:ms-2 ${activeTab === tab.id ? 'text-primary dark:text-primary-light' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-500 dark:group-hover:text-neutral-300'}`} />
                  {t(tab.labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
