import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Images from '../../assets/images';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowRight } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';

const EASE = [0.22, 1, 0.36, 1];

export function HomeCategories() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useLang();

  const categoryShowcase = [
  { title: 'Café en grains', subtitle: 'L’origine du goût Khatra', img: Images.khatra.packaging },
  { title: 'Café signature', subtitle: 'Assemblages pour les pros', img: Images.khatra.khatra360 },
  { title: 'Sirops & accompagnements', subtitle: 'Des recettes à composer', img: Images.nidsys.syrupTrio },
  { title: 'Bubbles de fruits', subtitle: 'Une touche fraîche et colorée', img: Images.bubbles.all },
];

  return (
    <section className="categories-editorial-section" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <div className="categories-editorial__header">
          <motion.div
            className="categories-editorial__title-box"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="eyebrow">{t('L’Univers Khatra')}</span>
            <h2>{t('Une gamme pensée pour l’exigence des professionnels.')}</h2>
          </motion.div>

          <motion.div
            className="categories-editorial__intro-box"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          >
            <p>
              {t(
                'De la torréfaction artisanale aux ingrédients signatures, nous fournissons aux coffee shops, hôtels et restaurants les standards les plus élevés du marché.'
              )}
            </p>
            <Link to="/produits" className="btn btn-outline-dark btn-sm categories-all-btn">
              {t('Explorer tout le catalogue')} <ArrowRight s={14} />
            </Link>
          </motion.div>
        </div>
        </div>

        {/* Editorial Categories Spread */}
       <section className="home-section home-categories">
        
        <div className="home-category-grid">
          {categoryShowcase.map((category, index) => (
            <Link key={category.title} to="/produits" className="home-category-card">
              <img src={category.img} alt={category.title} loading="lazy" />
          
              <span className="home-category-label"><strong>{t(category.title)}</strong><small>{t(category.subtitle)}</small></span>
            </Link>
          ))}
        </div>
      </section>
      
    </section>
  );
}

export default HomeCategories;
