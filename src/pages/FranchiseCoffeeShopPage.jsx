import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../assets/images';
import { ArrowRight, Check } from '../components/Icons';
import SEO from '../components/SEO';

export function FranchiseCoffeeShopPage() {
  return (
    <div className="franchise-concept-page">
      <SEO
        title="Franchise Khatra Coffee Shop"
        description="Ouvrez votre coffee shop de spécialité sous enseigne Khatra au Maroc. Modèle clé en main, marges solides et formation barista."
      />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-bg">
          <img src={Images.khatra.hero} alt="Khatra Coffee Shop" />
        </div>
        <div className="page-header-overlay" />
        <div className="page-header-inner">
          <span className="eyebrow">Concept Franchise 01</span>
          <h1>Khatra Coffee Shop</h1>
          <p>
            L’art de vivre café contemporain : une signature sensorielle unique, une carte de boissons virales et un espace de partage chaleureux.
          </p>
        </div>
      </div>

      {/* Concept Section 1 */}
      <div className="concept-section">
        <div className="concept-img">
          <img src={Images.khatra.khatra360} alt="Ambiance Khatra Coffee Shop" />
        </div>
        <div className="concept-copy">
          <span className="eyebrow">L’Expérience Barista</span>
          <h2>Une ambiance soignée et une carte innovante.</h2>
          <p>
            Nos coffee shops sont pensés comme des tiers-lieux urbains où se mêlent amateurs de bon café, étudiants et professionnels en quête d’un cadre stimulant.
          </p>
          <p>
            Des espressos parfaitement extraits aux lattes signatures aromatisés avec nos sirops exclusifs, chaque recette est conçue pour fidéliser une clientèle récurrente.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
            <div style={{ background: 'var(--linen-d)', padding: '16px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--bordeaux)' }}>70%+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--toffee)', textTransform: 'uppercase' }}>Marge brute moyenne</div>
            </div>
            <div style={{ background: 'var(--linen-d)', padding: '16px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--bordeaux)' }}>60 à 150 m²</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--toffee)', textTransform: 'uppercase' }}>Surfaces modulables</div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Section 2 (Reverse) */}
      <div className="concept-section reverse" style={{ background: 'var(--linen-d)' }}>
        <div className="concept-img">
          <img src={Images.khatra.grainClose} alt="Café de spécialité Khatra" />
        </div>
        <div className="concept-copy">
          <span className="eyebrow">Excellence Produit</span>
          <h2>La garantie d’un approvisionnement direct.</h2>
          <p>
            En tant que franchisé Khatra Coffee Shop, vous bénéficiez de notre chaîne d’approvisionnement exclusive : grains torréfiés sur mesure, sirops gastronomiques et emballages éco-responsables à tarif préférentiel.
          </p>
          <div className="process-steps" style={{ margin: '24px 0' }}>
            <div className="process-step">
              <span className="step-num"><Check s={18} /></span>
              <div className="step-info">
                <h4>Formation Complète à l’Académie Khatra</h4>
                <p>Formation théorique et pratique barista de 2 semaines pour vous et votre équipe.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-num"><Check s={18} /></span>
              <div className="step-info">
                <h4>Équipement Professionnel Calibré</h4>
                <p>Machines espresso et moulins haut de gamme négociés au meilleur tarif.</p>
              </div>
            </div>
          </div>
          <Link to="/contact?subject=Franchise%20Coffee%20Shop" className="btn btn-primary">
            Parler de mon projet Coffee Shop <ArrowRight s={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FranchiseCoffeeShopPage;
