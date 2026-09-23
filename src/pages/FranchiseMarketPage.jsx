import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../assets/images';
import { ArrowRight, Check } from '../components/Icons';
import SEO from '../components/SEO';

export function FranchiseMarketPage() {
  return (
    <div className="franchise-concept-page">
      <SEO
        title="Franchise Khatra Market"
        description="Le concept retail spécialisé café, sirops et gourmandises au Maroc. Investissement maîtrisé et forte rotation des stocks."
      />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-bg">
          <img src={Images.khatra.packaging} alt="Khatra Market Retail" />
        </div>
        <div className="page-header-overlay" />
        <div className="page-header-inner">
          <span className="eyebrow">Concept Franchise 02</span>
          <h1>Khatra Market</h1>
          <p>
            Le concept retail de proximité nouvelle génération : vente de cafés en grains, sirops, bubbles, accessoires et gourmandises à emporter.
          </p>
        </div>
      </div>

      {/* Concept Section 1 */}
      <div className="concept-section">
        <div className="concept-img">
          <img src={Images.nidsys.syrupTrio} alt="Produits Khatra Market" />
        </div>
        <div className="concept-copy">
          <span className="eyebrow">Le Retail Spécialisé</span>
          <h2>Une boutique compacte à forte rentabilité au m².</h2>
          <p>
            Khatra Market répond à la demande croissante des particuliers et des petits professionnels qui veulent recréer l’expérience coffee shop chez eux ou dans leur établissement.
          </p>
          <p>
            Grâce à un agencement moderne et épuré, chaque mètre carré est optimisé pour maximiser le panier moyen et encourager les achats d’impulsion.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
            <div style={{ background: 'var(--linen-d)', padding: '16px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--bordeaux)' }}>30 à 80 m²</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--toffee)', textTransform: 'uppercase' }}>Surface compacte</div>
            </div>
            <div style={{ background: 'var(--linen-d)', padding: '16px', borderRadius: 'var(--radius)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--bordeaux)' }}>Élevée</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--toffee)', textTransform: 'uppercase' }}>Rotation des stocks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Section 2 (Reverse) */}
      <div className="concept-section reverse" style={{ background: 'var(--linen-d)' }}>
        <div className="concept-img">
          <img src={Images.bubbles.all} alt="Bubbles et Sirops Khatra" />
        </div>
        <div className="concept-copy">
          <span className="eyebrow">Écosystème Produits</span>
          <h2>Une offre diversifiée qui séduit toute l’année.</h2>
          <p>
            Du café fraîchement moulu sur place aux bouteilles de sirops Nidsys, en passant par les bubbles et le snacking haut de gamme : Khatra Market génère des flux constants toute la journée.
          </p>
          <div className="process-steps" style={{ margin: '24px 0' }}>
            <div className="process-step">
              <span className="step-num"><Check s={18} /></span>
              <div className="step-info">
                <h4>Investissement Initial Accessible</h4>
                <p>Aménagement allégé et pas de cuisine lourde, pour un retour sur investissement rapide.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-num"><Check s={18} /></span>
              <div className="step-info">
                <h4>Centrale Logistique Intégrée</h4>
                <p>Réapprovisionnement automatisé et gestion de stock simplifiée par logiciel connecté.</p>
              </div>
            </div>
          </div>
          <Link to="/contact?subject=Franchise%20Khatra%20Market" className="btn btn-primary">
            Parler de mon projet Khatra Market <ArrowRight s={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FranchiseMarketPage;
