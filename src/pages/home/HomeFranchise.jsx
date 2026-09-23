import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Images from "../../assets/images";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ArrowRight } from "../../components/Icons";
import { useLang } from "../../context/LanguageContext";

const E = [0.22, 1, 0.36, 1];

export function HomeFranchise() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -60, reduceMotion ? 0 : 80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);

  return (
    <section className="home-franchise" ref={ref}>
      <motion.div className="home-franchise__bg" style={reduceMotion ? undefined : { y, scale }}>
        <img src={Images.khatra.khatra360} alt="Franchise Khatra" />
      </motion.div>
      <div className="home-franchise__overlay" />

      <div className="container">
        <motion.div
          className="home-franchise__content"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: E }}
        >
          <span className="eyebrow" style={{ color: "var(--caramel-l)" }}>{t('Franchise')}</span>
          <h2>{t('Et si Khatra devenait votre prochaine aventure?')}</h2>
          <p>
            {t('Deux concepts pensés pour la rentabilité et la modernité : Coffee Shop et Khatra Market.')}
          </p>
          <Link to="/franchise" className="btn btn-primary">
            {t('Devenir franchisé')} <ArrowRight s={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeFranchise;
