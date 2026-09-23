import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Images from '../../assets/images';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowRight } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';

const E = [0.22, 1, 0.36, 1];

const CATEGORIES = [
  {
    key: 'cafe',
    label: 'Café en Grains',
    sub: 'Torréfaction artisanale',
    img: Images.khatra.packaging,
    dominant: true,
  },
  {
    key: 'sirops',
    label: 'Sirops Gourmands',
    sub: '11 références signature',
    img: Images.nidsys.syrupTrio,
    dominant: false,
  },
  {
    key: 'bubbles',
    label: 'Bubbles Popping',
    sub: 'Perles de fruits premium',
    img: Images.bubbles.all,
    dominant: false,
  },
];

export function HomeCategories() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useLang();

  return (
    <section className="home-categories" ref={ref}>
      <div className="container">
        <motion.div
          className="home-categories__head"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: E }}
        >
          <span className="eyebrow">{t('Nos produits')}</span>
          <h2>{t('Une gamme pensée pour les professionnels')}</h2>
        </motion.div>

        <div className="category-grid">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.key}
              className={`category-card${cat.dominant ? ' category-card--dominant' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: E, delay: 0.1 + idx * 0.1 }}
            >
              <Link to="/produits" className="category-card__inner">
                <div className="category-card__img">
                  <img src={cat.img} alt={cat.label} loading="lazy" />
                </div>
                <div className="category-card__overlay" />
                <div className="category-card__body">
                  <span className="category-card__sub">{t(cat.sub)}</span>
                  <h3 className="category-card__title">{t(cat.label)}</h3>
                  <span className="category-card__cta">
                    {t('Explorer')} <ArrowRight s={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeCategories;
