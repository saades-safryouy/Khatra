import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import productsApi from '../services/productsApi';
import { adaptProduct } from '../services/dataAdapters';
import { ArrowLeft, Check, WhatsApp, ArrowRight } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useCart } from '../context/cartStore';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { products, settings, loading: contextLoading, showToast } = useData();
  const { addProduct } = useCart();
  const { t, lang } = useLang();
  const [lookupResult, setLookupResult] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const matchedProduct = products.find((p) => p.slug === slug || String(p.id) === String(slug));
  const lookupMatchesSlug = lookupResult?.slug === slug;
  const fetchedProduct = lookupMatchesSlug ? lookupResult.product : null;
  const fetchError = lookupMatchesSlug ? lookupResult.error : null;
  const loadingDirect = !matchedProduct && Boolean(slug) && !lookupMatchesSlug;
  const product = matchedProduct || fetchedProduct;

  // FIX: the same component instance is reused when you open a related product,
  // so the previously selected thumbnail used to "stick" on the next product.
  useEffect(() => {
    setSelectedImg(null);
  }, [slug]);

  useEffect(() => {
    if (!matchedProduct && slug) {
      let cancelled = false;
      productsApi.getProductBySlug(slug)
        .then((res) => {
          if (!cancelled) {
            setLookupResult({ slug, product: res ? adaptProduct(res) : null, error: null });
          }
        })
        .catch((err) => {
          if (!cancelled) setLookupResult({ slug, product: null, error: err });
        });
      return () => { cancelled = true; };
    }
  }, [matchedProduct, slug, retryKey]);

  // zoom origin follows the pointer (desktop only – see CSS)
  const handleZoomMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  if ((contextLoading && !product) || loadingDirect) {
    return (
      <div className="product-page-state" role="status" aria-live="polite">
        <span className="product-loader" aria-hidden="true" />
        <p>{t('Chargement du produit...')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-state">
        <span className="eyebrow">{t('Catalogue Khatra')}</span>
        <h1>{fetchError ? t('Fiche momentanément indisponible') : t('Produit introuvable')}</h1>
        <p>
          {fetchError
            ? t('Impossible de charger cette fiche pour le moment. Vous pouvez réessayer ou revenir au catalogue.')
            : t('Cette référence n’est pas disponible dans notre catalogue.')}
        </p>
        <div className="product-state-actions">
          {fetchError && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setLookupResult(null);
                setRetryKey((key) => key + 1);
              }}
            >
              {t('Réessayer')}
            </button>
          )}
          <Link to="/produits" className="btn btn-primary">
            <ArrowLeft s={16} /> {t('Retour au catalogue')}
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.status !== 'INACTIVE')
    .slice(0, 3);

  const hasPrice = product.price !== null && product.price !== undefined;
  const priceLabel = hasPrice
    ? `${new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(product.price)} MAD`
    : t('Prix sur demande');

  const waNum = settings?.whatsapp || '212661000000';
  const waMsg = `Bonjour Khatra, je souhaite obtenir des informations professionnelles et tarifs pour le produit : ${product.name}.`;
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
  const quoteUrl = `/contact?product=${encodeURIComponent(product.name)}`;
  const currentImage = selectedImg || product.img;
  const slide = lang === 'ar' ? 18 : -18;

  const handleAdd = () => {
    if (addProduct(product)) showToast(t('Produit ajouté au panier.'));
  };

  return (
    <div className="product-detail-page has-mobile-bar">
      <SEO title={`${product.name} — B2B`} description={product.short} />

      {/* breadcrumb replaces the lone "back" link */}
      <div className="product-detail-top container">
        <nav className="product-breadcrumb" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link to="/produits">
                <ArrowLeft s={14} /> {t('Catalogue')}
              </Link>
            </li>
            {product.category && <li>{product.category}</li>}
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>
      </div>

      <div className="product-detail-wrap">
        <motion.div
          className="product-detail-img"
          initial={{ opacity: 0, x: slide }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="product-detail-image-frame" onMouseMove={handleZoomMove}>
            <img key={currentImage} src={currentImage} alt={product.name} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="product-detail-gallery" aria-label={t('Images du produit')}>
              {product.images.map((im, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImg(im)}
                  className={`product-detail-thumb${currentImage === im ? ' is-selected' : ''}`}
                  aria-label={`${t('Afficher l’image')} ${idx + 1} — ${product.name}`}
                  aria-pressed={currentImage === im}
                >
                  <img src={im} alt="" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="product-detail-info"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <span className="eyebrow">
            {product.category} · {t('Gamme Professionnelle')}
          </span>
          <h1>{product.name}</h1>

          <p className={`product-detail-price${hasPrice ? '' : ' is-on-request'}`}>{priceLabel}</p>

          <p className="product-detail-description">{product.desc || product.short}</p>

          <dl className="product-specs">
            <div className="product-spec-row">
              <dt>{t('Catégorie')}</dt>
              <dd>{product.category}</dd>
            </div>
            {product.formats?.length > 0 && (
              <div className="product-spec-row">
                <dt>{t('Conditionnements')}</dt>
                <dd className="product-spec-chips">
                  {product.formats.map((f) => (
                    <span key={f} className="product-spec-chip">{f}</span>
                  ))}
                </dd>
              </div>
            )}
            {product.reference && (
              <div className="product-spec-row">
                <dt>{t('Référence')}</dt>
                <dd>{product.reference}</dd>
              </div>
            )}
          </dl>

          {product.features && product.features.length > 0 && (
            <div className="product-features">
              <h2>{t('Points forts produit')}</h2>
              <ul>
                {product.features.map((feat, i) => (
                  <li key={i}>
                    <span aria-hidden="true"><Check s={16} /></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* clear hierarchy: ONE primary action */}
          <div className="product-detail-actions">
            {hasPrice && (
              <button type="button" className="btn btn-primary" onClick={handleAdd}>
                {t('Ajouter au panier')}
              </button>
            )}
            <Link to={quoteUrl} className={`btn ${hasPrice ? 'btn-outline' : 'btn-primary'}`}>
              {t('Demander une offre tarifaire B2B')} <ArrowRight s={16} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsApp s={18} color="#fff" /> {t('Échanger directement sur WhatsApp')}
            </a>

            <ul className="product-trust">
              <li><Check s={14} /> {t('Tarification dégressive par volume')}</li>
              <li><Check s={14} /> {t('Échantillons disponibles pour les professionnels')}</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="product-related">
          <div className="container">
            <div className="product-related-heading">
              <span className="eyebrow">{t('À découvrir également')}</span>
              <h2>{t('Dans la même gamme')}</h2>
            </div>
            <div className="products-grid">
              {related.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* mobile sticky action bar */}
      <div className="product-mobile-bar">
        <div className="product-mobile-bar__info">
          <strong>{product.name}</strong>
          <span>{priceLabel}</span>
        </div>
        {hasPrice ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd}>
            {t('Ajouter au panier')}
          </button>
        ) : (
          <Link to={quoteUrl} className="btn btn-primary btn-sm">
            {t('Demander une offre tarifaire B2B')}
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;