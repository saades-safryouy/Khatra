import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../../assets/images';
import { ArrowUpRight } from '../../components/Icons';

export function HomeEcosystem() {
  return (
    <section className="ecosystem">
      <div className="ecosystem-inner">
        <div className="ecosystem-header">
          <div>
            <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>Nos deux concepts phares</span>
            <h2 style={{ color: '#ffffff' }}>Un écosystème à fort potentiel.</h2>
          </div>
          <span className="ecosystem-mark">Franchise & Retail</span>
        </div>

        <div className="eco-grid">
          <div className="eco-card">
            <div className="eco-card-img">
              <img src={Images.khatra.khatra360} alt="Khatra Coffee Shop" loading="lazy" />
            </div>
            <div className="eco-card-body">
              <span className="eyebrow">Concept 01</span>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '10px' }}>Khatra Coffee Shop</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>
                L’expérience café de spécialité dans un univers chaleureux. Boissons signatures, méthodes douces et offre food sélectionnée.
              </p>
              <Link to="/franchise/coffee-shop" className="btn btn-outline-light btn-sm">
                Découvrir le Coffee Shop <ArrowUpRight s={14} />
              </Link>
            </div>
          </div>

          <div className="eco-card">
            <div className="eco-card-img">
              <img src={Images.khatra.packaging} alt="Khatra Market" loading="lazy" />
            </div>
            <div className="eco-card-body">
              <span className="eyebrow">Concept 02</span>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '10px' }}>Khatra Market</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Le point de distribution moderne : vente de café en grains, sirops, bubbles et accessoires pour particuliers et pros.
              </p>
              <Link to="/franchise/khatra-market" className="btn btn-outline-light btn-sm">
                Découvrir Khatra Market <ArrowUpRight s={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeEcosystem;
