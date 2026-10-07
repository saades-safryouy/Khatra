import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from './Icons';
import { useCart } from '../context/cartStore';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import { useActivePromotion } from '../hooks/useActivePromotion';

/**
 * Props: { product, index, lang? }
 * `lang` ("fr" | "ar") is optional and, when given, wins over the app language
 * (before, the app language always won, so the prop never did anything).
 * Styling lives in product-card.css.
 */
const LABELS = {
  fr: {
    aria: 'Découvrir', cta: 'Voir la fiche', fallback: 'Gamme professionnelle',
    onRequest: 'Prix sur demande', add: 'Ajouter au panier', inCart: 'Au panier', addMore: 'Ajouter',
    quote: 'Demander un devis', added: 'Produit ajouté au panier.',
  },
  ar: {
    aria: 'اكتشف', cta: 'عرض التفاصيل', fallback: 'مجموعة احترافية',
    onRequest: 'السعر عند الطلب', add: 'إضافة إلى السلة', inCart: 'في السلة', addMore: 'إضافة',
    quote: 'طلب عرض سعر', added: 'تمت إضافة المنتج إلى السلة.',
  },
};

export function ProductCard({ product, index = 0, lang: langProp }) {
  const reduce = useReducedMotion();
  const { addProduct, items } = useCart();
  const { showToast } = useData();
  const { lang: appLang } = useLang();
  const promoActive = useActivePromotion(product);
  const locale = langProp || appLang || 'fr';
  const t = LABELS[locale] || LABELS.fr;

  const hasPrice = product.price !== null && product.price !== undefined;
  const priceLabel = hasPrice
    ? `${new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(promoActive ? product.effectivePrice : product.price)} MAD`
    : t.onRequest;
  const quantity = items.find((item) => String(item.id) === String(product.id))?.quantity || 0;

  const addToCart = () => {
    if (addProduct(product)) showToast(t.added);
  };

  return (
    <motion.article
      className="product-card"
      dir={locale === 'ar' ? 'rtl' : undefined}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index % 3, 2) * 0.07 }}
    >
      {/* the bordered "one item" surface lives on this inner div, so framer-motion's
          transform on the <article> never fights the hover lift */}
      <div className="product-card-surface">
        <Link
          to={`/produits/${product.slug}`}
          className="product-card-link"
          aria-label={`${t.aria} ${product.name}`}
        >
          <div className="product-card-img">
            {product.category && <span className="product-card-cat">{product.category}</span>}
            <img src={product.img} alt={product.name} data-no-translate loading="lazy" decoding="async" />
          </div>
          <div className="product-card-body">
            <h3 data-no-translate>{product.name}</h3>
            {product.short && <p>{product.short}</p>}
            <span className={`product-card-price${hasPrice ? '' : ' is-on-request'}${promoActive ? ' is-promotional' : ''}`}>
              {promoActive && <del>{`${new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price)} MAD`}</del>}
              <strong>{priceLabel}</strong>
              {promoActive && <span className="product-promo-badge">-{product.promo}%</span>}
            </span>
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

        {hasPrice ? (
          <button
            type="button"
            className={`product-card-add${quantity ? ' is-in-cart' : ''}`}
            onClick={addToCart}
            aria-label={locale === 'ar' ? `أضف ${product.name} إلى السلة` : `Ajouter ${product.name} au panier`}
          >
            {quantity ? `${t.inCart} · ${quantity} — ${t.addMore}` : t.add}
          </button>
        ) : (
          <Link
            to={`/contact?product=${encodeURIComponent(product.name)}`}
            className="product-card-add is-quote"
          >
            {t.quote}
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export default ProductCard;