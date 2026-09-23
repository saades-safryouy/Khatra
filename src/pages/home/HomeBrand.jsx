import React from 'react';
import { motion } from 'framer-motion';
import Images from '../../assets/images';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const EASE = [0.22, 1, 0.36, 1];

const BRAND_IMAGES = [
  { src: Images.slogans.slogan1, alt: 'Khatra Slogan 1' },
  { src: Images.slogans.slogan2, alt: 'Khatra Slogan 2' },
  { src: Images.slogans.slogan3, alt: 'Khatra Slogan 3' },
];

export function HomeBrand() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="container section" ref={ref}>
      <motion.div
        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span className="eyebrow">Identité & Esprit</span>
        <h2>Khatra, bien plus qu'un café.</h2>
        <p style={{ marginTop: '16px' }}>
          Des visuels audacieux, des recettes créatives et une proximité unique avec la culture urbaine marocaine.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {BRAND_IMAGES.map((img, idx) => (
          <motion.div
            key={img.alt}
            style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 34, scale: 0.96 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 + idx * 0.12 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HomeBrand;
