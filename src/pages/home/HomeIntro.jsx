import React from 'react';

export function HomeIntro() {
  return (
    <section className="intro">
      <div className="intro-title">
        <span className="eyebrow intro-eyebrow">Une signature marocaine</span>
        <h2>L’alliance du savoir-faire barista et de la rigueur retail.</h2>
      </div>
      <div className="intro-text">
        <p>
          Fondée sur la conviction que le Maroc mérite une marque de café authentique et contemporaine, Khatra accompagne les professionnels, restaurateurs et franchisés avec des produits haut de gamme et un modèle économique robuste.
        </p>
        <div className="intro-stats">
          <div className="stat-item">
            <div className="stat-num">100%</div>
            <div className="stat-label">Dédié aux professionnels</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">11+</div>
            <div className="stat-label">Références signatures</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5+</div>
            <div className="stat-label">Points de présence</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">01</div>
            <div className="stat-label">Partenaire de confiance</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeIntro;
