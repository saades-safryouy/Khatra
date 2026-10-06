import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import productsApi from '../services/productsApi';
import { adaptProduct } from '../services/dataAdapters';
import { ArrowLeft, Check, WhatsApp, ArrowRight } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { products, settings, loading: contextLoading } = useData();
  const [lookupResult, setLookupResult] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const matchedProduct = products.find((p) => p.slug === slug || String(p.id) === String(slug));
  const lookupMatchesSlug = lookupResult?.slug === slug;
  const fetchedProduct = lookupMatchesSlug ? lookupResult.product : null;
  const fetchError = lookupMatchesSlug ? lookupResult.error : null;
  const loadingDirect = !matchedProduct && Boolean(slug) && !lookupMatchesSlug;
  const product = matchedProduct || fetchedProduct;

  useEffect(() => {
    if (!matchedProduct && slug) {
      let cancelled = false;
      productsApi.getProductBySlug(slug)
        .then((res) => {
          if (!cancelled) {
            setLookupResult({
              slug,
              product: res ? adaptProduct(res) : null,
              error: null,
            });
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setLookupResult({ slug, product: null, error: err });
          }
        });
      return () => { cancelled = true; };
    }
  }, [matchedProduct, slug, retryKey]);

  if ((contextLoading && !product) || loadingDirect) {
    return (
      <div className="product-page-state" role="status" aria-live="polite">
        <p style={{ color: 'var(--dark-s)' }}>Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-state">
        <span className="eyebrow">Catalogue Khatra</span>
        <h1>{fetchError ? 'Fiche momentanément indisponible' : 'Produit introuvable'}</h1>
        <p>{fetchError ? 'Impossible de charger cette fiche pour le moment. Vous pouvez réessayer ou revenir au catalogue.' : 'Cette référence n’est pas disponible dans notre catalogue.'}</p>
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
              Réessayer
            </button>
          )}
          <Link to="/produits" className="btn btn-primary"><ArrowLeft s={16} /> Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.status !== 'INACTIVE')
    .slice(0, 3);

  const waNum = settings?.whatsapp || '212661000000';
  const waMsg = `Bonjour Khatra, je souhaite obtenir des informations professionnelles et tarifs pour le produit : ${product.name}.`;
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
  const currentImage = selectedImg || product.img;

  return (
    <div className="product-detail-page">
      <SEO
        title={`${product.name} — B2B`}
        description={product.short}
      />

      <div className="product-detail-top container">
        <Link to="/produits" className="btn-text">
          <ArrowLeft s={16} /> Retour au catalogue
        </Link>
      </div>

      <div className="product-detail-wrap">
        <motion.div
          className="product-detail-img"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="product-detail-image-frame">
            <img src={currentImage} alt={product.name} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="product-detail-gallery" aria-label="Images du produit">
              {product.images.map((im, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImg(im)}
                  className={`product-detail-thumb${currentImage === im ? ' is-selected' : ''}`}
                  aria-label={`Afficher l’image ${idx + 1} de ${product.name}`}
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
          <span className="eyebrow">{product.category} · Gamme Professionnelle</span>
          <h1>{product.name}</h1>
          <p className="product-detail-description">
            {product.desc || product.short}
          </p>

          <dl className="product-specs">
            <div className="product-spec-row">
              <dt>Catégorie</dt>
              <dd>{product.category}</dd>
            </div>
            {product.formats?.length > 0 && (
              <div className="product-spec-row">
                <dt>Conditionnements</dt>
                <dd>{product.formats.join(', ')}</dd>
              </div>
            )}
            {product.reference && (
              <div className="product-spec-row">
                <dt>Référence</dt>
                <dd>{product.reference}</dd>
              </div>
            )}
          </dl>

          {product.features && product.features.length > 0 && (
            <div className="product-features">
              <h2>Points forts produit</h2>
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

          <div className="product-detail-actions">
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="btn btn-primary">
              Demander une offre tarifaire B2B <ArrowRight s={16} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsApp s={18} color="#fff" /> Échanger directement sur WhatsApp
            </a>
            <p className="product-cta-note">
              Tarification dégressive par volume · Échantillons disponibles pour les professionnels.
            </p>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="product-related">
          <div className="container">
            <div className="product-related-heading">
              <span className="eyebrow">À découvrir également</span>
              <h2>Dans la même gamme</h2>
            </div>
            <div className="products-grid">
              {related.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
