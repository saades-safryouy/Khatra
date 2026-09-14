import React from 'react';
import Images from '../../assets/images';

export function HomeBrand() {
  return (
    <section className="container section">
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
        <span className="eyebrow">Identité & Esprit</span>
        <h2>Une marque fière, pensée pour marquer les esprits.</h2>
        <p style={{ marginTop: '16px' }}>
          Des visuels audacieux, des recettes créatives et une proximité unique avec la culture urbaine marocaine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <img src={Images.slogans.slogan1} alt="Khatra Slogan 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <img src={Images.slogans.slogan2} alt="Khatra Slogan 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <img src={Images.slogans.slogan3} alt="Khatra Slogan 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </section>
  );
}

export default HomeBrand;
