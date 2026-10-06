import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Images from '../../assets/images';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowRight } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';

const EASE = [0.22, 1, 0.36, 1];

const collageImages = [
  { className: 'coffee', src: Images.khatra.grainClose, alt: 'Café Khatra, un concept autour du café' },
  { className: 'beans', src: Images.khatra.khatra360, alt: 'La gamme de café Khatra' },
  { className: 'market', src: Images.khatra.packaging, alt: 'Les produits du Khatra Market' },
  { className: 'syrup', src: Images.nidsys.syrupTrio, alt: 'Les sirops Nidsy’s proposés chez Khatra' },
];

export function HomeFranchise() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useLang();

  return (
    <section className="franchise-editorial-section" ref={ref}>
      <div className="container">
        <div className="franchise-editorial__collage">
          {collageImages.map((image, index) => (
            <motion.figure
              key={image.className}
              className={`franchise-editorial__image franchise-editorial__image--${image.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
            </motion.figure>
          ))}

          <motion.div
            className="franchise-editorial__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          >
            <span className="eyebrow">{t('Développement & Réseau')}</span>
            <h2>{t('Et si Khatra devenait votre prochaine aventure ?')}</h2>
            <p>
              {t('Khatra Coffee Shop ou Khatra Market : découvrez le concept qui vous ressemble.')}
            </p>
            <Link to="/franchise" className="franchise-editorial__cta">
              {t('Découvrir nos franchises')} <ArrowRight s={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeFranchise;
