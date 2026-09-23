import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ArrowRight } from "../components/Icons";
import SEO from "../components/SEO";
import HomeHero from "./home/HomeHero";
import HomeCategories from "./home/HomeCategories";
import HomeStory from "./home/HomeStory";
import HomeFranchise from "./home/HomeFranchise";
import HomeLocations from "./home/HomeLocations";
import { useLang } from "../context/LanguageContext";

const E = [0.22, 1, 0.36, 1];

export function HomePage() {
  const { products } = useData();
  const { t } = useLang();
  const { ref: productsRef, isInView: productsInView } = useScrollReveal();

  const cafeProducts = (products || []).filter((p) => p.category === "Café");
  const otherProducts = (products || []).filter((p) => p.category !== "Café");
  const featured = [...cafeProducts.slice(0, 2), ...otherProducts.slice(0, 2)].slice(0, 4);

  return (
    <div className="home-page">
      <SEO
        title="Coffee & Retail Partner au Maroc"
        description="Khatra développe un écosystème marocain complet autour du café de spécialité, des sirops d'exception et des concepts de franchise."
      />

      <HomeHero />
      <HomeCategories />
      <HomeStory />
      <HomeFranchise />

      <section className="home-featured" ref={productsRef}>
        <div className="container">
          <motion.div
            className="home-featured__head"
            initial={{ opacity: 0, y: 24 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: E }}
          >
            <div>
              <span className="eyebrow">{t('Sélection')}</span>
              <h2>{t('Les incontournables Khatra')}</h2>
            </div>
            <Link to="/produits" className="btn btn-primary btn-sm">
              {t('Voir tout le catalogue')} <ArrowRight s={14} />
            </Link>
          </motion.div>

          <div className="home-featured__grid">
            {featured.map((prod, idx) => (
              <motion.article
                key={prod.id}
                className={`featured-product${idx === 0 ? " featured-product--lead" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                animate={productsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: E, delay: 0.08 + idx * 0.1 }}
              >
                <Link to={`/produits/${prod.slug}`} className="featured-product__link">
                  <div className="featured-product__img">
                    <img src={prod.img} alt={prod.name} loading="lazy" />
                    <span className="featured-product__cat">{t(prod.category)}</span>
                  </div>
                  <div className="featured-product__body">
                    <h3>{t(prod.name)}</h3>
                    <p>{t(prod.short)}</p>
                    <div className="featured-product__meta">
                      <span>{prod.formats?.[0] || "Pro"}</span>
                      <span className="btn-text">{t('Détails')}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <HomeLocations />

      <section className="home-cta-band">
        <div className="container">
          <motion.div
            className="home-cta-band__inner"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: E }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="eyebrow" style={{ color: "var(--caramel-l)" }}>
              {t('Partenariat & Distribution')}
            </span>
            <h2>{t("Prêt à intégrer l'écosystème Khatra ?")}</h2>
            <p>
              {t('Franchise, distribution ou équipement de votre établissement : nos conseillers vous accompagnent.')}
            </p>
            <div className="home-cta-band__actions">
              <Link to="/contact" className="btn btn-light">
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
