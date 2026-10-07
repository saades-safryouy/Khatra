import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { translateTexts } from '../services/translationApi';

const LanguageContext = createContext(null);
const LANG_KEY = 'khatra_lang';
const CACHE_KEY = 'khatra_i18n_cache';
const TRANSLATION_PENDING = 'جارٍ تحميل الترجمة…';
const TRANSLATION_UNAVAILABLE = 'تعذّر عرض الترجمة';

const ARABIC_UI = {
  'Accueil': 'الرئيسية',
  'Produits': 'المنتجات',
  'Produits B2B': 'منتجات الأعمال',
  'Franchise': 'الامتياز التجاري',
  'Stores': 'المتاجر',
  'Points de vente': 'نقاط البيع',
  'Notre histoire': 'قصتنا',
  'Contact': 'تواصل معنا',
  'Contact & Partenariat': 'التواصل والشراكات',
  'Devenir Partenaire': 'كن شريكاً',
  'Fermer le menu': 'إغلاق القائمة',
  'Ouvrir le menu': 'فتح القائمة',
  'Sélection Signature': 'اختياراتنا المميزة',
  'Les incontournables Khatra': 'منتجات خاترة المميزة',
  'Voir tous les produits': 'عرض جميع المنتجات',
  'Partenariat & Distribution Pro': 'الشراكة والتوزيع المهني',
  'Prêt à intégrer l’écosystème Khatra ?': 'هل أنت مستعد للانضمام إلى منظومة خاترة؟',
  'Devenir partenaire': 'كن شريكاً',
  'Dossier Franchise': 'ملف الامتياز التجاري',
  'Catalogue': 'الكتالوج',
  'Catalogue Khatra': 'كتالوج خاترة',
  'Prix sur demande': 'السعر عند الطلب',
  'Ajouter au panier': 'أضف إلى السلة',
  'Demander une offre tarifaire B2B': 'اطلب عرض أسعار للأعمال',
  'Échanger directement sur WhatsApp': 'تواصل مباشرة عبر واتساب',
  'Tarification dégressive par volume': 'أسعار مخفّضة حسب الكمية',
  'Échantillons disponibles pour les professionnels': 'عينات متاحة للمهنيين',
  'À découvrir également': 'اكتشف أيضاً',
  'Dans la même gamme': 'من المجموعة نفسها',
  'Catégorie': 'الفئة',
  'Conditionnements': 'الأحجام',
  'Référence': 'المرجع',
  'Points forts produit': 'مزايا المنتج',
  'Images du produit': 'صور المنتج',
  'Afficher l’image': 'عرض الصورة',
  'Chargement du produit...': 'جارٍ تحميل المنتج…',
  'Fiche momentanément indisponible': 'صفحة المنتج غير متاحة مؤقتاً',
  'Produit introuvable': 'المنتج غير موجود',
  'Impossible de charger cette fiche pour le moment. Vous pouvez réessayer ou revenir au catalogue.': 'تعذّر تحميل صفحة المنتج حالياً. يمكنك إعادة المحاولة أو الرجوع إلى الكتالوج.',
  'Cette référence n’est pas disponible dans notre catalogue.': 'هذا المنتج غير متوفر في الكتالوج.',
  'Réessayer': 'إعادة المحاولة',
  'Retour au catalogue': 'العودة إلى الكتالوج',
  'Gamme Professionnelle': 'مجموعة المنتجات المهنية',
  'Navigation': 'التنقل',
  'Franchise': 'الامتياز التجاري',
  "Vue d'ensemble": 'نظرة عامة',
  'Candidature Franchise': 'طلب الانضمام إلى الامتياز',
  'Contact & Siège': 'التواصل والمقر الرئيسي',
  'Siège & Showroom': 'المقر وصالة العرض',
  'Téléphone Direct': 'الهاتف المباشر',
  'Email Professionnel': 'البريد الإلكتروني المهني',
  'Tous droits réservés.': 'جميع الحقوق محفوظة.',
};

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
    console.warn('Unable to persist the Khatra translation cache.');
  }
}

function hasArabic(text) {
  return /[\u0600-\u06ff]/u.test(String(text || ''));
}

function hasLatinLetters(text) {
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/u.test(String(text || ''));
}

