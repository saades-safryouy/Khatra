import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import productsApi from '../services/productsApi';
import { adaptProduct } from '../services/dataAdapters';
import { ArrowLeft, Check, WhatsApp, ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { products, settings, loading: contextLoading } = useData();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loadingDirect, setLoadingDirect] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const matchedProduct = products.find((p) => p.slug === slug || String(p.id) === String(slug));
  const product = matchedProduct || fetchedProduct;

  useEffect(() => {
    if (!matchedProduct && slug) {
      setLoadingDirect(true);
      productsApi.getProductBySlug(slug)
        .then((res) => {
          if (res) setFetchedProduct(adaptProduct(res));
        })
        .catch(() => {
          setFetchedProduct(null);
        })
        .finally(() => {
          setLoadingDirect(false);
        });
    }
  }, [matchedProduct, slug]);

  if (contextLoading || loadingDirect) {
    return (
      <div className="container section" style={{ paddingTop: 'calc(var(--nav-h) + 60px)', textAlign: 'center' }}>
        <p style={{ color: 'var(--dark-s)' }}>Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/produits" replace />;
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
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

      <div className="container" style={{ paddingTop: 'calc(var(--nav-h) + 28px)' }}>
        <Link to="/produits" className="btn-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <ArrowLeft s={16} /> Retour au catalogue
        </Link>
      </div>

      <div className="product-detail-wrap" style={{ paddingTop: 0 }}>
        <div className="product-detail-img">
          <img src={currentImage} alt={product.name} />
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {product.images.map((im, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImg(im)}
                  style={{
                    border: currentImage === im ? '2px solid var(--caramel)' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    width: '60px',
                    height: '60px',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  <img src={im} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="eyebrow">{product.category} · Gamme Professionnelle</span>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--dark-s)', lineHeight: 1.8 }}>
            {product.desc || product.short}
          </p>

          <div className="product-specs">
            <div className="product-spec-row">
              <dt>Catégorie</dt>
              <dd>{product.category}</dd>
            </div>
            <div className="product-spec-row">
              <dt>Conditionnements</dt>
              <dd>{product.formats?.join(', ') || 'Standard Pro'}</dd>
            </div>
            <div className="product-spec-row">
              <dt>Usage recommandé</dt>
              <dd>Cafés, Coffee shops, Hôtels, Salons de thé, Bars</dd>
            </div>
            <div className="product-spec-row">
              <dt>Disponibilité</dt>
              <dd style={{ color: '#16a34a', fontWeight: 600 }}>En stock professionnel · Expédition Maroc</dd>
            </div>
          </div>

          {product.features && product.features.length > 0 && (
            <div style={{ marginBottom: '36px' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Points forts produit
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--bordeaux)', display: 'flex' }}><Check s={16} /></span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-actions">
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Demander une offre tarifaire B2B <ArrowRight s={16} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ justifyContent: 'center' }}>
              <WhatsApp s={18} color="#fff" /> Échanger directement sur WhatsApp
            </a>
            <p className="product-cta-note">
              Tarification dégressive par volume · Échantillons disponibles pour les professionnels.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ background: 'var(--linen-d)', padding: '80px 0' }}>
          <div className="container">
            <h3 style={{ marginBottom: '32px' }}>Produits complémentaires dans la même catégorie</h3>
            <div className="products-grid" style={{ padding: 0 }}>
              {related.map(p => (
                <div key={p.id} className="product-card">
                  <div className="product-card-img">
                    <img src={p.img} alt={p.name} loading="lazy" />
                  </div>
                  <div className="product-card-body">
                    <h4>{p.name}</h4>
                    <p>{p.short}</p>
                    <Link to={`/produits/${p.slug}`} className="btn-text">
                      Voir le produit ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
