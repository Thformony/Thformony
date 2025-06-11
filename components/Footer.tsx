
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const Footer: React.FC = () => {
  const { t } = useAppContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 py-8 text-center mt-12">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {currentYear} {t('appName')}. {t('tagline')}.
        </p>
        <p className="text-xs mt-1">
          Disclaimer: Exchange rates are for informational purposes only and may be subject to change. AI suggestions are not financial advice.
        </p>
      </div>
    </footer>
  );
};
