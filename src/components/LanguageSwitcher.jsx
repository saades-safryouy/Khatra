import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export function LanguageSwitcher({ light = false }) {
  const { lang, setLang, loading } = useLang();

  return (
    <div className={`lang-switch${light ? ' lang-switch--light' : ''}`} role="group" aria-label={lang === 'ar' ? 'اختيار اللغة' : 'Choisir la langue'} dir="ltr">
      <motion.span
        className="lang-switch__thumb"
        animate={{ x: lang === 'ar' ? '100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />
      <button
        type="button"
        className={`lang-switch__btn${lang === 'fr' ? ' is-active' : ''}`}
        onClick={() => setLang('fr')}
        aria-pressed={lang === 'fr'}
      >
        FR
      </button>
      <button
        type="button"
        className={`lang-switch__btn${lang === 'ar' ? ' is-active' : ''}`}
        onClick={() => setLang('ar')}
        aria-pressed={lang === 'ar'}
      >
        {'العربية'}
      </button>
      {loading && <span className="lang-switch__status" aria-hidden="true" />}
    </div>
  );
}

export default LanguageSwitcher;
