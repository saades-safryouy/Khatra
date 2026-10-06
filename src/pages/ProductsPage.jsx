import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { ArrowRight, WhatsApp } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import productsIntroImage from '../assets/design/PRODUCTS_bg.jpeg';

export function ProductsPage() {
  const { products, categories: backendCategories, settings, loading, error, refreshData } = useData();
  const [activeCategory, setActiveCategory] = useState('Tout');

  const categories = [
    'Tout',
    ...Array.from(new Set([...(backendCategories || []), ...products.map((p) => p.category)])).filter(Boolean),
  ];

  const filtered = activeCategory === 'Tout'
    ? products
    : products.filter((p) => p.category === activeCategory || p.categorySlug === activeCategory.toLowerCase());

  const waNum = settings?.whatsapp || '212661000000';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent("Bonjour Khatra, je souhaite recevoir le catalogue tarifaire professionnel B2B.")}`;

  return (
    <div className="products-page">
      <SEO
        title="Catalogue Professionnel B2B"
        description="Découvrez la gamme professionnelle Khatra : grains de café sélectionnés, sirops pour boissons et bubbles de fruits."
      />

      <header className="products-intro">
        <div className="products-intro-bg" aria-hidden="true">
          <img src={productsIntroImage} alt="" fetchPriority="high" />
        </div>
        <div className="products-intro-inner">
          <span className="eyebrow">Catalogue & Épicerie Pro</span>
          <h1>Nos Produits</h1>
          <p>
            Des ingrédients de haute volée pensés pour les baristas, mixologues, salons de thé et concepts de restauration moderne.
          </p>
          <span className="products-intro-index">Khatra · Sélection professionnelle</span>
        </div>
      </header>

      <nav className="products-filters container" aria-label="Filtrer par catégorie">
        <div className="products-filters-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`products-filter${activeCategory === cat ? ' is-active' : ''}`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="products-count">
          {filtered.length} {filtered.length === 1 ? 'référence' : 'références'}
        </span>
      </nav>

      <section className="container products-catalogue" aria-label="Catalogue produits">
        {error && (
          <div className="products-state products-state--notice" role="status">
            <p>Le catalogue est affiché avec les données disponibles. La synchronisation est momentanément indisponible.</p>
            <button type="button" className="btn-text" onClick={refreshData}>Réessayer</button>
          </div>
        )}
        {loading && products.length === 0 ? (
          <div className="products-state" role="status" aria-live="polite">Chargement du catalogue…</div>
        ) : filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="products-state">
            <h2>Aucun produit dans cette catégorie</h2>
            <p>Choisissez une autre catégorie pour parcourir notre sélection professionnelle.</p>
            <button type="button" className="btn-text" onClick={() => setActiveCategory('Tout')}>
              Voir tout le catalogue <ArrowRight s={15} />
            </button>
          </div>
        )}
      </section>

      <motion.section
        className="products-b2b"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container products-b2b-inner">
          <div>
            <span className="eyebrow">Commande volumique & Échantillons</span>
            <h2>Besoin d’un devis sur-mesure ?</h2>
            <p>
              Livraison pro rapide sur tout le Maroc et tarification dégressive par carton / palette.
            </p>
          </div>
          <div className="products-b2b-actions">
            <Link to="/contact" className="btn btn-primary">
              Demander un devis B2B <ArrowRight s={16} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsApp s={18} color="#fff" /> Commander via WhatsApp
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default ProductsPage;
