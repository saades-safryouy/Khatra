import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { translateTexts } from '../services/translationApi';

const LanguageContext = createContext(null);
const LANG_KEY = 'khatra_lang';
const CACHE_KEY = 'khatra_i18n_cache';

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'fr';
    } catch {
      return 'fr';
    }
  });
  const [cache, setCache] = useState(loadCache);
  const [loading, setLoading] = useState(false);
  const pending = useRef(new Set());
  const timer = useRef(null);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle('is-rtl', lang === 'ar');
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, dir]);

  const flush = useCallback(async (nextLang, texts) => {
    const unique = [...new Set(texts.map((t) => String(t || '').trim()).filter(Boolean))];
    if (!unique.length || nextLang === 'fr') return;
    setLoading(true);
    try {
      const translations = await translateTexts(unique, nextLang, 'fr');
      setCache((prev) => {
        const next = { ...prev };
        unique.forEach((src, i) => {
          next[`${nextLang}:${src}`] = translations[i] || src;
        });
        saveCache(next);
        return next;
      });
    } catch {
      // keep French on failure
    } finally {
      setLoading(false);
    }
  }, []);

  const queue = useCallback((text) => {
    if (lang === 'fr' || !text) return;
    const src = String(text).trim();
    if (!src || cache[`${lang}:${src}`] || pending.current.has(src)) return;
    pending.current.add(src);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const batch = [...pending.current];
      pending.current.clear();
      flush(lang, batch);
    }, 60);
  }, [lang, cache, flush]);

  const t = useCallback((text) => {
    if (!text || lang === 'fr') return text;
    const src = String(text);
    const hit = cache[`ar:${src}`];
    if (hit) return hit;
    queue(src);
    return src;
  }, [lang, cache, queue]);

  const setLang = useCallback((next) => {
    setLangState(next === 'ar' ? 'ar' : 'fr');
  }, []);

  const value = useMemo(() => ({
    lang,
    dir,
    loading,
    setLang,
    t,
  }), [lang, dir, loading, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export default LanguageProvider;
