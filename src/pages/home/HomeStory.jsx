import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Images from '../../assets/images';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowRight } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';

const EASE = [0.22, 1, 0.36, 1];

export function HomeStory() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useLang();

  const PILLARS = [
    {
      num: '01',
      title: 'Torréfaction Locale & Précision',
      desc: 'Une sélection rigoureuse de grains d’origine sourcés avec soin et torréfiés à Casablanca pour révéler chaque nuance aromatique.',
    },
    {
      num: '02',
      title: 'L’Art de l’Hospitalité Marocaine',
      desc: 'L’esprit de partage et de générosité du café marocain réinterprété selon les standards les plus stricts du coffee shop moderne.',
    },
    {
      num: '03',
      title: 'Partenaire des Établissements Exigeants',
      desc: 'Au-delà des produits, nous fournissons le calibrage machine, les recettes signatures et la formation barista complète.',
    },
  ];

  return (
    <section className="story-editorial-section" ref={ref}>
      <div className="container">
        <div className="story-editorial__grid">
          {/* Left: Magazine Photographic Plate */}
          <motion.div
            className="story-editorial__visual-col"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="story-editorial__photo-frame">
              <img
                src={Images.khatra.grainClose}
                alt="Grain de café Khatra torréfaction"
                className="story-editorial__photo"
                loading="lazy"
              />
              <div className="story-editorial__stamp">
                <span className="story-editorial__stamp-title">KHATRA ROASTERY</span>
                <span className="story-editorial__stamp-sub">Casablanca · Maroc</span>
              </div>
            </div>

            {/* Secondary atmospheric thumbnail */}
            <div className="story-editorial__secondary-card">
              <img
                src={Images.khatra.brand3}
                alt="Origine Khatra Hay Sadri"
                loading="lazy"
              />
              <div className="story-editorial__secondary-text">
                <strong>{t('Né à Hay Sadri')}</strong>
                <span>{t('Une aventure humaine ancrée dans la passion du café.')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Narrative Content */}
          <motion.div
            className="story-editorial__content-col"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          >
            <span className="eyebrow">{t('Origines & Vision')}</span>
            <h2 className="story-editorial__title">
              {t('Khatra, bien plus qu’un café. Une signature sensorielle.')}
            </h2>
            <p className="story-editorial__lead">
              {t(
                'Fondée sur la conviction que le Maroc mérite une marque de café authentique et contemporaine, Khatra accompagne les professionnels avec des produits d’exception et un modèle économique éprouvé.'
              )}
            </p>

            <div className="story-editorial__pillars">
              {PILLARS.map((p) => (
                <div key={p.num} className="story-pillar-item">
                  <span className="story-pillar-num">{p.num}</span>
                  <div className="story-pillar-body">
                    <h4>{t(p.title)}</h4>
                    <p>{t(p.desc)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="story-editorial__footer">
              <Link to="/notre-histoire" className="btn btn-outline-dark">
                {t('Découvrir notre histoire')} <ArrowRight s={16} />
              </Link>
              <div className="story-editorial__badge">
                <span>100% Marque Marocaine</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeStory;
