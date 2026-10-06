import React from 'react';
import { Link } from 'react-router-dom';
import bgHero from '../../assets/design/khatrabg.jpeg';
import { ArrowRight } from '../../components/Icons';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LanguageContext';

export function HomeHero() {
  const { content } = useData();
  const { t } = useLang();

  const scrollToNextSection = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section
      className="hero-showcase"
      aria-label="Hero Khatra"
      style={{ backgroundImage: `url("${bgHero}")` }}
    >
      <div className="hero-showcase__content">
        <h1 className="hero-showcase__headline">
          <span>NCHORBOHA</span>
          <span>KHAAATRA</span>
        </h1>

        <p className="hero-showcase__desc">
          {t(
            content?.heroDesc ||
              "Khatra développe un écosystème marocain complet : café de spécialité, sirops d'exception, concepts de franchise Coffee Shop et retail Khatra Market."
          )}
        </p>

        <div className="hero-showcase__actions">
          <Link to="/produits" className="btn btn-primary">
            {t('Découvrir nos produits')} <ArrowRight s={16} />
          </Link>
          <Link to="/franchise" className="btn btn-outline-dark">
            {t('Devenir franchisé')}
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="hero-showcase__scroll"
        onClick={scrollToNextSection}
        aria-label={t('Défiler vers la suite')}
      >
        <span className="hero-showcase__scroll-text">{t('Défiler')}</span>
        <span className="hero-showcase__scroll-arrow" aria-hidden="true" />
      </button>
    </section>
  );
}

export default HomeHero;
