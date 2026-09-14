import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../assets/images';
import { ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';

export function FranchisePage() {
  return (
    <div className="franchise-page">
      <SEO
        title="Opportunités de Franchise"
        description="Ouvrez votre Khatra Coffee Shop ou Khatra Market au Maroc. Deux concepts éprouvés pour entrepreneurs passionnés."
      />

      {/* Franchise Hero */}
      <section className="franchise-hero">
        <div className="franchise-hero-inner">
          <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>Développement Réseau</span>
          <h1>Rejoignez l’aventure Khatra.</h1>
          <p>
            Deux concepts de franchise complémentaires conçus pour allier rentabilité, puissance de marque et expérience client mémorable au Maroc.
          </p>
        </div>

        {/* Split Panels */}
        <div className="franchise-split">
          <Link to="/franchise/coffee-shop" className="franchise-panel">
            <div className="franchise-panel-bg">
              <img src={Images.khatra.khatra360} alt="Franchise Khatra Coffee Shop" />
            </div>
            <div className="franchise-panel-overlay" />
            <div className="franchise-panel-body">
              <span className="eyebrow">Concept 01</span>
              <h2>Khatra Coffee Shop</h2>
              <p>
                L’expérience du café de spécialité, baristas formés, boissons signatures et espace de vie chaleureux.
              </p>
              <div className="franchise-panel-pill">
                <span className="pill">Format 60-150 m²</span>
                <span className="pill">Forte rentabilité</span>
                <span className="pill">Formation Barista</span>
              </div>
              <span className="btn btn-outline-light btn-sm" style={{ display: 'inline-flex' }}>
                Découvrir le modèle Coffee Shop <ArrowRight s={14} />
              </span>
            </div>
          </Link>

          <Link to="/franchise/khatra-market" className="franchise-panel">
            <div className="franchise-panel-bg">
              <img src={Images.khatra.packaging} alt="Franchise Khatra Market" />
            </div>
            <div className="franchise-panel-overlay" />
            <div className="franchise-panel-body">
              <span className="eyebrow">Concept 02</span>
              <h2>Khatra Market</h2>
              <p>
                Le concept retail de proximité nouvelle génération : vente de cafés en grains, sirops, bubbles et snacking premium.
              </p>
              <div className="franchise-panel-pill">
                <span className="pill">Format 30-80 m²</span>
                <span className="pill">Distribution Pro & Particuliers</span>
                <span className="pill">Gestion optimisée</span>
              </div>
              <span className="btn btn-outline-light btn-sm" style={{ display: 'inline-flex' }}>
                Découvrir le modèle Khatra Market <ArrowRight s={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      {/* 4 Pillars Section */}
      <section className="container section">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
          <span className="eyebrow">Pourquoi Khatra</span>
          <h2>Un accompagnement global pour maximiser votre réussite.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          <div style={{ background: 'var(--white)', padding: '36px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--bordeaux)', fontWeight: 'bold' }}>01</span>
            <h4 style={{ margin: '16px 0 10px' }}>Identité de Marque Forte</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--dark-s)' }}>
              Une notoriété grandissante, un univers graphique distinctif et une communauté engagée sur les réseaux sociaux.
            </p>
          </div>

          <div style={{ background: 'var(--white)', padding: '36px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--bordeaux)', fontWeight: 'bold' }}>02</span>
            <h4 style={{ margin: '16px 0 10px' }}>Centrale d’Achat & Marges</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--dark-s)' }}>
              Approvisionnement direct sans intermédiaires pour garantir des marges brutes optimales sur chaque vente.
            </p>
          </div>

          <div style={{ background: 'var(--white)', padding: '36px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--bordeaux)', fontWeight: 'bold' }}>03</span>
            <h4 style={{ margin: '16px 0 10px' }}>Formation Barista Continue</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--dark-s)' }}>
              Formation complète de vos équipes : extraction espresso, latte art, mixologie de sirops et gestion de stock.
            </p>
          </div>

          <div style={{ background: 'var(--white)', padding: '36px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--bordeaux)', fontWeight: 'bold' }}>04</span>
            <h4 style={{ margin: '16px 0 10px' }}>Accompagnement Clé en Main</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--dark-s)' }}>
              Aide au choix de l’emplacement, agencement architectural 3D, installation technique et plan marketing d’ouverture.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Steps */}
      <section style={{ background: 'var(--linen-d)', padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span className="eyebrow">Processus</span>
            <h2>Comment devenir franchisé Khatra ?</h2>
          </div>

          <div className="process-steps" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div className="process-step">
              <span className="step-num">01</span>
              <div className="step-info">
                <h4>Prise de Contact & Candidature</h4>
                <p>Remplissez le formulaire en ligne pour nous faire part de votre projet et de votre ville cible.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-num">02</span>
              <div className="step-info">
                <h4>Échange & Analyse Stratégique</h4>
                <p>Rencontre avec l’équipe dirigeante Khatra et étude de faisabilité de votre zone géographique.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-num">03</span>
              <div className="step-info">
                <h4>Validation du Local & Plans 3D</h4>
                <p>Validation conjointe de l’emplacement et modélisation de l’agencement intérieur.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-num">04</span>
              <div className="step-info">
                <h4>Formation & Travaux</h4>
                <p>Formation théorique et pratique de vos baristas pendant l’aménagement du point de vente.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-num">05</span>
              <div className="step-info">
                <h4>Inauguration & Accompagnement Continu</h4>
                <p>Lancement assisté par nos experts et suivi commercial régulier pour dynamiser vos ventes.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link to="/contact" className="btn btn-primary">
              Déposer une candidature franchise <ArrowRight s={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FranchisePage;
