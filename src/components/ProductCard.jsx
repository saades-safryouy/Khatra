import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from './Icons';

/**
 * Same props as before: { product, index }.
 * Optional `lang` ("fr" | "ar") → Arabic labels + RTL (mirrored layout/arrow).
 * Styling lives in product-card.css (your existing class names).
 */
const LABELS = {
  fr: { aria: 'Découvrir', cta: 'Voir la fiche', fallback: 'Gamme professionnelle' },
  ar: { aria: 'اكتشف', cta: 'عرض التفاصيل', fallback: 'مجموعة احترافية' },
};

export function ProductCard({ product, index = 0, lang = 'fr' }) {
  const reduce = useReducedMotion();
  const t = LABELS[lang] || LABELS.fr;

  return (
    <motion.article
      className="product-card"
      dir={lang === 'ar' ? 'rtl' : undefined}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index % 3, 2) * 0.07 }}
    >
      <Link
        to={`/produits/${product.slug}`}
        className="product-card-link"
        aria-label={`${t.aria} ${product.name}`}
      >
        <div className="product-card-img">
          {product.category && <span className="product-card-cat">{product.category}</span>}
          <img src={product.img} alt={product.name} loading="lazy" decoding="async" />
        </div>
        <div className="product-card-body">
          <h3>{product.name}</h3>
          {product.short && <p>{product.short}</p>}
          <div className="product-card-footer">
            <span className="product-card-tag">
              {product.formats?.length ? product.formats.join(' · ') : t.fallback}
            </span>
            <span className="product-card-cta">
              {t.cta} <ArrowRight s={15} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;