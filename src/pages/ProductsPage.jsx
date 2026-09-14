import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, WhatsApp } from '../components/Icons';
import SEO from '../components/SEO';

export function ProductsPage() {
  const { products, settings } = useData();
  const [activeCategory, setActiveCategory] = useState('Tout');

  const categories = ['Tout', 'Café', 'Sirops', 'Bubbles'];

  const filtered = activeCategory === 'Tout'
    ? products
    : products.filter(p => p.category === activeCategory);

  const waNum = settings?.whatsapp || '212661000000';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent("Bonjour Khatra, je souhaite recevoir le catalogue tarifaire professionnel B2B.")}`;

  return (
    <div className="products-page">
      <SEO
        title="Catalogue Professionnel B2B"
        description="Découvrez la gamme professionnelle Khatra : grains de café sélectionnés, sirops pour boissons et bubbles de fruits."
      />

      {/* Page Header */}
      <div className="page-header no-image">
        <div className="page-header-inner">
          <span className="eyebrow">Catalogue & Épicerie Pro</span>
          <h1>Nos Produits B2B</h1>
          <p>
            Des ingrédients de haute volée pensés pour les baristas, mixologues, salons de thé et concepts de restauration moderne.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ background: 'var(--linen)', borderBottom: '1px solid rgba(42,30,23,0.08)', padding: '24px 0', position: 'sticky', top: 'var(--nav-h)', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-dark'}`}
              style={{ padding: '8px 20px', borderRadius: '30px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container section">
        <div className="products-grid" style={{ padding: 0 }}>
          {filtered.map(prod => (
            <div key={prod.id} className="product-card">
              <div className="product-card-img">
                <img src={prod.img} alt={prod.name} loading="lazy" />
                <span className="product-card-cat">{prod.category}</span>
              </div>
              <div className="product-card-body">
                <h3>{prod.name}</h3>
                <p>{prod.short}</p>
                <div className="product-card-footer">
                  <span className="product-card-tag">{prod.formats?.join(' · ') || 'Format Pro'}</span>
                  <Link to={`/produits/${prod.slug}`} className="btn-text" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Voir la fiche <ArrowRight s={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom B2B Banner */}
      <section style={{ background: 'var(--dark)', color: '#fff', padding: '80px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>Commande volumique & Échantillons</span>
            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '8px' }}>Besoin d’un devis sur-mesure ?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Livraison pro rapide sur tout le Maroc et tarification dégressive par carton / palette.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">
              Demander un devis B2B <ArrowRight s={16} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsApp s={18} color="#fff" /> Commander via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
