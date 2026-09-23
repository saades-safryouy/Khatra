import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const STATS = [
  { num: '100%', label: 'Dédié aux professionnels' },
  { num: '11+', label: 'Références signatures' },
  { num: '5+', label: 'Points de présence' },
  { num: '01', label: 'Partenaire de confiance' },
];

export function HomeIntro() {
  const { ref, isInView } = useScrollReveal();

  const EASE = [0.22, 1, 0.36, 1];

  return (
    <section className="intro" ref={ref}>
      <motion.div
        className="intro-title"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
      >
        <motion.span
          className="eyebrow intro-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Une signature marocaine
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
        >
          L’alliance du savoir-faire barista et de la rigueur retail.
        </motion.h2>
      </motion.div>
      <motion.div
        className="intro-text"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      >
        <p>
          Fondée sur la conviction que le Maroc mérite une marque de café authentique et contemporaine, Khatra accompagne les professionnels, restaurateurs et franchisés avec des produits haut de gamme et un modèle économique robuste.
        </p>
        <div className="intro-stats">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.num}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.6, ease: EASE }}
            >
              <div className="stat-num">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HomeIntro;
