import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import HomeHero from './home/HomeHero';
import HomeCategories from './home/HomeCategories';
import HomeStory from './home/HomeStory';
import HomeFranchise from './home/HomeFranchise';
import HomeLocations from './home/HomeLocations';
import HomeReviews from './home/HomeReviews';
import { useLang } from '../context/LanguageContext';

const EASE = [0.22, 1, 0.36, 1];

export function HomePage() {
  const { products } = useData();
  const { t, lang } = useLang();
  const { ref: productsRef, isInView: productsInView } = useScrollReveal();

  const featured = (products || [])
    .filter((product) => product?.slug && product.status !== 'INACTIVE')
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);

  return (
    <div className="home-editorial-page">
      <SEO
        title="Coffee & Retail Partner au Maroc"
        description="Khatra développe un écosystème marocain complet autour du café de spécialité, des sirops d'exception et des concepts de franchise."
      />

      {/* 1. HERO: Full-bleed background + 3D floating transparent products + monumental NCHORBOHA KHAAATRA typography */}
      <HomeHero />

      {/* 2. CATEGORIES: Clean White surface with editorial showcase */}
      <HomeCategories />

      {/* 3. STORY: Warm Linen surface with Moroccan storytelling */}
      <HomeStory />

      {/* 4. FRANCHISE: White surface with Night Bordeaux & Coffee Shop / Market architectural split */}
      <HomeFranchise />

      {/* 5. FEATURED PRODUCTS: White surface, editorial product presentation with large imagery and minimal UI */}
      <section className="featured-editorial-section" ref={productsRef}>
        <div className="container">
          <motion.div
            className="featured-editorial__header"
            initial={{ opacity: 0, y: 24 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div>
              <span className="eyebrow">{t('Sélection Signature')}</span>
              <h2>{t('Les incontournables Khatra')}</h2>
            </div>
            <Link to="/produits" className="btn btn-outline-dark btn-sm">
              {t('Voir tous les produits')} <ArrowRight s={14} />
            </Link>
          </motion.div>

          <div className="featured-editorial__grid">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS: only source verified Google Places data */}
      <HomeReviews />

      {/* 7. LOCATIONS: Warm Linen surface */}
      <HomeLocations />

      {/* 8. B2B CTA BAND: Subtle Night Bordeaux moment before the dark coffee footer */}
      <section className="home-cta-band-bordeaux">
        <div className="container">
          <motion.div
            className="home-cta-band-bordeaux__inner"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="home-cta-band-bordeaux__eyebrow">
              {t('Partenariat & Distribution Pro')}
            </span>
            <h2>{t('Prêt à intégrer l’écosystème Khatra ?')}</h2>
            <p>
              {t(
                'Franchise, distribution ou équipement de votre établissement : nos conseillers vous accompagnent pas à pas.'
              )}
            </p>
            <div className="home-cta-band-bordeaux__actions">
              <Link to="/contact" className="btn btn-white-hero">
                {t('Devenir partenaire')} <ArrowRight s={16} />
              </Link>
              <Link to="/franchise" className="btn btn-outline-light">
                {t('Dossier Franchise')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
