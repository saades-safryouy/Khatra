import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';
import HomeHero from './home/HomeHero';
import HomeIntro from './home/HomeIntro';
import HomeEcosystem from './home/HomeEcosystem';
import HomeBrand from './home/HomeBrand';

export function HomePage() {
  const { products } = useData();
  const featured = products.slice(0, 4);

  return (
    <div className="home-page">
      <SEO
        title="Coffee & Retail Partner au Maroc"
        description="Khatra développe un écosystème marocain complet autour du café de spécialité, des sirops d'exception et des concepts de franchise."
      />

      <HomeHero />
      <HomeIntro />
      <HomeEcosystem />
      <HomeBrand />

      {/* Products Showcase */}
      <section style={{ background: 'var(--linen-d)', padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="eyebrow">Sélection B2B</span>
              <h2>Les indispensables de votre établissement.</h2>
            </div>
            <Link to="/produits" className="btn btn-primary btn-sm">
              Voir tout le catalogue <ArrowRight s={14} />
            </Link>
          </div>

          <div className="products-grid" style={{ padding: 0 }}>
            {featured.map(prod => (
              <div key={prod.id} className="product-card">
                <div className="product-card-img">
                  <img src={prod.img} alt={prod.name} loading="lazy" />
                  <span className="product-card-cat">{prod.category}</span>
                </div>
                <div className="product-card-body">
                  <h3>{prod.name}</h3>
                  <p>{prod.short}</p>
                  <div className="product-card-footer">
                    <span className="product-card-tag">{prod.formats?.[0] || 'Pro'}</span>
                    <Link to={`/produits/${prod.slug}`} className="btn-text" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      Détails ↗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Callout Band */}
      <section style={{ background: 'var(--bordeaux)', color: '#fff', padding: '90px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>Partenariat & Distribution</span>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>Prêt à intégrer l’écosystème Khatra ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '36px' }}>
            Que vous souhaitiez ouvrir une franchise, commander des produits en gros ou équiper votre établissement, nos conseillers sont à votre écoute.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-light">
              Demander un devis / RDV <ArrowRight s={16} />
            </Link>
            <Link to="/franchise" className="btn btn-outline-light">
              Dossier Franchise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