function isBrandOnly(text) {
  let remaining = String(text || '').trim();
  ['NCHORBOHA KHAAATRA', 'Khatra Market', 'Coffee Shop', 'Khatra', 'KHATRA', 'WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'B2B', 'MAD']
    .sort((a, b) => b.length - a.length)
    .forEach((brand) => { remaining = remaining.replace(new RegExp(brand, 'gi'), ' '); });
  return !hasLatinLetters(remaining);
}

function isFrenchFallback(source, translation) {
  return !isBrandOnly(source) && !hasArabic(translation);
}

function getSavedLanguage() {
  try {
    return localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'fr';
  } catch {
    return 'fr';
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getSavedLanguage);
  const [cache, setCache] = useState(loadCache);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(cache);
  const domTranslations = useRef({
    originalText: new WeakMap(),
    translatedText: new WeakMap(),
    originalAttributes: new WeakMap(),
    translatedAttributes: new WeakMap(),
    textNodes: new Set(),
    attributes: new Set(),
  });
  const pending = useRef(new Set());
  const timer = useRef(null);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle('is-rtl', lang === 'ar');
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      console.warn('Unable to save the selected Khatra language.');
    }
  }, [lang, dir]);

  const flush = useCallback(async (nextLang, texts) => {
    const unique = [...new Set(texts.map((text) => String(text || '').trim()).filter(Boolean))];
    if (!unique.length || nextLang !== 'ar') return;
    setLoading(true);
    try {
      const translations = await translateTexts(unique, nextLang, 'fr');
      setCache((previous) => {
        const next = { ...previous };
        unique.forEach((source, index) => {
          const translated = String(translations[index] || '').trim();
          next[`ar:${source}`] = isFrenchFallback(source, translated)
            ? (ARABIC_UI[source] || TRANSLATION_UNAVAILABLE)
            : translated;
        });
        cacheRef.current = next;
        saveCache(next);
        return next;
      });
    } catch (error) {
      console.error('Khatra Arabic translation request failed.', error);
      setCache((previous) => {
        const next = { ...previous };
        unique.forEach((source) => {
          next[`ar:${source}`] = ARABIC_UI[source] || TRANSLATION_UNAVAILABLE;
        });
        cacheRef.current = next;
        saveCache(next);
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const queue = useCallback((text) => {
    if (lang === 'fr' || !text) return;
    const source = String(text).trim();
    if (!source || !hasLatinLetters(source) || cacheRef.current[`ar:${source}`] || pending.current.has(source)) return;
    pending.current.add(source);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const batch = [...pending.current];
      pending.current.clear();
      flush(lang, batch);
    }, 60);
  }, [lang, flush]);

  const t = useCallback((text) => {
    if (!text || lang === 'fr') return text;
    const source = String(text);
    if (hasArabic(source) || isBrandOnly(source)) return text;
    const saved = cacheRef.current[`ar:${source}`];
    if (saved && hasArabic(saved)) return saved;
    if (ARABIC_UI[source]) return ARABIC_UI[source];
    queue(source);
    return TRANSLATION_PENDING;
  }, [lang, queue]);

  useEffect(() => {
    const {
      originalText, translatedText, originalAttributes, translatedAttributes, textNodes, attributes,
    } = domTranslations.current;
    const results = new Map(Object.entries(cacheRef.current)
      .filter(([key, value]) => key.startsWith('ar:') && hasArabic(value))
      .map(([key, value]) => [key.slice(3), value]));
    const pendingTranslations = new Set();
    const selector = 'aria-label,title,placeholder,alt';
    let active = true;

    const isExcluded = (node) => {
      const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      return !element
        || Boolean(element.closest('script,style,noscript,[contenteditable="true"],[data-no-translate],.product-card h3,.product-detail-info h1,.cart-product strong'));
    };
    const getSource = (node) => {
      const current = node.nodeValue || '';
      if (translatedText.get(node) === current) return originalText.get(node) || '';
      originalText.set(node, current);
      return current;
    };
    const setText = (node, source, value) => {
      if (!node.isConnected || getSource(node) !== source || node.nodeValue === value) return;
      translatedText.set(node, value);
      node.nodeValue = value;
    };
    const setAttribute = (element, name, source, value) => {
      if (!element.isConnected || originalAttributes.get(element)?.[name] !== source
        || element.getAttribute(name) === value) return;
      const translated = { ...(translatedAttributes.get(element) || {}), [name]: value };
      translatedAttributes.set(element, translated);
      element.setAttribute(name, value);
    };

    const translate = async (entries) => {
      const unique = [...new Set(entries.map((entry) => entry.source.trim()).filter(Boolean))];
      const missing = unique.filter((source) => !results.has(source) && !hasArabic(source)
        && !isBrandOnly(source) && !pendingTranslations.has(source));
      missing.forEach((source) => pendingTranslations.add(source));
      const fallback = (source) => (isBrandOnly(source) ? source : ARABIC_UI[source] || TRANSLATION_PENDING);
      entries.forEach((entry) => {
        if (hasArabic(entry.source)) return;
        const value = results.get(entry.source) || fallback(entry.source);
        if (entry.node) setText(entry.node, entry.source, value);
        else setAttribute(entry.element, entry.name, entry.source, value);
      });
      if (!missing.length) return;
      try {
        const translated = await translateTexts(missing, 'ar', 'fr');
        if (!active) return;
        missing.forEach((source, index) => {
          const value = String(translated[index] || '').trim();
          results.set(source, isFrenchFallback(source, value) ? (ARABIC_UI[source] || TRANSLATION_UNAVAILABLE) : value);
          pendingTranslations.delete(source);
        });
        setCache((previous) => {
          const next = { ...previous };
          results.forEach((value, source) => { next[`ar:${source}`] = value; });
          cacheRef.current = next;
          saveCache(next);
          return next;
        });
        entries.forEach((entry) => {
          if (entry.node) setText(entry.node, entry.source, results.get(entry.source) || fallback(entry.source));
          else setAttribute(entry.element, entry.name, entry.source, results.get(entry.source) || fallback(entry.source));
        });
      } catch (error) {
        console.error('Khatra page translation failed.', error);
        missing.forEach((source) => {
          results.set(source, ARABIC_UI[source] || TRANSLATION_UNAVAILABLE);
          pendingTranslations.delete(source);
        });
        entries.forEach((entry) => {
          if (entry.node) setText(entry.node, entry.source, results.get(entry.source) || fallback(entry.source));
          else setAttribute(entry.element, entry.name, entry.source, results.get(entry.source) || fallback(entry.source));
        });
      }
    };

    const collect = (root) => {
      const entries = [];
      if (root.nodeType === Node.TEXT_NODE) {
        if (!isExcluded(root)) {
          const source = getSource(root);
          if (source.trim() && hasLatinLetters(source) && !hasArabic(source)) {
            textNodes.add(root);
            entries.push({ node: root, source });
          }
        }
      } else if (root.nodeType === Node.ELEMENT_NODE) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (isExcluded(node)) continue;
          const source = getSource(node);
          if (source.trim() && hasLatinLetters(source) && !hasArabic(source)) {
            textNodes.add(node);
            entries.push({ node, source });
          }
        }
        if (!isExcluded(root) && root.matches?.(`[${selector.split(',').join('],[')}]`)) {
          for (const name of selector.split(',')) {
            const value = root.getAttribute(name);
            if (!value) continue;
            const stored = { ...(originalAttributes.get(root) || {}) };
            if (translatedAttributes.get(root)?.[name] === value) {
              if (stored[name]) entries.push({ element: root, name, source: stored[name] });
              continue;
            }
            stored[name] = value;
            originalAttributes.set(root, stored);
            if (hasLatinLetters(value) && !hasArabic(value)) {
              attributes.add({ element: root, name });
              entries.push({ element: root, name, source: value });
            }
          }
        }
        root.querySelectorAll?.(`[${selector.split(',').join('],[')}]`).forEach((element) => {
          if (isExcluded(element)) return;
          for (const name of selector.split(',')) {
            const value = element.getAttribute(name);
            if (!value) continue;
            const stored = { ...(originalAttributes.get(element) || {}) };
            if (translatedAttributes.get(element)?.[name] === value) {
              if (stored[name]) entries.push({ element, name, source: stored[name] });
              continue;
            }
            stored[name] = value;
            originalAttributes.set(element, stored);
            if (hasLatinLetters(value) && !hasArabic(value)) {
              attributes.add({ element, name });
              entries.push({ element, name, source: value });
            }
          }
        });
      }
      if (entries.length) translate(entries);
    };

    if (lang === 'ar') {
      collect(document.body);
      const observer = new MutationObserver((records) => {
        records.forEach((record) => {
          if (record.type === 'characterData') collect(record.target);
          if (record.type === 'attributes') collect(record.target);
          record.addedNodes?.forEach((node) => collect(node));
        });
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: selector.split(','),
      });
      return () => {
        active = false;
        observer.disconnect();
      };
    }

    textNodes.forEach((node) => {
      if (node.isConnected && translatedText.has(node) && node.nodeValue === translatedText.get(node)) {
        node.nodeValue = originalText.get(node) || '';
      }
    });
    attributes.forEach(({ element, name }) => {
      const original = originalAttributes.get(element)?.[name];
      const translated = translatedAttributes.get(element)?.[name];
      if (element.isConnected && original !== undefined && element.getAttribute(name) === translated) {
        element.setAttribute(name, original);
      }
    });
    textNodes.clear();
    attributes.clear();
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next === 'ar' ? 'ar' : 'fr');
  }, []);

  const value = useMemo(() => ({ lang, dir, loading, setLang, t }), [lang, dir, loading, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export default LanguageProvider;
