import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation(); // Get i18n instance

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // <-- This actually switches the language globally
  };

  const currentLang = i18n.language; // current active language

  return (
    <div className="flex items-center space-x-2 bg-gray-800 p-1.5 rounded-full shadow-inner">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          currentLang === 'en'
            ? 'bg-emerald-500 text-white shadow-md'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <span role="img" aria-label="English">
          🇺🇸 EN
        </span>
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          currentLang === 'fr'
            ? 'bg-emerald-500 text-white shadow-md'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <span role="img" aria-label="French">
          🇫🇷 FR
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
