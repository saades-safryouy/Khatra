import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../../assets/images';
import { useData } from '../../context/DataContext';
import { ArrowRight } from '../../components/Icons';

export function HomeHero() {
  const { content } = useData();

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={Images.bgHero} alt="Khatra Coffee & Retail" />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow">{content?.heroTagline || 'L’art du café & de la franchise au Maroc'}</span>
        <h1>{content?.heroTitle || 'Redéfinir l’expérience café au Maroc.'}</h1>
        <p>
          {content?.heroDesc || 'Khatra développe un écosystème marocain complet : café de spécialité, sirops d’exception, concepts de franchise Coffee Shop et retail Khatra Market.'}
        </p>
        <div className="hero-actions">
          <Link to="/franchise" className="btn btn-primary">
            Découvrir nos franchises <ArrowRight s={16} />
          </Link>
          <Link to="/produits" className="btn btn-outline-light">
            Explorer nos produits B2B
          </Link>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Défiler</span>
      </div>
    </section>
  );
}

export default HomeHero;
