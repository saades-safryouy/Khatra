import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Images from '../../assets/images';
import { useData } from '../../context/DataContext';
import { ArrowRight } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';

export function HomeHero() {
  const { content } = useData();
  const { t } = useLang();
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  // Parallax effect on hero background (disabled for reduced motion)
  const y = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 140]);
  const scale = useTransform(scrollY, [0, 600], [1.08, reduceMotion ? 1.08 : 1.16]);
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const contentY = useTransform(scrollY, [0, 350], [0, reduceMotion ? 0 : -60]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 34 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="hero">
      <motion.div className="hero-bg" style={reduceMotion ? undefined : { y, scale }}>
        <img src={Images.bgHero} alt="Khatra Coffee & Retail" />
      </motion.div>
      <div className="hero-overlay" />
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        <motion.span className="eyebrow" variants={itemVariants}>
          {t(content?.heroTagline || "L'art du café & de la franchise au Maroc")}
        </motion.span>
        <motion.h1 variants={itemVariants}>
          {content?.heroTitle || "NCHORBOHA KHAAATRA"}
        </motion.h1>
        <motion.p variants={itemVariants}>
          {t(content?.heroDesc || "Khatra développe un écosystème marocain complet : café de spécialité, sirops d'exception, concepts de franchise Coffee Shop et retail Khatra Market.")}
        </motion.p>
        <motion.div className="hero-actions" variants={itemVariants}>
          <Link to="/produits" className="btn btn-primary">
            {t('Découvrir nos produits')} <ArrowRight s={16} />
          </Link>
          <Link to="/franchise" className="btn btn-outline-light">
            {t('Découvrir Khatra')}
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span>{t('Défiler')}</span>
      </motion.div>
    </section>
  );
}

export default HomeHero;
