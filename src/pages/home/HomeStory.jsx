import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Images from "../../assets/images";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ArrowRight } from "../../components/Icons";
import { useLang } from "../../context/LanguageContext";

const E = [0.22, 1, 0.36, 1];

export function HomeStory() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useLang();

  return (
    <section className="home-story" ref={ref}>
      <div className="container">
        <div className="story-grid">
          <motion.div
            className="story-media"
            initial={{ opacity: 0, clipPath: "inset(12% 12% 12% 12%)" }}
            animate={isInView ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" } : {}}
            transition={{ duration: 1.1, ease: E }}
          >
            <img src={Images.khatra.grainClose} alt="Cafe Khatra" loading="lazy" />
          </motion.div>

          <motion.div
            className="story-copy"
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: E, delay: 0.18 }}
          >
            <span className="eyebrow">{t('Identité & Esprit')}</span>
            <h2>{t("Khatra, bien plus qu'un café.")}</h2>
            <p>
              {t('Une marque marocaine contemporaine. Des visuels audacieux, des recettes signatures et une exigence de professionnel.')}
            </p>
            <Link to="/notre-histoire" className="btn btn-outline">
              {t('Notre histoire')} <ArrowRight s={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeStory;
